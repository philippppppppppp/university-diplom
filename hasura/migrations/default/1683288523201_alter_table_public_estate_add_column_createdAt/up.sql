alter table "public"."estate" add column "createdAt" timestamptz
 not null default now();
