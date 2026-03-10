/*
Project: Eclipse
Owned by Zorvia
All credits to the Zorvia Community
Licensed under ZPL v2.0
See LICENSE.md for details
*/

/** app.js — Main entry point for Eclipse library. */
import { initReader, openStory } from './reader.js';

const THEME_KEY = 'eclipse-theme';
const MANIFEST_PATH = 'stories/manifest.json';

/** Apply saved theme or respect system preference */
function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === 'dark' || (!saved && matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  document.getElementById('theme-toggle').addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem(THEME_KEY, 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem(THEME_KEY, 'dark');
    }
  });
}

/** Create a card element for a story */
function createCard(story, index) {
  const li = document.createElement('li');

  const card = document.createElement('article');
  card.className = 'card';
  card.setAttribute('role', 'button');
  card.setAttribute('tabindex', '0');
  card.setAttribute('aria-label', `Read "${story.title}" by ${story.author}`);

  const img = document.createElement('img');
  img.className = 'card__cover';
  img.src = story.cover;
  img.alt = `Cover art for "${story.title}"`;
  img.loading = 'lazy';
  img.width = 300;
  img.height = 400;
  card.appendChild(img);

  const info = document.createElement('div');
  info.className = 'card__info';

  const title = document.createElement('h2');
  title.className = 'card__title';
  title.textContent = story.title;
  info.appendChild(title);

  const author = document.createElement('p');
  author.className = 'card__author';
  author.textContent = story.author;
  info.appendChild(author);

  if (story.tags && story.tags.length) {
    const tags = document.createElement('div');
    tags.className = 'card__tags';
    tags.setAttribute('aria-label', 'Tags');
    for (const tag of story.tags) {
      const span = document.createElement('span');
      span.className = 'card__tag';
      span.textContent = tag;
      tags.appendChild(span);
    }
    info.appendChild(tags);
  }

  card.appendChild(info);

  // Interaction handlers
  const activate = () => openStory(index, card);
  card.addEventListener('click', activate);
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      activate();
    }
  });

  li.appendChild(card);
  return li;
}

/** Load manifest and render the grid */
async function loadLibrary() {
  const grid = document.getElementById('library-grid');
  const emptyMsg = document.getElementById('library-empty');

  try {
    const resp = await fetch(MANIFEST_PATH);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const stories = await resp.json();

    if (!Array.isArray(stories) || stories.length === 0) {
      emptyMsg.hidden = false;
      return;
    }

    initReader(stories);

    const fragment = document.createDocumentFragment();
    stories.forEach((story, i) => fragment.appendChild(createCard(story, i)));
    grid.appendChild(fragment);
  } catch {
    emptyMsg.hidden = false;
  }
}

/** Boot */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  loadLibrary();
});
