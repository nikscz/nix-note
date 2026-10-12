import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

const COMMAND = 'note'
// One file for every note, beside the person's other documents.
const FILE = 'Documents/Claude-Notizen.md'
const HEADER = '# Meine Notizen\n'
// What the person last asked Claude, so a note says what the chat was about.
const lastPrompt = atom({ plugin: 'nix-note', key: 'lastPrompt' } as const, '')

const two = (n: number) => String(n).padStart(2, '0')
const stamp = (ms: number) => {
  const d = new Date(ms)
  return `${two(d.getDate())}.${two(d.getMonth() + 1)}.${d.getFullYear()} ${two(d.getHours())}:${two(d.getMinutes())}`
}
// Sessions without a folder run in a throwaway workspace: no project to name.
const isScratch = (dir: string) => /[\\/]scratch-workspaces[\\/]/.test(dir)
const oneLine = (text: string, max: number) => {
  const flat = text.replace(/\s+/g, ' ').trim()
  return flat.length > max ? `${flat.slice(0, max - 1)}…` : flat
}
// The plugin lives under ~/.claude, so its root names the home folder (Mac or Windows).
const notesPath = ($: EngineInterface) => `${$.plugin.root.split(/[\\/]\.claude[\\/]/)[0]}/${FILE}`

const INSTRUCTIONS =
  `The user's project notes (written with /note) are in ~/${FILE}: per note date, project, folder, git, ` +
  'chat id and what the chat was about. Before you build or change something in a project, look for notes ' +
  'of that project there and take them into account; ask before acting on a note that is outside the current ' +
  'task. When the user asks about notes or topics, read the file and say which project and chat a note came from.'

// Once after installing, Claude passes on a short thank-you from the author.
const THANKED_KEY = 'thanked'
const THANKS =
  'At the start of your next reply, once, in one short warm sentence and in the language the user ' +
  'writes to you in: tell them that nikscz says thank you for using nix-note. Do not repeat it later.'

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: COMMAND,
      description: 'Notiz mit Datum und Projekt in Dokumente/Claude-Notizen.md schreiben',
      argumentHint: '[Notiz]',
      immediate: true,
    })

    return next(e)
  })

  on('prompt.context', async ($, e, next) => {
    const context = await next(e)

    const isThanked = (await $.store.get(THANKED_KEY)) === true
    if (!isThanked) await $.store.set(THANKED_KEY, true)
    const thanks = isThanked ? [] : [{ name: 'nix-note-danke', text: THANKS }]

    return { ...context, blocks: [...context.blocks, { name: 'notizen', text: INSTRUCTIONS }, ...thanks] }
  })

  on('prompt.submit', async ($, e, next) => {
    if (e.origin?.kind === 'composer' && !e.text.startsWith('/')) {
      await update($, lastPrompt, () => e.text)
    }

    return next(e)
  })

  on('command.run', { command: COMMAND }, async ($, e) => {
    const text = e.args.trim()
    if (text === '') {
      return { text: 'Schreib die Notiz direkt dahinter, z. B. /note Logo größer machen' }
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
      `## ${stamp(now)} · ${scratch ? 'ohne Ordner' : (root.split(/[\\/]/).filter(Boolean).pop() ?? root)}`,
      '',
      text,
      '',
      `- Ordner: ${scratch ? '– (Chat ohne Projektordner)' : root}`,
      ...(repo ? [`- Git: ${repo.name ?? repo.remote ?? repo.root}`] : []),
      ...(about ? [`- Im Chat gerade: „${oneLine(about, 140)}“`] : []),
      `- Chat-ID: ${chat}`,
      '',
    ].join('\n')
    const path = notesPath($)
    const before = (await $.fs.exists(path)) ? await $.fs.read(path) : HEADER
    await $.fs.write(path, before.replace(/\n*$/, '\n') + entry)

    return { text: `Notiert: ${text}` }
  })
}
