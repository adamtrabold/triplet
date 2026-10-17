#!/usr/bin/env bash
# Re-fetch the phase 2 test fixtures: real Nominatim answers, in English (accept-language=en, as the
# app asks), with a generic UA. Run from the sandbox or a laptop; respects Nominatim's 1 req/s.
#   design/add-tag-jam/p2/fetch-fixtures.sh
set -euo pipefail
cd "$(dirname "$0")/fixtures"
UA="triplet-test-fixtures/1.0"
# the tests' map view (Reykjavík at its start zoom): the app sends it as the soft viewbox
VIEW="-22.076,64.029,-21.809,64.264"
search() {   # search <q> [countrycodes]
  local q="$1" cc="${2:-}" f
  f="$(echo "$q" | tr ' ' '_')"; [ -n "$cc" ] && f="${f}__${cc}"
  curl -sS -G "https://nominatim.openstreetmap.org/search" --data-urlencode "q=$q" --data-urlencode "format=json" \
    --data-urlencode "limit=10" --data-urlencode "addressdetails=1" --data-urlencode "accept-language=en" \
    $( [ -n "$cc" ] && echo --data-urlencode "countrycodes=$cc" || echo --data-urlencode "viewbox=$VIEW" ) -A "$UA" -o "$f.json" -w "$q [$cc] %{http_code}\n"
  sleep 1.2
}
bounded() {  # bounded <q> <viewbox>: the quiet search near your cities (searchNearCities())
  local q="$1" vb="$2" f
  f="$(echo "$q" | tr ' ' '_')__vb_$(echo "$vb" | tr ',' '_')"
  curl -sS -G "https://nominatim.openstreetmap.org/search" --data-urlencode "q=$q" --data-urlencode "format=json" \
    --data-urlencode "limit=5" --data-urlencode "addressdetails=1" --data-urlencode "accept-language=en" \
    --data-urlencode "viewbox=$vb" --data-urlencode "bounded=1" -A "$UA" -o "$f.json" -w "$q [$vb] %{http_code}\n"
  sleep 1.2
}
lookup() {   # lookup <osm_ids>
  curl -sS -G "https://nominatim.openstreetmap.org/lookup" --data-urlencode "osm_ids=$1" --data-urlencode "format=json" \
    --data-urlencode "polygon_geojson=1" --data-urlencode "accept-language=en" -A "$UA" -o "lookup_$1.json" -w "lookup $1 %{http_code}\n"
  sleep 1.2
}
for q in "Sundhöllin" "Blue Lagoon" "Jönköpings läns museum" "Vesterbro" "Tivoli" "Harpa" "Sund" "Hallgrímskirkja" \
         "Noma" "Laugavegur 18, Reykjavík" "Vesterbrogade 10" "Grettisgata 20" "Sundhöll"; do search "$q"; done
# the seed cities' regions (cityRegions()): LA alone, Copenhagen + Malmö + Stockholm merged; the
# map view's own region (Reykjavík in the tests) is never re-searched
for q in "Tivoli" "Noma"; do bounded "$q" "-118.668,33.704,-118.155,34.337"; bounded "$q" "12.450,55.530,18.220,59.420"; done
search "Jönköping" "se"
lookup R2583102
