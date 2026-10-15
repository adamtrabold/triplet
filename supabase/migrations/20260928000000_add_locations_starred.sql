-- ALREADY APPLIED to the live project (Trip Map, jgvckilmltimabfdvaly) before
-- the Pencil Star merged to main (2026-09-28). This file is kept as the record
-- of the locations.starred column: it was run by hand from design/star/ (now
-- design/archive/star/) and was not in supabase/migrations/ until 2026-10-15.
-- Idempotent (`if not exists`), so re-running it changes nothing.
--
-- Personal priority star ("Baedeker star") -- locations.starred
-- Run BEFORE merging the star commit (r3-star.diff): the client's explicit
-- select of `starred` fails the whole locations fetch if the column is
-- missing. The popup-fix commit (r3-popup-fix.diff) has no dependency.
--
-- NOT NULL DEFAULT false: every existing row becomes "not starred"; the
-- client never handles null. A constant default is metadata-only on PG11+
-- (no table rewrite). No index: a few hundred rows, no server-side
-- filter/order on it yet.
-- RLS: unchanged. The existing table-level policies (public SELECT;
-- INSERT/UPDATE/DELETE for the two owner emails) cover the new column.

alter table public.locations
  add column if not exists starred boolean not null default false;

comment on column public.locations.starred is
  'Owner''s "I really care about this one" flag. Set from the map popup or the add form.';

-- Verify after running:
--   select column_name, data_type, is_nullable, column_default
--     from information_schema.columns
--    where table_schema = 'public' and table_name = 'locations' and column_name = 'starred';
--   select policyname, cmd, roles, qual, with_check
--     from pg_policies where schemaname = 'public' and tablename = 'locations';
