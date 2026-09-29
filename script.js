/* =========================================
   POCKET PIXELS
   Complete Application Logic - Finalized
========================================= */

/* =========================================
   1. STORAGE KEYS & CONSTANTS
========================================= */

const STORAGE_KEY = "lumiereJournals";

const COVER_COLORS = {
    ivory: "#f8f4ec",
    cream: "#efe3c8",
    beige: "#d8c5a9",
    blush: "#edc7ce",
    rose: "#c994a3",
    pink: "#e9b8c9",
    lavender: "#c9b9df",
    lilac: "#d8c6e8",
    periwinkle: "#aeb9df",
    babyblue: "#b9d7e8",
    powderblue: "#c9dce5",
    sage: "#b9c8ae",
    pistachio: "#d1d9ae",
    eucalyptus: "#aebfb3",
    butter: "#ead99a",
    peach: "#e8b99e",
    terracotta: "#bd806b",
    plum: "#81617d",
    burgundy: "#713f4d",
    espresso: "#654c42",
    charcoal: "#47444a"
};

const STICKER_COLLECTION = [
    { icon: "🎞️", label: "Filmstrip" },
    { icon: "✨", label: "Sparkles" },
    { icon: "🏷️", label: "Vintage Tag" },
    { icon: "☕", label: "Coffee Cup" },
    { icon: "🌿", label: "Botanical" },
    { icon: "📮", label: "Postmark" },
    { icon: "🎨", label: "Palette" },
    { icon: "🐈", label: "Cat Stamp" },
    { icon: "🕯️", label: "Candle" },
    { icon: "🗝️", label: "Old Key" },
    { icon: "🥐", label: "Croissant" },
    { icon: "🌻", label: "Sunflower" }
];

/* =========================================
   2. SYNTHESIZED TACTILE WEB AUDIO ENGINE
========================================= */

let audioCtx = null;

function getAudioContext() {
    if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) audioCtx = new AudioContextClass();
    }
    if (audioCtx && audioCtx.state === "suspended") {
        audioCtx.resume();
    }
    return audioCtx;
}

const AudioHaptics = {
    playPageFlip() {
        const ctx = getAudioContext();
        if (!ctx) return;
        const bufferSize = ctx.sampleRate * 0.18;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.35));
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(800, ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(2800, ctx.currentTime + 0.12);
        filter.Q.value = 1.2;

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.24, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.18);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start();
    },

    playStickerPlop() {
        const ctx = getAudioContext();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(420, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.08);

        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
    },

    playCameraSnap() {
        const ctx = getAudioContext();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(950, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.04);

        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
    }
};

/* =========================================
   3. DOM ELEMENTS
========================================= */

const homeView = document.getElementById("homeView");
const journalLibrary = document.getElementById("journalLibrary");
const emptyLibrary = document.getElementById("emptyLibrary");
const emptyAddButton = document.getElementById("emptyAddButton");
const brandButton = document.getElementById("brandButton");
const searchButton = document.getElementById("searchButton");
const viewBookMode = document.getElementById("viewBookMode");
const viewGridMode = document.getElementById("viewGridMode");
const shelfGridView = document.getElementById("shelfGridView");
const coverStage = document.getElementById("coverStage");
const carouselNavArrows = document.getElementById("carouselNavArrows");

/* Journal Home Carousel */
const journalTitle = document.getElementById("journalTitle");
const journalPageCount = document.getElementById("journalPageCount");
const mainCover = document.getElementById("mainCover");
const leftCover = document.getElementById("leftCover");
const rightCover = document.getElementById("rightCover");
const leftCoverCanvas = document.getElementById("leftCoverCanvas");
const rightCoverCanvas = document.getElementById("rightCoverCanvas");
const mainCoverButton = document.getElementById("mainCoverButton");
const previousJournal = document.getElementById("previousJournal");
const nextJournal = document.getElementById("nextJournal");
const journalPosition = document.getElementById("journalPosition");
const moreOptionsButton = document.getElementById("moreOptionsButton");
const exportButton = document.getElementById("exportButton");
const importButton = document.getElementById("importButton");
const importJsonInput = document.getElementById("importJsonInput");
const deleteButton = document.getElementById("deleteButton");
const addJournalButton = document.getElementById("addJournalButton");
const editCoverButton = document.getElementById("editCoverButton");

/* Opened Journal View */
const journalView = document.getElementById("journalView");
const backButton = document.getElementById("backButton");
const openedJournalTitle = document.getElementById("openedJournalTitle");
const openedJournalPageCount = document.getElementById("openedJournalPageCount");
const exportSpreadPngBtn = document.getElementById("exportSpreadPngBtn");
const journalSearchButton = document.getElementById("journalSearchButton");
const journalSearch = document.getElementById("journalSearch");
const journalSearchInput = document.getElementById("journalSearchInput");
const closeJournalSearch = document.getElementById("closeJournalSearch");
const leftPage = document.getElementById("leftPage");
const rightPage = document.getElementById("rightPage");
const leftDrawCanvas = document.getElementById("leftDrawCanvas");
const rightDrawCanvas = document.getElementById("rightDrawCanvas");
const previousPage = document.getElementById("previousPage");
const nextPage = document.getElementById("nextPage");
const pagePosition = document.getElementById("pagePosition");

/* Zoom & Pan Elements */
const spreadViewport = document.getElementById("spreadViewport");
const bookSpreadContainer = document.getElementById("bookSpreadContainer");
const zoomInBtn = document.getElementById("zoomInBtn");
const zoomOutBtn = document.getElementById("zoomOutBtn");
const zoomResetBtn = document.getElementById("zoomResetBtn");
const zoomLevelText = document.getElementById("zoomLevelText");

/* Drawing Toolbar */
const drawToolbar = document.getElementById("drawToolbar");
const drawColorPicker = document.getElementById("drawColorPicker");
const drawSizeSlider = document.getElementById("drawSizeSlider");
const clearDrawingBtn = document.getElementById("clearDrawingBtn");

/* Floating Action Dock */
const dockAddPage = document.getElementById("dockAddPage");
const dockAddImage = document.getElementById("dockAddImage");
const dockAddSticker = document.getElementById("dockAddSticker");
const dockAddText = document.getElementById("dockAddText");
const dockToggleDraw = document.getElementById("dockToggleDraw");
const dockTemplates = document.getElementById("dockTemplates");
const pageImageInput = document.getElementById("pageImageInput");

/* Modals */
const stickerModal = document.getElementById("stickerModal");
const stickerModalBackdrop = document.getElementById("stickerModalBackdrop");
const closeStickerModal = document.getElementById("closeStickerModal");
const stickerGrid = document.getElementById("stickerGrid");

const templatesModal = document.getElementById("templatesModal");
const templatesModalBackdrop = document.getElementById("templatesModalBackdrop");
const closeTemplatesModal = document.getElementById("closeTemplatesModal");

const pageTextModal = document.getElementById("pageTextModal");
const pageTextBackdrop = document.getElementById("pageTextBackdrop");
const closePageTextModal = document.getElementById("closePageTextModal");
const pageTextInput = document.getElementById("pageTextInput");
const fontOptions = document.getElementById("fontOptions");
const savePageText = document.getElementById("savePageText");

const newJournalModal = document.getElementById("newJournalModal");
const modalBackdrop = document.getElementById("modalBackdrop");
const closeNewJournalModal = document.getElementById("closeNewJournalModal");
const newJournalForm = document.getElementById("newJournalForm");
const journalName = document.getElementById("journalName");
const journalDescription = document.getElementById("journalDescription");
const coverOptions = document.getElementById("coverOptions");
const colourRequiredMessage = document.getElementById("colourRequiredMessage");
const journalModalTitle = document.getElementById("journalModalTitle");
const journalSubmitButton = document.getElementById("journalSubmitButton");

