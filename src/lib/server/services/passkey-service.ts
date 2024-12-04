import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from '@simplewebauthn/server';
import type {
  AuthenticationResponseJSON,
  AuthenticatorTransportFuture,
  PublicKeyCredentialCreationOptionsJSON,
  RegistrationResponseJSON,
} from '@simplewebauthn/types';
import { db } from '../prisma';
import type { Passkey, User } from '@prisma/client';
import { env } from '$env/dynamic/private';

export class PasskeyService {
  public async generateRegistrationOptions(user: NonNullable<App.Locals['user']>) {
    const userPasskeys = await db.passkey.findMany({ where: { userId: user.id } });

    const options = await generateRegistrationOptions({
      rpName: env.PASSKEY_RP_NAME,
      rpID: env.PASSKEY_RP_ID,
      userName: user.username,
      // Don't prompt users for additional information about the authenticator
      // (Recommended for smoother UX)
      attestationType: 'none',
      // Prevent users from re-registering existing authenticators
      excludeCredentials: userPasskeys.map((passkey) => ({
        id: passkey.id,
        // Optional
        transports: passkey.transports as AuthenticatorTransportFuture[],
      })),
      // See "Guiding use of authenticators via authenticatorSelection" below
      authenticatorSelection: {
        // Defaults
        residentKey: 'preferred',
        userVerification: 'preferred',
        // Optional
        authenticatorAttachment: 'platform',
      },
    });

    // Save the options to the database so we can verify the user's response later
    await db.passkeyCredentialOptions.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        optionsJson: JSON.stringify(options),
      },
      update: { optionsJson: JSON.stringify(options) },
    });

    return options;
  }

  public async generateAuthenticationOptions(user: User) {
    const userPasskeys = await db.passkey.findMany({ where: { userId: user.id } });

    const options = await generateAuthenticationOptions({
      rpID: env.PASSKEY_RP_ID,
      // Require users to use a previously-registered authenticator
      allowCredentials: userPasskeys.map((passkey) => ({
        id: passkey.id,
        transports: passkey.transports as AuthenticatorTransportFuture[],
      })),
    });

    // Save the options to the database so we can verify the user's response later
    await db.passkeyCredentialOptions.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        optionsJson: JSON.stringify(options),
      },
      update: { optionsJson: JSON.stringify(options) },
    });

    return options;
  }

  public async verifyRegistrationResponse(
    response: RegistrationResponseJSON,
    currentOptions: PublicKeyCredentialCreationOptionsJSON,
    user: NonNullable<App.Locals['user']>,
    passkeyName: string
  ) {
    const verification = await verifyRegistrationResponse({
      response,
      expectedChallenge: currentOptions.challenge,
      expectedOrigin: env.PASSKEY_ORIGIN,
      expectedRPID: env.PASSKEY_RP_ID,
    });

    if (!verification.verified || !verification.registrationInfo) {
      return verification;
    }

    const { credential, credentialDeviceType, credentialBackedUp } = verification.registrationInfo;

    await db.passkey.create({
      data: {
        userId: user.id,
        // Created by `generateRegistrationOptions()`
        webauthnUserID: currentOptions.user.id,
        // A unique identifier for the credential
        id: credential.id,
        // The public key bytes, used for subsequent authentication signature verification
        publicKey: Buffer.from(credential.publicKey),
        // The number of times the authenticator has been used on this site so far
        counter: BigInt(credential.counter),
        // How the browser can talk with this credential's authenticator
        transports: credential.transports as string[],
        // Whether the passkey is single-device or multi-device
        deviceType: credentialDeviceType,
        // Whether the passkey has been backed up in some way
        backedUp: credentialBackedUp,
        name: passkeyName,
        lastUsed: new Date(),
      },
    });

    return verification;
  }

  public async verifyAuthenticationResponse(
    response: AuthenticationResponseJSON,
    currentOptions: PublicKeyCredentialCreationOptionsJSON,
    passkey: Passkey
  ) {
    const verification = await verifyAuthenticationResponse({
      response,
      expectedChallenge: currentOptions.challenge,
      expectedOrigin: env.PASSKEY_ORIGIN,
      expectedRPID: env.PASSKEY_RP_ID,
      credential: {
        id: passkey.id,
        publicKey: passkey.publicKey,
        counter: Number(passkey.counter),
        transports: passkey.transports as AuthenticatorTransportFuture[],
      },
    });

    if (!verification.verified) {
      return verification;
    }

    await db.passkey.update({
      where: { id: passkey.id },
      data: {
        counter: verification.authenticationInfo.newCounter,
        lastUsed: new Date(),
      },
    });

    return verification;
  }

  public async getCurrentAuthenticationOptions(user: NonNullable<App.Locals['user']>) {
    const passkeyCredentialOptions = await db.passkeyCredentialOptions.findFirst({
      where: { userId: user.id },
    });

    if (!passkeyCredentialOptions) {
      return;
    }

    const currentOptions: PublicKeyCredentialCreationOptionsJSON = JSON.parse(
      passkeyCredentialOptions.optionsJson
    );

    return currentOptions;
  }
}
