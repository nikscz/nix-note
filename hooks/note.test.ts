import { expect, mock, test } from 'claude-code/testing'

// Only the command's name and text matter to this mod.
const note = (args: string) => ({ command: 'note', args }) as never

// A German Mac
const german = { value: { exitCode: 0, stdout: '(\n    "de-DE"\n)', stderr: '' } } as never

test('a note carries date, project, folder, git, chat and topic', async ($, on) => {
  mock.clock(on, { now: new Date(2026, 9, 7, 18, 53).getTime() })
  on('process.run', () => german)
  const files = new Map<string, string>()
  on('fs.exists', (_, e) => ({ value: files.has(e.path) }))
  on('fs.read', (_, e) => ({ value: files.get(e.path) ?? '' }) as never)
  on('fs.write', (_, e) => {
    files.set(e.path, e.text)
    return { value: undefined }
  })
  on('session.root', () => ({ value: '/Users/anna/Projekte/clipping' }))
  on('session.repo', () => ({ value: { root: '/x', remote: null, internal: false, name: 'anna/clipping' } }) as never)
  on('session.id', () => ({ value: 'abc-123' }))
  on('prompt.submit', (_, e) => ({ text: e.text }))

  await $.prompt.submit({ text: 'Mach den Header ruhiger', origin: { kind: 'composer' } } as never)
  expect((await $.command.run(note('Logo größer machen'))).text).toBe('Notiert: Logo größer machen')
  const [path, text] = [...files.entries()][0] ?? []
  expect(path).toEndWith('/Documents/Claude-Notizen.md')
  expect(text).toBe(
    '# Meine Notizen\n' +
      '\n## 07.10.2026 18:53 · clipping\n\nLogo größer machen\n\n' +
      '- Ordner: /Users/anna/Projekte/clipping\n' +
      '- Git: anna/clipping\n' +
      '- Im Chat gerade: „Mach den Header ruhiger“\n' +
      '- Chat-ID: abc-123\n',
  )
})

test('an empty note explains how to use it', async ($, on) => {
  on('process.run', () => german)
  expect((await $.command.run(note('  '))).text).toContain('/note Logo')
})

test('Windows folders work too', async ($, on) => {
  mock.clock(on, { now: new Date(2026, 9, 7, 9, 5).getTime() })
  on('process.run', () => german)
  const files = new Map<string, string>()
  on('fs.exists', (_, e) => ({ value: files.has(e.path) }))
  on('fs.read', (_, e) => ({ value: files.get(e.path) ?? '' }) as never)
  on('fs.write', (_, e) => {
    files.set(e.path, e.text)
    return { value: undefined }
  })
  on('session.root', () => ({ value: 'C:\\Users\\anna\\Projekte\\shop' }))
  on('session.repo', () => ({ value: null }))
  on('session.id', () => ({ value: 'w-1' }))
  await $.command.run(note('Farben prüfen'))
  const text = [...files.values()][0] ?? ''
  expect(text).toContain('## 07.10.2026 09:05 · shop')
  expect(text).toContain('- Ordner: C:\\Users\\anna\\Projekte\\shop')
})

test('on an English system the note goes to Claude-Notes.md in English', async ($, on) => {
  mock.clock(on, { now: new Date(2026, 9, 7, 9, 5).getTime() })
  const files = new Map<string, string>()
  on('fs.exists', (_, e) => ({ value: files.has(e.path) }))
  on('fs.read', (_, e) => ({ value: files.get(e.path) ?? '' }) as never)
  on('fs.write', (_, e) => {
    files.set(e.path, e.text)
    return { value: undefined }
  })
  on('session.root', () => ({ value: '/Users/anna/Projects/shop' }))
  on('session.repo', () => ({ value: null }))
  on('session.id', () => ({ value: 'e-1' }))
  expect((await $.command.run(note('check colours'))).text).toBe('Noted: check colours')
  const [path, text] = [...files.entries()][0] ?? []
  expect(path).toEndWith('/Documents/Claude-Notes.md')
  expect(text).toContain('# My notes')
  expect(text).toContain('## 2026-10-07 09:05 · shop')
  expect(text).toContain('- Folder: /Users/anna/Projects/shop')
})
