/*
  Warnings:

  - You are about to drop the column `total` on the `TransactionProduct` table. All the data in the column will be lost.
  - Added the required column `total` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "total" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "TransactionProduct" DROP COLUMN "total";
