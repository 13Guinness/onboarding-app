-- Tie each client row to the Clerk user who created it.
-- Email stays contact info and is no longer an identity key.
ALTER TABLE "Client" ADD COLUMN "clerkUserId" TEXT;

-- Rows saved before this change have no login id. Stamp them with their own
-- id so the column can be required. Those values are not Clerk user ids, so
-- the old rows are not readable by a signed-in user.
UPDATE "Client" SET "clerkUserId" = "id" WHERE "clerkUserId" IS NULL;

ALTER TABLE "Client" ALTER COLUMN "clerkUserId" SET NOT NULL;

CREATE UNIQUE INDEX "Client_clerkUserId_key" ON "Client"("clerkUserId");

DROP INDEX "Client_email_key";
