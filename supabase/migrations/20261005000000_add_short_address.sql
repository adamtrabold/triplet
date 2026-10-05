-- Short address (owner, 2026-10-05): store a proper short form, "street +
-- number · area", when a place is added, and backfill existing places --
-- "#1 since there's a directions button". The full Nominatim display_name in
-- `address` stays untouched (Directions and the current popup use it).
-- docs/shipped.md "Short address".
--
-- address_details: the raw Nominatim `address` object (addressdetails=1) the
--   place was geocoded with -- the source of truth, so the short form can be
--   recomputed when its rules change without another round of Nominatim calls.
--   NULL = never fetched (what tools/short-address-backfill.html fills).
-- short_address: the derived display string (deriveShortAddress() in
--   index.html). Stored so every reader (the coming popup, SQL, tools) gets
--   one agreed value without porting the rules. NULL with address_details set
--   = nothing useful to show (e.g. a large area with no road or sub-area).
--
-- Additive and nullable: the deployed index.html never selects these, and
-- addLocation() retries an insert without them if they are missing, so the
-- order of deploy vs. migration does not matter.
--
-- RLS: unchanged. All four `locations` policies are column-agnostic (they test
-- only `true` or the auth.jwt() email), and Supabase grants at table level, so
-- the new columns are covered exactly like the existing ones (see
-- 20260918000000_add_city_to_locations.sql section 6).
ALTER TABLE locations
  ADD COLUMN IF NOT EXISTS address_details jsonb,
  ADD COLUMN IF NOT EXISTS short_address text;

ALTER TABLE locations
  DROP CONSTRAINT IF EXISTS locations_address_details_object;
ALTER TABLE locations
  ADD CONSTRAINT locations_address_details_object
  CHECK (address_details IS NULL OR jsonb_typeof(address_details) = 'object');

COMMENT ON COLUMN locations.address_details IS
  'Raw Nominatim address object (addressdetails=1); source for short_address. NULL = not fetched yet.';
COMMENT ON COLUMN locations.short_address IS
  'Derived "street number · area" (deriveShortAddress() in index.html). NULL = none.';
