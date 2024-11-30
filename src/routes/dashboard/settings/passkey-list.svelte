<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import { Button } from '$lib/components/ui/button';
  import type { Passkey } from '@prisma/client';
  import { startRegistration } from '@simplewebauthn/browser';
  import KeyRound from 'lucide-svelte/icons/key-round';
  import PasskeyListItem from './passkey-list-item.svelte';
  import type { Infer, SuperValidated } from 'sveltekit-superforms';
  import type {
    DeletePasskeySchema,
    RenamePasskeySchema,
  } from '$lib/components/custom/forms/passkeys/schema';
  import { Separator } from '$lib/components/ui/separator';

  type Props = {
    passkeys: Passkey[];
    forms: {
      delete: SuperValidated<Infer<DeletePasskeySchema>>;
      rename: SuperValidated<Infer<RenamePasskeySchema>>;
    };
  };

  const { passkeys, forms }: Props = $props();

  let error = $state('');

  async function onNewPasskey() {
    const response = await fetch('/api/dashboard/passkeys/register', { method: 'POST' });
    const result = await response.json();

    if (!result) {
      error = 'Une erreur est survenue lors de la génération de la passkey.';
    }

    const attResp = await startRegistration({ optionsJSON: result });

    // TODO: Use sonner toast
    const verificationResponse = await fetch('/api/dashboard/passkeys/verify', {
      method: 'POST',
      body: JSON.stringify({
        passkeyName: `Passkey #${(passkeys.length ?? 0) + 1}`,
        attResp,
      }),
    });

    const verificationResult = await verificationResponse.json();

    if (verificationResult?.verified) {
      invalidateAll();
    } else {
      error = 'Une erreur est survenue lors de la tentative de génération de la passkey.';
    }
  }
</script>

<div class="grid grid-cols-1 gap-x-8 gap-y-10 border-b pb-12 md:grid-cols-3">
  <div>
    <h2 class="font-semibold">Passkeys</h2>
    <p class="mt-1 text-sm/6 text-muted-foreground">
      Les passkeys sont des clés de sécurité qui vous permettent de vous connecter à votre compte
      sans avoir à saisir votre mot de passe.
    </p>
  </div>
  <div class="flex flex-col gap-4 md:col-span-2">
    {#if passkeys.length > 0}
      <ul class="space-y-4">
        {#each passkeys as passkey, index}
          <PasskeyListItem {forms} {passkey} />
          {#if index < passkeys.length - 1}
            <Separator />
          {/if}
        {/each}
      </ul>
    {:else}
      <p class="text-center text-muted-foreground">Aucune passkey n'a été trouvée.</p>
    {/if}
    <Button variant="outline" size="lg" class="mt-2" onclick={onNewPasskey}>
      Ajouter une passkey
      <KeyRound class="size-4" />
    </Button>
    <p class="text-sm text-destructive">{error}</p>
  </div>
</div>