const coverEditorModal = document.getElementById("coverEditorModal");
const coverEditorBackdrop = document.getElementById("coverEditorBackdrop");
const closeCoverEditor = document.getElementById("closeCoverEditor");
const coverCanvas = document.getElementById("coverCanvas");
const addCoverText = document.getElementById("addCoverText");
const addCoverImage = document.getElementById("addCoverImage");
const changeCoverColour = document.getElementById("changeCoverColour");
const saveCoverChanges = document.getElementById("saveCoverChanges");
const cancelCoverChanges = document.getElementById("cancelCoverChanges");
const coverImageInput = document.getElementById("coverImageInput");
const editorCoverColourPalette = document.getElementById("editorCoverColourPalette");

const coverTextModal = document.getElementById("coverTextModal");
const coverTextBackdrop = document.getElementById("coverTextBackdrop");
const closeCoverTextModal = document.getElementById("closeCoverTextModal");
const coverTextInput = document.getElementById("coverTextInput");
const saveCoverText = document.getElementById("saveCoverText");

/* =========================================
   4. APP STATE
========================================= */

let journals = loadJournals();
let currentJournalIndex = 0;
let currentPageIndex = 0;
let activeTargetPageIndex = 0;
let isPageFlipping = false;
let selectedNoteFont = "font-handwriting";
let currentViewMode = "book";
let isDrawingMode = false;
let activeSelectedScrap = null;

/* Zoom & Pan State */
let zoomScale = 1;
let panX = 0;
let panY = 0;
let isPanning = false;
let panStartX = 0;
let panStartY = 0;

let selectedCover = null;
let editingJournalId = null;
let coverEditorDraft = null;
let editingCoverElementId = null;

/* =========================================
   5. STORAGE & UTILITIES
========================================= */

function loadJournals() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) return [];
        const parsed = JSON.parse(saved);
        if (!Array.isArray(parsed)) return [];
        return parsed.map(journal => ({
            ...journal,
            title: journal.title || "Untitled journal",
            description: journal.description || "",
            pages: Array.isArray(journal.pages) ? journal.pages : [],
            cover: (journal.cover && typeof journal.cover === "object") ? {
                color: journal.cover.color || "ivory",
                elements: Array.isArray(journal.cover.elements) ? journal.cover.elements : []
            } : {
                color: COVER_COLORS[journal.cover] ? journal.cover : "ivory",
                elements: []
            }
        }));
    } catch (e) {
        console.error("Could not load journals:", e);
        return [];
    }
}

function saveJournals() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(journals));
    } catch (e) {
        console.error("Could not save journals:", e);
    }
}

function createId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function getCurrentJournal() {
    return journals[currentJournalIndex] || null;
}

/* =========================================
   6. COVER DECORATION & RESIZE STYLES
========================================= */

function injectCoverResizeStyles() {
    if (document.getElementById("pocketPixelsResizeStyles")) return;
    const style = document.createElement("style");
    style.id = "pocketPixelsResizeStyles";
    style.textContent = `
        .cover-image-wrapper {
            position: absolute;
            transform: translate(-50%, -50%) rotate(var(--rotation));
            transform-origin: center center;
            user-select: none;
            -webkit-user-select: none;
            overflow: visible !important;
        }
        .cover-image-wrapper img {
            user-select: none;
            -webkit-user-drag: none;
            display: block;
            width: 100%;
            height: auto;
        }
        .cover-resize-handle {
            position: absolute;
            right: -8px;
            bottom: -8px;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #ffffff;
            border: 2px solid rgba(80, 65, 60, 0.58);
            box-shadow: 0 2px 7px rgba(50, 40, 35, 0.25);
            cursor: nwse-resize;
            z-index: 1000;
            touch-action: none;
        }
        .cover-rotate-handle {
            position: absolute;
            left: 50%;
            top: -38px;
            width: 18px;
            height: 18px;
            transform: translateX(-50%);
            border-radius: 50%;
            background: #ffffff;
            border: 2px solid rgba(80, 65, 60, 0.58);
            box-shadow: 0 2px 7px rgba(50, 40, 35, 0.25);
            cursor: grab;
            z-index: 1000;
            touch-action: none;
        }
        .cover-rotate-handle::before {
            content: "↻";
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            font-size: 12px;
            line-height: 1;
            color: rgba(70, 55, 50, 0.78);
        }
        .cover-delete-button {
            position: absolute;
            top: -10px;
            right: -10px;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #ffffff;
            border: 1px solid rgba(80, 65, 60, 0.38);
            color: rgba(70, 55, 50, 0.82);
            font-family: Arial, sans-serif;
            font-size: 16px;
            line-height: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 1001;
            box-shadow: 0 2px 7px rgba(50, 40, 35, 0.25);
        }
        .cover-image-wrapper.editor-image-selected {
            outline: 1px dashed rgba(80, 65, 60, 0.28);
            outline-offset: 5px;
        }
    `;
    document.head.appendChild(style);
}

/* =========================================
   7. LIBRARY & HOME VIEW
========================================= */

function renderHome() {
    if (journals.length === 0) {
        emptyLibrary.classList.remove("hidden");
        journalLibrary.classList.add("hidden");
        return;
    }
    emptyLibrary.classList.add("hidden");
    journalLibrary.classList.remove("hidden");

    if (currentJournalIndex >= journals.length) currentJournalIndex = journals.length - 1;

    if (currentViewMode === "grid") {
        renderGridView();
    } else {
        renderJournalHome();
    }
}

function renderJournalHome() {
    const journal = getCurrentJournal();
    if (!journal) {
        renderHome();
        return;
    }

    coverStage.classList.remove("hidden");
    carouselNavArrows.classList.remove("hidden");
    shelfGridView.classList.add("hidden");

    journalTitle.textContent = journal.title || "Untitled journal";
    const pageCount = Array.isArray(journal.pages) ? journal.pages.length : 0;
    journalPageCount.textContent = `⊘ ${pageCount} ${pageCount === 1 ? "Page" : "Pages"}`;

    renderCover(mainCover, journal.cover);
    journalPosition.textContent = `${currentJournalIndex + 1} / ${journals.length}`;
    renderSideCovers();
    updateJournalArrows();
}

function renderGridView() {
    coverStage.classList.add("hidden");
    carouselNavArrows.classList.add("hidden");
    shelfGridView.classList.remove("hidden");
    shelfGridView.innerHTML = "";

    journalTitle.textContent = "All Journals";
    journalPageCount.textContent = `${journals.length} ${journals.length === 1 ? "Book" : "Books"}`;

    journals.forEach((j, idx) => {
        const item = document.createElement("div");
        item.className = "grid-journal-item";
        renderCover(item, j.cover);

        const title = document.createElement("div");
        title.className = "grid-journal-title";
        title.textContent = j.title || "Untitled";
        item.appendChild(title);

        item.addEventListener("click", () => {
            currentJournalIndex = idx;
            openJournal();
        });

        shelfGridView.appendChild(item);
    });
}

function renderCover(container, cover) {
    if (!container) return;
    const colour = cover?.color ? (COVER_COLORS[cover.color] || cover.color) : COVER_COLORS.ivory;
    container.innerHTML = "";
    container.style.backgroundColor = colour;

    if (cover && Array.isArray(cover.elements)) {
        cover.elements.forEach(element => {
            const node = createCoverElement(element, false);
            if (node) {
                node.style.zIndex = Math.max(10, Number(element.zIndex || 10));
                container.appendChild(node);
            }
        });
    }
}

function switchHomeJournal(direction) {
    if (journals.length <= 1) return;
    currentJournalIndex = (currentJournalIndex + direction + journals.length) % journals.length;
    currentPageIndex = 0;
    AudioHaptics.playPageFlip();
    renderJournalHome();
}

function updateJournalArrows() {
    const multiple = journals.length > 1;
    if (previousJournal) previousJournal.classList.toggle("hidden", !multiple);
    if (nextJournal) nextJournal.classList.toggle("hidden", !multiple);
}

function renderSideCovers() {
    clearSideCover(leftCover);
    clearSideCover(rightCover);

    if (journals.length <= 1) return;

    if (journals.length === 2) {
        const otherIndex = (currentJournalIndex + 1) % 2;
        renderCover(rightCoverCanvas, journals[otherIndex].cover);
        showSideCover(rightCover);
        return;
    }

    const leftIndex = (currentJournalIndex - 1 + journals.length) % journals.length;
    const rightIndex = (currentJournalIndex + 1) % journals.length;

    renderCover(leftCoverCanvas, journals[leftIndex].cover);
    renderCover(rightCoverCanvas, journals[rightIndex].cover);
    showSideCover(leftCover);
    showSideCover(rightCover);
}

