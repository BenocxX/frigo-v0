<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import { Button } from '$lib/components/ui/button';
  import type { Passkey } from '@prisma/client';
  import { startRegistration } from '@simplewebauthn/browser';
  import Pen from 'lucide-svelte/icons/pen';
  import Trash from 'lucide-svelte/icons/trash';
  import KeyRound from 'lucide-svelte/icons/key-round';
  import AlertDialogConfirm from '$lib/components/custom/ui/dialogs/alert-dialog-confirm.svelte';
  import { enhance } from '$app/forms';

  const { passkeys }: { passkeys: Passkey[] } = $props();

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
      <ul>
        {#each passkeys as passkey}
          {@render passkeyListItem(passkey)}
        {/each}
      </ul>
    {:else}
      <p class="text-center text-muted-foreground">Aucune passkey n'a été trouvée.</p>
    {/if}
    <Button variant="outline" size="lg" onclick={onNewPasskey}>
      Ajouter une passkey
      <KeyRound class="size-4" />
    </Button>
    <p class="text-sm text-destructive">{error}</p>
  </div>
</div>

{#snippet passkeyListItem(passkey: Passkey)}
  <li class="flex items-center justify-between">
    <div>
      <p>
        {passkey.name}
      </p>
      <p class="mt-1 text-sm text-muted-foreground">
        <!-- {{
          formatDate(passkey.createdAt, 'PPP', {
            locale: frCA,
          })
        }} -->
        | Dernière utilisation il y a
        <!-- {{
          formatDistance(new Date(), passkey.lastUsed ?? '', {
            locale: frCA,
          })
        }} -->
      </p>
    </div>
    <div class="flex items-center gap-2">
      <Button
        size="icon"
        variant="outline"
        onclick={() => {
          // isEditing = !isEditing;
          // editingName = passkey.name;
        }}
      >
        <Pen />
      </Button>
      <AlertDialogConfirm>
        {#snippet trigger({ props })}
          <Button {...props} size="icon" variant="destructive">
            <Trash />
          </Button>
        {/snippet}
        {#snippet title()}
          Êtes-vous sûr de vouloir supprimer cette passkey ?
        {/snippet}
        {#snippet description()}
          Supprimer cette passkey la rendra inutilisable, vous devrez utiliser un autre moyen pour
          vous connecter ou en générer une nouvelle. Cette action est irréversible.
        {/snippet}
        {#snippet action({ props })}
          <form method="POST" action="?/deletePasskey" use:enhance>
            <input type="hidden" name="passkeyId" value={passkey.id} />
            <Button {...props} type="submit" variant="destructive">
              Supprimer la passkey
              <Trash />
            </Button>
          </form>
        {/snippet}
      </AlertDialogConfirm>
    </div>
  </li>
{/snippet}
