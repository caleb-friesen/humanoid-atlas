/**
 * Overlay component that sits on top of a video clip,
 * providing animated title bar and optional caption.
 */

import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import type { CSSProperties } from 'react';

export interface SceneOverlayProps {
  /** Title text shown at top */
  title?: string;
  /** Caption text shown at bottom */
  caption?: string;
  /** Position of the title bar */
  titlePosition?: 'top' | 'bottom';
  /** Delay before overlay appears (in frames) */
  delay?: number;
  /** Style variant */
  variant?: 'dark' | 'light';
}

export function SceneOverlay({
  title,
  caption,
  titlePosition = 'top',
  delay = 8,
  variant = 'dark',
}: SceneOverlayProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slideIn = spring({
    frame: frame - delay,
    fps,
    config: { damping: 20, stiffness: 80 },
  });

  const bg = variant === 'dark' ? 'rgba(26, 26, 26, 0.85)' : 'rgba(245, 242, 237, 0.9)';
  const fg = variant === 'dark' ? '#f5f2ed' : '#1a1a1a';

  const barStyle: CSSProperties = {
    position: 'absolute',
    left: 0,
    right: 0,
    [titlePosition]: 0,
    padding: '14px 32px',
    backgroundColor: bg,
    backdropFilter: 'blur(8px)',
    transform: `translateY(${interpolate(slideIn, [0, 1], [titlePosition === 'top' ? -60 : 60, 0])}px)`,
    opacity: slideIn,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  const textStyle: CSSProperties = {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 16,
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: fg,
  };

  const captionSpring = spring({
    frame: frame - delay - 15,
    fps,
    config: { damping: 20, stiffness: 60 },
  });

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {title && (
        <div style={barStyle}>
          <span style={textStyle}>{title}</span>
        </div>
      )}

      {caption && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: titlePosition === 'bottom' ? 60 : 0,
            top: titlePosition === 'top' ? undefined : undefined,
            padding: '12px 32px',
            opacity: captionSpring,
            transform: `translateY(${interpolate(captionSpring, [0, 1], [20, 0])}px)`,
          }}
        >
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 14,
              color: fg,
              backgroundColor: bg,
              padding: '6px 14px',
              borderRadius: 4,
            }}
          >
            {caption}
          </span>
        </div>
      )}
    </AbsoluteFill>
  );
}