function clearSideCover(element) {
    if (!element) return;
    element.classList.add("hidden-preview");
    element.hidden = true;
}

function showSideCover(element) {
    if (!element) return;
    element.classList.remove("hidden-preview");
    element.hidden = false;
}

/* =========================================
   8. OPENED JOURNAL & COLLAGE SPREAD
========================================= */

function openJournal() {
    const journal = getCurrentJournal();
    if (!journal) return;

    if (!journal.pages || journal.pages.length === 0) {
        journal.pages = [
            { id: createId(), elements: [], drawing: null },
            { id: createId(), elements: [], drawing: null }
        ];
        saveJournals();
    }

    currentPageIndex = 0;
    activeTargetPageIndex = 0;
    resetSpreadTransform();
    homeView.classList.add("hidden");
    journalView.classList.remove("hidden");
    AudioHaptics.playPageFlip();
    renderOpenedJournal();
}

function renderOpenedJournal() {
    const journal = getCurrentJournal();
    if (!journal) return;
    openedJournalTitle.textContent = journal.title || "Untitled journal";
    const count = Array.isArray(journal.pages) ? journal.pages.length : 0;
    openedJournalPageCount.textContent = `⊘ ${count} ${count === 1 ? "Page" : "Pages"}`;
    renderBook();
}

function renderBook() {
    const journal = getCurrentJournal();
    if (!journal) return;
    const pages = Array.isArray(journal.pages) ? journal.pages : [];

    cleanPageContainer(leftPage);
    cleanPageContainer(rightPage);

    if (pages.length === 0) {
        pagePosition.textContent = "0 / 0";
        return;
    }

    const leftIdx = currentPageIndex;
    const rightIdx = currentPageIndex + 1;

    if (pages[leftIdx]) renderPage(leftPage, leftDrawCanvas, pages[leftIdx], leftIdx);
    if (pages[rightIdx]) renderPage(rightPage, rightDrawCanvas, pages[rightIdx], rightIdx);

    pagePosition.textContent = `${Math.min(currentPageIndex + 1, pages.length)} / ${pages.length}`;
}

function cleanPageContainer(container) {
    const elements = container.querySelectorAll(".page-element");
    elements.forEach(el => el.remove());
}

function renderPage(container, canvas, page, pageIndex) {
    if (!container) return;
    container.dataset.pageIndex = pageIndex;

    container.addEventListener("pointerdown", () => {
        activeTargetPageIndex = pageIndex;
    });

    if (page && Array.isArray(page.elements)) {
        const sorted = [...page.elements].sort((a, b) => (Number(a.zIndex || 1) - Number(b.zIndex || 1)));
        sorted.forEach(element => {
            const node = createPageElementNode(element, page);
            if (node) container.appendChild(node);
        });
    }

    if (canvas) {
        initDrawCanvas(canvas, page);
    }
}

document.addEventListener("pointerdown", (e) => {
    if (!e.target.closest(".page-element")) {
        document.querySelectorAll(".page-element.active-scrap").forEach(el => el.classList.remove("active-scrap"));
        activeSelectedScrap = null;
    }
});

/* =========================================
   9. CANVAS ZOOM & PAN ENGINE
========================================= */

function updateSpreadTransform() {
    if (!bookSpreadContainer) return;
    bookSpreadContainer.style.transform = `translate(${panX}px, ${panY}px) scale(${zoomScale})`;
    if (zoomLevelText) {
        zoomLevelText.textContent = `${Math.round(zoomScale * 100)}%`;
    }
}

function resetSpreadTransform() {
    zoomScale = 1;
    panX = 0;
    panY = 0;
    updateSpreadTransform();
}

zoomInBtn?.addEventListener("click", () => {
    zoomScale = Math.min(2.5, Number((zoomScale + 0.15).toFixed(2)));
    updateSpreadTransform();
});

zoomOutBtn?.addEventListener("click", () => {
    zoomScale = Math.max(0.65, Number((zoomScale - 0.15).toFixed(2)));
    updateSpreadTransform();
});

zoomResetBtn?.addEventListener("click", resetSpreadTransform);

// Wheel Zoom (Ctrl/Cmd + Wheel) or Desktop Pinch
spreadViewport?.addEventListener("wheel", (e) => {
    if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY < 0 ? 0.08 : -0.08;
        zoomScale = Math.max(0.65, Math.min(2.5, Number((zoomScale + delta).toFixed(2))));
        updateSpreadTransform();
    }
}, { passive: false });

// Pan with Space + Drag or Middle Mouse
spreadViewport?.addEventListener("pointerdown", (e) => {
    if (e.target.closest(".page-element, .spread-dock, .draw-toolbar, .zoom-floating-bar, .spread-arrow, input, button")) return;
    if (e.button === 1 || e.shiftKey || zoomScale > 1.05) {
        isPanning = true;
        panStartX = e.clientX - panX;
        panStartY = e.clientY - panY;
        bookSpreadContainer?.classList.add("is-panning");
        spreadViewport.setPointerCapture(e.pointerId);
    }
});

spreadViewport?.addEventListener("pointermove", (e) => {
    if (!isPanning) return;
    panX = e.clientX - panStartX;
    panY = e.clientY - panStartY;
    updateSpreadTransform();
});

const stopPanning = (e) => {
    if (!isPanning) return;
    isPanning = false;
    bookSpreadContainer?.classList.remove("is-panning");
    try { spreadViewport.releasePointerCapture(e.pointerId); } catch (_) {}
};

spreadViewport?.addEventListener("pointerup", stopPanning);
spreadViewport?.addEventListener("pointercancel", stopPanning);

/* =========================================
   10. PAGE SCRAP ELEMENTS (COLLAGE ENGINE)
========================================= */

function createPageElementNode(element, page) {
    if (!element) return null;
    const node = document.createElement("div");
    node.className = "page-element";
    node.style.left = `${element.x ?? 50}%`;
    node.style.top = `${element.y ?? 50}%`;
    node.style.setProperty("--rotation", `${element.rotation ?? 0}deg`);
    node.style.zIndex = element.zIndex || 10;

    if (element.type === "image") {
        node.classList.add("scrap-photo");
        node.style.width = `${element.width || 38}%`;
        const img = document.createElement("img");
        img.src = element.content;
        img.draggable = false;
        node.appendChild(img);
    } else if (element.type === "text") {
        node.classList.add("scrap-text");
        node.classList.add(element.fontStyle || "font-handwriting");
        node.textContent = element.content;
    }

    /* Transform Handles */
    const resizeHandle = document.createElement("div");
    resizeHandle.className = "scrap-resize-handle";
    node.appendChild(resizeHandle);

    const rotateHandle = document.createElement("div");
    rotateHandle.className = "scrap-rotate-handle";
    node.appendChild(rotateHandle);

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "scrap-delete-btn";
    deleteBtn.type = "button";
    deleteBtn.textContent = "×";
    deleteBtn.title = "Delete scrap";
    deleteBtn.addEventListener("pointerdown", e => e.stopPropagation());
    deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const idx = page.elements.findIndex(item => item.id === element.id);
        if (idx !== -1) {
            page.elements.splice(idx, 1);
            saveJournals();
            renderBook();
        }
    });
    node.appendChild(deleteBtn);

    /* Layer Stacking Controls */
    const stackControls = document.createElement("div");
    stackControls.className = "scrap-stack-controls";

    const forwardBtn = document.createElement("button");
    forwardBtn.className = "scrap-stack-btn";
    forwardBtn.textContent = "▲ Up";
    forwardBtn.title = "Bring Forward";
    forwardBtn.addEventListener("pointerdown", e => e.stopPropagation());
    forwardBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        element.zIndex = (Number(element.zIndex) || 10) + 1;
        node.style.zIndex = element.zIndex;
        saveJournals();
    });

    const backwardBtn = document.createElement("button");
    backwardBtn.className = "scrap-stack-btn";
    backwardBtn.textContent = "▼ Down";
    backwardBtn.title = "Send Backward";
    backwardBtn.addEventListener("pointerdown", e => e.stopPropagation());
    backwardBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        element.zIndex = Math.max(1, (Number(element.zIndex) || 10) - 1);
        node.style.zIndex = element.zIndex;
        saveJournals();
    });

    stackControls.appendChild(backwardBtn);
    stackControls.appendChild(forwardBtn);
    node.appendChild(stackControls);

    makePageElementInteractive(node, element, page, resizeHandle, rotateHandle);
    return node;
}

