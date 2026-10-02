-- Shape parity (owner, 2026-10-02: "Every category should have the same
-- information and capabilities"): districts and streets can be visited and
-- starred like pins (docs/shipped.md "Shape parity").
-- ALREADY APPLIED to the live project (Trip Map, jgvckilmltimabfdvaly) by the
-- operator on 2026-10-02, before index.html read these columns; this file
-- records it. The existing rows got false/false. RLS is unchanged: the
-- existing UPDATE policy already limits writes to the two owner emails.
ALTER TABLE neighborhood_shapes
  ADD COLUMN visited boolean NOT NULL DEFAULT false,
  ADD COLUMN starred boolean NOT NULL DEFAULT false;
