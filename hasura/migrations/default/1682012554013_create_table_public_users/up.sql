CREATE TABLE "public"."users" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "email" text NOT NULL, "name" text NOT NULL, PRIMARY KEY ("id") , UNIQUE ("email"), UNIQUE ("id"));
CREATE EXTENSION IF NOT EXISTS pgcrypto;
