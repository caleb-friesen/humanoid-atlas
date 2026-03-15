/**
 * Spring-based animated text reveal for Remotion compositions.
 * Supports multiple animation styles: fade-up, typewriter, scale.
 */

import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import type { CSSProperties } from 'react';

export interface AnimatedTextProps {
  text: string;
  /** Frame at which animation starts (default: 0) */
  startFrame?: number;
  /** Animation style */
  animation?: 'fade-up' | 'fade' | 'scale' | 'typewriter';
  /** Font size in px */
  fontSize?: number;
  /** Font weight */
  fontWeight?: CSSProperties['fontWeight'];
  /** Text color */
  color?: string;
  /** Use Share Tech Mono font */
  mono?: boolean;
  /** Letter spacing */
  letterSpacing?: number;
  /** Text transform */
  textTransform?: CSSProperties['textTransform'];
  /** Additional styles */
  style?: CSSProperties;
}

export function AnimatedText({
  text,
  startFrame = 0,
  animation = 'fade-up',
  fontSize = 48,
  fontWeight = 600,
  color = '#1a1a1a',
  mono = true,
  letterSpacing = 2,
  textTransform = 'uppercase',
  style,
}: AnimatedTextProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const relativeFrame = frame - startFrame;

  if (relativeFrame < 0) return null;

  const springValue = spring({
    frame: relativeFrame,
    fps,
    config: { damping: 20, stiffness: 80, mass: 0.8 },
  });

  let animStyle: CSSProperties = {};

  switch (animation) {
    case 'fade-up':
      animStyle = {
        opacity: springValue,
        transform: `translateY(${interpolate(springValue, [0, 1], [30, 0])}px)`,
      };
      break;
    case 'fade':
      animStyle = { opacity: springValue };
      break;
    case 'scale':
      animStyle = {
        opacity: springValue,
        transform: `scale(${interpolate(springValue, [0, 1], [0.8, 1])})`,
      };
      break;
    case 'typewriter': {
      const chars = Math.round(interpolate(springValue, [0, 1], [0, text.length]));
      return (
        <div
          style={{
            fontFamily: mono ? "'Share Tech Mono', monospace" : "'Inter', sans-serif",
            fontSize,
            fontWeight,
            color,
            letterSpacing,
            textTransform,
            ...style,
          }}
        >
          {text.slice(0, chars)}
          <span style={{ opacity: frame % 20 < 10 ? 1 : 0 }}>▌</span>
        </div>
      );
    }
  }

  return (
    <div
      style={{
        fontFamily: mono ? "'Share Tech Mono', monospace" : "'Inter', sans-serif",
        fontSize,
        fontWeight,
        color,
        letterSpacing,
        textTransform,
        ...animStyle,
        ...style,
      }}
    >
      {text}
    </div>
  );
}
