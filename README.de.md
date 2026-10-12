🇬🇧 [English](README.md)

# nix note

**Projekt-Notizen nebenbei – `/note` tippen, fertig. Claude kennt sie und wendet sie an.**

## Das Problem

Während Claude arbeitet, fällt dir etwas ein: „Logo größer“, „Farbe nochmal prüfen“. Schreibst du es in den Chat, unterbrichst du Claude oder es geht im Verlauf unter. Und eine Woche später weißt du nicht mehr, zu welchem Projekt die Notiz gehörte.

## Die Lösung

`/note` speichert eine Notiz mit Datum, Projekt und Chat in einer Datei – ohne Claude zu unterbrechen. Und Claude kennt deine Notizen: Bevor es an einem Projekt arbeitet, schaut es nach den Notizen dazu und wendet sie an.

## Installieren

1. Claude Code öffnen (Desktop-App oder Terminal).
2. Ins Eingabefeld schreiben und Enter drücken:
   ```
   /plugin marketplace add nikscz/nix-note
   ```
3. Dann:
   ```
   /plugin install nix-note@nix-note
   ```
4. Claude Code einmal neu starten (oder `/reload-plugins` eingeben). Fertig.

Kein GitHub-Konto nötig.

## So geht’s

```
/note Logo größer machen
```

- Die Notiz landet in **Dokumente/Claude-Notizen.md** (englisches System: **Claude-Notes.md**) –
  auch während Claude arbeitet.
- Jede Notiz bekommt automatisch: Datum und Uhrzeit, Projekt und Ordner, Git-Repository (falls
  vorhanden), worum es im Chat gerade ging, und die Chat-ID.
- **Claude wendet sie an:** Bevor Claude in einem Projekt etwas baut oder ändert, schaut es nach
  den Notizen zu genau diesem Projekt und berücksichtigt sie. Gehört eine Notiz nicht zur aktuellen
  Aufgabe, fragt Claude erst nach.
- **Danach fragen:** *„Was hab ich mir zum Logo notiert?“* – Claude sucht die Notizen raus und sagt
  dir, aus welchem Projekt und Chat sie stammen.
- Eine einzige Datei für alles, mit jedem Texteditor zu öffnen.

| Befehl | Was passiert |
|---|---|
| `/note dein Text` | speichert die Notiz |

## Datenschutz & Sicherheit

Alles bleibt auf deinem Rechner:

| Liest | Speichert |
|---|---|
| Deine letzte Nachricht an Claude (für „Im Chat gerade“) | nur wenn du `/note` tippst: die ersten 140 Zeichen, in deiner Notiz-Datei |
| Projektordner, Name des Git-Repositorys, Chat-ID | nur wenn du `/note` tippst: in deiner Notiz-Datei |
| Deine Notiz-Datei, wenn Claude nach Notizen schaut | die Notiz, in **Dokumente/Claude-Notizen.md** (englisches System: Claude-Notes.md) – sonst nirgends |

**Schickt nichts irgendwohin.** Keine Internetverbindung, kein Tracking, keine Statistik. Der Code ist
offen – du kannst es selbst nachprüfen.

**Sprach-Check:** Damit die Beschriftungen in deiner Sprache erscheinen, liest das Tool einmal pro Chat
deine Systemsprache mit einem harmlosen Systembefehl – `defaults read -g AppleLanguages` auf dem Mac,
`(Get-Culture).TwoLetterISOLanguageName` in PowerShell unter Windows. Sonst wird nichts gelesen.

> [!WARNING]
> **Frühe Version – Updates kommen.** Diese Art Erweiterung ist bei Claude Code noch ganz neu.
> Nach einem Update von Anthropic kann etwas nicht mehr funktionieren, bis hier ein Fix kommt.
> Mit automatischen Updates (unten) bekommst du ihn von selbst.

## Updates

Einmal einschalten und vergessen: `/plugin` eingeben → **Marketplaces** → **nix-note** →
automatische Updates an.

Oder von Hand, wann immer du willst:
```
/plugin marketplace update nix-note
```

### Neu

**2.2 – Deutsch und Englisch.** Die festen Wörter des Tools folgen jetzt deiner Systemsprache:
Deutsch auf einem deutschen System, sonst Englisch. Andere Sprachen (z. B. Spanisch) bekommen die
englischen Wörter – alles, was Claude selbst schreibt (die Schritte, der Danke-Satz, die Antworten),
kommt aber ohnehin in deiner Sprache.

## Deinstallieren

```
/plugin uninstall nix-note@nix-note
```

## Mehr von nikscz

- [nix-checklist-sidebar](https://github.com/nikscz/nix-checklist-sidebar) – Claudes Plan als Checkliste
- [nix-progress-bar](https://github.com/nikscz/nix-progress-bar) – Fortschrittsleiste mit Zeitschätzung
- [nix-done-sound](https://github.com/nikscz/nix-done-sound) – dein eigener Alert-Sound, wenn Claude fertig ist

## Lizenz

[MIT](LICENSE) – nutzen, ändern, weitergeben erlaubt, ohne Gewähr.

Mit Claudius, für Claudius. Fehler gefunden oder eine Idee?
Gern ein [Issue](https://github.com/nikscz/nix-note/issues) aufmachen.
