/**
 * Video 2 — 30-second Hero Demo (Landscape 16:9)
 *
 * Purpose: Launch day hero post on X. Shows the full value prop.
 * Format:  1280x720 landscape — standard for screen recordings
 * Pacing:
 *   0–3s   Problem statement (text overlay on skeleton)
 *   3–7s   Skeleton spinning, site loads
 *   7–11s  All OEMs grid — the landscape
 *   11–16s Click into Tesla — company detail + specs
 *   16–22s Motors tab — supply chain flow with focus
 *   22–27s Geopolitics scoreboard + sanction sim
 *   27–30s CTA: humanoids.fyi
 */

import {
  launchBrowser,
  createRecordingPage,
  loadApp,
  clickTab,
  clickOemCard,
  clickBack,
  clickChainEntity,
  clickCutToggle,
  smoothScroll,
  wait,
  saveRecording,
  ensureOutputDir,
  encodeForX,
  VIEWPORTS,
  OUTPUT_DIR,
  type TextOverlay,
} from './utils';
import * as path from 'path';

async function recordHero() {
  console.log('\n🎬 Recording Video 2: 30s Hero Demo (Landscape)\n');
  ensureOutputDir();

  const browser = await launchBrowser();

  const rawPath = path.join(OUTPUT_DIR, 'raw-hero.webm');
  const page = await createRecordingPage(browser, {
    viewport: VIEWPORTS.landscape,
    outputPath: rawPath,
  });

  // ── Scene 1: Skeleton hero (0s–7s) ──
  // Problem statement overlay is added in post
  console.log('  Scene 1: Skeleton hero + problem statement...');
  await loadApp(page);
  await wait(4500);

  // ── Scene 2: All OEMs grid (7s–11s) ──
  console.log('  Scene 2: All OEMs grid...');
  await clickTab(page, 'All OEMs');
  await wait(3500);

  // ── Scene 3: Tesla company detail (11s–16s) ──
  console.log('  Scene 3: Tesla company detail...');
  await clickOemCard(page, 'Tesla');
  await wait(1500);

  // Scroll down to show specs
  await smoothScroll(page, '.company-view', 400, 1500);
  await wait(1500);

  // Back out
  await clickBack(page);
  await wait(500);

  // ── Scene 4: Motors supply chain (16s–22s) ──
  console.log('  Scene 4: Motors supply chain...');
  await clickTab(page, 'Motors');
  await wait(1500);

  // Scroll to supply chain section
  await smoothScroll(page, '.component-view', 500, 800);
  await wait(1000);

  // Focus on Maxon to show connections
  await clickChainEntity(page, 'Maxon');
  await wait(2000);

  // Clear focus
  await page.click('.chain-clear');
  await wait(500);

  // ── Scene 5: Geopolitics (22s–27s) ──
  console.log('  Scene 5: Geopolitics scoreboard + sanctions...');
  await clickTab(page, 'Geopolitics');
  await wait(1500);

  // Scroll to Cut the Wire
  await smoothScroll(page, '.geo-view', 800, 800);
  await wait(500);

  // Toggle China sanctions
  await clickCutToggle(page, 'China');
  await wait(2500);

  // ── Scene 6: CTA hold (27s–30s) ──
  console.log('  Scene 6: CTA hold...');
  // Reset and scroll to top for clean end frame
  await page.click('.cut-reset');
  await wait(500);
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
      text: '13 HUMANOID ROBOTS. 40+ SUPPLIERS. 1 ATLAS.',
      startTime: 0,
      endTime: 3,
      fontSize: 32,
      position: 'center',
      bgOpacity: 0.8,
    },
    {
      text: 'EVERY OEM. EVERY COMPONENT.',
      startTime: 7,
      endTime: 10,
      fontSize: 28,
      position: 'top',
      bgOpacity: 0.6,
    },
    {
      text: 'DRILL INTO ANY COMPANY',
      startTime: 11,
      endTime: 15,
      fontSize: 28,
      position: 'top',
      bgOpacity: 0.6,
    },
    {
      text: 'TRACE THE FULL SUPPLY CHAIN',
      startTime: 16,
      endTime: 21,
      fontSize: 28,
      position: 'top',
      bgOpacity: 0.6,
    },
    {
      text: 'SIMULATE SANCTIONS. SEE WHO BREAKS.',
      startTime: 22,
      endTime: 27,
      fontSize: 28,
      position: 'top',
      bgOpacity: 0.6,
    },
    {
      text: 'HUMANOID ATLAS',
      startTime: 27.5,
      endTime: 30,
      fontSize: 44,
      position: 'center',
      bgOpacity: 0.8,
    },
    {
      text: 'humanoids.fyi',
      startTime: 27.5,
      endTime: 30,
      fontSize: 24,
      position: 'bottom',
      bgOpacity: 0.5,
    },
  ];

  const finalPath = path.join(OUTPUT_DIR, 'hero-30s.mp4');

  encodeForX({
    inputPath: savedPath,
    outputPath: finalPath,
    overlays,
    width: VIEWPORTS.landscape.width,
    height: VIEWPORTS.landscape.height,
  });

  console.log(`\n✅ Hero demo complete: ${finalPath}\n`);
}

recordHero().catch((err) => {
  console.error('❌ Hero recording failed:', err);
  process.exit(1);
});
