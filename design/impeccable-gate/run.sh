#!/usr/bin/env bash
# Impeccable gate -- the one command every agent runs (see README.md):
#   design/impeccable-gate/run.sh [--runtime] [--update] [path/to/index.html]
# Default file: this checkout's index.html. Exit 0 pass, 1 gate failed, 3 could not run.
# --update rewrites the baseline(s); only when the owner/operator approved the change.
set -u
HERE="$(cd "$(dirname "$0")" && pwd)"
command -v node >/dev/null && command -v npx >/dev/null || { echo "IMPECCABLE ERROR: node/npx not found; the gate did NOT run" >&2; exit 3; }
export IMPECCABLE_NO_TELEMETRY=1 DO_NOT_TRACK=1
exec node "$HERE/gate.mjs" "$@"
