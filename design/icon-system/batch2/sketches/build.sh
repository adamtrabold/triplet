#!/bin/bash
# build.sh <size> <id,id,...>: one process per sketch, 6 at a time (TOOLS must point at a dir with node_modules/paper)
cd "$(dirname "$0")"
for i in ${2//,/ }; do
  while [ $(jobs -r | wc -l) -ge 6 ]; do sleep 2; done
  node sketch.js $1 $i &
done
wait
