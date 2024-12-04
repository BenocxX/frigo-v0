/*
  Warnings:

  - A unique constraint covering the columns `[publicId]` on the table `Session` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `publicId` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "publicId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Session_publicId_key" ON "Session"("publicId");
