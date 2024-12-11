/*
  Warnings:

  - Added the required column `paymentMethod` to the `Receipt` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Receipt" ADD COLUMN     "paymentMethod" TEXT NOT NULL;
