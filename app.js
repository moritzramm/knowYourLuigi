(() => {
  const THEME_KEY = "namen-lernen-theme";
  const LANG_KEY = "namen-lernen-lang";
  const REINSERT_MIN = 2;
  const REINSERT_MAX = 5;
  const DEMO_IMAGE_DIR = "bilder0";
  // Filenames as on disk (NFD umlauts) so relative img paths resolve from file:// and http.
  const DEMO_IMAGE_FILES = [
    "David Werth.jpg",
    "Frank Sautter.jpg",
    "Jo\u0308rg Henne.jpg",
    "Ju\u0308rgen Ma\u0308stling.jpg",
    "Oliver Bausch.jpg",
    "Vincenzo Biasi.jpg",
    "luigi levigo.png",
    "pablo pulsatrix.png",
  ];
  // Embedded so demo works without fetch (file://).
  const DEMO_CSV_TEXT = `Foto;Name;Abteilung;Position;Gesellschaft
David Werth.jpg;David Werth;levigo solutions;Geschäftsführer;levigo solutions gmbh
Frank Sautter.jpg;Frank Sautter;levigo holding;Gesellschafter-Geschäftsführer;levigo holding gmbh
Jörg Henne.jpg;Jörg Henne;levigo solutions;Gesellschafter-Geschäftsführer;levigo solutions gmbh
Jürgen Mästling.jpg;Jürgen Mästling;levigo solutions;Geschäftsführer;levigo solutions gmbh
luigi levigo.png;Luigi Levigo;Internal Functions;Maskottchen;levigo holding gmbh
Oliver Bausch.jpg;Oliver Bausch;Internal Functions;Gesellschafter-Geschäftsführer;levigo systems gmbh
Pablo pulsatrix.png;Pablo Pulsatrix;Internal Functions;Maskottchen;levigo holding gmbh
Vincenzo Biasi.jpg;Vincenzo Biasi;Internal Functions;Geschäftsführer;levigo systems gmbh
`;

  const I18N = {
    de: {
      langBtn: "EN",
      langAria: "Switch to English",
      langTitle: "English",
      restartAria: "Runde neu starten",
      restartTitle: "Neu starten",
      themeAria: "Hell-/Dunkelmodus umschalten",
      importTitle: "Daten importieren",
      importLeadBefore:
        "Wähle zuerst die Fotos, dann die CSV. Im Dateidialog kannst du den Ordner öffnen und alle Bilder markieren. Noch keine Daten? ",
      tryThese: "Diese ausprobieren",
      importLeadAfter: ".",
      pickImages: "Bilder wählen",
      pickCsv: "CSV wählen",
      start: "Los geht’s",
      noPhotos: "Noch keine Fotos",
      pickPhotosFirst: "Zuerst Fotos wählen",
      csvNotChosen: "CSV noch nicht gewählt",
      noImagesDetected: "Keine Bilder erkannt",
      photosLoaded: (n) => `${n} Foto${n === 1 ? "" : "s"} geladen`,
      noPeopleFound: "Keine Personen gefunden",
      csvReadError: "CSV konnte nicht gelesen werden",
      csvLoaded: (people, matched) => `${people} Personen · ${matched} mit Foto`,
      unmatchedTitle: (n) =>
        n === 1 ? "1 Person ohne passendes Foto:" : `${n} Personen ohne passendes Foto:`,
      summaryTitle: "Runde geschafft",
      summaryText: (firstTry, neededRetry) =>
        `${firstTry} beim ersten Versuch · ${neededRetry} mit Wiederholung`,
      summaryContinue: "Nächste Runde",
      errPickImages: "Bitte Bilddateien auswählen (JPG, PNG, WebP …).",
      errNoPeople: "In der CSV wurden keine Personen gefunden.",
      errNeedBoth: "Bitte zuerst Bilder und CSV wählen.",
      errCsvGeneric: "CSV konnte nicht gelesen werden.",
      errDemoLoad: "Demo-Daten konnten nicht geladen werden.",
      prevAria: "Vorherige Person",
      nextAria: "Nächste Person",
      photoRevealAria: "Informationen aufdecken",
      photoAlt: (name) => `Foto von ${name}`,
      photoAltGeneric: "Mitarbeiterfoto",
      hint: "Tippe auf das Foto oder auf „Aufdecken“.",
      reveal: "Aufdecken",
      wrong: "Falsch",
      right: "Richtig",
      remaining: (n) => `${n} übrig`,
      retryHint: (n) => ` · ${n} wieder`,
    },
    en: {
      langBtn: "DE",
      langAria: "Auf Deutsch umschalten",
      langTitle: "Deutsch",
      restartAria: "Restart round",
      restartTitle: "Restart",
      themeAria: "Toggle light/dark mode",
      importTitle: "Import data",
      importLeadBefore:
        "First select the photos, then the CSV. In the file dialog you can open the folder and select all images. No data yet? ",
      tryThese: "Try these",
      importLeadAfter: ".",
      pickImages: "Choose images",
      pickCsv: "Choose CSV",
      start: "Let’s go",
      noPhotos: "No photos yet",
      pickPhotosFirst: "Choose photos first",
      csvNotChosen: "CSV not chosen yet",
      noImagesDetected: "No images detected",
      photosLoaded: (n) => `${n} photo${n === 1 ? "" : "s"} loaded`,
      noPeopleFound: "No people found",
      csvReadError: "Could not read CSV",
      csvLoaded: (people, matched) => `${people} people · ${matched} with photo`,
      unmatchedTitle: (n) =>
        n === 1 ? "1 person without a matching photo:" : `${n} people without a matching photo:`,
      summaryTitle: "Round complete",
      summaryText: (firstTry, neededRetry) =>
        `${firstTry} first-try · ${neededRetry} needed retry`,
      summaryContinue: "Next round",
      errPickImages: "Please select image files (JPG, PNG, WebP …).",
      errNoPeople: "No people were found in the CSV.",
      errNeedBoth: "Please choose images and a CSV first.",
      errCsvGeneric: "Could not read the CSV.",
      errDemoLoad: "Could not load demo data.",
      prevAria: "Previous person",
      nextAria: "Next person",
      photoRevealAria: "Reveal information",
      photoAlt: (name) => `Photo of ${name}`,
      photoAltGeneric: "Employee photo",
      hint: "Tap the photo or “Reveal”.",
      reveal: "Reveal",
      wrong: "Wrong",
      right: "Right",
      remaining: (n) => `${n} left`,
      retryHint: (n) => ` · ${n} again`,
    },
  };

  const els = {
    progress: document.getElementById("progress"),
    error: document.getElementById("error"),
    themeToggle: document.getElementById("theme-toggle"),
    themeToggleLabel: document.querySelector("label.theme-toggle"),
    langBtn: document.getElementById("lang-btn"),
    restartBtn: document.getElementById("restart-btn"),
    importScreen: document.getElementById("import-screen"),
    gameScreen: document.getElementById("game-screen"),
    importTitle: document.getElementById("import-title"),
    importLead: document.getElementById("import-lead"),
    imagesInput: document.getElementById("images-input"),
    csvInput: document.getElementById("csv-input"),
    pickImagesBtn: document.getElementById("pick-images-btn"),
    pickCsvBtn: document.getElementById("pick-csv-btn"),
    startBtn: document.getElementById("start-btn"),
    imagesStatus: document.getElementById("images-status"),
    csvStatus: document.getElementById("csv-status"),
    importMisses: document.getElementById("import-misses"),
    summaryScreen: document.getElementById("summary-screen"),
    summaryTitle: document.getElementById("summary-title"),
    summaryText: document.getElementById("summary-text"),
    summaryContinueBtn: document.getElementById("summary-continue-btn"),
    photoButton: document.getElementById("photo-button"),
    photo: document.getElementById("photo"),
    photoPlaceholder: document.getElementById("photo-placeholder"),
    photoInitials: document.getElementById("photo-initials"),
    details: document.getElementById("details"),
    hint: document.getElementById("hint"),
    name: document.getElementById("name"),
    abteilung: document.getElementById("abteilung"),
    position: document.getElementById("position"),
    gesellschaft: document.getElementById("gesellschaft"),
    revealBtn: document.getElementById("reveal-btn"),
    answerActions: document.getElementById("answer-actions"),
    rightBtn: document.getElementById("right-btn"),
    wrongBtn: document.getElementById("wrong-btn"),
    prevBtn: document.getElementById("prev-btn"),
    nextBtn: document.getElementById("next-btn"),
  };

  /** @type {{ foto: string, photoUrl: string, name: string, abteilung: string, position: string, gesellschaft: string }[]} */
  let people = [];
  /** @type {typeof people} */
  let queue = [];
  /** @type {Set<string>} */
  let requeuedKeys = new Set();
  /** @type {Set<string>} */
  let wrongThisRound = new Set();
  let firstTryCount = 0;
  let neededRetryCount = 0;
  /** @type {string[]} */
  let unmatchedNames = [];
  /** @type {Map<string, string>} */
  let photoUrls = new Map();
  let revealed = false;
  let summaryVisible = false;
  let pendingRows = null;
  /** @type {"de" | "en"} */
  let lang = "de";
  let imagesStatusKey = "noPhotos";
  let imagesCount = 0;
  let csvStatusKey = "pickPhotosFirst";
  let csvPeopleCount = 0;
  let csvMatchedCount = 0;
  let errorKey = "";

  function t() {
    return I18N[lang];
  }

  function personKey(person) {
    return `${person.name}\0${person.foto}`;
  }

  function assetUrl(path) {
    return path
      .split("/")
      .map((segment) => encodeURIComponent(segment))
      .join("/");
  }

  function renderImportLead() {
    const s = t();
    els.importLead.replaceChildren();
    els.importLead.append(document.createTextNode(s.importLeadBefore));

    const link = document.createElement("a");
    link.href = "#";
    link.className = "demo-link";
    link.id = "demo-link";
    link.textContent = s.tryThese;
    link.addEventListener("click", (event) => {
      event.preventDefault();
      loadDemoData();
    });
    els.importLead.append(link);
    els.importLead.append(document.createTextNode(s.importLeadAfter));
  }

  function applyTheme(theme) {
    const next = theme === "dark" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    els.themeToggle.checked = next === "dark";
    localStorage.setItem(THEME_KEY, next);
  }

  function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "dark" || saved === "light") {
      applyTheme(saved);
      return;
    }
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(prefersDark ? "dark" : "light");
  }

  function refreshStatusTexts() {
    const s = t();

    if (imagesStatusKey === "photosLoaded") {
      els.imagesStatus.textContent = s.photosLoaded(imagesCount);
    } else {
      els.imagesStatus.textContent = s[imagesStatusKey] || s.noPhotos;
    }

    if (csvStatusKey === "csvLoaded") {
      els.csvStatus.textContent = s.csvLoaded(csvPeopleCount, csvMatchedCount);
    } else {
      els.csvStatus.textContent = s[csvStatusKey] || s.pickPhotosFirst;
    }

    renderUnmatchedList();

    if (summaryVisible) {
      els.summaryTitle.textContent = s.summaryTitle;
      els.summaryText.textContent = s.summaryText(firstTryCount, neededRetryCount);
      els.summaryContinueBtn.textContent = s.summaryContinue;
    }

    if (errorKey) {
      const message = typeof s[errorKey] === "function" ? s[errorKey]() : s[errorKey];
      if (message) {
        els.error.textContent = message;
        els.error.classList.remove("hidden");
      }
    }
  }

  function applyLanguage() {
    const s = t();
    document.documentElement.lang = lang;
    document.documentElement.setAttribute("data-lang", lang);

    els.langBtn.textContent = s.langBtn;
    els.langBtn.setAttribute("aria-label", s.langAria);
    els.langBtn.title = s.langTitle;

    els.restartBtn.setAttribute("aria-label", s.restartAria);
    els.restartBtn.title = s.restartTitle;
    if (els.themeToggleLabel) {
      els.themeToggleLabel.setAttribute("aria-label", s.themeAria);
    }

    els.importTitle.textContent = s.importTitle;
    renderImportLead();
    els.pickImagesBtn.textContent = s.pickImages;
    els.pickCsvBtn.textContent = s.pickCsv;
    els.startBtn.textContent = s.start;

    els.prevBtn.setAttribute("aria-label", s.prevAria);
    els.nextBtn.setAttribute("aria-label", s.nextAria);
    els.photoButton.setAttribute("aria-label", s.photoRevealAria);
    if (!els.photo.alt || els.photo.alt === I18N.de.photoAltGeneric || els.photo.alt === I18N.en.photoAltGeneric) {
      els.photo.alt = s.photoAltGeneric;
    }
    els.hint.textContent = s.hint;
    els.revealBtn.textContent = s.reveal;
    els.wrongBtn.textContent = s.wrong;
    els.rightBtn.textContent = s.right;
    els.summaryTitle.textContent = s.summaryTitle;
    els.summaryContinueBtn.textContent = s.summaryContinue;

    refreshStatusTexts();

    if (summaryVisible) {
      els.summaryText.textContent = s.summaryText(firstTryCount, neededRetryCount);
    }

    if (queue.length > 0 && !els.gameScreen.classList.contains("is-hidden")) {
      updateProgressText();
      const person = queue[0];
      if (person && person.photoUrl) {
        els.photo.alt = s.photoAlt(person.name);
      }
    }
  }

  function setLanguage(next) {
    lang = next === "en" ? "en" : "de";
    localStorage.setItem(LANG_KEY, lang);
    applyLanguage();
  }

  function initLanguage() {
    const saved = localStorage.getItem(LANG_KEY);
    lang = saved === "en" ? "en" : "de";
    applyLanguage();
  }

  function toggleLanguage() {
    setLanguage(lang === "de" ? "en" : "de");
  }

  function shuffle(array) {
    const copy = array.slice();
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function basename(path) {
    const normalized = String(path || "").replace(/\\/g, "/");
    const parts = normalized.split("/");
    return parts[parts.length - 1] || "";
  }

  function normalizeKey(name) {
    // NFC: macOS File API often returns NFD names (ö = o + ¨), CSV usually NFC.
    return basename(name).trim().toLowerCase().normalize("NFC");
  }

  function parseCsv(text) {
    const lines = text.replace(/^\uFEFF/, "").split(/\r?\n/).filter((line) => line.trim() !== "");
    if (lines.length < 2) return [];

    const rows = [];
    for (let i = 1; i < lines.length; i += 1) {
      const cols = lines[i].split(";");
      const foto = (cols[0] || "").trim();
      const name = (cols[1] || "").trim();
      if (!name) continue;

      rows.push({
        foto,
        name,
        abteilung: (cols[2] || "").trim(),
        position: (cols[3] || "").trim(),
        gesellschaft: (cols[4] || "").trim(),
      });
    }
    return rows;
  }

  function initialsFromName(name) {
    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "?";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  function clearError() {
    errorKey = "";
    els.error.textContent = "";
    els.error.classList.add("hidden");
  }

  function showError(key) {
    errorKey = key;
    const s = t();
    els.error.textContent = s[key] || key;
    els.error.classList.remove("hidden");
  }

  function revokePhotoUrls() {
    for (const url of photoUrls.values()) {
      if (String(url).startsWith("blob:")) {
        URL.revokeObjectURL(url);
      }
    }
    photoUrls = new Map();
  }

  function updateStartEnabled() {
    const ready = photoUrls.size > 0 && Array.isArray(pendingRows) && pendingRows.length > 0;
    els.startBtn.disabled = !ready;
  }

  function showImportScreen() {
    clearError();
    summaryVisible = false;
    els.importScreen.classList.remove("is-hidden");
    els.gameScreen.classList.add("is-hidden");
    els.summaryScreen.classList.add("is-hidden");
    els.progress.classList.add("is-hidden");
    els.restartBtn.classList.add("is-hidden");
    els.progress.textContent = "– / –";
  }

  function showGameScreen() {
    summaryVisible = false;
    els.importScreen.classList.add("is-hidden");
    els.summaryScreen.classList.add("is-hidden");
    els.gameScreen.classList.remove("is-hidden");
    els.progress.classList.remove("is-hidden");
    els.restartBtn.classList.remove("is-hidden");
  }

  function showSummaryScreen() {
    summaryVisible = true;
    els.gameScreen.classList.add("is-hidden");
    els.summaryScreen.classList.remove("is-hidden");
    els.progress.classList.add("is-hidden");
    els.summaryTitle.textContent = t().summaryTitle;
    els.summaryText.textContent = t().summaryText(firstTryCount, neededRetryCount);
    els.summaryContinueBtn.textContent = t().summaryContinue;
  }

  function restartGame() {
    if (people.length === 0) return;
    clearError();
    showGameScreen();
    startRound(people);
  }

  function continueAfterSummary() {
    if (!summaryVisible) return;
    showGameScreen();
    startRound(people);
  }

  function getUnmatchedNames(rows) {
    return rows
      .filter((row) => !row.foto || !photoUrls.has(normalizeKey(row.foto)))
      .map((row) => row.name);
  }

  function renderUnmatchedList() {
    if (!unmatchedNames.length) {
      els.importMisses.textContent = "";
      els.importMisses.hidden = true;
      els.importMisses.classList.add("is-hidden");
      return;
    }

    const title = t().unmatchedTitle(unmatchedNames.length);
    els.importMisses.textContent = `${title} ${unmatchedNames.join(", ")}`;
    els.importMisses.hidden = false;
    els.importMisses.classList.remove("is-hidden");
  }

  function setCsvImportResult(rows) {
    pendingRows = rows;
    csvPeopleCount = rows.length;
    csvMatchedCount = rows.filter((row) => row.foto && photoUrls.has(normalizeKey(row.foto))).length;
    unmatchedNames = getUnmatchedNames(rows);
    csvStatusKey = "csvLoaded";
    updateStartEnabled();
    refreshStatusTexts();
  }

  function buildPeople(rows) {
    return rows.map((row) => {
      const key = normalizeKey(row.foto);
      const photoUrl = key && photoUrls.has(key) ? photoUrls.get(key) : "";
      return {
        ...row,
        photoUrl,
      };
    });
  }

  function setRevealed(isRevealed) {
    revealed = isRevealed;
    els.details.classList.toggle("is-masked", !isRevealed);
    els.details.setAttribute("aria-hidden", String(!isRevealed));
    els.hint.classList.toggle("is-masked", isRevealed);
    els.revealBtn.classList.toggle("is-masked", isRevealed);
    els.revealBtn.setAttribute("aria-hidden", String(isRevealed));
    els.revealBtn.tabIndex = isRevealed ? -1 : 0;
    els.answerActions.classList.toggle("is-masked", !isRevealed);
    els.answerActions.setAttribute("aria-hidden", String(!isRevealed));
  }

  function showPhoto(person) {
    const hasFoto = Boolean(person.photoUrl);
    els.photo.classList.toggle("hidden", !hasFoto);
    els.photoPlaceholder.classList.toggle("hidden", hasFoto);

    if (hasFoto) {
      els.photo.src = person.photoUrl;
      els.photo.alt = t().photoAlt(person.name);
      els.photo.onerror = () => {
        els.photo.classList.add("hidden");
        els.photoPlaceholder.classList.remove("hidden");
        els.photoInitials.textContent = initialsFromName(person.name);
      };
    } else {
      els.photo.removeAttribute("src");
      els.photo.alt = t().photoAltGeneric;
      els.photoInitials.textContent = initialsFromName(person.name);
    }
  }

  function countRequeuedInQueue() {
    let count = 0;
    for (const person of queue) {
      if (requeuedKeys.has(personKey(person))) count += 1;
    }
    return count;
  }

  function updateProgressText() {
    const again = countRequeuedInQueue();
    const againHint = again > 0 ? t().retryHint(again) : "";
    els.progress.textContent = `${t().remaining(queue.length)}${againHint}`;
  }

  function renderCard() {
    const person = queue[0];
    if (!person) return;

    updateProgressText();
    // CSV fields stay as imported — never translated
    els.name.textContent = person.name;
    els.abteilung.textContent = person.abteilung || "–";
    els.position.textContent = person.position || "–";
    els.gesellschaft.textContent = person.gesellschaft || "–";

    showPhoto(person);
    setRevealed(false);
    updateSkipButtons();
  }

  function updateSkipButtons() {
    els.prevBtn.disabled = queue.length <= 1;
    els.nextBtn.disabled = queue.length <= 1;
  }

  function startRound(source = people) {
    queue = shuffle(source);
    requeuedKeys = new Set();
    wrongThisRound = new Set();
    firstTryCount = 0;
    neededRetryCount = 0;
    renderCard();
  }

  function finishOrContinue() {
    if (queue.length === 0) {
      showSummaryScreen();
      return;
    }
    renderCard();
  }

  function randomReinsertGap() {
    return REINSERT_MIN + Math.floor(Math.random() * (REINSERT_MAX - REINSERT_MIN + 1));
  }

  function isGameActive() {
    return (
      !summaryVisible &&
      !els.gameScreen.classList.contains("is-hidden") &&
      people.length > 0 &&
      queue.length > 0
    );
  }

  function reveal() {
    if (!isGameActive() || revealed) return;
    setRevealed(true);
  }

  function markRight() {
    if (!isGameActive() || !revealed || queue.length === 0) return;
    const [done] = queue.splice(0, 1);
    const key = personKey(done);
    if (wrongThisRound.has(key)) {
      neededRetryCount += 1;
    } else {
      firstTryCount += 1;
    }
    requeuedKeys.delete(key);
    finishOrContinue();
  }

  function markWrong() {
    if (!isGameActive() || !revealed || queue.length === 0) return;
    const [card] = queue.splice(0, 1);
    const key = personKey(card);
    wrongThisRound.add(key);
    requeuedKeys.add(key);
    const insertAt = Math.min(randomReinsertGap(), queue.length);
    queue.splice(insertAt, 0, card);
    renderCard();
  }

  function skipPrev() {
    if (!isGameActive() || queue.length <= 1) return;
    queue.unshift(queue.pop());
    renderCard();
  }

  function skipNext() {
    if (!isGameActive() || queue.length <= 1) return;
    queue.push(queue.shift());
    renderCard();
  }

  function handleKeyboard(event) {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    const tag = event.target && event.target.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

    if (summaryVisible) {
      if (event.key === "Enter") {
        event.preventDefault();
        continueAfterSummary();
      }
      return;
    }

    if (!isGameActive()) return;

    if (event.key === " " || event.code === "Space") {
      event.preventDefault();
      if (!revealed) reveal();
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      skipPrev();
      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      skipNext();
      return;
    }

    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
    if (key === "f" || key === "1") {
      event.preventDefault();
      markWrong();
      return;
    }
    if (key === "r" || key === "2") {
      event.preventDefault();
      markRight();
    }
  }

  function handleImagesSelected(fileList) {
    clearError();
    revokePhotoUrls();
    pendingRows = null;
    unmatchedNames = [];
    els.csvInput.value = "";
    csvStatusKey = "csvNotChosen";
    csvPeopleCount = 0;
    csvMatchedCount = 0;
    els.startBtn.disabled = true;
    renderUnmatchedList();

    const files = Array.from(fileList || []).filter(
      (file) => file.type.startsWith("image/") || /\.(jpe?g|png|webp|gif)$/i.test(file.name)
    );

    for (const file of files) {
      const key = normalizeKey(file.name);
      if (!key || photoUrls.has(key)) continue;
      photoUrls.set(key, URL.createObjectURL(file));
    }

    if (photoUrls.size === 0) {
      imagesStatusKey = "noImagesDetected";
      imagesCount = 0;
      els.pickCsvBtn.disabled = true;
      refreshStatusTexts();
      showError("errPickImages");
      return;
    }

    imagesStatusKey = "photosLoaded";
    imagesCount = photoUrls.size;
    els.pickCsvBtn.disabled = false;
    refreshStatusTexts();
  }

  async function handleCsvSelected(file) {
    clearError();
    if (!file) return;

    try {
      const text = await file.text();
      const rows = parseCsv(text);
      if (rows.length === 0) {
        pendingRows = null;
        unmatchedNames = [];
        csvStatusKey = "noPeopleFound";
        csvPeopleCount = 0;
        csvMatchedCount = 0;
        updateStartEnabled();
        refreshStatusTexts();
        showError("errNoPeople");
        return;
      }

      setCsvImportResult(rows);
    } catch (err) {
      pendingRows = null;
      unmatchedNames = [];
      csvStatusKey = "csvReadError";
      csvPeopleCount = 0;
      csvMatchedCount = 0;
      updateStartEnabled();
      refreshStatusTexts();
      showError("errCsvGeneric");
    }
  }

  function startGame() {
    clearError();
    if (!pendingRows || pendingRows.length === 0 || photoUrls.size === 0) {
      showError("errNeedBoth");
      return;
    }

    people = buildPeople(pendingRows);
    showGameScreen();
    startRound(people);
  }

  function loadDemoData() {
    clearError();
    revokePhotoUrls();
    pendingRows = null;
    unmatchedNames = [];
    els.imagesInput.value = "";
    els.csvInput.value = "";
    els.pickCsvBtn.disabled = true;
    els.startBtn.disabled = true;

    try {
      const rows = parseCsv(DEMO_CSV_TEXT);
      if (rows.length === 0) {
        throw new Error("demo-empty");
      }

      for (const fileName of DEMO_IMAGE_FILES) {
        const key = normalizeKey(fileName);
        if (!key || photoUrls.has(key)) continue;
        // Relative paths work for both file:// and http(s)://
        photoUrls.set(key, assetUrl(`${DEMO_IMAGE_DIR}/${fileName}`));
      }

      if (photoUrls.size === 0) {
        throw new Error("demo-images");
      }

      imagesStatusKey = "photosLoaded";
      imagesCount = photoUrls.size;
      setCsvImportResult(rows);
      startGame();
    } catch (err) {
      pendingRows = null;
      unmatchedNames = [];
      imagesStatusKey = "noPhotos";
      imagesCount = 0;
      csvStatusKey = "pickPhotosFirst";
      csvPeopleCount = 0;
      csvMatchedCount = 0;
      els.pickCsvBtn.disabled = true;
      els.startBtn.disabled = true;
      refreshStatusTexts();
      showError("errDemoLoad");
    }
  }

  function init() {
    initTheme();
    initLanguage();
    showImportScreen();

    els.themeToggle.addEventListener("change", () => {
      applyTheme(els.themeToggle.checked ? "dark" : "light");
    });
    els.langBtn.addEventListener("click", toggleLanguage);

    els.pickImagesBtn.addEventListener("click", () => els.imagesInput.click());
    els.pickCsvBtn.addEventListener("click", () => {
      if (!els.pickCsvBtn.disabled) els.csvInput.click();
    });
    els.imagesInput.addEventListener("change", () => {
      handleImagesSelected(els.imagesInput.files);
    });
    els.csvInput.addEventListener("change", () => {
      const file = els.csvInput.files && els.csvInput.files[0];
      handleCsvSelected(file);
    });
    els.startBtn.addEventListener("click", startGame);
    els.restartBtn.addEventListener("click", restartGame);
    els.summaryContinueBtn.addEventListener("click", continueAfterSummary);

    els.photoButton.addEventListener("click", reveal);
    els.revealBtn.addEventListener("click", reveal);
    els.rightBtn.addEventListener("click", markRight);
    els.wrongBtn.addEventListener("click", markWrong);
    els.prevBtn.addEventListener("click", skipPrev);
    els.nextBtn.addEventListener("click", skipNext);
    document.addEventListener("keydown", handleKeyboard);
  }

  init();
})();
