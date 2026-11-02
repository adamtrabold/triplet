#!/bin/bash
# chain.sh <id,id,...> [sizes=18,24,12]: per concept, its sizes in order (24 and 12 read the 18), 4 concepts at a time
cd "$(dirname "$0")/../concepts"
SIZES=${2:-18,24,12}
one() { for s in ${SIZES//,/ }; do node decl.js $s $1; done; }
for i in ${1//,/ }; do
  while [ $(jobs -r | wc -l) -ge 4 ]; do sleep 3; done
  one $i &
done
wait
echo CHAIN DONE
