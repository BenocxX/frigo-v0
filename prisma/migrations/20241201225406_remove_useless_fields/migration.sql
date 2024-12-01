/*
  Warnings:

  - You are about to drop the column `quantity` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `TransactionProduct` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "quantity";

-- AlterTable
ALTER TABLE "TransactionProduct" DROP COLUMN "createdAt";
