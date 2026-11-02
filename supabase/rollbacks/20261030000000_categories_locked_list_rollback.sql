-- Rollback for supabase/migrations/20261030000000_categories_locked_list.sql.
-- Restores both tables' rows to the snapshot the migration took in backup.*_20261030
-- (category, the 10 deleted pins, and the shapes' type/note/starred/visited). Only the
-- columns the migration touched are restored on surviving rows, so any edit made since
-- to other columns (notes, visited, star on pins) is kept. Run with execute_sql or
-- apply_migration; one transaction.
--
-- Note: a code rollback (revert the index.html commit) must go out with it, since the old
-- code knows `district`, not `neighborhood`.

begin;

-- pins: put the deleted duplicates back, then their categories
insert into public.locations
  select b.* from backup.locations_20261030 b
  where not exists (select 1 from public.locations l where l.id = b.id);

update public.locations l set category = b.category
  from backup.locations_20261030 b
  where b.id = l.id and l.category is distinct from b.category;

-- shapes: type, and the carried-over note / star / visited
alter table public.neighborhood_shapes drop constraint neighborhood_shapes_type_check;
update public.neighborhood_shapes s set
  type = b.type, note = b.note, starred = b.starred, visited = b.visited
  from backup.neighborhood_shapes_20261030 b
  where b.id = s.id;
-- any shape added after the migration as 'neighborhood' goes back to the old key too
update public.neighborhood_shapes set type = 'district' where type = 'neighborhood';
-- pins added after the migration under a new key have no old category; the old code
-- shows them with the `other` ink. Listed here so nothing is silently changed:
--   select id, name, category from public.locations
--   where category in ('venue','museum','landmark','park','neighborhood');
alter table public.neighborhood_shapes add constraint neighborhood_shapes_type_check
  check (type = any (array['district'::text, 'street'::text]));

commit;

-- Once the rollback (or the migration) is settled for good:
--   drop table backup.locations_20261030; drop table backup.neighborhood_shapes_20261030;