function makePageElementInteractive(node, element, page, resizeHandle, rotateHandle) {
    let dragging = false;
    let startX = 0, startY = 0;
    let elemX = Number(element.x ?? 50), elemY = Number(element.y ?? 50);

    /* Movement */
    node.addEventListener("pointerdown", (e) => {
        if (e.target.closest(".scrap-resize-handle, .scrap-rotate-handle, .scrap-delete-btn, .scrap-stack-controls")) return;
        if (e.button !== 0) return;
        e.preventDefault();
        e.stopPropagation();

        document.querySelectorAll(".page-element.active-scrap").forEach(el => el.classList.remove("active-scrap"));
        node.classList.add("active-scrap");
        activeSelectedScrap = { element, node };

        dragging = true;
        startX = e.clientX;
        startY = e.clientY;
        elemX = Number(element.x ?? 50);
        elemY = Number(element.y ?? 50);

        node.setPointerCapture(e.pointerId);
    });

    node.addEventListener("pointermove", (e) => {
        if (!dragging) return;
        const rect = node.parentElement.getBoundingClientRect();
        if (!rect.width || !rect.height) return;

        // Account for current zoom scale during drag
        const deltaX = (((e.clientX - startX) / zoomScale) / rect.width) * 100;
        const deltaY = (((e.clientY - startY) / zoomScale) / rect.height) * 100;

        element.x = Math.max(0, Math.min(100, elemX + deltaX));
        element.y = Math.max(0, Math.min(100, elemY + deltaY));

        node.style.left = `${element.x}%`;
        node.style.top = `${element.y}%`;
    });

    const stopDrag = (e) => {
        if (!dragging) return;
        dragging = false;
        try { node.releasePointerCapture(e.pointerId); } catch (_) {}
        saveJournals();
    };

    node.addEventListener("pointerup", stopDrag);
    node.addEventListener("pointercancel", stopDrag);

    /* Resize */
    let resizing = false;
    let startResizeX = 0, startWidth = 0;

    resizeHandle.addEventListener("pointerdown", (e) => {
        if (e.button !== 0) return;
        e.preventDefault();
        e.stopPropagation();
        resizing = true;
        startResizeX = e.clientX;
        startWidth = Number(element.width || 38);
        resizeHandle.setPointerCapture(e.pointerId);
    });

    resizeHandle.addEventListener("pointermove", (e) => {
        if (!resizing) return;
        const rect = node.parentElement.getBoundingClientRect();
        if (!rect.width) return;
        const delta = (((e.clientX - startResizeX) / zoomScale) / rect.width) * 100;
        element.width = Math.max(12, Math.min(95, Number((startWidth + delta).toFixed(2))));
        node.style.width = `${element.width}%`;
    });

    const stopResize = (e) => {
        if (!resizing) return;
        resizing = false;
        try { resizeHandle.releasePointerCapture(e.pointerId); } catch (_) {}
        saveJournals();
    };
    resizeHandle.addEventListener("pointerup", stopResize);
    resizeHandle.addEventListener("pointercancel", stopResize);

    /* Rotate */
    let rotating = false;
    let startAngle = 0, startRot = 0;

    rotateHandle.addEventListener("pointerdown", (e) => {
        if (e.button !== 0) return;
        e.preventDefault();
        e.stopPropagation();
        const rect = node.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        startAngle = Math.atan2(e.clientY - cy, e.clientX - cx) * 180 / Math.PI;
        startRot = Number(element.rotation || 0);
        rotating = true;
        try { rotateHandle.setPointerCapture(e.pointerId); } catch (_) {}
    });

    rotateHandle.addEventListener("pointermove", (e) => {
        if (!rotating) return;
        const rect = node.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const curAngle = Math.atan2(e.clientY - cy, e.clientX - cx) * 180 / Math.PI;
        let delta = curAngle - startAngle;
        if (delta > 180) delta -= 360;
        if (delta < -180) delta += 360;

        let newRot = ((startRot + delta + 180) % 360 + 360) % 360 - 180;
        element.rotation = Number(newRot.toFixed(1));
        node.style.setProperty("--rotation", `${element.rotation}deg`);
    });

    const stopRotate = (e) => {
        if (!rotating) return;
        rotating = false;
        try { rotateHandle.releasePointerCapture(e.pointerId); } catch (_) {}
        saveJournals();
    };
    rotateHandle.addEventListener("pointerup", stopRotate);
    rotateHandle.addEventListener("pointercancel", stopRotate);
}

function addScrapToCurrentPage(itemData) {
    const journal = getCurrentJournal();
    if (!journal) return;
    if (!Array.isArray(journal.pages) || journal.pages.length === 0) {
        addPage();
    }
    const target = journal.pages[activeTargetPageIndex] || journal.pages[0];
    if (!target.elements) target.elements = [];

    itemData.id = createId();
    target.elements.push(itemData);
    saveJournals();
    renderBook();
}

function addPage() {
    const journal = getCurrentJournal();
    if (!journal) return;
    if (!Array.isArray(journal.pages)) journal.pages = [];

    journal.pages.push({ id: createId(), elements: [], drawing: null });
    currentPageIndex = Math.max(journal.pages.length - 2, 0);
    saveJournals();
    AudioHaptics.playPageFlip();
    renderBook();
    openedJournalPageCount.textContent = `⊘ ${journal.pages.length} ${journal.pages.length === 1 ? "Page" : "Pages"}`;
}

/* =========================================
   11. FREEHAND DRAWING / STYLUS ENGINE
========================================= */

function initDrawCanvas(canvas, page) {
    const parent = canvas.parentElement;
    canvas.width = parent.clientWidth || 450;
    canvas.height = parent.clientHeight || 580;
    const ctx = canvas.getContext("2d");

    if (page.drawing) {
        const img = new Image();
        img.onload = () => ctx.drawImage(img, 0, 0);
        img.src = page.drawing;
    }

    let drawing = false;

    const startDraw = (e) => {
        if (!isDrawingMode) return;
        drawing = true;
        ctx.beginPath();
        const rect = canvas.getBoundingClientRect();
        ctx.moveTo((e.clientX - rect.left) / zoomScale, (e.clientY - rect.top) / zoomScale);
        ctx.strokeStyle = drawColorPicker.value;
        ctx.lineWidth = Number(drawSizeSlider.value);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
    };

    const draw = (e) => {
        if (!drawing || !isDrawingMode) return;
        const rect = canvas.getBoundingClientRect();
        ctx.lineTo((e.clientX - rect.left) / zoomScale, (e.clientY - rect.top) / zoomScale);
        ctx.stroke();
    };

    const stopDraw = () => {
        if (!drawing) return;
        drawing = false;
        page.drawing = canvas.toDataURL();
        saveJournals();
    };

    canvas.onpointerdown = startDraw;
    canvas.onpointermove = draw;
    canvas.onpointerup = stopDraw;
    canvas.onpointerleave = stopDraw;
}

dockToggleDraw?.addEventListener("click", () => {
    isDrawingMode = !isDrawingMode;
    dockToggleDraw.classList.toggle("active", isDrawingMode);
    drawToolbar.classList.toggle("hidden", !isDrawingMode);
    leftDrawCanvas.classList.toggle("drawing-active", isDrawingMode);
    rightDrawCanvas.classList.toggle("drawing-active", isDrawingMode);
});

