/**
 * Remotion Root — registers all video compositions.
 *
 * This is the entry point for both Remotion Studio (preview) and CLI rendering.
 * Clips must exist in public/clips/ for Remotion Studio preview,
 * or in recordings/clips/ for the render pipeline.
 */

import { Composition } from 'remotion';
import { Teaser } from './Teaser';
import { Hero } from './Hero';
import { DeepDive } from './DeepDive';

const FPS = 30;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Teaser"
        component={Teaser}
        durationInFrames={15 * FPS}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="Hero"
        component={Hero}
        durationInFrames={30 * FPS}
        fps={FPS}
        width={1280}
        height={720}
      />
      <Composition
        id="DeepDive"
        component={DeepDive}
        durationInFrames={45 * FPS}
        fps={FPS}
        width={1280}
        height={720}
      />
    </>
  );
};
