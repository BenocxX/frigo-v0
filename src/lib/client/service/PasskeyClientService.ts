import type { PasskeyLoginData } from '$lib/components/custom/forms/passkeys/schema';
import { startAuthentication } from '@simplewebauthn/browser';
import type {
  AuthenticationResponseJSON,
  PublicKeyCredentialRequestOptionsJSON,
} from '@simplewebauthn/types';
import type { SuperValidated } from 'sveltekit-superforms';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PasskeyAuthGenerateActionResult<T extends SuperValidated<any>> = {
  form: T;
  optionsJSON: PublicKeyCredentialRequestOptionsJSON;
};

export type PasskeyAuthVerifyBody = {
  authentificationResponse: AuthenticationResponseJSON;
  loginData: PasskeyLoginData;
};

type AuthenticateParams = {
  optionsJSON: PublicKeyCredentialRequestOptionsJSON;
  form: SuperValidated<PasskeyLoginData>;
  onSuccess: () => void;
  onError: (error: unknown) => void;
};

export class PasskeyClientService {
  public async authenticate(
    verifyRoute: string,
    { optionsJSON, form, onSuccess, onError }: AuthenticateParams
  ) {
    try {
      const authentificationResponse = await startAuthentication({ optionsJSON });

      const verifyResponse = await fetch(verifyRoute, {
        method: 'POST',
        body: JSON.stringify({ authentificationResponse, loginData: form.data }),
      });

      const verifyResult = (await verifyResponse.json()) as { verified: boolean };

      if (verifyResult.verified) {
        onSuccess();
      } else {
        onError(new Error('Authentication failed'));
      }
    } catch (error) {
      onError(error);
    }
  }
}
