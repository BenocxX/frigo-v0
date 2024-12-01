<script lang="ts">
  import type { Passkey } from '@prisma/client';
  import Pen from 'lucide-svelte/icons/pen';
  import Trash from 'lucide-svelte/icons/trash';
  import AlertDialogConfirm from '$lib/components/custom/ui/dialogs/alert-dialog-confirm.svelte';
  import { Button } from '$lib/components/ui/button';
  import { type Infer, type SuperValidated } from 'sveltekit-superforms';
  import DeletePasskeyForm from '$lib/components/custom/forms/passkeys/delete-passkey-form.svelte';
  import type {
    DeletePasskeySchema,
    RenamePasskeySchema,
  } from '$lib/components/custom/forms/passkeys/schema';
  import RenamePasskeyForm from '$lib/components/custom/forms/passkeys/rename-passkey-form.svelte';
  import { formatDate, formatDistance } from 'date-fns';
  import { frCA } from 'date-fns/locale';

  type Props = {
    passkey: Passkey;
    forms: {
      delete: SuperValidated<Infer<DeletePasskeySchema>>;
      rename: SuperValidated<Infer<RenamePasskeySchema>>;
    };
  };

  const { passkey, forms }: Props = $props();

  let isEditing = $state(false);
</script>

<li class="flex items-center justify-between">
  {#if isEditing}
    <RenamePasskeyForm {passkey} data={forms.rename} onDoneEditing={() => (isEditing = false)} />
  {:else}
    <div>
      <p>
        {passkey.name}
      </p>
      <p class="mt-1 flex flex-col gap-1 text-sm text-muted-foreground sm:flex-row sm:items-center">
        <span>
          Créée le {formatDate(passkey.createdAt, 'PPP', {
            locale: frCA,
          })}
        </span>
        <span class="hidden sm:inline">|</span>
        <span>
          Dernière utilisation il y a
          {formatDistance(new Date(), passkey.lastUsed ?? '', {
            locale: frCA,
          })}
        </span>
      </p>
    </div>
  {/if}
  <div class="flex items-center gap-2">
    {#if !isEditing}
      <Button size="icon" variant="outline" onclick={() => (isEditing = true)}>
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
          <DeletePasskeyForm {passkey} data={forms.delete} buttonProps={props} />
        {/snippet}
      </AlertDialogConfirm>
    {/if}
  </div>
</li>
