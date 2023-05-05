alter table "public"."users" alter column "type" drop not null;
alter table "public"."users" add column "type" text;
