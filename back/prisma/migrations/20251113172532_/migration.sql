/*
  Warnings:

  - You are about to drop the column `description` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `authzVersion` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `hashedRefreshToken` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Permission" DROP COLUMN "description";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "authzVersion",
DROP COLUMN "hashedRefreshToken",
ADD COLUMN     "authorizationVersion" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "refreshToken" TEXT;
