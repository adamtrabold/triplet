#!/usr/bin/env bash
# Row-gesture gate: runs every suite against one index.html and prints the gate
# summary line (CLAUDE.md format). Usage:
#   design/gesture-harness/run-all.sh [path/to/index.html] [suite ...]
# Default file: this checkout's index.html. Default suites: all eight.
# OUTDIR (default: a fresh temp dir) keeps each suite's log + json.
set -u
HERE="$(cd "$(dirname "$0")" && pwd)"
FILE="$(realpath "${1:-$HERE/../../index.html}")"; shift || true
SUITES=("$@"); [ ${#SUITES[@]} -eq 0 ] && SUITES=(touch flip visit popup-open dust rows curve delete)
OUTDIR="${OUTDIR:-$(mktemp -d -t gesture-gate.XXXXXX)}"; mkdir -p "$OUTDIR"
export PLAYWRIGHT_BROWSERS_PATH="${PLAYWRIGHT_BROWSERS_PATH:-/opt/pw-browsers}"
echo "gesture gate: $FILE ($(md5sum "$FILE" | cut -c1-12)) -> $OUTDIR"
T0=$(date +%s)
for s in "${SUITES[@]}"; do
  t=$(date +%s)
  FILE="$FILE" OUT="$OUTDIR/$s.json" SHOTS="$OUTDIR/shots" node "$HERE/$s.js" > "$OUTDIR/$s.log" 2>&1
  echo "  $s: $(tail -n 1 "$OUTDIR/$s.log")  ($(( $(date +%s) - t ))s)"
done
echo "total $(( $(date +%s) - T0 ))s"
node "$HERE/summarize.js" "$OUTDIR"
