/*
  Warnings:

  - You are about to drop the column `price` on the `CryptoPriceCache` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `CryptoPriceCache` table. All the data in the column will be lost.
  - Added the required column `btcPrice` to the `CryptoPriceCache` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ethPrice` to the `CryptoPriceCache` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expiresAt` to the `CryptoPriceCache` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CryptoPriceCache" DROP COLUMN "price",
DROP COLUMN "updatedAt",
ADD COLUMN     "btcPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "ethPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL;
