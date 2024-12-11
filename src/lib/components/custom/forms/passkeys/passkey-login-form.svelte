<script lang="ts">
  import { buttonVariants } from '$lib/components/ui/button';
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input';
  import { passkeyLoginSchema, type PasskeyLoginSchema } from './schema';
  import { type SuperValidated, type Infer, superForm, setError } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { makeSearchParams } from '$lib/utils/search-params';
  import { goto } from '$app/navigation';
  import {
    PasskeyClientService,
    type PasskeyAuthGenerateActionResult,
  } from '$lib/client/service/PasskeyClientService';
  import { makeFormResultToast } from '$lib/utils/toasts';

  const { data }: { data: SuperValidated<Infer<PasskeyLoginSchema>> } = $props();

  const form = superForm(data, {
    validators: zodClient(passkeyLoginSchema),
    onResult: async ({ result }) => {
      makeFormResultToast(result, {
        success: 'Authentification complété avec succès.',
        error: "Erreur lors de l'authentification.",
      });

      if (result.type !== 'success') return;

      const { form, optionsJSON } = result.data as PasskeyAuthGenerateActionResult<typeof data>;

      const passkeyClientService = new PasskeyClientService();
      await passkeyClientService.authenticate('/api/passkeys/verify', {
        form,
        optionsJSON,
        onSuccess: () => goto('/dashboard'),
        onError: (error) => {
          console.log(error);
          setError(form, 'username', 'Une erreur est survenue');
        },
      });
    },
  });

  const { form: formData, delayed, enhance } = form;

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
    <Form.Button {delayed}>Connexion</Form.Button>
    <a href={`/login${searchParams}`} class={buttonVariants({ variant: 'outline' })}>
      Utiliser un mot de passe
    </a>
  </div>
  <p class="my-4 text-center">
    Pas de compte?
    <a href="/register" class="link">Inscription</a>
  </p>
</form>
