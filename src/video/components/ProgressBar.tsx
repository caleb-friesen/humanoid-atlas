/**
 * Subtle progress indicator at the bottom of the video.
 * Shows how far through the video the viewer is.
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';

export interface ProgressBarProps {
  color?: string;
  height?: number;
  position?: 'top' | 'bottom';
}

export function ProgressBar({
  color = '#1a1a1a',
  height = 3,
  position = 'bottom',
}: ProgressBarProps) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const progress = (frame / durationInFrames) * 100;

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          [position]: 0,
          height,
          backgroundColor: 'rgba(0,0,0,0.1)',
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: '100%',
            backgroundColor: color,
            transition: 'none',
          }}
        />
      </div>
    </AbsoluteFill>
  );
}