clearDrawingBtn?.addEventListener("click", () => {
    const journal = getCurrentJournal();
    if (!journal) return;
    const p1 = journal.pages[currentPageIndex];
    const p2 = journal.pages[currentPageIndex + 1];
    if (p1) {
        p1.drawing = null;
        const ctx = leftDrawCanvas.getContext("2d");
        ctx.clearRect(0, 0, leftDrawCanvas.width, leftDrawCanvas.height);
    }
    if (p2) {
        p2.drawing = null;
        const ctx = rightDrawCanvas.getContext("2d");
        ctx.clearRect(0, 0, rightDrawCanvas.width, rightDrawCanvas.height);
    }
    saveJournals();
});

/* =========================================
   12. SPREAD PNG EXPORT GENERATOR
========================================= */

exportSpreadPngBtn?.addEventListener("click", () => {
    const book = document.getElementById("interactiveBook");
    if (!book) return;

    const w = book.clientWidth;
    const h = book.clientHeight;

    const c = document.createElement("canvas");
    c.width = w * 2;
    c.height = h * 2;
    const ctx = c.getContext("2d");
    ctx.scale(2, 2);

    ctx.fillStyle = "#fbf9f4";
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
    ctx.fillRect(w / 2 - 3, 0, 6, h);

    ctx.drawImage(leftDrawCanvas, 0, 0);
    ctx.drawImage(rightDrawCanvas, w / 2, 0);

    const scraps = book.querySelectorAll(".page-element");
    let loaded = 0;
    const total = scraps.length;

    if (total === 0) {
        downloadCanvas(c);
        return;
    }

    scraps.forEach(scrap => {
        const rect = scrap.getBoundingClientRect();
        const bookRect = book.getBoundingClientRect();
        const x = (rect.left - bookRect.left + rect.width / 2) / zoomScale;
        const y = (rect.top - bookRect.top + rect.height / 2) / zoomScale;
        const rot = parseFloat(scrap.style.getPropertyValue("--rotation")) || 0;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate((rot * Math.PI) / 180);

        const img = scrap.querySelector("img");
        if (img) {
            ctx.drawImage(img, -rect.width / (2 * zoomScale), -rect.height / (2 * zoomScale), rect.width / zoomScale, rect.height / zoomScale);
            loaded++;
            if (loaded === total) downloadCanvas(c);
        } else {
            ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
            ctx.fillRect(-rect.width / (2 * zoomScale), -rect.height / (2 * zoomScale), rect.width / zoomScale, rect.height / zoomScale);
            ctx.fillStyle = "#1e1918";
            ctx.font = "20px 'Caveat', cursive";
            ctx.fillText(scrap.textContent.replace("×▲ Up▼ Down", "").trim(), -rect.width / (2 * zoomScale) + 10, 5);
            loaded++;
            if (loaded === total) downloadCanvas(c);
        }
        ctx.restore();
    });
});

