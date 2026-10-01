-- Plans (v3 build; design/plans-deepdive/v3/README.md, docs/shipped.md
-- "Plans (v3 build)"). The schema is unchanged since phase 1.
-- NOT YET APPLIED: the operator applies this to the live project after review.
-- index.html fails soft until it is: the Plans side of the filter panel says
-- plans aren't available yet, and everything else works exactly as before.
--
-- A plan is a named, ordered list of stops. A stop is EITHER a pin
-- (locations) OR a district/street (neighborhood_shapes), never both.
-- Plans are shared between the two authorized users, like every other table.
--
-- Column types follow the live tables (checked 2026-09-29 through the
-- Supabase connector, list_tables):
--   locations.id            uuid   (default gen_random_uuid())
--   neighborhood_shapes.id  bigint (generated always as identity)
-- so plan_stops.location_id is uuid (a text column can't reference a uuid
-- key) and plan_stops.shape_id is bigint.
--
-- ids are uuid with a server default, but the app sends its own
-- crypto.randomUUID() on insert so an optimistic row keeps its id when the
-- server confirms it (no temp-id swap).
--
-- position is float8 so a reorder writes ONE row (the midpoint between its
-- new neighbours); the app renumbers the plan 1..n only if two neighbours
-- ever get too close. Last write wins between the two users.

CREATE TABLE plans (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL CHECK (char_length(btrim(name)) BETWEEN 1 AND 80),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE plan_stops (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id     uuid NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
  location_id uuid NULL REFERENCES locations(id) ON DELETE CASCADE,
  shape_id    bigint NULL REFERENCES neighborhood_shapes(id) ON DELETE CASCADE,
  position    double precision NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT plan_stops_one_target CHECK (num_nonnulls(location_id, shape_id) = 1)
);

-- A place is in a plan at most once (Edit mode shows + or its number).
CREATE UNIQUE INDEX plan_stops_plan_location_uniq ON plan_stops (plan_id, location_id) WHERE location_id IS NOT NULL;
CREATE UNIQUE INDEX plan_stops_plan_shape_uniq    ON plan_stops (plan_id, shape_id)    WHERE shape_id IS NOT NULL;
-- The cascades from locations / neighborhood_shapes need an index on the
-- referencing column (the unique indexes above lead with plan_id).
CREATE INDEX plan_stops_location_id_idx ON plan_stops (location_id) WHERE location_id IS NOT NULL;
CREATE INDEX plan_stops_shape_id_idx    ON plan_stops (shape_id)    WHERE shape_id IS NOT NULL;
CREATE INDEX plan_stops_plan_position_idx ON plan_stops (plan_id, position);

-- RLS: identical to locations / neighborhood_shapes / cities -- public read,
-- writes restricted to the two authorized emails.
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_stops ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON plans FOR SELECT TO public USING (true);
CREATE POLICY "Authorized users can insert" ON plans FOR INSERT TO authenticated
  WITH CHECK (auth.jwt() ->> 'email' IN ('adamtrabold@gmail.com', 'ericatrabold@gmail.com'));
CREATE POLICY "Authorized users can update" ON plans FOR UPDATE TO authenticated
  USING (auth.jwt() ->> 'email' IN ('adamtrabold@gmail.com', 'ericatrabold@gmail.com'))
  WITH CHECK (auth.jwt() ->> 'email' IN ('adamtrabold@gmail.com', 'ericatrabold@gmail.com'));
CREATE POLICY "Authorized users can delete" ON plans FOR DELETE TO authenticated
  USING (auth.jwt() ->> 'email' IN ('adamtrabold@gmail.com', 'ericatrabold@gmail.com'));

CREATE POLICY "Public read access" ON plan_stops FOR SELECT TO public USING (true);
CREATE POLICY "Authorized users can insert" ON plan_stops FOR INSERT TO authenticated
  WITH CHECK (auth.jwt() ->> 'email' IN ('adamtrabold@gmail.com', 'ericatrabold@gmail.com'));
CREATE POLICY "Authorized users can update" ON plan_stops FOR UPDATE TO authenticated
  USING (auth.jwt() ->> 'email' IN ('adamtrabold@gmail.com', 'ericatrabold@gmail.com'))
  WITH CHECK (auth.jwt() ->> 'email' IN ('adamtrabold@gmail.com', 'ericatrabold@gmail.com'));
CREATE POLICY "Authorized users can delete" ON plan_stops FOR DELETE TO authenticated
  USING (auth.jwt() ->> 'email' IN ('adamtrabold@gmail.com', 'ericatrabold@gmail.com'));
