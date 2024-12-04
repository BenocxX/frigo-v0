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
  import { formatDatePPP, formatTimeBetween } from '$lib/utils/format';
  import Badge from '../../ui/badges/badge.svelte';

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
      <div class="mt-1 flex flex-wrap gap-1.5">
        <Badge>Créée le {formatDatePPP(passkey.createdAt)}</Badge>
        <Badge>
          Dernière utilisation il y a {formatTimeBetween(passkey.lastUsed ?? new Date())}
        </Badge>
      </div>
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
