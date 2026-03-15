/**
 * Shared utilities for Humanoid Atlas launch video recording.
 *
 * Usage: these helpers are imported by each video script (teaser, hero, deep-dive).
 * They handle browser setup, viewport config, interaction helpers, and FFmpeg encoding.
 */

import { chromium, type Browser, type Page } from 'playwright';
import { execSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Constants ──────────────────────────────────────────────────────────────

export const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
export const OUTPUT_DIR = path.resolve(__dirname, '../../recordings');

export const VIEWPORTS = {
  /** 9:16 vertical — fills mobile X feed */
  vertical: { width: 1080, height: 1920 },
  /** 16:9 landscape — standard screen recording */
  landscape: { width: 1280, height: 720 },
} as const;

// ── Browser helpers ────────────────────────────────────────────────────────

export async function launchBrowser(): Promise<Browser> {
  return chromium.launch({
    headless: true,
    args: [
      '--disable-gpu-sandbox',
      '--use-gl=angle',
      '--use-angle=swiftshader',
      '--enable-webgl',
    ],
  });
}

interface RecordingPageOptions {
  viewport: { width: number; height: number };
  /** Output path for the raw webm recording */
  outputPath: string;
}

export async function createRecordingPage(
  browser: Browser,
  opts: RecordingPageOptions,
): Promise<Page> {
  const context = await browser.newContext({
    viewport: opts.viewport,
    screen: opts.viewport,
    recordVideo: {
      dir: path.dirname(opts.outputPath),
      size: opts.viewport,
    },
    // Reduce motion so transitions are snappy on camera
    reducedMotion: 'no-preference',
    deviceScaleFactor: 2,
  });

  const page = await context.newPage();
  return page;
}

// ── Interaction helpers ────────────────────────────────────────────────────

/** Navigate to the app and wait for initial render + 3D model to load */
export async function loadApp(page: Page): Promise<void> {
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  // Wait for the PLY viewer canvas to appear (Three.js rendered)
  await page.waitForSelector('canvas', { timeout: 15000 });
  // Extra time for point cloud to finish loading and start spinning
  await wait(2000);
}

/** Click a tab in the component nav by its label text */
export async function clickTab(page: Page, label: string): Promise<void> {
  await page.click(`.component-btn:has-text("${label}")`);
  await wait(800);
}

/** Click a country filter pill */
export async function clickCountryFilter(page: Page, label: string): Promise<void> {
  await page.click(`.country-pill:has-text("${label}")`);
  await wait(600);
}

/** Click an OEM card in the All OEMs grid by company name */
export async function clickOemCard(page: Page, name: string): Promise<void> {
  await page.click(`.oem-image-card:has-text("${name}")`);
  await wait(1000);
}

/** Click the back button to return from company detail */
export async function clickBack(page: Page): Promise<void> {
  await page.click('.back-btn');
  await wait(800);
}

/** Click a chain entity (supplier/OEM in supply chain flow) */
export async function clickChainEntity(page: Page, name: string): Promise<void> {
  await page.click(`.chain-entity:has-text("${name}")`);
  await wait(600);
}

/** Click a "Cut the Wire" toggle button */
export async function clickCutToggle(page: Page, label: string): Promise<void> {
  await page.click(`.cut-toggle:has-text("${label}")`);
  await wait(800);
}

/** Click the actuator type toggle (Linear/Rotary) */
export async function clickActuatorToggle(page: Page, type: 'Linear' | 'Rotary'): Promise<void> {
  await page.click(`.model-toggle__btn:has-text("${type}")`);
  await wait(800);
}

/** Scroll a scrollable view smoothly */
export async function smoothScroll(page: Page, selector: string, distance: number, duration = 1000): Promise<void> {
  await page.evaluate(
    `(function() {
      var el = document.querySelector("${selector}");
      if (!el) return;
      var start = el.scrollTop;
      var t0 = performance.now();
      var step = function(now) {
        var elapsed = now - t0;
        var progress = Math.min(elapsed / ${duration}, 1);
        var ease = progress < 0.5
          ? 2 * progress * progress
          : -1 + (4 - 2 * progress) * progress;
        el.scrollTop = start + ${distance} * ease;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    })()`
  );
  await wait(duration + 200);
}

/** Simple wait */
export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ── Output helpers ─────────────────────────────────────────────────────────

export function ensureOutputDir(): void {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
}

/** Save page recording and return the path to the raw webm file */
export async function saveRecording(page: Page): Promise<string> {
  const video = page.video();
  if (!video) throw new Error('No video recording found on page');
  const rawPath = await video.path();
  await page.context().close(); // finalize the recording
  return rawPath;
}

// ── FFmpeg encoding ────────────────────────────────────────────────────────

export interface TextOverlay {
  text: string;
  /** Start time in seconds */
  startTime: number;
  /** End time in seconds */
  endTime: number;
  /** Font size (default 48) */
  fontSize?: number;
  /** Position: 'center', 'top', 'bottom' */
  position?: 'center' | 'top' | 'bottom';
  /** Text color (default white) */
  color?: string;
  /** Background box opacity 0-1 (default 0.6) */
  bgOpacity?: number;
}

function buildDrawtextFilter(overlays: TextOverlay[], width: number): string {
  if (overlays.length === 0) return '';

  const filters = overlays.map((o) => {
    const fontSize = o.fontSize || 48;
    const color = o.color || 'white';
    const bgOpacity = o.bgOpacity ?? 0.6;
    const bgColor = `black@${bgOpacity}`;

    // Position calculation
    let y: string;
    switch (o.position || 'center') {
      case 'top':
        y = `${Math.round(width * 0.08)}`;
        break;
      case 'bottom':
        y = `h-th-${Math.round(width * 0.08)}`;
        break;
      default:
        y = '(h-th)/2';
    }

    // Escape special chars for FFmpeg
    const escapedText = o.text
      .replace(/'/g, "'\\''")
      .replace(/:/g, '\\:')
      .replace(/\\/g, '\\\\');

    return `drawtext=text='${escapedText}':fontsize=${fontSize}:fontcolor=${color}:x=(w-tw)/2:y=${y}:box=1:boxcolor=${bgColor}:boxborderw=16:enable='between(t,${o.startTime},${o.endTime})'`;
  });

  return filters.join(',');
}

export interface EncodeOptions {
  inputPath: string;
  outputPath: string;
  /** Target duration in seconds — will trim/speed-adjust if needed */
  targetDuration?: number;
  /** Text overlays to burn in */
  overlays?: TextOverlay[];
  /** Output dimensions */
  width: number;
  height: number;
}

export function encodeForX(opts: EncodeOptions): void {
  ensureOutputDir();

  const { inputPath, outputPath, overlays = [], width, height } = opts;

  // Build filter chain
  const filters: string[] = [];

  // Scale to target resolution
  filters.push(`scale=${width}:${height}:flags=lanczos`);

  // Add text overlays
  const textFilter = buildDrawtextFilter(overlays, width);
  if (textFilter) filters.push(textFilter);

  const filterChain = filters.join(',');

  // Probe input duration
  const probeCmd = `ffmpeg -i "${inputPath}" 2>&1 | grep "Duration" | head -1`;
  const probeResult = execSync(probeCmd, { encoding: 'utf-8' });
  console.log(`  Input info: ${probeResult.trim()}`);

  const cmd = [
    'ffmpeg -y',
    `-i "${inputPath}"`,
    `-vf "${filterChain}"`,
    '-c:v libx264',
    '-preset slow',
    '-crf 18',
    '-pix_fmt yuv420p',
    '-r 30',
    '-movflags +faststart',
    // No audio for these demos
    '-an',
    `"${outputPath}"`,
  ].join(' ');

  console.log(`  Encoding: ${path.basename(outputPath)}`);
  execSync(cmd, { stdio: 'inherit' });
  console.log(`  Done: ${outputPath}`);
}
