/**
 * Hybrid render pipeline — Playwright captures + Remotion compositions.
 *
 * Workflow:
 *   1. Playwright captures individual scene clips from the running app
 *   2. Clips are copied to public/clips/ so Remotion can access them via staticFile()
 *   3. Remotion renders each composition to final MP4
 *
 * Usage:
 *   pnpm render                  # full pipeline (capture + render all)
 *   pnpm render:clips            # capture clips only
 *   pnpm render:video            # render Remotion compositions only (clips must exist)
 *   pnpm render:video -- Teaser  # render a single composition
 *
 * Prerequisites:
 *   - Dev server running: pnpm dev
 *   - Playwright chromium: npx playwright install chromium
 *   - FFmpeg installed
 */

import { execSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.resolve(__dirname, '../..');
const CLIPS_SRC = path.join(ROOT, 'recordings/clips');
const CLIPS_DST = path.join(ROOT, 'public/clips');
const OUTPUT_DIR = path.join(ROOT, 'recordings');

const COMPOSITIONS = ['Teaser', 'Hero', 'DeepDive'];

function exec(cmd: string, label: string) {
  console.log(`\n  → ${label}`);
  execSync(cmd, { cwd: ROOT, stdio: 'inherit' });
}

function copyClipsToPublic() {
  console.log('\n  → Copying clips to public/clips/ for Remotion...');

  if (!fs.existsSync(CLIPS_SRC)) {
    console.error(`  ❌ No clips found at ${CLIPS_SRC}. Run clip capture first.`);
    process.exit(1);
  }

  if (!fs.existsSync(CLIPS_DST)) {
    fs.mkdirSync(CLIPS_DST, { recursive: true });
  }

  const files = fs.readdirSync(CLIPS_SRC).filter((f) => f.endsWith('.webm'));
  for (const file of files) {
    fs.copyFileSync(path.join(CLIPS_SRC, file), path.join(CLIPS_DST, file));
  }
  console.log(`    Copied ${files.length} clips`);
}

function renderComposition(id: string) {
  const outPath = path.join(OUTPUT_DIR, `${id.toLowerCase()}.mp4`);
  const cmd = [
    'npx remotion render',
    'src/video/index.ts',
    id,
    `"${outPath}"`,
    '--codec h264',
    '--crf 18',
    '--pixel-format yuv420p',
    '--log warn',
  ].join(' ');

  exec(cmd, `Rendering ${id}...`);

  const stat = fs.statSync(outPath);
  const sizeMB = (stat.size / (1024 * 1024)).toFixed(1);
  console.log(`    ✓ ${outPath} (${sizeMB} MB)`);
}

function cleanupPublicClips() {
  if (fs.existsSync(CLIPS_DST)) {
    fs.rmSync(CLIPS_DST, { recursive: true, force: true });
    console.log('\n  → Cleaned up public/clips/');
  }
}

// ── Main ───────────────────────────────────────────────────────────────────

function main() {
  const mode = process.argv[2]; // 'clips', 'video', or undefined (full pipeline)
  const specificComp = process.argv[3]; // optional: 'Teaser', 'Hero', 'DeepDive'

  console.log('');
  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║   HUMANOID ATLAS — HYBRID VIDEO PIPELINE        ║');
  console.log('║   Playwright Capture + Remotion Composition      ║');
  console.log('╚══════════════════════════════════════════════════╝');

  // ── Step 1: Capture clips (unless mode is 'video') ──
  if (mode !== 'video') {
    console.log('\n━━━ STEP 1: Capturing scene clips with Playwright ━━━');
    exec('npx tsx scripts/record/capture-clips.ts', 'Running Playwright capture...');
  }

  // ── Step 2: Copy clips to public/ ──
  if (mode !== 'clips') {
    console.log('\n━━━ STEP 2: Preparing clips for Remotion ━━━');
    copyClipsToPublic();

    // ── Step 3: Render compositions ──
    console.log('\n━━━ STEP 3: Rendering Remotion compositions ━━━');

    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    const toRender = specificComp
      ? COMPOSITIONS.filter((c) => c.toLowerCase() === specificComp.toLowerCase())
      : COMPOSITIONS;

    if (toRender.length === 0) {
      console.error(`  ❌ Unknown composition: ${specificComp}`);
      console.error(`  Available: ${COMPOSITIONS.join(', ')}`);
      process.exit(1);
    }

    for (const comp of toRender) {
      renderComposition(comp);
    }

    // ── Step 4: Cleanup ──
    cleanupPublicClips();
  }

  // ── Done ──
  console.log('');
  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║                 PIPELINE COMPLETE               ║');
  console.log('╚══════════════════════════════════════════════════╝');
  console.log('');

  if (mode !== 'clips') {
    console.log('Output files:');
    const mp4s = fs.readdirSync(OUTPUT_DIR).filter((f) => f.endsWith('.mp4'));
    mp4s.forEach((f) => {
      const stat = fs.statSync(path.join(OUTPUT_DIR, f));
      const sizeMB = (stat.size / (1024 * 1024)).toFixed(1);
      console.log(`  📹 recordings/${f} (${sizeMB} MB)`);
    });
  }

  console.log('');
  console.log('Next steps:');
  console.log('  1. Preview in Remotion Studio: pnpm studio');
  console.log('  2. Review MP4s in recordings/');
  console.log('  3. Upload natively to X');
  console.log('');
}

main();
