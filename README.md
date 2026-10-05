# Know Your Luigi

**Know Your Luigi** is a small flashcard app for learning the names (and roles) of people in a group — for example colleagues at work.

You see a photo, try to recall who it is, then reveal the name and details. Mark answers as right or wrong: cards you miss come back again soon, so you practice the hard ones more. Everything runs in the browser on your computer or phone. There is no server and no account — your photos and CSV stay on your device (unless you choose to put demo files in a public repo).

The interface is available in German and English. Person data from the CSV is always shown as written. Work with new data? Just reload the app! 

### http://moritzramm.github.io/knowYourLuigi

---

## How to use

### 1. Start the app

Keep the whole project folder together.

- **Easiest:** double-click `index.html` to open it in your browser.
- **Or** from the project folder run:
  ```bash
  python3 -m http.server 8080
  ```
  and open `http://localhost:8080`.

**On a phone:** open the same address on your computer’s Wi‑Fi (`http://<laptop-ip>:8080`), or use a GitHub Pages link. You can also “Add to Home Screen” for an app-like icon.

### 2. Load people (import)

On the first screen:

1. Tap **Bilder wählen** / **Choose images** and select all photo files (open the folder → Select All).
2. Tap **CSV wählen** / **Choose CSV** and pick your people file.
3. Tap **Los geht’s** / **Let’s go**.

**No data yet?** Click **Diese ausprobieren** / **Try these** under the intro text to load the built-in demo set and start playing right away.

**Tips**

- The `Foto` column in the CSV must match the image file names (case does not matter; umlauts are fine).
- If a name has no matching photo, it still appears with initials. The import screen lists who is missing a photo.
- To use a **different** set of people later, refresh the page and import again.
- The blue **restart** button only reshuffles the **current** set — it does not load new files.

### 3. Play a round

1. Look at the photo and try to remember the person.
2. Tap the photo or **Aufdecken** / **Reveal** to show name, department, position, and company.
3. Tap **Richtig** / **Right** if you knew them, or **Falsch** / **Wrong** if not.
   - Right → card is done for this pass.
   - Wrong → the card returns a few cards later.
4. Use the chevrons to skip without scoring.
5. When the queue is empty, you get a short summary (first-try vs needed retry), then start the next shuffled round.

**Header buttons**

| Button | What it does |
|--------|----------------|
| **EN** / **DE** | Switch UI language |
| Sun / moon | Light or dark mode |
| Circular arrow | Restart round with the same data |

### 4. Keyboard shortcuts (desktop)

| Key | Action |
|-----|--------|
| Space | Reveal |
| ← / → | Previous / next (skip) |
| `F` or `1` | Wrong |
| `R` or `2` | Right |
| Enter | Continue after the round summary |

---

## CSV format (for your own data)

Use a semicolon-separated file with a header row:

```text
Foto;Name;Abteilung;Position;Gesellschaft
Adrian Friedrich.jpg;Adrian Friedrich;Projekt;Softwareentwickler;levigo solutions gmbh
```

| Column | Purpose |
|--------|---------|
| Foto | Image file name |
| Name | Display name |
| Abteilung | Shown after reveal |
| Position | Shown after reveal |
| Gesellschaft | Shown after reveal |

Extra columns (if any) are ignored.

---

## Publish on GitHub Pages

Upload the full folder, including `vendor/` and `bilder0/`. Visitors import their own photos/CSV in the browser; those files are not sent to GitHub. Only what you commit (e.g. the demo photos) is public — do not commit private portraits unless that is intentional.

---

## Folder overview

| Path | Role |
|------|------|
| `index.html`, `app.js`, `style.css` | App |
| `vendor/` | Styles, script, fonts (works offline / without CDN) |
| `bilder0/` | Demo photos |
| `personen0.csv` | Demo CSV (also embedded for `file://`) |
| `favicon.svg`, `manifest.webmanifest` | Icon and home-screen install |
