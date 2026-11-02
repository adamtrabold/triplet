-- Categories: the locked list (design/icon-system/categories.md, 2026-10-16; design calls
-- design/icon-system/categories-design-calls.md, 2026-10-30). Owner: "Great ship the categories".
-- Rollback: supabase/rollbacks/20261030000000_categories_locked_list_rollback.sql
--
-- Live data checked 2026-10-30: 202 pins, 11 shapes. Every row is addressed by id.
-- Runs as one transaction; the closing check raises (and so rolls everything back) unless
-- the result is exactly the expected tally.

-- 0. Snapshot every row of both tables (small) in a schema the API does not expose.
create schema if not exists backup;
revoke all on schema backup from public, anon, authenticated;
create table backup.locations_20261030 as table public.locations;
create table backup.neighborhood_shapes_20261030 as table public.neighborhood_shapes;

-- 1. district -> neighborhood (shapes)
alter table public.neighborhood_shapes drop constraint neighborhood_shapes_type_check;
update public.neighborhood_shapes set type = 'neighborhood' where type = 'district';
alter table public.neighborhood_shapes add constraint neighborhood_shapes_type_check
  check (type = any (array['neighborhood'::text, 'street'::text]));

-- 2. Duplicate pins: notes, star and visited move onto the matching shape, then the pin goes.
create temp table dup_pins (pin_id uuid primary key, shape_id bigint not null, ord int not null);
insert into dup_pins values
  ('ef342a15-ab2d-4c38-9350-61f34774ac85', 12, 1),  -- Skogskyrkogården
  ('f230c1fb-7934-49fa-a2bf-e329c38b8a90', 10, 1),  -- Djurgården
  ('2b388372-ad07-4dfb-aa93-9209adf3875f',  9, 1),  -- Västra Hamnen Bo01
  ('c4a10180-f30e-42d4-a3c5-a1f5b1a01bdf',  1, 1),  -- Old Harbour Reykjavik -> Grandi
  ('3e12d2cb-3bed-4945-a439-d4ac1871b4ed',  6, 1),  -- Jægersborggade
  ('674a8f2d-0528-43f8-9bbd-e7bb8754a547',  2, 1),  -- Laugavegur
  ('ffcdbda5-8557-407c-b81f-6a28484681b3',  3, 1),  -- Grandagarður
  ('d17db176-b465-4e25-b281-9b1cccb79523',  4, 1),  -- Skólavörðustígur
  ('35a18f49-c93b-41d1-90d9-98f6dcbff12d', 11, 1),  -- Bondegatan Stockholm (area)
  ('acf9f01e-9414-44f7-bdb7-b2c8f9fc9e90', 11, 2);  -- Bondegatan Erstagatan Stockholm (attraction)

do $$
begin
  if (select count(*) from public.locations l join dup_pins d on d.pin_id = l.id) <> 10 then
    raise exception 'categories migration: expected 10 duplicate pins';
  end if;
  if exists (select 1 from public.plan_stops s join dup_pins d on d.pin_id = s.location_id) then
    raise exception 'categories migration: a duplicate pin is a plan stop';
  end if;
end $$;

update public.neighborhood_shapes s set
  note    = nullif(concat_ws(E'\n\n', nullif(s.note, ''), agg.notes), ''),
  starred = coalesce(s.starred, false) or agg.starred,
  visited = coalesce(s.visited, false) or agg.visited
from (
  select d.shape_id,
         string_agg(nullif(l.notes, ''), E'\n\n' order by d.ord) as notes,
         bool_or(coalesce(l.starred, false)) as starred,
         bool_or(coalesce(l.visited, false)) as visited
  from dup_pins d join public.locations l on l.id = d.pin_id
  group by d.shape_id
) agg
where s.id = agg.shape_id;

delete from public.locations where id in (select pin_id from dup_pins);

-- 3. Re-category pins
update public.locations set category = 'venue' where id in (
  '3dba6b97-346e-4f3a-8073-d9361cfe3265', -- Jazzhouse Copenhagen
  '13533452-c51c-490b-acc7-7561663cacc4', -- Jazzhus Montmartre
  'b44f129f-6da8-4d76-bcd6-ded67a58bd22', -- VEGA Copenhagen
  '658f92fc-7ef3-4e54-a899-48f20667c094', -- Debaser Nova
  'de21dce6-47d1-44af-b102-f631ca853747', -- Debaser Strand
  '51e68a7f-2e76-4c32-970b-692be28e1e46', -- Fasching
  '9dbe282b-f554-495b-bcb3-a3fcc2133bce', -- Nalen
  '007d6e2e-0aad-4058-98bb-d4eaa90c0112', -- Slaktkyrkan
  '00f826bc-a13f-4ace-bb0f-08ebe2a7d90d', -- Greek Theatre
  'c9b67205-5161-49ae-8977-06b485cf2b7e', -- Konserthuset Stockholm
  '61eacb16-c04f-4efd-bd9c-c4283f50d001'  -- Øksnehallen
);

