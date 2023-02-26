CREATE TABLE "user" (
  "id" SERIAL NOT NULL PRIMARY KEY,
  "username" character varying  NOT NULL UNIQUE,
  "password" character varying NOT NULL,
  "email" character varying
);
CREATE TABLE "bank" (
  "id" SERIAL NOT NULL PRIMARY KEY,
  "name" character varying  NOT NULL,
  "balance" integer NOT NULL DEFAULT 0,
  "userId" integer NOT NULL REFERENCES public.user(id)
);
CREATE TABLE "category" (
  "id" SERIAL NOT NULL PRIMARY KEY,
  "name" character varying  NOT NULL
);
CREATE TYPE transaction_enum AS ENUM ('profitable', 'consumable');
CREATE TABLE "transaction" (
  "id" SERIAL NOT NULL PRIMARY KEY,
  "amount" integer NOT NULL,
  "type" transaction_enum NOT NULL,
  "createdAt" character varying NOT NULL,
  "bankId" integer NOT NULL REFERENCES public.bank(id),
  "userId" integer NOT NULL REFERENCES public.user(id)
);
CREATE TABLE "statistic" (
  "id" SERIAL NOT NULL PRIMARY KEY,
  "transactionId" integer NOT NULL REFERENCES public.transaction(id) ON DELETE CASCADE,
  "categoryId" integer NOT NULL REFERENCES public.category(id)
);