-- CreateTable
CREATE TABLE "CryptoPriceCache" (
    "id" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CryptoPriceCache_pkey" PRIMARY KEY ("id")
);