update public.locations set category = 'museum' where id in (
  '50b6e1ed-013d-4ecd-a288-ed85d9bb33be', -- Designmuseum Danmark
  'cebf0a04-0042-443b-9822-691b03a43f35', -- Danish Architecture Center BLOX
  '86b043c9-9f29-415e-aec0-86de524b465c', -- Galleri Bo Bjerggaard
  '0362a586-1baf-420e-b52f-cea24d028ee4', -- Nils Stærk gallery
  '1f90bf79-8e42-4f66-b539-96ea32306c2b', -- V1 Gallery
  '08f142d1-b055-41fa-86c5-3dffb21c6032', -- Hammer Museum
  'ef6c9ed2-54e0-49b8-a628-6f6fe8e747c2', -- Photo Booth Museum
  'fa5be103-73aa-44cd-bba2-8430bef819eb', -- The Broad
  'c1e8bab1-d99d-4d3a-a002-3a8372177481', -- Shepard Fairey Exhibit
  'd365e2bb-7e07-4f0b-8526-0e4db6c9f2bc', -- Moderna Museet Malmö
  '918f5528-31ae-4bc0-9fd6-5deed4d39af8', -- Ásmundarsafn
  '002fdfb8-c978-4b59-8636-b4b9c2db1af3', -- Hafnarhús
  '406b68ca-88fb-471a-98e1-c201d1692d54', -- Icelandic Punk Museum
  '43ad7bab-c781-491f-b0eb-4bf35136821f', -- Kjarvalsstaðir
  '9f73a821-2958-4161-a6ab-42d7b20a426b', -- Reykjavík Maritime Museum
  'f1f8fa1f-b9bc-43ac-9350-072613eb8bac', -- Marshall House
  '9c8ab27a-b6da-457f-ba8e-0b38fe63ff47', -- ABBA Museum
  '443cb266-c704-4f82-8072-d5c50ff63d3a', -- ArkDes
  'c5418841-73ad-49c5-a07b-93bd316a8196', -- Fotografiska
  'c29d94cc-6785-4d2b-9461-36fe9dd89aa1', -- Moderna Museet Stockholm
  'a013765a-16ea-4af8-97ea-5a63d9c6d925', -- Spårvägsmuseet
  'afcf5fab-7625-4fda-98b9-3494599efa9c', -- Spritmuseum
  'c3821644-ca67-4cf0-928d-ad3adf0de77a', -- Scenkonstmuseet
  'ff81d6bf-26b9-4bc6-9050-a60ca7ca96e9'  -- Vasa Museum
);

update public.locations set category = 'landmark' where id in (
  '59a9b4c2-efd8-4119-9b2b-690e320ec33a', -- 8 House
  '46055bc2-7a10-4d9f-b730-769c4a1e9f96', -- Amalienborg
  'c35de945-461f-4e3a-84f2-e6757f130936', -- The Little Mermaid
  'c9a66359-adbf-42be-92ca-82f27626087b', -- Rentemestervej (mural)
  'dd3f50fc-a2c6-4e13-8078-87077fc2e19e', -- Turning Torso
  '6f6157d2-358a-4111-af85-750917f73d53', -- Davidshallsgatan 10 (mural)
  '511c1904-a3a1-4c6f-a023-e3bb75c4b647', -- Davidshallsgatan 24 (mural)
  '25977001-ad3e-4ca5-8579-f81db3e1c770', -- Grynbodagatan 9 (mural)
  '5e7fe205-6709-410f-af3e-a1413ee970b9', -- Södra Skolgatan (mural)
  'c6a52978-4346-431c-be10-3d3cc6ef7fc5', -- Stenhuggaregatan (mural)
  '15a37f04-9988-4e09-8690-cbb9cc969078', -- Hallgrímskirkja
  'b62e325d-f017-4c2a-b6ce-907b975da0a4', -- Harpa
  'e6ddf80d-5329-48a8-8439-f5392e49fc6a', -- Sólfar Sun Voyager
  'f866e464-36ad-4ed0-b6e3-5d99e7ce2304', -- Þúfa
  '11f2adc8-62bf-4f8e-bbd6-116a45e68892', -- Stockholm City Hall
  '3ada3888-f894-4bef-8835-31441383a03e', -- Stockholm Public Library
  'e8bab10e-cd1f-49ed-a508-a18e75618140', -- The Philosophical Research Society
  '801a4369-fcf1-435b-9a18-0ba1e50da050', -- Reykjanesviti (nature)
  'fafaa47d-3c61-4f16-adfa-9187240a34d0', -- Lilla Torg (area)
  'a7c5031c-d366-4cf3-8f7e-703fb648812f', -- Möllevångstorget (area)
  '5f0b98bd-d703-4880-a149-35ebf02d8e17', -- Nytorget Stockholm (area)
  '00720ae5-e864-4209-802d-868a1a42d802', -- Israels Plads (shopping)
  '35b6974b-036a-4d3b-bfc9-6a473950f454'  -- Frederiksberg Runddel (shopping)
);

