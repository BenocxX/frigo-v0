<script lang="ts">
  import { buttonVariants } from '$lib/components/ui/button';
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input';
  import { startAuthentication } from '@simplewebauthn/browser';
  import { passkeyLoginSchema, type PasskeyLoginSchema } from './schema';
  import { type SuperValidated, type Infer, superForm, setError } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { goto } from '$app/navigation';

  export let data: SuperValidated<Infer<PasskeyLoginSchema>>;

  const form = superForm(data, {
    // Client-side only because we need to stay in the browser for the passkeys
    SPA: true,
    validators: zodClient(passkeyLoginSchema),
    async onUpdate({ form }) {
      if (form.valid) {
        const response = await fetch('/api/passkeys/generate', {
          method: 'POST',
          body: JSON.stringify(form.data),
        });
        const result = await response.json();

        try {
          const authentificationResponse = await startAuthentication({ optionsJSON: result });

          // TODO: Use sonner toast
          const verifyResponse = await fetch('/api/passkeys/verify', {
            method: 'POST',
            body: JSON.stringify({ ...authentificationResponse, ...form.data }),
          });

          const verifyResult = await verifyResponse.json();

          if (verifyResult.verified) {
            goto('/dashboard');
          }
        } catch (error) {
          console.log(error);
          setError(form, 'username', 'Une erreur est survenue');
        }
      }
    },
  });

  const { form: formData, enhance } = form;
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
    <a href="/login" class={buttonVariants({ variant: 'outline' })}>Utiliser un mot de passe</a>
  </div>
  <p class="my-4 text-center">
    Pas de compte?
    <a href="/register" class="link">Inscription</a>
  </p>
</form>
