alter table "public"."users" alter column "favorites" drop not null;
alter table "public"."users" add column "favorites" _uuid;
