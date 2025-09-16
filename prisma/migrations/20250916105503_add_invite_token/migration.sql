/*
  Warnings:

  - A unique constraint covering the columns `[inviteToken]` on the table `campaigns` will be added. If there are existing duplicate values, this will fail.
  - The required column `inviteToken` was added to the `campaigns` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "public"."campaigns" ADD COLUMN     "inviteToken" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "campaigns_inviteToken_key" ON "public"."campaigns"("inviteToken");
