#!/usr/bin/env bash
# Re-fetch the city-crud build test fixtures: real Nominatim answers, in English (accept-language=en,
# as the app asks), with a generic UA, at Nominatim's 1 req/s. The place searches are keyed by q
# (spaces -> _); Find a city's settlement searches (featureType=city) by q + "__city".
#   design/city-crud/build/fetch-fixtures.sh
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p fixtures && cd fixtures
UA="triplet-test-fixtures/1.0"
search() {   # search <q>: the add tag's place search (worldwide; no viewbox needed for these)
  local q="$1" f; f="$(echo "$q" | tr ' ' '_')"
  curl -sS -G "https://nominatim.openstreetmap.org/search" --data-urlencode "q=$q" --data-urlencode "format=json" \
    --data-urlencode "limit=10" --data-urlencode "addressdetails=1" --data-urlencode "accept-language=en" \
    -A "$UA" -o "$f.json" -w "$q %{http_code}\n"
  sleep 1.2
}
city() {     # city <q>: Find a city (featureType=city)
  local q="$1" f; f="$(echo "$q" | tr ' ' '_')__city"
  curl -sS -G "https://nominatim.openstreetmap.org/search" --data-urlencode "q=$q" --data-urlencode "format=json" \
    --data-urlencode "limit=10" --data-urlencode "addressdetails=1" --data-urlencode "featureType=city" --data-urlencode "accept-language=en" \
    -A "$UA" -o "$f.json" -w "$q [city] %{http_code}\n"
  sleep 1.2
}
search "Longwood Gardens"
search "Cape Henlopen State Park"
search "1007 N Orange St Wilmington"
city "Philadelphia"
city "Reykjavik"
city "Lewes"
city "Zzyzxqq"
