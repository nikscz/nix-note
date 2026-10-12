# nix note

**Projekt-Notizen nebenbei – `/note` tippen, fertig. Claude kennt sie und wendet sie an.**

> [!WARNING]
> **Frühe Version – Updates kommen.** Diese Art Erweiterung ist bei Claude Code noch ganz neu.
> Nach einem Update von Anthropic kann etwas nicht mehr funktionieren, bis hier ein Fix kommt.
> Mit Updates eingeschaltet (siehe unten) bekommst du ihn automatisch.

## Das Problem

Während Claude arbeitet, fällt dir etwas ein: „Logo größer“, „Farbe nochmal prüfen“.
Schreibst du es in den Chat, unterbrichst du Claude oder es geht im Verlauf unter.
Und eine Woche später weißt du nicht mehr, zu welchem Projekt die Notiz gehörte.

## Die Lösung

```
/note Logo größer machen
```

Die Notiz landet sofort in **Dokumente/Claude-Notizen.md** – auch während Claude arbeitet,
ohne es zu unterbrechen. Jede Notiz bekommt automatisch:

- Datum und Uhrzeit, Projekt und Ordner, Git-Repository (falls vorhanden)
- worum es im Chat gerade ging, und die Chat-ID

**Der eigentliche Vorteil: Claude kennt deine Notizen und wendet sie an.**
Arbeitet Claude später an einem Projekt, schaut es vorher nach Notizen zu genau diesem Projekt
und berücksichtigt sie – „Logo größer machen“ wird beim nächsten Design-Schritt mitgedacht.
Gehört eine Notiz nicht zur aktuellen Aufgabe, fragt Claude erst nach.

Und du kannst fragen: *„Was hab ich mir zum Logo notiert?“* – Claude sucht die Notizen raus
und sagt dir, aus welchem Projekt und Chat sie stammen.

Eine einzige Datei für alles, mit jedem Texteditor zu öffnen.

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

## Updates

Einmal einschalten und vergessen: `/plugin` eingeben → **Marketplaces** → **nix-note** →
automatische Updates an.

Oder von Hand, wann immer du willst:
```
/plugin marketplace update nix-note
```

## Deinstallieren

```
/plugin uninstall nix-note@nix-note
```

## Mehr von nix

- [nix-checklist-sidebar](https://github.com/nikscz/nix-checklist-sidebar) – Claudes Plan als Checkliste
- [nix-progress-bar](https://github.com/nikscz/nix-progress-bar) – Fortschrittsleiste mit Zeitschätzung
- [nix-done-sound](https://github.com/nikscz/nix-done-sound) – dein eigener Sound, wenn Claude fertig ist

## Lizenz

[MIT](LICENSE) – nutzen, ändern, weitergeben erlaubt, ohne Gewähr.

Mit Claude gebaut, für Claude. Fehler gefunden oder eine Idee?
Gern ein [Issue](https://github.com/nikscz/nix-note/issues) aufmachen.
