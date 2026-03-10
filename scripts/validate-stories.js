#!/usr/bin/env node

/*
Project: Eclipse
Owned by Zorvia
All credits to the Zorvia Community
Licensed under ZPL v2.0
See LICENSE.md for details
*/

/**
 * validate-stories.js — Validates that all stories/*.md files
 * have the required frontmatter keys.
 *
 * Usage: node scripts/validate-stories.js
 * Exits with code 1 if any file is missing required keys.
 */

import { readdir, readFile } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = join(__filename, '..', '..');
const STORIES_DIR = join(ROOT, 'stories');
const REQUIRED_KEYS = ['title', 'author', 'date', 'cover', 'id'];

function parseFrontmatter(raw) {
  const match = raw.match(/^\s*(?:<!--[\s\S]*?-->\s*)?---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;

  const meta = {};
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    meta[key] = line.slice(idx + 1).trim();
  }
  return meta;
}

async function validate() {
  const files = (await readdir(STORIES_DIR)).filter(f => extname(f) === '.md');

  if (files.length === 0) {
    console.error('❌ No .md files found in stories/');
    process.exit(1);
  }

  let hasErrors = false;

  for (const file of files) {
    const raw = await readFile(join(STORIES_DIR, file), 'utf-8');
    const meta = parseFrontmatter(raw);

    if (!meta) {
      console.error(`❌ ${file}: Missing frontmatter block (--- delimiters)`);
      hasErrors = true;
      continue;
    }

    const missing = REQUIRED_KEYS.filter(k => !meta[k]);
    if (missing.length > 0) {
      console.error(`❌ ${file}: Missing keys: ${missing.join(', ')}`);
      hasErrors = true;
    } else {
      console.log(`✓ ${file}: OK`);
    }
  }

  if (hasErrors) {
    console.error('\nValidation failed.');
    process.exit(1);
  }

  console.log(`\n✓ All ${files.length} stories are valid.`);
}

validate().catch((err) => {
  console.error('Validation error:', err);
  process.exit(1);
});
