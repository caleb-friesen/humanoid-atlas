/**
 * Playwright clip capture — records individual scene clips for Remotion compositions.
 *
 * Each clip is a short, focused recording of one app interaction.
 * Remotion then composes these clips with animated text, transitions, and branding.
 *
 * Usage:
 *   npx tsx scripts/record/capture-clips.ts          # capture all clips
 *   npx tsx scripts/record/capture-clips.ts skeleton  # capture one clip by name
 *
 * Prerequisites: dev server running (pnpm dev)
 */

import { chromium, type Browser, type Page, type BrowserContext } from 'playwright';
import * as path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
const CLIPS_DIR = path.resolve(__dirname, '../../recordings/clips');

// ── Helpers ────────────────────────────────────────────────────────────────

function wait(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

async function ensureClipsDir() {
  if (!fs.existsSync(CLIPS_DIR)) fs.mkdirSync(CLIPS_DIR, { recursive: true });
}

interface ClipOptions {
  name: string;
  viewport: { width: number; height: number };
}

async function startClip(
  browser: Browser,
  opts: ClipOptions,
): Promise<{ page: Page; context: BrowserContext }> {
  const context = await browser.newContext({
    viewport: opts.viewport,
    screen: opts.viewport,
    recordVideo: {
      dir: CLIPS_DIR,
      size: opts.viewport,
    },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();
  return { page, context };
}

async function finishClip(
  page: Page,
  context: BrowserContext,
  name: string,
): Promise<string> {
  const video = page.video();
  if (!video) throw new Error(`No video for clip: ${name}`);
  await context.close(); // finalize recording
  const rawPath = await video.path();

  // Rename to a descriptive name
  const finalPath = path.join(CLIPS_DIR, `${name}.webm`);
  fs.renameSync(rawPath, finalPath);
  console.log(`    ✓ ${name}.webm`);
  return finalPath;
}

async function loadApp(page: Page) {
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.waitForSelector('canvas', { timeout: 15000 });
  await wait(2000);
}

async function smoothScroll(page: Page, selector: string, distance: number, duration = 1000) {
  await page.evaluate(
    `(function() {
      var el = document.querySelector("${selector}");
      if (!el) return;
      var start = el.scrollTop;
      var t0 = performance.now();
      var step = function(now) {
        var p = Math.min((now - t0) / ${duration}, 1);
        var ease = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p;
        el.scrollTop = start + ${distance} * ease;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    })()`
  );
  await wait(duration + 200);
}

// ── Viewport presets ───────────────────────────────────────────────────────

const VP_LANDSCAPE = { width: 1280, height: 720 };
const VP_VERTICAL = { width: 1080, height: 1920 };

// ── Clip definitions ───────────────────────────────────────────────────────

type ClipRecorder = (browser: Browser) => Promise<void>;

const CLIPS: Record<string, ClipRecorder> = {
  // ── Skeleton (used in all 3 videos) ──
  'skeleton-landscape': async (browser) => {
    const { page, context } = await startClip(browser, { name: 'skeleton-landscape', viewport: VP_LANDSCAPE });
    await loadApp(page);
    await wait(5000); // Let it spin
    await finishClip(page, context, 'skeleton-landscape');
  },

  'skeleton-vertical': async (browser) => {
    const { page, context } = await startClip(browser, { name: 'skeleton-vertical', viewport: VP_VERTICAL });
    await loadApp(page);
    await wait(5000);
    await finishClip(page, context, 'skeleton-vertical');
  },

  // ── All OEMs grid ──
  'oems-grid': async (browser) => {
    const { page, context } = await startClip(browser, { name: 'oems-grid', viewport: VP_LANDSCAPE });
    await loadApp(page);
    await page.click('.component-btn:has-text("All OEMs")');
    await wait(4000);
    await finishClip(page, context, 'oems-grid');
  },

  // ── OEMs with country filter cycling ──
  'oems-filters': async (browser) => {
    const { page, context } = await startClip(browser, { name: 'oems-filters', viewport: VP_LANDSCAPE });
    await loadApp(page);
    await page.click('.component-btn:has-text("All OEMs")');
    await wait(1000);
    await page.click('.country-pill:has-text("US")');
    await wait(1200);
    await page.click('.country-pill:has-text("China")');
    await wait(1200);
    await page.click('.country-pill:has-text("Other")');
    await wait(1200);
    await page.click('.country-pill:has-text("All")');
    await wait(1000);
    await finishClip(page, context, 'oems-filters');
  },

  // ── Tesla company detail ──
  'tesla-detail': async (browser) => {
    const { page, context } = await startClip(browser, { name: 'tesla-detail', viewport: VP_LANDSCAPE });
    await loadApp(page);
    await page.click('.component-btn:has-text("All OEMs")');
    await wait(800);
    await page.click('.oem-image-card:has-text("Tesla")');
    await wait(1500);
    await smoothScroll(page, '.company-view', 400, 1500);
    await wait(2000);
    await finishClip(page, context, 'tesla-detail');
  },

  // ── Motors supply chain ──
  'motors-chain': async (browser) => {
    const { page, context } = await startClip(browser, { name: 'motors-chain', viewport: VP_LANDSCAPE });
    await loadApp(page);
    await page.click('.component-btn:has-text("Motors")');
    await wait(1500);
    await smoothScroll(page, '.component-view', 500, 800);
    await wait(1000);
    // Focus on Maxon
    await page.click('.chain-entity:has-text("Maxon")');
    await wait(2000);
    await page.click('.chain-clear');
    await wait(1000);
    await finishClip(page, context, 'motors-chain');
  },

  // ── Reducers (bottleneck) ──
  'reducers-bottleneck': async (browser) => {
    const { page, context } = await startClip(browser, { name: 'reducers-bottleneck', viewport: VP_LANDSCAPE });
    await loadApp(page);
    await page.click('.component-btn:has-text("Reducers")');
    await wait(1500);
    await smoothScroll(page, '.component-view', 350, 800);
    await wait(3000);
    await finishClip(page, context, 'reducers-bottleneck');
  },

  // ── Actuators — Linear/Rotary toggle ──
  'actuators-toggle': async (browser) => {
    const { page, context } = await startClip(browser, { name: 'actuators-toggle', viewport: VP_LANDSCAPE });
    await loadApp(page);
    await page.click('.component-btn:has-text("Actuators")');
    await wait(1500);
    await page.click('.model-toggle__btn:has-text("Rotary")');
    await wait(2000);
    await page.click('.model-toggle__btn:has-text("Linear")');
    await wait(2000);
    await finishClip(page, context, 'actuators-toggle');
  },

  // ── Battery supply chain with CATL focus ──
  'battery-chain': async (browser) => {
    const { page, context } = await startClip(browser, { name: 'battery-chain', viewport: VP_LANDSCAPE });
    await loadApp(page);
    await page.click('.component-btn:has-text("Battery")');
    await wait(1200);
    await smoothScroll(page, '.component-view', 450, 600);
    await wait(800);
    await page.click('.chain-entity:has-text("CATL")');
    await wait(2500);
    await page.click('.chain-clear');
    await wait(800);
    await finishClip(page, context, 'battery-chain');
  },

  // ── Geopolitics scoreboard ──
  'geo-scoreboard': async (browser) => {
    const { page, context } = await startClip(browser, { name: 'geo-scoreboard', viewport: VP_LANDSCAPE });
    await loadApp(page);
    await page.click('.component-btn:has-text("Geopolitics")');
    await wait(2000);
    await smoothScroll(page, '.geo-view', 500, 1200);
    await wait(2000);
    await finishClip(page, context, 'geo-scoreboard');
  },

  // ── Geopolitics scoreboard (vertical for teaser) ──
  'geo-scoreboard-vertical': async (browser) => {
    const { page, context } = await startClip(browser, { name: 'geo-scoreboard-vertical', viewport: VP_VERTICAL });
    await loadApp(page);
    await page.click('.component-btn:has-text("Geopolitics")');
    await wait(2000);
    await finishClip(page, context, 'geo-scoreboard-vertical');
  },

  // ── Cut the Wire — sanction simulation ──
  'cut-the-wire': async (browser) => {
    const { page, context } = await startClip(browser, { name: 'cut-the-wire', viewport: VP_LANDSCAPE });
    await loadApp(page);
    await page.click('.component-btn:has-text("Geopolitics")');
    await wait(1000);
    // Scroll to Cut the Wire
    await page.evaluate(`(function() {
      var el = document.querySelector('.geo-view');
      if (el) el.scrollTop = el.scrollHeight;
    }())`);
    await wait(800);
    await page.click('.cut-toggle:has-text("China")');
    await wait(2500);
    await page.click('.cut-toggle:has-text("US")');
    await wait(2500);
    await page.click('.cut-reset');
    await wait(1500);
    await finishClip(page, context, 'cut-the-wire');
  },

  // ── Cut the Wire (vertical for teaser) ──
  'cut-the-wire-vertical': async (browser) => {
    const { page, context } = await startClip(browser, { name: 'cut-the-wire-vertical', viewport: VP_VERTICAL });
    await loadApp(page);
    await page.click('.component-btn:has-text("Geopolitics")');
    await wait(800);
    await page.evaluate(`(function() {
      var el = document.querySelector('.geo-view');
      if (el) el.scrollTop = el.scrollHeight;
    }())`);
    await wait(800);
    await page.click('.cut-toggle:has-text("China")');
    await wait(2500);
    await page.click('.cut-toggle:has-text("US")');
    await wait(2500);
    await page.click('.cut-reset');
    await wait(1500);
    await finishClip(page, context, 'cut-the-wire-vertical');
  },

  // ── Geopolitics sovereignty + OEM dependency ──
  'geo-sovereignty': async (browser) => {
    const { page, context } = await startClip(browser, { name: 'geo-sovereignty', viewport: VP_LANDSCAPE });
    await loadApp(page);
    await page.click('.component-btn:has-text("Geopolitics")');
    await wait(1500);
    await smoothScroll(page, '.geo-view', 500, 1200);
    await wait(1000);
    await smoothScroll(page, '.geo-view', 400, 800);
    await wait(2000);
    await finishClip(page, context, 'geo-sovereignty');
  },

  // ── AGIBot company drilldown ──
  'agibot-detail': async (browser) => {
    const { page, context } = await startClip(browser, { name: 'agibot-detail', viewport: VP_LANDSCAPE });
    await loadApp(page);
    await page.click('.component-btn:has-text("All OEMs")');
    await wait(800);
    await page.click('.oem-image-card:has-text("AGIBot")');
    await wait(1500);
    await smoothScroll(page, '.company-view', 300, 800);
    await wait(2500);
    await finishClip(page, context, 'agibot-detail');
  },
};

// ── Main ───────────────────────────────────────────────────────────────────

async function main() {
  await ensureClipsDir();

  const filter = process.argv[2];
  const clipNames = filter
    ? Object.keys(CLIPS).filter((n) => n.includes(filter))
    : Object.keys(CLIPS);

  if (clipNames.length === 0) {
    console.error(`No clips matching "${filter}". Available: ${Object.keys(CLIPS).join(', ')}`);
    process.exit(1);
  }

  console.log(`\n🎬 Capturing ${clipNames.length} scene clips\n`);

  const browser = await chromium.launch({
    headless: true,
    args: ['--disable-gpu-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-webgl'],
  });

  for (const name of clipNames) {
    console.log(`  📹 ${name}...`);
    try {
      await CLIPS[name](browser);
    } catch (err) {
      console.error(`  ❌ Failed: ${name}`, err);
    }
  }

  await browser.close();

  console.log(`\n✅ All clips saved to recordings/clips/\n`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
