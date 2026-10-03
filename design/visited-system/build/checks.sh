#!/usr/bin/env bash
# The non-gesture checks for the visited sticker branch, one after another (timing-sensitive suites never in parallel).
#   design/visited-system/build/checks.sh <outdir>   (run from the repo root)
set -u
R="$(pwd)"; OUT="${1:-/tmp/vs-checks}"; mkdir -p "$OUT"
V="$R/design/gesture-harness/vendor"
export PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers
run() { local n="$1"; shift; echo "== $n"; ( "$@" ) > "$OUT/$n.log" 2>&1; echo "   exit $? :: $(tail -n 2 "$OUT/$n.log" | tr '\n' ' ' | cut -c1-300)"; }
run plantest env VENDOR="$V" PAGE="$R/index.html" OUT="$OUT/plans" node design/plans-build/plantest.js
run griptest env REPO="$R" VENDOR="$V" OUT="$OUT/plans" node design/plans-build/griptest.js
run ink      env REPO="$R" VENDOR="$V" OUT="$OUT/plans" node design/plans-build/ink.js
run frames   env REPO="$R" VENDOR="$V" OUT="$OUT/plans" node design/plans-build/frames.js
run check    env OUT="$OUT/plans" node design/plans-build/check.js
run matrix   env REPO="$R" VENDOR="$V" OUT="$OUT/plans" node design/plans-build/matrix.js
run sweep    env REPO="$R" VENDOR="$V" OUT="$OUT/plans" node design/plans-build/sweep.js
run sorttest env REPO="$R" VENDOR="$V" node design/list-ordering/build/sorttest.js
run state-check  env REPO="$R" VENDOR="$V" node design/state-system/check.js
run state-matrix env REPO="$R" VENDOR="$V" node design/state-system/matrix.js
LIBS="${LIBS:-}"; [ -n "$LIBS" ] && run widen env LIBS="$LIBS" node design/trip-location-model/widen-test.js "$R/index.html"
run gesturediff env REPO="$R" VENDOR="$V" node design/list-ordering/build/gesturediff.js
run impeccable design/impeccable-gate/run.sh "$R/index.html"
