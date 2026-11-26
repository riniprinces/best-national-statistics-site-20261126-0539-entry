// Aldermere in Numbers — hand-in program for the make.fun national
// statistics site bounty. Node 22, standard library only.
//
// The entry is a static site: app/ holds index.html, one stylesheet, and ES
// modules that draw canvas charts from a data file. There is no build step
// and the site fetches nothing from the network, so any static server can
// host it with app/ at its root and it works on a desktop and on a phone.
//
// This program is the hand-in. It copies the site (app/) and the maker's own
// screenshots (screenshots/) from beside this file into the output directory,
// then writes dossier.json there with the vendored make.fun library — the
// summary the judge reads, with the screenshots, the first load's files and
// bytes, and the site's source. vendor/makefun-frontend.ts must stay exactly
// as the kit shipped it: the scorer rebuilds the dossier with its own copy
// and compares the two byte for byte.
//
// Determinism: run the program twice and both outputs are byte-identical.
// The copy is a plain recursive copy in a fixed order, the dossier is a pure
// function of the files it reads, and nothing here stamps a time, a random
// value, or a host-dependent path into the output.
//
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
//
// Outside the grader's container MAKEFUN_OUTPUT_DIR stands in for /output;
// inside it, the grader's /output is used when the variable is unset.

import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// --- Step 1: the site itself. Every file under app/ is served, so copy it whole.
function copySite() {
  const appDir = join(here, 'app');
  const index = join(appDir, 'index.html');
  if (!existsSync(index) || !statSync(index).isFile()) {
    throw new Error('app/index.html is missing — nothing to hand in');
  }
  cpSync(appDir, join(out, 'app'), { recursive: true });
}

// --- Step 2: the screenshots. Real renders of the running site, taken by
// its maker; the first by name is the cover. At most four, each at most
// 256 KiB — the dossier builder refuses anything past those caps.
function copyScreenshots() {
  const shotsDir = join(here, 'screenshots');
  const dest = join(out, 'screenshots');
  mkdirSync(dest, { recursive: true });
  if (!existsSync(shotsDir)) return;
  cpSync(shotsDir, dest, { recursive: true });
  const shots = readdirSync(dest).filter((f) => !f.startsWith('.'));
  if (shots.length < 3 || shots.length > 4) {
    throw new Error(`expected 3 or 4 screenshots, found ${shots.length}`);
  }
  for (const shot of shots) {
    const size = statSync(join(dest, shot)).size;
    if (size > 262144) throw new Error(`screenshot ${shot} is ${size} bytes, over the 256 KiB cap`);
  }
}

// --- Step 3: the dossier the judge reads. Its caps mirror the scorer's own
// (reference/gate.json): the text is capped at 160 KiB, app/ at 993 files
// and 16 MiB, screenshots at 4 files of 256 KiB each.
function writeDossier() {
  const dossier = buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  });
  writeFileSync(join(out, 'dossier.json'), dossier);
}

mkdirSync(out, { recursive: true });
copySite();
copyScreenshots();
writeDossier();