update public.locations set category = 'park' where id in (
  '8904e42e-417e-441b-99e6-85a20401253b', -- Folkets Park Malmö (attraction)
  'eea9eb4c-4ac6-4b84-82d3-39d6e4cf6a1a', -- Griffith Park
  'c8754a2d-2b9f-4dc2-99c7-6ac19692d7d9', -- Slottsparken Malmö
  '5e9bdcbe-f16f-41e3-a52a-20164bc62c88', -- Humlegården
  '1f3fef76-9bed-4638-868e-f3f7fb9587b9', -- Tantolunden
  'e36d0fed-35ed-4465-96c8-3af22d5010ae', -- Vasaparken
  'c9311792-f7b1-4f4f-babb-eba608590951', -- Superkilen park (area)
  '7ea6ac33-3c50-4085-9a90-672437f8c65d', -- Björns Trädgård (area)
  '9857d20b-c02a-4e17-94ca-ddd221f8e5ed'  -- Assistens Cemetery (area)
);

update public.locations set category = 'attraction' where id in (
  '2be2fcf5-03e4-458f-acf3-e1cbd9c7d1c4', -- Laugardalslaug (city pool)
  'da04a7b6-0399-4c37-920f-8f3a45b856d5'  -- Sundhöllin (city pool)
);

update public.locations set category = 'shopping' where id in (
  '60cc41b7-cc9a-4466-b65d-b24a5d7d5d67'  -- Hornstulls Marknad (area)
);

-- Interim: these become shapes once the owner fetches them; until then a Neighborhood /
-- Street pin (the app's existing approximate-pin form).
update public.locations set category = 'neighborhood' where id in (
  '1bc0f269-2fc2-4e85-bdf9-4c625bdd4496', -- Freetown Christiania
  'b6b8fbcd-3c77-4512-8a5f-9a3d76240f1f', -- Nyboder
  '4c5fec54-beae-473a-8e5d-35cd589c4616', -- Gamla Stan
  '2233be13-919f-400a-8973-1ddff16ff5e3'  -- Fashion District
);
update public.locations set category = 'street' where id in (
  '1988f97f-e7d9-4a3c-a62e-2c3660a5e60e', -- Hornstull Strand
  '0d16f040-a889-4ccb-88c8-c90342a7ccc7', -- Klapparstígur
  'e72b5a07-7123-45cb-b910-f2edb395b457', -- Ravnsborggade
  '684e3dfb-bc02-49e6-9f25-bba3b8de1334', -- Sankt Eriksgatan
  '6d6087ad-ca7b-4f9f-9f91-bc1be87063ad'  -- Værnedamsvej (approx.)
);

-- 4. The tally, or nothing at all.
do $$
declare got text; want text :=
  'attraction:15,bar:4,cafe:16,landmark:23,museum:24,nature:2,neighborhood:4,park:9,restaurant:30,shopping:49,street:5,venue:11';
begin
  select string_agg(category || ':' || n, ',' order by category) into got
    from (select category, count(*) n from public.locations group by category) t;
  if got is distinct from want then
    raise exception 'categories migration: pin tally % <> %', got, want;
  end if;
  select string_agg(type || ':' || n, ',' order by type) into got
    from (select type, count(*) n from public.neighborhood_shapes group by type) t;
  if got is distinct from 'neighborhood:6,street:5' then
    raise exception 'categories migration: shape tally %', got;
  end if;
end $$;

drop table dup_pins;
