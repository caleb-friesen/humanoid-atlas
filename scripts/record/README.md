# Launch Video Suite

Hybrid pipeline: **Playwright** captures real app footage, **Remotion** composes it with animated text, transitions, and branding into polished X-ready videos.

## Prerequisites

```bash
npx playwright install chromium    # one-time browser install
brew install ffmpeg                # macOS
```

## Quick Start

```bash
# Terminal 1: start dev server
pnpm dev

# Terminal 2: full pipeline (capture clips + render compositions)
pnpm render
```

Output: `recordings/teaser.mp4`, `recordings/hero.mp4`, `recordings/deepdive.mp4`

## Commands

| Command | What it does |
|---------|-------------|
| `pnpm render` | Full pipeline: capture clips → render all 3 videos |
| `pnpm render:clips` | Capture scene clips only (Playwright) |
| `pnpm render:video` | Render Remotion compositions only (clips must exist) |
| `pnpm render:video -- Teaser` | Render a single composition |
| `pnpm studio` | Open Remotion Studio for live preview/editing |

### Legacy (Playwright-only, no Remotion polish)

| Command | What it does |
|---------|-------------|
| `pnpm record` | Record all 3 videos (raw capture + FFmpeg text overlays) |
| `pnpm record:teaser` | 15s vertical teaser only |
| `pnpm record:hero` | 30s landscape hero only |
| `pnpm record:deep` | 45s landscape deep dive only |

## Architecture

```
┌─────────────────────────┐     ┌─────────────────────────┐
│  PLAYWRIGHT             │     │  REMOTION                │
│                         │     │                          │
│  capture-clips.ts       │────▶│  Teaser.tsx  (15s 9:16)  │
│  Records 15 scene clips │     │  Hero.tsx    (30s 16:9)  │
│  from the running app   │     │  DeepDive.tsx(45s 16:9)  │
│                         │     │                          │
│  recordings/clips/*.webm│     │  + AnimatedText          │
│                         │     │  + TitleCard             │
│                         │     │  + SceneOverlay          │
│                         │     │  + Transitions           │
│                         │     │  + ProgressBar           │
└─────────────────────────┘     └──────────┬──────────────┘
                                           │
                                     recordings/*.mp4
```

## Videos

| Video | Duration | Aspect | Resolution | Purpose |
|-------|----------|--------|------------|---------|
| `teaser.mp4` | 15s | 9:16 vertical | 1080x1920 | Pre-launch buzz (3-7 days before) |
| `hero.mp4` | 30s | 16:9 landscape | 1280x720 | Launch day hero post |
| `deepdive.mp4` | 45s | 16:9 landscape | 1280x720 | Day 2+ thread reply |

## X Upload Specs

All outputs are encoded to X-optimal specs:
- **Codec**: H.264, CRF 18
- **Framerate**: 30fps
- **Audio**: None (80% of X videos watched silent)
- **Pixel format**: yuv420p
- **File size**: Well under 512MB limit

## Customization

### Remotion compositions (recommended)

Edit `src/video/Teaser.tsx`, `Hero.tsx`, or `DeepDive.tsx`:
- **Scene order**: Rearrange `<TransitionSeries.Sequence>` blocks
- **Transitions**: Change `fade()`, `slide()`, `wipe()` between scenes
- **Overlay text**: Edit `<SceneOverlay title="..." />` props
- **Title cards**: Edit `<TitleCard title="..." subtitle="..." />` props
- **Timing**: Adjust `durationInFrames` on each sequence
- **Preview live**: `pnpm studio` opens Remotion Studio with frame-by-frame scrubbing

### Playwright clips

Edit `scripts/record/capture-clips.ts`:
- **Interactions**: Change what gets clicked/scrolled in each clip
- **Timing**: Adjust `wait()` calls for longer/shorter captures
- **New clips**: Add entries to the `CLIPS` record
- **Base URL**: `BASE_URL=https://humanoids.fyi pnpm render:clips`

### Design system

Edit `src/video/components/`:
- **AnimatedText**: Spring-based text reveals (fade-up, typewriter, scale)
- **TitleCard**: Full-screen branded intro/outro cards
- **SceneOverlay**: Animated title bar on top of video clips
- **ProgressBar**: Subtle timeline indicator

## Launch Sequence (Recommended)

1. **T-5 days**: Post `teaser.mp4` — vertical, fills mobile feed, builds curiosity
2. **Launch day**: Post `hero.mp4` — the main demo, shows full value prop
3. **Day 2**: Reply in thread with `deepdive.mp4` — full walkthrough for engaged audience

Key X best practices:
- Always upload natively (never post as YouTube links)
- Front-load the hook in the first 3 seconds
- Design for silent viewing — text overlays carry the message
- Coordinate early replies/RTs in the first 10 minutes for algorithmic boost