function downloadCanvas(canvas) {
    const link = document.createElement("a");
    link.download = `scrapbook-spread-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    AudioHaptics.playCameraSnap();
}

/* =========================================
   13. PRE-MADE SPREAD TEMPLATES
========================================= */

dockTemplates?.addEventListener("click", () => {
    templatesModal.classList.remove("hidden");
});

closeTemplatesModal?.addEventListener("click", () => templatesModal.classList.add("hidden"));
templatesModalBackdrop?.addEventListener("click", () => templatesModal.classList.add("hidden"));

document.querySelectorAll(".template-item-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const type = btn.dataset.template;
        applyTemplateToSpread(type);
        AudioHaptics.playStickerPlop();
        templatesModal.classList.add("hidden");
    });
});

function applyTemplateToSpread(type) {
    const journal = getCurrentJournal();
    if (!journal) return;

    if (type === "travel") {
        addScrapToCurrentPage({
            type: "text",
            content: "PARIS '24",
            fontStyle: "font-editorial",
            x: 25,
            y: 20,
            rotation: -4,
            zIndex: 10
        });
        addScrapToCurrentPage({
            type: "text",
            content: "🏷️",
            fontStyle: "font-handwriting",
            x: 75,
            y: 20,
            rotation: 8,
            zIndex: 10
        });
        addScrapToCurrentPage({
            type: "text",
            content: "Best morning café au lait near the Seine.",
            fontStyle: "font-handwriting",
            x: 48,
            y: 75,
            rotation: 2,
            zIndex: 10
        });
    } else if (type === "editorial") {
        addScrapToCurrentPage({
            type: "text",
            content: "CINEMATIC MEMORIES",
            fontStyle: "font-typewriter",
            x: 50,
            y: 18,
            rotation: 0,
            zIndex: 10
        });
        addScrapToCurrentPage({
            type: "text",
            content: "🎞️",
            fontStyle: "font-handwriting",
            x: 20,
            y: 40,
            rotation: -12,
            zIndex: 10
        });
    } else if (type === "minimal") {
        addScrapToCurrentPage({
            type: "text",
            content: "Daily Moments ☕",
            fontStyle: "font-handwriting",
            x: 35,
            y: 30,
            rotation: -3,
            zIndex: 10
        });
    }
}

/* =========================================
   14. 3D PAGE FLIP TRANSITION
========================================= */

function flipPage(direction) {
    if (isPageFlipping) return;
    const journal = getCurrentJournal();
    if (!journal || !Array.isArray(journal.pages)) return;

    const book = document.getElementById("interactiveBook");
    if (!book) return;

    if (direction === "next") {
        if (currentPageIndex + 2 >= journal.pages.length) return;

        isPageFlipping = true;
        AudioHaptics.playPageFlip();

        const currentRightPage = journal.pages[currentPageIndex + 1];
        const upcomingLeftPage = journal.pages[currentPageIndex + 2];

        const sheet = document.createElement("div");
        sheet.className = "flipping-sheet flip-forward";

        const frontFace = document.createElement("div");
        frontFace.className = "sheet-face sheet-face-front right-page";
        if (currentRightPage) renderPage(frontFace, null, currentRightPage, currentPageIndex + 1);

        const frontShadow = document.createElement("div");
        frontShadow.className = "sheet-shadow";
        frontFace.appendChild(frontShadow);

        const backFace = document.createElement("div");
        backFace.className = "sheet-face sheet-face-back left-page";
        if (upcomingLeftPage) renderPage(backFace, null, upcomingLeftPage, currentPageIndex + 2);

        const backShadow = document.createElement("div");
        backShadow.className = "sheet-shadow";
        backFace.appendChild(backShadow);

        sheet.appendChild(frontFace);
        sheet.appendChild(backFace);
        book.appendChild(sheet);

        currentPageIndex += 2;
        renderBook();

        requestAnimationFrame(() => {
            sheet.classList.add("turned");
        });

        setTimeout(() => {
            sheet.remove();
            isPageFlipping = false;
        }, 650);

    } else if (direction === "prev") {
        if (currentPageIndex <= 0) return;

        isPageFlipping = true;
        AudioHaptics.playPageFlip();

        const currentLeftPage = journal.pages[currentPageIndex];
        const targetRightPage = journal.pages[currentPageIndex - 1];

        const sheet = document.createElement("div");
        sheet.className = "flipping-sheet flip-backward";

        const frontFace = document.createElement("div");
        frontFace.className = "sheet-face sheet-face-front left-page";
        if (currentLeftPage) renderPage(frontFace, null, currentLeftPage, currentPageIndex);

        const frontShadow = document.createElement("div");
        frontShadow.className = "sheet-shadow";
        frontFace.appendChild(frontShadow);

        const backFace = document.createElement("div");
        backFace.className = "sheet-face sheet-face-back right-page";
        if (targetRightPage) renderPage(backFace, null, targetRightPage, currentPageIndex - 1);

        const backShadow = document.createElement("div");
        backShadow.className = "sheet-shadow";
        backFace.appendChild(backShadow);

        sheet.appendChild(frontFace);
        sheet.appendChild(backFace);
        book.appendChild(sheet);

        currentPageIndex = Math.max(0, currentPageIndex - 2);
        renderBook();

        requestAnimationFrame(() => {
            sheet.classList.add("turned");
        });

        setTimeout(() => {
            sheet.remove();
            isPageFlipping = false;
        }, 650);
    }
}

/* =========================================
   15. STICKER TRAY DRAWER
========================================= */

function openStickerTray() {
    if (!stickerGrid) return;
    stickerGrid.innerHTML = "";

    STICKER_COLLECTION.forEach(stk => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "sticker-item-btn";
        btn.innerHTML = `${stk.icon}<span>${stk.label}</span>`;
        btn.addEventListener("click", () => {
            addScrapToCurrentPage({
                type: "text",
                content: stk.icon,
                fontStyle: "font-handwriting",
                x: 45 + Math.random() * 10,
                y: 45 + Math.random() * 10,
                rotation: (Math.random() * 24) - 12,
                zIndex: 15
            });
            AudioHaptics.playStickerPlop();
            stickerModal.classList.add("hidden");
        });
        stickerGrid.appendChild(btn);
    });

    stickerModal.classList.remove("hidden");
}

/* =========================================
   16. TYPOGRAPHY STUDIO MODAL
========================================= */

function openTypographyStudio() {
    pageTextInput.value = "";
    pageTextModal.classList.remove("hidden");
    setTimeout(() => pageTextInput.focus(), 50);
}

fontOptions?.querySelectorAll(".font-option-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        fontOptions.querySelectorAll(".font-option-btn").forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
        selectedNoteFont = btn.dataset.font || "font-handwriting";
    });
});

savePageText?.addEventListener("click", () => {
    const text = pageTextInput.value.trim();
    if (!text) return;

    addScrapToCurrentPage({
        type: "text",
        content: text,
        fontStyle: selectedNoteFont,
        x: 35 + Math.random() * 30,
        y: 40 + Math.random() * 30,
        rotation: (Math.random() * 8) - 4,
        zIndex: 15
    });

    AudioHaptics.playStickerPlop();
    pageTextModal.classList.add("hidden");
});

/* =========================================
   17. COVER EDITOR
========================================= */

function createCoverElement(element, interactive = true) {
    if (!element || element.type === "sticker") return null;

    const node = document.createElement("div");
    node.className = "cover-element";
    node.dataset.elementId = element.id || createId();
    if (!element.id) element.id = node.dataset.elementId;

    node.style.left = `${element.x ?? 50}%`;
    node.style.top = `${element.y ?? 50}%`;
    node.style.setProperty("--rotation", `${element.rotation ?? 0}deg`);

    if (element.type === "text") {
        node.classList.add("cover-text-element");
        node.textContent = element.content || "";
        if (element.width) node.style.width = `${element.width}%`;
        if (element.fontSize) node.style.fontSize = `${element.fontSize}px`;
        if (element.color) node.style.color = element.color;
    } else if (element.type === "image") {
        node.classList.add("cover-image-wrapper");
        node.style.width = `${element.width || 40}%`;

        const image = document.createElement("img");
        image.className = "cover-image-element";
        image.src = element.content || "";
        image.draggable = false;
        node.appendChild(image);

        if (interactive && coverEditorDraft) {
            node.classList.add("editor-image-selected");

            const resizeHandle = document.createElement("div");
            resizeHandle.className = "cover-resize-handle";
            resizeHandle.title = "Drag to resize";
            node.appendChild(resizeHandle);
            makeCoverImageResizable(node, resizeHandle, element);

            const rotateHandle = document.createElement("div");
            rotateHandle.className = "cover-rotate-handle";
            rotateHandle.title = "Drag to rotate";
            node.appendChild(rotateHandle);
            makeCoverImageRotatable(node, rotateHandle, element);

            const deleteBtn = document.createElement("button");
            deleteBtn.type = "button";
            deleteBtn.className = "cover-delete-button";
            deleteBtn.textContent = "×";
            deleteBtn.title = "Delete image";
            deleteBtn.addEventListener("pointerdown", e => e.stopPropagation());
            deleteBtn.addEventListener("click", e => {
                e.stopPropagation();
                if (!coverEditorDraft) return;
                const idx = coverEditorDraft.elements.findIndex(i => i.id === element.id);
                if (idx !== -1) {
                    coverEditorDraft.elements.splice(idx, 1);
                    renderCoverEditor();
                }
            });
            node.appendChild(deleteBtn);
        }
    }

    node.style.zIndex = Math.max(10, Number(element.zIndex || 10));

    if (interactive && coverEditorDraft) {
        makeCoverElementDraggable(node, element);
        node.addEventListener("dblclick", e => {
            e.stopPropagation();
            if (element.type === "text") openEditCoverText(element);
        });
    }

    return node;
}

function makeCoverElementDraggable(node, element) {
    let dragging = false;
    let startX = 0, startY = 0;
    let elemX = 0, elemY = 0;

    node.addEventListener("pointerdown", (e) => {
        if (e.target.closest(".cover-resize-handle, .cover-rotate-handle, .cover-delete-button")) return;
        if (e.button !== 0) return;
        e.preventDefault();
        e.stopPropagation();

        dragging = true;
        startX = e.clientX;
        startY = e.clientY;
        elemX = Number(element.x ?? 50);
        elemY = Number(element.y ?? 50);
        node.setPointerCapture(e.pointerId);

        const highest = (coverEditorDraft?.elements || []).reduce((max, i) => Math.max(max, Number(i.zIndex || 1)), 0);
        element.zIndex = highest + 1;
        node.style.zIndex = Math.max(10, element.zIndex);
    });

    node.addEventListener("pointermove", (e) => {
        if (!dragging) return;
        const rect = coverCanvas.getBoundingClientRect();
        if (!rect.width || !rect.height) return;

        const dx = ((e.clientX - startX) / rect.width) * 100;
        const dy = ((e.clientY - startY) / rect.height) * 100;

        element.x = Math.max(0, Math.min(100, elemX + dx));
        element.y = Math.max(0, Math.min(100, elemY + dy));
        node.style.left = `${element.x}%`;
        node.style.top = `${element.y}%`;
    });

    const stop = (e) => {
        if (!dragging) return;
        dragging = false;
        try { node.releasePointerCapture(e.pointerId); } catch (_) {}
    };

    node.addEventListener("pointerup", stop);
    node.addEventListener("pointercancel", stop);
}

function makeCoverImageResizable(node, handle, element) {
    let resizing = false;
    let startX = 0, startW = 0, cWidth = 0;

    handle.addEventListener("pointerdown", (e) => {
        if (e.button !== 0) return;
        e.preventDefault();
        e.stopPropagation();
        resizing = true;
        startX = e.clientX;
        startW = Number(element.width || 40);
        cWidth = coverCanvas.getBoundingClientRect().width;
        handle.setPointerCapture(e.pointerId);
    });

    handle.addEventListener("pointermove", (e) => {
        if (!resizing || !cWidth) return;
        const delta = ((e.clientX - startX) / cWidth) * 100;
        element.width = Math.max(8, Math.min(85, Number((startW + delta).toFixed(2))));
        node.style.width = `${element.width}%`;
    });

    const stop = (e) => {
        if (!resizing) return;
        resizing = false;
        try { handle.releasePointerCapture(e.pointerId); } catch (_) {}
    };
    handle.addEventListener("pointerup", stop);
    handle.addEventListener("pointercancel", stop);
}

function makeCoverImageRotatable(node, handle, element) {
    let rotating = false;
    let pId = null, startAngle = 0, startRot = 0;

    handle.addEventListener("pointerdown", (e) => {
        if (e.button !== 0) return;
        e.preventDefault();
        e.stopPropagation();
        const rect = node.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        startAngle = Math.atan2(e.clientY - cy, e.clientX - cx) * 180 / Math.PI;
        startRot = Number(element.rotation || 0);
        rotating = true;
        pId = e.pointerId;
        try { handle.setPointerCapture(e.pointerId); } catch (_) {}
    });

    handle.addEventListener("pointermove", (e) => {
        if (!rotating || e.pointerId !== pId) return;
        const rect = node.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const curAngle = Math.atan2(e.clientY - cy, e.clientX - cx) * 180 / Math.PI;
        let delta = curAngle - startAngle;
        if (delta > 180) delta -= 360;
        if (delta < -180) delta += 360;

        let newRot = ((startRot + delta + 180) % 360 + 360) % 360 - 180;
        element.rotation = Number(newRot.toFixed(1));
        node.style.setProperty("--rotation", `${element.rotation}deg`);
    });

    const stop = (e) => {
        if (!rotating || e.pointerId !== pId) return;
        rotating = false;
        pId = null;
        try { handle.releasePointerCapture(e.pointerId); } catch (_) {}
    };
    handle.addEventListener("pointerup", stop);
    handle.addEventListener("pointercancel", stop);
}

function openCoverEditor() {
    const journal = getCurrentJournal();
    if (!journal) return;
    coverEditorDraft = JSON.parse(JSON.stringify(journal.cover));
    renderCoverEditor();
    createEditorColourPalette();
    if (editorCoverColourPalette) editorCoverColourPalette.classList.remove("visible");
    coverEditorModal.classList.remove("hidden");
}

function renderCoverEditor() {
    if (!coverEditorDraft) return;
    coverCanvas.innerHTML = "";
    coverCanvas.style.backgroundColor = COVER_COLORS[coverEditorDraft.color] || coverEditorDraft.color || COVER_COLORS.ivory;

    if (!Array.isArray(coverEditorDraft.elements)) coverEditorDraft.elements = [];
    const sorted = [...coverEditorDraft.elements].sort((a, b) => Number(a.zIndex || 1) - Number(b.zIndex || 1));

    sorted.forEach(element => {
        const node = createCoverElement(element, true);
        if (node) coverCanvas.appendChild(node);
    });
}

function createEditorColourPalette() {
    if (!editorCoverColourPalette) return;
    editorCoverColourPalette.innerHTML = "";
    Object.entries(COVER_COLORS).forEach(([name, colour]) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "editor-colour-option";
        btn.dataset.cover = name;
        btn.title = name;
        btn.style.backgroundColor = colour;
        if (coverEditorDraft?.color === name) btn.classList.add("selected");
        btn.addEventListener("click", () => {
            if (!coverEditorDraft) return;
            coverEditorDraft.color = name;
            editorCoverColourPalette.querySelectorAll(".editor-colour-option").forEach(o => o.classList.toggle("selected", o === btn));
            renderCoverEditor();
        });
        editorCoverColourPalette.appendChild(btn);
    });
}

function openEditCoverText(element) {
    if (!element) return;
    editingCoverElementId = element.id;
    coverTextInput.value = element.content || "";
    coverTextModal.classList.remove("hidden");
    setTimeout(() => coverTextInput.focus(), 50);
}

/* =========================================
   18. MODAL & PALETTE HELPERS
========================================= */

function createNewJournalColourPalette() {
    if (!coverOptions) return;
    coverOptions.innerHTML = "";
    Object.entries(COVER_COLORS).forEach(([name, colour]) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "cover-option";
        button.dataset.cover = name;
        button.title = name.charAt(0).toUpperCase() + name.slice(1);
        button.style.backgroundColor = colour;
        button.addEventListener("click", () => {
            selectedCover = name;
            coverOptions.querySelectorAll(".cover-option").forEach(opt => opt.classList.toggle("selected", opt === button));
            if (colourRequiredMessage) colourRequiredMessage.classList.remove("visible");
        });
        coverOptions.appendChild(button);
    });
}

function openNewJournalModal(isEditing = false) {
    editingJournalId = isEditing ? getCurrentJournal()?.id : null;
    journalModalTitle.textContent = isEditing ? "Edit Journal" : "Create a journal";
    journalSubmitButton.textContent = isEditing ? "Save Changes" : "Create journal";

    newJournalForm.reset();
    createNewJournalColourPalette();

    if (isEditing) {
        const j = getCurrentJournal();
        if (j) {
            journalName.value = j.title || "";
            journalDescription.value = j.description || "";
            selectedCover = j.cover?.color || "ivory";
            coverOptions?.querySelectorAll(".cover-option").forEach(opt => {
                opt.classList.toggle("selected", opt.dataset.cover === selectedCover);
            });
        }
    } else {
        selectedCover = null;
    }

    if (colourRequiredMessage) colourRequiredMessage.classList.remove("visible");
    newJournalModal.classList.remove("hidden");
    setTimeout(() => journalName.focus(), 50);
}

function closeNewJournalModalFunc() {
    newJournalModal.classList.add("hidden");
    editingJournalId = null;
}

function closeCoverEditorModal() {
    coverEditorDraft = null;
    editingCoverElementId = null;
    coverEditorModal.classList.add("hidden");
}

function closeCoverText() {
    coverTextModal.classList.add("hidden");
    editingCoverElementId = null;
}

/* =========================================
   19. ALL EVENT LISTENERS
========================================= */

/* VIEW TOGGLES */
viewBookMode?.addEventListener("click", () => {
    currentViewMode = "book";
    viewBookMode.classList.add("active");
    viewGridMode?.classList.remove("active");
    renderHome();
});

viewGridMode?.addEventListener("click", () => {
    currentViewMode = "grid";
    viewGridMode.classList.add("active");
    viewBookMode?.classList.remove("active");
    renderHome();
});

/* Search */
searchButton?.addEventListener("click", () => {
    if (journals.length === 0) return alert("Create a journal first!");
    const query = prompt("Search journal by title or description:");
    if (!query) return;
    const lower = query.toLowerCase().trim();
    const foundIndex = journals.findIndex(j => (j.title || "").toLowerCase().includes(lower) || (j.description || "").toLowerCase().includes(lower));
    if (foundIndex !== -1) {
        currentJournalIndex = foundIndex;
        currentViewMode = "book";
        viewBookMode?.classList.add("active");
        viewGridMode?.classList.remove("active");
        renderHome();
    } else {
        alert(`No journals found matching "${query}"`);
    }
});

/* Brand / Menu */
brandButton?.addEventListener("click", () => {
    alert(`Pocket Pixels — Scrapbook Edition\nTotal Journals: ${journals.length}\nTotal Pages Across Library: ${journals.reduce((sum, j) => sum + (j.pages?.length || 0), 0)}`);
});

/* Carousel & Home */
previousJournal?.addEventListener("click", e => { e.stopPropagation(); switchHomeJournal(-1); });
nextJournal?.addEventListener("click", e => { e.stopPropagation(); switchHomeJournal(1); });
leftCover?.addEventListener("click", e => { e.stopPropagation(); switchHomeJournal(-1); });
rightCover?.addEventListener("click", e => { e.stopPropagation(); switchHomeJournal(1); });
mainCoverButton?.addEventListener("click", openJournal);

/* Shelf Dock Actions */
moreOptionsButton?.addEventListener("click", () => {
    if (!getCurrentJournal()) return;
    openNewJournalModal(true);
});

addJournalButton?.addEventListener("click", () => openNewJournalModal(false));
emptyAddButton?.addEventListener("click", () => openNewJournalModal(false));

/* Delete Journal */
deleteButton?.addEventListener("click", () => {
    const journal = getCurrentJournal();
    if (!journal || !confirm(`Delete "${journal.title}"?\nThis cannot be undone.`)) return;
    journals.splice(currentJournalIndex, 1);
    currentJournalIndex = Math.max(0, journals.length - 1);
    currentPageIndex = 0;
    saveJournals();
    renderHome();
});

/* Export / Share JSON */
exportButton?.addEventListener("click", () => {
    const journal = getCurrentJournal();
    if (!journal) return;
    const blob = new Blob([JSON.stringify(journal, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${(journal.title || "journal").replace(/[^a-z0-9]/gi, "-").toLowerCase()}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    AudioHaptics.playStickerPlop();
});

/* Import JSON Backup */
importButton?.addEventListener("click", () => {
    importJsonInput?.click();
});

importJsonInput?.addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const imported = JSON.parse(event.target.result);
            if (!imported || typeof imported !== "object" || !Array.isArray(imported.pages)) {
                alert("Invalid journal file format!");
                return;
            }

            imported.id = createId();
            imported.title = imported.title ? `${imported.title} (Imported)` : "Imported Journal";
            journals.push(imported);
            currentJournalIndex = journals.length - 1;
            saveJournals();
            renderHome();
            AudioHaptics.playCameraSnap();
            alert(`Successfully imported "${imported.title}"!`);
        } catch (err) {
            console.error(err);
            alert("Could not parse JSON journal file.");
        } finally {
            importJsonInput.value = "";
        }
    };
    reader.readAsText(file);
});

/* Page Navigation */
backButton?.addEventListener("click", () => {
    journalView.classList.add("hidden");
    homeView.classList.remove("hidden");
    journalSearch.classList.add("hidden");
    AudioHaptics.playPageFlip();
    renderHome();
});
previousPage?.addEventListener("click", () => flipPage("prev"));
nextPage?.addEventListener("click", () => flipPage("next"));
dockAddPage?.addEventListener("click", addPage);

/* Opened Spread Tools */
dockAddSticker?.addEventListener("click", openStickerTray);
dockAddImage?.addEventListener("click", () => pageImageInput.click());
dockAddText?.addEventListener("click", openTypographyStudio);

pageImageInput?.addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
        addScrapToCurrentPage({
            type: "image",
            content: reader.result,
            width: 42,
            x: 50,
            y: 50,
            rotation: (Math.random() * 14) - 7,
            zIndex: 10
        });
        AudioHaptics.playCameraSnap();
        pageImageInput.value = "";
    };
    reader.readAsDataURL(file);
});

/* Close Modals */
closeStickerModal?.addEventListener("click", () => stickerModal.classList.add("hidden"));
stickerModalBackdrop?.addEventListener("click", () => stickerModal.classList.add("hidden"));
closePageTextModal?.addEventListener("click", () => pageTextModal.classList.add("hidden"));
pageTextBackdrop?.addEventListener("click", () => pageTextModal.classList.add("hidden"));

/* New / Edit Journal Submit */
newJournalForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = journalName.value.trim();
    const description = journalDescription.value.trim();
    if (!title) return;

    if (!editingJournalId && !selectedCover) {
        if (colourRequiredMessage) colourRequiredMessage.classList.add("visible");
        return;
    }

    if (editingJournalId) {
        const j = journals.find(item => item.id === editingJournalId);
        if (j) {
            j.title = title;
            j.description = description;
            if (selectedCover) j.cover.color = selectedCover;
        }
    } else {
        const newJournal = {
            id: createId(),
            title,
            description,
            createdAt: new Date().toISOString(),
            cover: { color: selectedCover, elements: [] },
            pages: [
                { id: createId(), elements: [], drawing: null },
                { id: createId(), elements: [], drawing: null }
            ]
        };
        journals.push(newJournal);
        currentJournalIndex = journals.length - 1;
    }

    currentPageIndex = 0;
    saveJournals();
    AudioHaptics.playStickerPlop();
    closeNewJournalModalFunc();
    renderHome();
});

/* Search In Journal */
journalSearchButton?.addEventListener("click", () => {
    journalSearch.classList.toggle("hidden");
    if (!journalSearch.classList.contains("hidden")) journalSearchInput.focus();
});
closeJournalSearch?.addEventListener("click", () => {
    journalSearch.classList.add("hidden");
    journalSearchInput.value = "";
    renderBook();
});
journalSearchInput?.addEventListener("input", () => {
    const query = journalSearchInput.value.trim().toLowerCase();
    const journal = getCurrentJournal();
    if (!journal || !query) {
        renderBook();
        return;
    }
    const results = journal.pages.filter(p => JSON.stringify(p).toLowerCase().includes(query));
    cleanPageContainer(leftPage);
    cleanPageContainer(rightPage);
    if (results.length === 0) {
        pagePosition.textContent = "0 results";
        return;
    }
    renderPage(leftPage, leftDrawCanvas, results[0], 0);
    if (results[1]) renderPage(rightPage, rightDrawCanvas, results[1], 1);
    pagePosition.textContent = `${results.length} result${results.length === 1 ? "" : "s"}`;
});

/* Keyboard Shortcuts for Stacking ([ and ]) */
document.addEventListener("keydown", (e) => {
    if (activeSelectedScrap) {
        if (e.key === "]") {
            activeSelectedScrap.element.zIndex = (Number(activeSelectedScrap.element.zIndex) || 10) + 1;
            activeSelectedScrap.node.style.zIndex = activeSelectedScrap.element.zIndex;
            saveJournals();
        } else if (e.key === "[") {
            activeSelectedScrap.element.zIndex = Math.max(1, (Number(activeSelectedScrap.element.zIndex) || 10) - 1);
            activeSelectedScrap.node.style.zIndex = activeSelectedScrap.element.zIndex;
            saveJournals();
        }
    }
});

/* Cover Editor Actions */
editCoverButton?.addEventListener("click", (e) => {
    e.stopPropagation();
    openCoverEditor();
});
closeCoverEditor?.addEventListener("click", closeCoverEditorModal);
coverEditorBackdrop?.addEventListener("click", closeCoverEditorModal);
cancelCoverChanges?.addEventListener("click", closeCoverEditorModal);
changeCoverColour?.addEventListener("click", () => {
    editorCoverColourPalette?.classList.toggle("visible");
});
saveCoverChanges?.addEventListener("click", () => {
    const journal = getCurrentJournal();
    if (!journal || !coverEditorDraft) return;
    journal.cover = JSON.parse(JSON.stringify(coverEditorDraft));
    saveJournals();
    closeCoverEditorModal();
    AudioHaptics.playStickerPlop();
    renderJournalHome();
});

addCoverImage?.addEventListener("click", () => coverImageInput.click());
coverImageInput?.addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    if (!file || !coverEditorDraft) return;
    const reader = new FileReader();
    reader.onload = () => {
        const highestZ = coverEditorDraft.elements.reduce((h, i) => Math.max(h, Number(i.zIndex || 1)), 0);
        coverEditorDraft.elements.push({
            id: createId(),
            type: "image",
            content: reader.result,
            x: 50,
            y: 50,
            width: 40,
            rotation: 0,
            zIndex: highestZ + 1
        });
        AudioHaptics.playCameraSnap();
        renderCoverEditor();
        coverImageInput.value = "";
    };
    reader.readAsDataURL(file);
});

addCoverText?.addEventListener("click", () => {
    editingCoverElementId = null;
    coverTextInput.value = "";
    coverTextModal.classList.remove("hidden");
    setTimeout(() => coverTextInput.focus(), 50);
});
closeCoverTextModal?.addEventListener("click", closeCoverText);
coverTextBackdrop?.addEventListener("click", closeCoverText);

saveCoverText?.addEventListener("click", () => {
    const text = coverTextInput.value.trim();
    if (!text || !coverEditorDraft) return;
    if (editingCoverElementId) {
        const el = coverEditorDraft.elements.find(i => i.id === editingCoverElementId);
        if (el) el.content = text;
    } else {
        const highestZ = coverEditorDraft.elements.reduce((h, i) => Math.max(h, Number(i.zIndex || 1)), 0);
        coverEditorDraft.elements.push({
            id: createId(),
            type: "text",
            content: text,
            x: 50,
            y: 50,
            width: 60,
            rotation: 0,
            fontSize: 24,
            color: "#332b29",
            zIndex: highestZ + 1
        });
    }
    closeCoverText();
    AudioHaptics.playStickerPlop();
    renderCoverEditor();
});

/* Global Escape Shortcuts */
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        if (!newJournalModal.classList.contains("hidden")) closeNewJournalModalFunc();
        if (!coverTextModal.classList.contains("hidden")) closeCoverText();
        if (!coverEditorModal.classList.contains("hidden")) closeCoverEditorModal();
        if (!stickerModal.classList.contains("hidden")) stickerModal.classList.add("hidden");
        if (!templatesModal.classList.contains("hidden")) templatesModal.classList.add("hidden");
        if (!pageTextModal.classList.contains("hidden")) pageTextModal.classList.add("hidden");
    }
});

/* =========================================
   20. INITIALISE
========================================= */

function initialiseApp() {
    injectCoverResizeStyles();
    createNewJournalColourPalette();
    renderHome();
}

initialiseApp();