/**
 * Master runner — record all 3 launch videos sequentially.
 *
 * Usage:
 *   pnpm record           # record all 3 videos
 *   pnpm record:teaser    # record just the 15s teaser
 *   pnpm record:hero      # record just the 30s hero demo
 *   pnpm record:deep      # record just the 45s deep dive
 *
 * Prerequisites:
 *   1. Dev server running: pnpm dev
 *   2. Playwright + Chromium installed: npx playwright install chromium
 *   3. FFmpeg installed: brew install ffmpeg
 *
 * Output goes to ./recordings/ directory.
 */

import { execSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SCRIPTS_DIR = __dirname;
const ROOT_DIR = path.resolve(SCRIPTS_DIR, '../..');
const RECORDINGS_DIR = path.join(ROOT_DIR, 'recordings');

const VIDEOS = [
  { name: 'teaser-15s', script: 'teaser-15s.ts', description: '15s Vertical Teaser' },
  { name: 'hero-30s', script: 'hero-30s.ts', description: '30s Landscape Hero Demo' },
  { name: 'deep-dive-45s', script: 'deep-dive-45s.ts', description: '45s Landscape Deep Dive' },
];

function run() {
  // Ensure output directory exists
  if (!fs.existsSync(RECORDINGS_DIR)) {
    fs.mkdirSync(RECORDINGS_DIR, { recursive: true });
  }

  const filter = process.argv[2]; // optional: 'teaser', 'hero', 'deep'

  const toRecord = filter
    ? VIDEOS.filter((v) => v.name.includes(filter))
    : VIDEOS;

  if (toRecord.length === 0) {
    console.error(`No video matching "${filter}". Options: teaser, hero, deep`);
    process.exit(1);
  }

  console.log('');
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║     HUMANOID ATLAS — LAUNCH VIDEO SUITE     ║');
  console.log('╚══════════════════════════════════════════════╝');
  console.log('');
  console.log(`Recording ${toRecord.length} video(s):`);
  toRecord.forEach((v) => console.log(`  • ${v.description}`));
  console.log('');

  for (const video of toRecord) {
    const scriptPath = path.join(SCRIPTS_DIR, video.script);
    console.log(`━━━ ${video.description} ━━━`);

    try {
      execSync(`npx tsx "${scriptPath}"`, {
        cwd: ROOT_DIR,
        stdio: 'inherit',
        env: { ...process.env },
      });
    } catch (err) {
      console.error(`\n❌ Failed to record ${video.name}`);
      console.error(err);
      process.exit(1);
    }
  }

  console.log('');
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║             ALL RECORDINGS DONE             ║');
  console.log('╚══════════════════════════════════════════════╝');
  console.log('');
  console.log('Output files:');

  const files = fs.readdirSync(RECORDINGS_DIR).filter((f) => f.endsWith('.mp4'));
  files.forEach((f) => {
    const stat = fs.statSync(path.join(RECORDINGS_DIR, f));
    const sizeMB = (stat.size / (1024 * 1024)).toFixed(1);
    console.log(`  📹 recordings/${f} (${sizeMB} MB)`);
  });

  console.log('');
  console.log('Next steps:');
  console.log('  1. Review the MP4s in recordings/');
  console.log('  2. Upload natively to X (never post as links)');
  console.log('  3. Post teaser 3-7 days before launch');
  console.log('  4. Post hero demo on launch day');
  console.log('  5. Post deep dive as day-2 thread reply');
  console.log('');
}

run();
