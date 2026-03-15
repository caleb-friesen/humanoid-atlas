#!/usr/bin/env bash
#
# encode.sh — Re-encode raw Playwright recordings to X-optimized MP4s.
#
# Usage:
#   ./scripts/record/encode.sh                    # encode all raw-*.webm files
#   ./scripts/record/encode.sh recordings/raw-hero.webm   # encode a single file
#
# Prerequisites: ffmpeg 5+
#
# Output specs (X/Twitter optimized):
#   - Codec: H.264 (libx264)
#   - Container: MP4 with faststart
#   - Framerate: 30fps
#   - CRF: 18 (high quality, well under 512MB limit)
#   - No audio (silent playback optimized)
#   - Pixel format: yuv420p (maximum compatibility)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
RECORDINGS_DIR="$SCRIPT_DIR/../../recordings"

encode_file() {
  local input="$1"
  local basename
  basename="$(basename "$input" .webm)"

  # Strip "raw-" prefix for output name
  local outname="${basename#raw-}"
  local output="$RECORDINGS_DIR/${outname}.mp4"

  echo ""
  echo "━━━ Encoding: $basename → $outname.mp4 ━━━"
  echo ""

  # Probe input
  echo "  Input:"
  ffprobe -v error -show_entries format=duration,size -of default=noprint_wrappers=1 "$input" 2>/dev/null || true

  ffmpeg -y \
    -i "$input" \
    -c:v libx264 \
    -preset slow \
    -crf 18 \
    -pix_fmt yuv420p \
    -r 30 \
    -movflags +faststart \
    -an \
    "$output"

  echo ""
  echo "  Output: $output"
  local size
  size=$(du -h "$output" | cut -f1)
  echo "  Size: $size"
  echo ""
}

# ── Main ────────────────────────────────────────────────────────────────────

if [ $# -gt 0 ]; then
  # Encode specific file(s)
  for f in "$@"; do
    encode_file "$f"
  done
else
  # Encode all raw-*.webm files in recordings/
  if [ ! -d "$RECORDINGS_DIR" ]; then
    echo "No recordings directory found at $RECORDINGS_DIR"
    echo "Run the recording scripts first."
    exit 1
  fi

  count=0
  for f in "$RECORDINGS_DIR"/raw-*.webm; do
    [ -f "$f" ] || continue
    encode_file "$f"
    count=$((count + 1))
  done

  if [ "$count" -eq 0 ]; then
    echo "No raw-*.webm files found in $RECORDINGS_DIR"
    echo "Run the recording scripts first."
    exit 1
  fi

  echo "━━━ Done: $count files encoded ━━━"
fi
