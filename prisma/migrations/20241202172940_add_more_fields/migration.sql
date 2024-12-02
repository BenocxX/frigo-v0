/*
  Warnings:

  - Added the required column `description` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageURL` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total` to the `TransactionProduct` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "imageURL" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TransactionProduct" ADD COLUMN     "total" DOUBLE PRECISION NOT NULL;
