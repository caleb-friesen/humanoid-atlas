/**
 * Video 1 — 15-second Teaser (Vertical 9:16)
 *
 * Purpose: Pre-launch buzz on X. Fast, visual, intriguing.
 * Format:  1080x1920 vertical — fills mobile feed
 * Pacing:  Skeleton spin (5s) → Geopolitics cut-the-wire (6s) → Title card (4s)
 *
 * Text overlays are burned in during FFmpeg post-processing.
 */

import {
  launchBrowser,
  createRecordingPage,
  loadApp,
  clickTab,
  clickCutToggle,
  wait,
  saveRecording,
  ensureOutputDir,
  encodeForX,
  VIEWPORTS,
  OUTPUT_DIR,
  type TextOverlay,
} from './utils';
import * as path from 'path';

async function recordTeaser() {
  console.log('\n🎬 Recording Video 1: 15s Teaser (Vertical)\n');
  ensureOutputDir();

  const browser = await launchBrowser();

  const rawPath = path.join(OUTPUT_DIR, 'raw-teaser.webm');
  const page = await createRecordingPage(browser, {
    viewport: VIEWPORTS.vertical,
    outputPath: rawPath,
  });

  // ── Scene 1: Skeleton spinning (0s–5s) ──
  console.log('  Scene 1: Skeleton hero shot...');
  await loadApp(page);
  // Let the skeleton spin for dramatic effect
  await wait(4000);

  // ── Scene 2: Geopolitics — Cut the Wire (5s–11s) ──
  console.log('  Scene 2: Geopolitics sanction simulator...');
  await clickTab(page, 'Geopolitics');
  await wait(500);

  // Scroll to "Cut the Wire" section
  await page.evaluate(`(function() {
    var el = document.querySelector('.geo-view');
    if (el) el.scrollTop = el.scrollHeight;
  }())`);
  await wait(800);

  // Toggle China off — show the supply chain impact
  await clickCutToggle(page, 'China');
  await wait(2000);

  // Toggle US off too — show cascading effect
  await clickCutToggle(page, 'US');
  await wait(2000);

  // ── Scene 3: Hold for title card overlay (11s–15s) ──
  console.log('  Scene 3: Title card hold...');
  // Reset cuts for clean ending frame
  await page.click('.cut-reset');
  await wait(1000);

  // Scroll back to scoreboard for a clean final frame
  await page.evaluate(`(function() {
    var el = document.querySelector('.geo-view');
    if (el) el.scrollTop = 0;
  }())`);
  await wait(2500);

  // ── Finalize ──
  console.log('  Saving raw recording...');
  const savedPath = await saveRecording(page);
  await browser.close();

  // ── Post-process with FFmpeg ──
  const overlays: TextOverlay[] = [
    {
      text: 'WHO BUILDS THE ROBOTS?',
      startTime: 0,
      endTime: 4.5,
      fontSize: 72,
      position: 'top',
      bgOpacity: 0.7,
    },
    {
      text: 'WHAT HAPPENS WHEN YOU CUT THE SUPPLY CHAIN?',
      startTime: 5.5,
      endTime: 10.5,
      fontSize: 52,
      position: 'top',
      bgOpacity: 0.7,
    },
    {
      text: 'HUMANOID ATLAS',
      startTime: 11,
      endTime: 15,
      fontSize: 80,
      position: 'center',
      bgOpacity: 0.8,
    },
    {
      text: 'humanoids.fyi',
      startTime: 11,
      endTime: 15,
      fontSize: 40,
      position: 'bottom',
      bgOpacity: 0.5,
    },
  ];

  const finalPath = path.join(OUTPUT_DIR, 'teaser-15s.mp4');

  encodeForX({
    inputPath: savedPath,
    outputPath: finalPath,
    overlays,
    width: VIEWPORTS.vertical.width,
    height: VIEWPORTS.vertical.height,
  });

  console.log(`\n✅ Teaser complete: ${finalPath}\n`);
}

recordTeaser().catch((err) => {
  console.error('❌ Teaser recording failed:', err);
  process.exit(1);
});
