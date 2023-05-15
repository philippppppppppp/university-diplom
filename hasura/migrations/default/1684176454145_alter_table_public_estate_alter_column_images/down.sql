alter table "public"."estate" alter column "images" drop not null;
ALTER TABLE "public"."estate" ALTER COLUMN "images" drop default;
ALTER TABLE "public"."estate" ALTER COLUMN "images" TYPE ARRAY;
