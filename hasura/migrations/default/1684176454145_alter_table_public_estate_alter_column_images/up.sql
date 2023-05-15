ALTER TABLE "public"."estate" ALTER COLUMN "images" TYPE text[];
alter table "public"."estate" alter column "images" set default '{}';
alter table "public"."estate" alter column "images" set not null;
