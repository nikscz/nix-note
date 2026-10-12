import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

import { ASK_LANG, langOf } from './lang'
import type { Lang } from './lang'

const COMMAND = 'note'
// What the person last asked Claude, so a note says what the chat was about.
const lastPrompt = atom({ plugin: 'nix-note', key: 'lastPrompt' } as const, '')

const two = (n: number) => String(n).padStart(2, '0')
const clock = (d: Date) => `${two(d.getHours())}:${two(d.getMinutes())}`

// One file for every note, beside the person's other documents, and the words in it,
// in the system's language.
const WORDS = {
  de: {
    file: 'Documents/Claude-Notizen.md',
    header: '# Meine Notizen\n',
    stamp: (d: Date) => `${two(d.getDate())}.${two(d.getMonth() + 1)}.${d.getFullYear()} ${clock(d)}`,
    noFolder: 'ohne Ordner',
    folder: 'Ordner',
    scratch: '– (Chat ohne Projektordner)',
    about: 'Im Chat gerade',
    chat: 'Chat-ID',
    describe: 'Projekt-Notiz mit Datum und Projekt in Dokumente/Claude-Notizen.md schreiben',
    hint: '[Notiz]',
    empty: 'Schreib die Notiz direkt dahinter, z. B. /note Logo größer machen',
    noted: (text: string) => `Notiert: ${text}`,
  },
  en: {
    file: 'Documents/Claude-Notes.md',
    header: '# My notes\n',
    stamp: (d: Date) => `${d.getFullYear()}-${two(d.getMonth() + 1)}-${two(d.getDate())} ${clock(d)}`,
    noFolder: 'no folder',
    folder: 'Folder',
    scratch: '– (chat without a project folder)',
    about: 'In the chat',
    chat: 'Chat ID',
    describe: 'Write a project note with date and project to Documents/Claude-Notes.md',
    hint: '[note]',
    empty: 'Write the note right after it, e.g. /note make the logo bigger',
    noted: (text: string) => `Noted: ${text}`,
  },
}

// Sessions without a folder run in a throwaway workspace: no project to name.
const isScratch = (dir: string) => /[\\/]scratch-workspaces[\\/]/.test(dir)
const oneLine = (text: string, max: number) => {
  const flat = text.replace(/\s+/g, ' ').trim()
  return flat.length > max ? `${flat.slice(0, max - 1)}…` : flat
}
// The plugin lives under ~/.claude, so its root names the home folder (Mac or Windows).
const notesPath = ($: EngineInterface, lang: Lang) =>
  `${$.plugin.root.split(/[\\/]\.claude[\\/]/)[0]}/${WORDS[lang].file}`

const instructions = (lang: Lang) =>
  `The user's project notes (written with /note) are in ~/${WORDS[lang].file}: per note date, project, folder, ` +
  'git, chat id and what the chat was about. Before you build or change something in a project, look for notes ' +
  'of that project there and take them into account; ask before acting on a note that is outside the current ' +
  'task. When the user asks about notes or topics, read the file and say which project and chat a note came from.'

// Once after installing, Claude passes on a short thank-you from the author.
const THANKED_KEY = 'thanked'
const THANKS =
  'At the start of your next reply, once, say this sentence, translated into the language the user writes ' +
  'to you in: "nikscz says thank you for using one of his tools. Glad to have you!" Do not repeat it later.'

// Asked when a text is first needed, then kept; a reload asks again.
let asked: Promise<Lang> | null = null
const systemLang = async ($: EngineInterface): Promise<Lang> => {
  for (const argv of ASK_LANG) {
    try {
      const ran = await $.process.run(argv, { timeoutMs: 3_000 })
      const found = ran.exitCode === 0 ? langOf(ran.stdout) : null
      if (found) return found
    } catch {
      // not this system
    }
  }
  const env = (await $.env.get('LC_ALL').catch(() => undefined)) || (await $.env.get('LANG').catch(() => undefined))
  return (env && langOf(env)) || 'en'
}
const langOf$ = ($: EngineInterface) => (asked ??= systemLang($))

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const words = WORDS[await systemLang($)]
    await $.command.register({
      name: COMMAND,
      description: words.describe,
      argumentHint: words.hint,
      immediate: true,
    })

    return next(e)
  })

  on('prompt.context', async ($, e, next) => {
    const context = await next(e)
    const lang = await langOf$($)

    const isThanked = (await $.store.get(THANKED_KEY)) === true
    if (!isThanked) await $.store.set(THANKED_KEY, true)
    const thanks = isThanked ? [] : [{ name: 'nix-note-danke', text: THANKS }]

    return { ...context, blocks: [...context.blocks, { name: 'notizen', text: instructions(lang) }, ...thanks] }
  })

  on('prompt.submit', async ($, e, next) => {
    if (e.origin?.kind === 'composer' && !e.text.startsWith('/')) {
      await update($, lastPrompt, () => e.text)
    }

    return next(e)
  })

  on('command.run', { command: COMMAND }, async ($, e) => {
    const lang = await langOf$($)
    const words = WORDS[lang]
    const text = e.args.trim()
    if (text === '') {
      return { text: words.empty }
    }
    const [now, root, repo, chat, about] = await Promise.all([
      $.clock.now(),
      $.session.root(),
      $.session.repo(),
      $.session.id(),
      read($, lastPrompt),
    ])
    const scratch = isScratch(root)
    const entry = [
      '',
      `## ${words.stamp(new Date(now))} · ${scratch ? words.noFolder : (root.split(/[\\/]/).filter(Boolean).pop() ?? root)}`,
      '',
      text,
      '',
      `- ${words.folder}: ${scratch ? words.scratch : root}`,
      ...(repo ? [`- Git: ${repo.name ?? repo.remote ?? repo.root}`] : []),
      ...(about ? [`- ${words.about}: „${oneLine(about, 140)}“`] : []),
      `- ${words.chat}: ${chat}`,
      '',
    ].join('\n')
    const path = notesPath($, lang)
    const before = (await $.fs.exists(path)) ? await $.fs.read(path) : words.header
    await $.fs.write(path, before.replace(/\n*$/, '\n') + entry)

    return { text: words.noted(text) }
  })
}
