-- CreateTable
CREATE TABLE "Passkey" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "publicKey" BYTEA NOT NULL,
    "webauthnUserID" TEXT NOT NULL,
    "counter" BIGINT NOT NULL,
    "deviceType" TEXT NOT NULL,
    "backedUp" BOOLEAN NOT NULL,
    "transports" TEXT[],
    "name" TEXT NOT NULL,
    "lastUsed" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Passkey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasskeyCredentialOptions" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "optionsJson" TEXT NOT NULL,

    CONSTRAINT "PasskeyCredentialOptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Passkey_id_key" ON "Passkey"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Passkey_webauthnUserID_key" ON "Passkey"("webauthnUserID");

-- CreateIndex
CREATE INDEX "passkey_id_index" ON "Passkey"("id");

-- CreateIndex
CREATE INDEX "passkey_user_id_index" ON "Passkey"("userId");

-- CreateIndex
CREATE INDEX "passkey_webauthn_user_id_index" ON "Passkey"("webauthnUserID");

-- CreateIndex
CREATE UNIQUE INDEX "PasskeyCredentialOptions_userId_key" ON "PasskeyCredentialOptions"("userId");

-- AddForeignKey
ALTER TABLE "Passkey" ADD CONSTRAINT "Passkey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasskeyCredentialOptions" ADD CONSTRAINT "PasskeyCredentialOptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
