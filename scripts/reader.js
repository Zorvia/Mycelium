/*
Project: Eclipse
Owned by Zorvia
All credits to the Zorvia Community
Licensed under ZPL v2.0
See LICENSE.md for details
*/

/** Reader overlay — manages the modal, story rendering, and reading preferences. */
const FONT_SIZE_KEY = 'eclipse-font-size';
const FONT_STEP = 0.1;
const FONT_MIN = 0.8;
const FONT_MAX = 2.0;
const DEFAULT_FONT = 1.1;

const $ = (sel) => document.querySelector(sel);

const els = {
  overlay: null,
  body: null,
  content: null,
  title: null,
  close: null,
  prev: null,
  next: null,
  fontUp: null,
  fontDown: null,
};

let manifest = [];
let currentIndex = -1;
let returnFocusEl = null;
let fontSize = DEFAULT_FONT;

/** Restore persisted font size */
function loadFontSize() {
  const stored = localStorage.getItem(FONT_SIZE_KEY);
  if (stored) {
    const val = parseFloat(stored);
    if (!Number.isNaN(val) && val >= FONT_MIN && val <= FONT_MAX) {
      fontSize = val;
    }
  }
  applyFontSize();
}

function applyFontSize() {
  document.documentElement.style.setProperty('--reader-font-size', `${fontSize}rem`);
}

function saveFontSize() {
  localStorage.setItem(FONT_SIZE_KEY, String(fontSize));
}

/** Focus trap — keeps Tab cycling inside the overlay */
function trapFocus(e) {
  if (e.key !== 'Tab') return;
  const focusable = els.overlay.querySelectorAll(
    'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
  );
  if (focusable.length === 0) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

/** Open reader at the given manifest index */
async function openStory(index, triggerEl) {
  if (index < 0 || index >= manifest.length) return;
  currentIndex = index;
  returnFocusEl = triggerEl || document.activeElement;
  const story = manifest[index];

  els.title.textContent = story.title;
  els.content.innerHTML = '<p>Loading…</p>';

  // Show overlay
  els.overlay.hidden = false;
  document.body.classList.add('reader-open');
  els.body.focus();

  // Load story HTML
  try {
    const resp = await fetch(story.htmlPath);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const html = await resp.text();
    els.content.innerHTML = html;
  } catch {
    els.content.innerHTML = '<p>Could not load story. Please try again.</p>';
  }

  updateNav();
  els.overlay.addEventListener('keydown', trapFocus);
  els.overlay.addEventListener('keydown', handleReaderKeys);
}

function closeReader() {
  els.overlay.hidden = true;
  document.body.classList.remove('reader-open');
  els.overlay.removeEventListener('keydown', trapFocus);
  els.overlay.removeEventListener('keydown', handleReaderKeys);
  if (returnFocusEl) returnFocusEl.focus();
}

function updateNav() {
  els.prev.disabled = currentIndex <= 0;
  els.next.disabled = currentIndex >= manifest.length - 1;
}

function handleReaderKeys(e) {
  if (e.key === 'Escape') {
    e.stopPropagation();
    closeReader();
  } else if (e.key === 'ArrowLeft' && !els.prev.disabled) {
    openStory(currentIndex - 1);
  } else if (e.key === 'ArrowRight' && !els.next.disabled) {
    openStory(currentIndex + 1);
  }
}

/** Initialise reader — called once from app.js */
export function initReader(storyManifest) {
  manifest = storyManifest;

  els.overlay = $('#reader-overlay');
  els.body = $('#reader-body');
  els.content = $('#reader-content');
  els.title = $('#reader-title');
  els.close = $('#reader-close');
  els.prev = $('#reader-prev');
  els.next = $('#reader-next');
  els.fontUp = $('#font-increase');
  els.fontDown = $('#font-decrease');

  loadFontSize();

  els.close.addEventListener('click', closeReader);
  els.prev.addEventListener('click', () => openStory(currentIndex - 1));
  els.next.addEventListener('click', () => openStory(currentIndex + 1));

  els.fontUp.addEventListener('click', () => {
    fontSize = Math.min(FONT_MAX, +(fontSize + FONT_STEP).toFixed(1));
    applyFontSize();
    saveFontSize();
  });

  els.fontDown.addEventListener('click', () => {
    fontSize = Math.max(FONT_MIN, +(fontSize - FONT_STEP).toFixed(1));
    applyFontSize();
    saveFontSize();
  });

  // Close on backdrop click
  els.overlay.addEventListener('click', (e) => {
    if (e.target === els.overlay) closeReader();
  });
}

export { openStory };
