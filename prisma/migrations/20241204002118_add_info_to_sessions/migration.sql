/*
  Warnings:

  - Added the required column `lastUsed` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "lastUsed" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;
