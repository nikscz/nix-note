🇩🇪 [Deutsch](README.de.md)

# nix note

**Project notes on the side – type `/note`, done. Claude knows them and applies them.**

## The problem

While Claude works, something occurs to you: "bigger logo", "check that colour again". Write it in the chat and you interrupt Claude, or it gets lost in the history. A week later you don't remember which project it belonged to.

## The solution

`/note` saves a note with date, project and chat into one file – without interrupting Claude. And Claude knows your notes: before it works on a project, it checks that project's notes and applies them.

## Install

1. Open Claude Code (desktop app or terminal).
2. Type this into the message box and press Enter:
   ```
   /plugin marketplace add nikscz/nix-note
   ```
3. Then:
   ```
   /plugin install nix-note@nix-note
   ```
4. Restart Claude Code once (or type `/reload-plugins`). Done.

No GitHub account needed.

## How to

```
/note make the logo bigger
```

- The note lands in **Documents/Claude-Notes.md** (German system: **Claude-Notizen.md**) – even
  while Claude is working.
- Each note gets automatically: date and time, project and folder, Git repository (if any),
  what the chat was about, and the chat ID.
- **Claude applies them:** before building or changing something in a project, Claude looks for
  that project's notes and takes them into account. If a note is outside the current task,
  Claude asks first.
- **Ask about them:** *"What did I note about the logo?"* – Claude finds the notes and tells you
  which project and chat they came from.
- One file for everything, open it with any text editor.

| Command | What happens |
|---|---|
| `/note your text` | saves the note |

> [!WARNING]
> **Early version – updates will come.** This kind of extension is still brand new in Claude Code.
> After an update from Anthropic something may stop working until a fix lands here.
> With automatic updates on (below) you get the fix by itself.

## Updates

Turn it on once and forget it: type `/plugin` → **Marketplaces** → **nix-note** → turn on
automatic updates.

Or by hand, whenever you like:
```
/plugin marketplace update nix-note
```

## Uninstall

```
/plugin uninstall nix-note@nix-note
```

## More from nix

- [nix-checklist-sidebar](https://github.com/nikscz/nix-checklist-sidebar) – Claude's plan as a checklist
- [nix-progress-bar](https://github.com/nikscz/nix-progress-bar) – progress bar with a time estimate
- [nix-done-sound](https://github.com/nikscz/nix-done-sound) – your own alert sound when Claude is done

## License

[MIT](LICENSE) – use it, change it, pass it on, no warranty.

Made with Claudius, for Claudius. Found a bug or have an idea?
Open an [issue](https://github.com/nikscz/nix-note/issues).
