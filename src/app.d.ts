// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  namespace App {
    interface Locals {
      user: import('$lib/server/services/session-service').SessionValidationResult['user'];
      session: import('$lib/server/services/session-service').SessionValidationResult['session'];
    }

    interface PageData {
      user: App.Locals['user'];
    }

    type PasskeyLoginData = {
      username: string;
    };
  }
}

export {};
