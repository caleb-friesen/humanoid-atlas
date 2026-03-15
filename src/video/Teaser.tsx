/**
 * Video 1 — 15s Vertical Teaser (1080x1920, 30fps = 450 frames)
 *
 * Scenes:
 *   0–5s   (0–150f)   Skeleton spinning + "WHO BUILDS THE ROBOTS?"
 *   5–11s  (150–330f) Cut-the-Wire clip + question overlay
 *   11–15s (330–450f) Branded title card
 *
 * Transitions: fade between scenes
 */

import {
  AbsoluteFill,
  OffthreadVideo,
  staticFile,
} from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { wipe } from '@remotion/transitions/wipe';
import { TitleCard } from './components/TitleCard';
import { SceneOverlay } from './components/SceneOverlay';
import { ProgressBar } from './components/ProgressBar';

const FPS = 30;
const TRANSITION = 15; // 0.5s transitions

export function Teaser() {
  return (
    <AbsoluteFill style={{ backgroundColor: '#f5f2ed' }}>
      <TransitionSeries>
        {/* Scene 1: Skeleton spin + hook question */}
        <TransitionSeries.Sequence durationInFrames={5 * FPS}>
          <AbsoluteFill>
            <OffthreadVideo
              src={staticFile('clips/skeleton-vertical.webm')}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <SceneOverlay
              title="Who builds the robots?"
              variant="dark"
              titlePosition="top"
              delay={15}
            />
          </AbsoluteFill>
        </TransitionSeries.Sequence>

        {/* Transition: wipe */}
        <TransitionSeries.Transition
          presentation={wipe({ direction: 'from-left' })}
          timing={linearTiming({ durationInFrames: TRANSITION })}
        />

        {/* Scene 2: Cut the Wire */}
        <TransitionSeries.Sequence durationInFrames={6 * FPS}>
          <AbsoluteFill>
            <OffthreadVideo
              src={staticFile('clips/cut-the-wire-vertical.webm')}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <SceneOverlay
              title="What happens when you cut the supply chain?"
              variant="dark"
              titlePosition="top"
              delay={10}
            />
          </AbsoluteFill>
        </TransitionSeries.Sequence>

        {/* Transition: fade */}
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION })}
        />

        {/* Scene 3: Title card */}
        <TransitionSeries.Sequence durationInFrames={4 * FPS}>
          <TitleCard
            title="Humanoid Atlas"
            subtitle="humanoids.fyi"
            bg="#1a1a1a"
            color="#f5f2ed"
            delay={5}
          />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      <ProgressBar color="#f5f2ed" height={3} />
    </AbsoluteFill>
  );
}
