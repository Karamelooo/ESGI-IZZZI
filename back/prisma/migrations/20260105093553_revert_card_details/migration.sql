/*
  Warnings:

  - You are about to drop the column `cardBrand` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `cardLast4` on the `Subscription` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "cardBrand",
DROP COLUMN "cardLast4";
