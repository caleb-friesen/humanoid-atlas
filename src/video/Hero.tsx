/**
 * Video 2 — 30s Hero Demo (1280x720, 30fps = 900 frames)
 *
 * Scenes:
 *   0–3s   (0–90f)     Problem statement title card
 *   3–7s   (90–210f)   Skeleton spinning
 *   7–11s  (210–330f)  All OEMs grid
 *   11–16s (330–480f)  Tesla company detail
 *   16–22s (480–660f)  Motors supply chain
 *   22–27s (660–810f)  Cut the Wire sanctions
 *   27–30s (810–900f)  CTA title card
 */

import {
  AbsoluteFill,
  OffthreadVideo,
  staticFile,
} from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { slide } from '@remotion/transitions/slide';
import { wipe } from '@remotion/transitions/wipe';
import { TitleCard } from './components/TitleCard';
import { SceneOverlay } from './components/SceneOverlay';
import { ProgressBar } from './components/ProgressBar';

const FPS = 30;
const T = 12; // transition duration in frames (~0.4s)

export function Hero() {
  return (
    <AbsoluteFill style={{ backgroundColor: '#f5f2ed' }}>
      <TransitionSeries>
        {/* Scene 1: Problem statement */}
        <TransitionSeries.Sequence durationInFrames={3 * FPS}>
          <TitleCard
            title="13 Robots. 40+ Suppliers. 1 Atlas."
            subtitle="The humanoid supply chain, mapped"
            delay={5}
          />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: T })}
        />

        {/* Scene 2: Skeleton */}
        <TransitionSeries.Sequence durationInFrames={4 * FPS}>
          <AbsoluteFill>
            <OffthreadVideo
              src={staticFile('clips/skeleton-landscape.webm')}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </AbsoluteFill>
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: 'from-right' })}
          timing={linearTiming({ durationInFrames: T })}
        />

        {/* Scene 3: All OEMs */}
        <TransitionSeries.Sequence durationInFrames={4 * FPS}>
          <AbsoluteFill>
            <OffthreadVideo
              src={staticFile('clips/oems-grid.webm')}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <SceneOverlay
              title="Every OEM. Every Component."
              variant="dark"
              delay={8}
            />
          </AbsoluteFill>
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={wipe({ direction: 'from-left' })}
          timing={linearTiming({ durationInFrames: T })}
        />

        {/* Scene 4: Tesla detail */}
        <TransitionSeries.Sequence durationInFrames={5 * FPS}>
          <AbsoluteFill>
            <OffthreadVideo
              src={staticFile('clips/tesla-detail.webm')}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <SceneOverlay
              title="Drill into any company"
              variant="dark"
              delay={8}
            />
          </AbsoluteFill>
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: 'from-right' })}
          timing={linearTiming({ durationInFrames: T })}
        />

        {/* Scene 5: Motors supply chain */}
        <TransitionSeries.Sequence durationInFrames={6 * FPS}>
          <AbsoluteFill>
            <OffthreadVideo
              src={staticFile('clips/motors-chain.webm')}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <SceneOverlay
              title="Trace the full supply chain"
              variant="dark"
              delay={8}
            />
          </AbsoluteFill>
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={wipe({ direction: 'from-right' })}
          timing={linearTiming({ durationInFrames: T })}
        />

        {/* Scene 6: Cut the Wire */}
        <TransitionSeries.Sequence durationInFrames={5 * FPS}>
          <AbsoluteFill>
            <OffthreadVideo
              src={staticFile('clips/cut-the-wire.webm')}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <SceneOverlay
              title="Simulate sanctions. See who breaks."
              variant="dark"
              delay={8}
            />
          </AbsoluteFill>
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: T })}
        />

        {/* Scene 7: CTA */}
        <TransitionSeries.Sequence durationInFrames={3 * FPS}>
          <TitleCard
            title="Humanoid Atlas"
            subtitle="humanoids.fyi"
            bg="#1a1a1a"
            color="#f5f2ed"
            delay={5}
          />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      <ProgressBar color="#1a1a1a" height={3} />
    </AbsoluteFill>
  );
}
