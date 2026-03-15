/**
 * Video 3 — 45-second Deep Dive (Landscape 16:9)
 *
 * Purpose: Day 2+ thread reply. Full walkthrough for engaged audience.
 * Format:  1280x720 landscape
 * Pacing:
 *   0–3s   Skeleton spin + title
 *   3–7s   All OEMs with country filter cycling
 *   7–12s  Motors tab — 3D model + metrics + supply chain
 *   12–17s Reducers tab — bottleneck alert + chain
 *   17–22s Actuators tab — Linear/Rotary toggle
 *   22–27s Battery tab — supply chain with focus on CATL
 *   27–33s Geopolitics — sovereignty bars + OEM dependency
 *   33–40s Cut the Wire — toggle US, CN, see cascading impact
 *   40–45s Company drilldown (AGIBot) + CTA
 */

import {
  launchBrowser,
  createRecordingPage,
  loadApp,
  clickTab,
  clickCountryFilter,
  clickOemCard,
  clickBack,
  clickChainEntity,
  clickActuatorToggle,
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

async function recordDeepDive() {
  console.log('\n🎬 Recording Video 3: 45s Deep Dive (Landscape)\n');
  ensureOutputDir();

  const browser = await launchBrowser();

  const rawPath = path.join(OUTPUT_DIR, 'raw-deep-dive.webm');
  const page = await createRecordingPage(browser, {
    viewport: VIEWPORTS.landscape,
    outputPath: rawPath,
  });

  // ── Scene 1: Skeleton intro (0s–3s) ──
  console.log('  Scene 1: Skeleton intro...');
  await loadApp(page);
  await wait(2000);

  // ── Scene 2: All OEMs + country filters (3s–7s) ──
  console.log('  Scene 2: All OEMs with filters...');
  await clickTab(page, 'All OEMs');
  await wait(1000);

  // Cycle through country filters
  await clickCountryFilter(page, 'US');
  await wait(800);
  await clickCountryFilter(page, 'China');
  await wait(800);
  await clickCountryFilter(page, 'All');
  await wait(600);

  // ── Scene 3: Motors tab (7s–12s) ──
  console.log('  Scene 3: Motors — 3D model + supply chain...');
  await clickTab(page, 'Motors');
  await wait(1500);

  // Scroll to supply chain
  await smoothScroll(page, '.component-view', 450, 800);
  await wait(1000);

  // Focus on a supplier
  await clickChainEntity(page, 'Kollmorgen');
  await wait(1200);
  await page.click('.chain-clear');
  await wait(300);

  // ── Scene 4: Reducers tab — bottleneck (12s–17s) ──
  console.log('  Scene 4: Reducers — bottleneck alert...');
  await clickTab(page, 'Reducers');
  await wait(1500);

  // Scroll to see bottleneck alert + supply chain
  await smoothScroll(page, '.component-view', 350, 800);
  await wait(2200);

  // ── Scene 5: Actuators — Linear/Rotary toggle (17s–22s) ──
  console.log('  Scene 5: Actuators — toggle linear/rotary...');
  await clickTab(page, 'Actuators');
  await wait(1500);

  // Toggle to Rotary
  await clickActuatorToggle(page, 'Rotary');
  await wait(1500);

  // Toggle back to Linear
  await clickActuatorToggle(page, 'Linear');
  await wait(1000);

  // ── Scene 6: Battery — supply chain focus (22s–27s) ──
  console.log('  Scene 6: Battery — CATL supply chain focus...');
  await clickTab(page, 'Battery');
  await wait(1200);

  // Scroll to supply chain
  await smoothScroll(page, '.component-view', 450, 600);
  await wait(800);

  // Focus on CATL
  await clickChainEntity(page, 'CATL');
  await wait(1800);
  await page.click('.chain-clear');
  await wait(300);

  // ── Scene 7: Geopolitics — sovereignty + OEM dependency (27s–33s) ──
  console.log('  Scene 7: Geopolitics — sovereignty analysis...');
  await clickTab(page, 'Geopolitics');
  await wait(1500);

  // Scroll through sovereignty bars
  await smoothScroll(page, '.geo-view', 500, 1200);
  await wait(1000);

  // Continue to OEM dependency section
  await smoothScroll(page, '.geo-view', 400, 800);
  await wait(1500);

  // ── Scene 8: Cut the Wire (33s–40s) ──
  console.log('  Scene 8: Cut the Wire — sanction simulation...');
  // Scroll to Cut the Wire section
  await smoothScroll(page, '.geo-view', 500, 600);
  await wait(500);

  // Toggle China
  await clickCutToggle(page, 'China');
  await wait(2000);

  // Add US too — show cascading effect
  await clickCutToggle(page, 'US');
  await wait(2000);

  // Reset
  await page.click('.cut-reset');
  await wait(800);

  // ── Scene 9: Company drilldown + CTA (40s–45s) ──
  console.log('  Scene 9: AGIBot drilldown + CTA...');
  await clickTab(page, 'All OEMs');
  await wait(500);
  await clickOemCard(page, 'AGIBot');
  await wait(1500);

  // Scroll to show specs
  await smoothScroll(page, '.company-view', 300, 800);
  await wait(2500);

  // ── Finalize ──
  console.log('  Saving raw recording...');
  const savedPath = await saveRecording(page);
  await browser.close();

  // ── Post-process with FFmpeg ──
  const overlays: TextOverlay[] = [
    {
      text: 'HUMANOID ATLAS — FULL WALKTHROUGH',
      startTime: 0,
      endTime: 3,
      fontSize: 32,
      position: 'top',
      bgOpacity: 0.7,
    },
    {
      text: '13 OEMs ACROSS US, CHINA & EUROPE',
      startTime: 3.5,
      endTime: 6.5,
      fontSize: 24,
      position: 'top',
      bgOpacity: 0.6,
    },
    {
      text: 'TRACE EVERY COMPONENT — MOTORS',
      startTime: 7.5,
      endTime: 11,
      fontSize: 24,
      position: 'top',
      bgOpacity: 0.6,
    },
    {
      text: 'IDENTIFY SUPPLY CHAIN BOTTLENECKS',
      startTime: 12.5,
      endTime: 16,
      fontSize: 24,
      position: 'top',
      bgOpacity: 0.6,
    },
    {
      text: 'COMPARE ACTUATOR ARCHITECTURES',
      startTime: 17.5,
      endTime: 21,
      fontSize: 24,
      position: 'top',
      bgOpacity: 0.6,
    },
    {
      text: 'FOLLOW THE BATTERY SUPPLY CHAIN',
      startTime: 22.5,
      endTime: 26,
      fontSize: 24,
      position: 'top',
      bgOpacity: 0.6,
    },
    {
      text: 'US vs CHINA vs REST — SOVEREIGNTY ANALYSIS',
      startTime: 27.5,
      endTime: 32,
      fontSize: 24,
      position: 'top',
      bgOpacity: 0.6,
    },
    {
      text: 'CUT THE WIRE — SANCTION SIMULATOR',
      startTime: 33.5,
      endTime: 39,
      fontSize: 24,
      position: 'top',
      bgOpacity: 0.6,
    },
    {
      text: 'HUMANOID ATLAS',
      startTime: 41,
      endTime: 45,
      fontSize: 44,
      position: 'center',
      bgOpacity: 0.8,
    },
    {
      text: 'humanoids.fyi',
      startTime: 41,
      endTime: 45,
      fontSize: 24,
      position: 'bottom',
      bgOpacity: 0.5,
    },
  ];

  const finalPath = path.join(OUTPUT_DIR, 'deep-dive-45s.mp4');

  encodeForX({
    inputPath: savedPath,
    outputPath: finalPath,
    overlays,
    width: VIEWPORTS.landscape.width,
    height: VIEWPORTS.landscape.height,
  });

  console.log(`\n✅ Deep dive complete: ${finalPath}\n`);
}

recordDeepDive().catch((err) => {
  console.error('❌ Deep dive recording failed:', err);
  process.exit(1);
});
