<script lang="ts">
  import { buttonVariants } from '$lib/components/ui/button';
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input';
  import { passkeyLoginSchema, type PasskeyLoginSchema } from './schema';
  import { type SuperValidated, type Infer, superForm, setError } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { makeSearchParams } from '$lib/utils/search-params';
  import type { PublicKeyCredentialRequestOptionsJSON } from '@simplewebauthn/types';
  import { startAuthentication } from '@simplewebauthn/browser';
  import { goto } from '$app/navigation';

  const { data }: { data: SuperValidated<Infer<PasskeyLoginSchema>> } = $props();

  const form = superForm(data, {
    validators: zodClient(passkeyLoginSchema),
    onResult: async ({ result }) => {
      if (result.type !== 'success') {
        return;
      }

      const { form, optionsJSON } = result.data as {
        form: typeof data;
        optionsJSON: PublicKeyCredentialRequestOptionsJSON;
      };

      try {
        const authentificationResponse = await startAuthentication({ optionsJSON });

        const verifyResponse = await fetch('/api/passkeys/verify', {
          method: 'POST',
          body: JSON.stringify({ ...authentificationResponse, ...$formData }),
        });

        const verifyResult = (await verifyResponse.json()) as { verified: boolean };

        if (verifyResult.verified) {
          goto('/dashboard');
        }
      } catch (error) {
        console.log(error);
        setError(form, 'username', 'Une erreur est survenue');
      }
    },
  });

  const { form: formData, enhance } = form;

  const { searchParams } = $derived(makeSearchParams($formData, ['username']));
</script>

<form method="POST" use:enhance>
  <Form.Field {form} name="username">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Username</Form.Label>
        <Input {...props} bind:value={$formData.username} />
      {/snippet}
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>
  <div class="mt-4 flex flex-col gap-2">
    <Form.Button>Connexion</Form.Button>
    <a href={`/login${searchParams}`} class={buttonVariants({ variant: 'outline' })}>
      Utiliser un mot de passe
    </a>
  </div>
  <p class="my-4 text-center">
    Pas de compte?
    <a href="/register" class="link">Inscription</a>
  </p>
</form>
