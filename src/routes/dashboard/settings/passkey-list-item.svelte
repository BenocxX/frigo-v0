<script lang="ts">
  import type { Passkey } from '@prisma/client';
  import * as Form from '$lib/components/ui/form/index.js';
  import Pen from 'lucide-svelte/icons/pen';
  import Trash from 'lucide-svelte/icons/trash';
  import AlertDialogConfirm from '$lib/components/custom/ui/dialogs/alert-dialog-confirm.svelte';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
  import { renamePasskeySchema, type RenamePasskeySchema } from '$lib/schemas/passkey';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { makeToastInstance } from '$lib/utils/toasts';
  import FormErrors from '$lib/components/custom/ui/form/form-errors.svelte';

  type Props = {
    passkey: Passkey;
    renamePasskeyForm: SuperValidated<Infer<RenamePasskeySchema>>;
  };

  const { passkey, renamePasskeyForm }: Props = $props();

  const toastInstance = makeToastInstance();

  const form = superForm(renamePasskeyForm, {
    id: `rename-passkey-${passkey.id}`,
    validators: zodClient(renamePasskeySchema),
    onSubmit: () => toastInstance.loading('Modification en cours...'),
    onResult: ({ result }) => {
      if (toastInstance.isFailure(result)) {
        toastInstance.error('Erreur lors de la modification.');
      } else {
        toastInstance.success('Passkey modifié avec succès.');
        isEditing = false;
      }
    },
  });

  const { form: formData, enhance } = form;

  $formData.passkeyId = passkey.id;
  $formData.name = passkey.name;

  let isEditing = $state(false);
</script>

<FormErrors {form} />
<li class="flex items-center justify-between">
  {#if isEditing}
    <form method="POST" action="?/renamePasskey" class="flex flex-1" use:enhance>
      <Form.Field {form} name="passkeyId">
        <Form.Control>
          {#snippet children({ props })}
            <Input type="hidden" {...props} bind:value={$formData.passkeyId} />
          {/snippet}
        </Form.Control>
      </Form.Field>
      <Form.Field {form} name="name" class="mr-2 flex-1">
        <Form.Control>
          {#snippet children({ props })}
            <Input type="text" {...props} bind:value={$formData.name} />
          {/snippet}
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
      <Button type="button" variant="secondary" class="mr-2" onclick={() => (isEditing = false)}>
        Annuler
      </Button>
      <Button type="submit">Sauvegarder</Button>
    </form>
  {:else}
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
  {/if}
  <div class="flex items-center gap-2">
    {#if !isEditing}
      <Button size="icon" variant="outline" onclick={() => (isEditing = true)}>
        <Pen />
      </Button>
      {@render deleteButton()}
    {/if}
  </div>
</li>

{#snippet deleteButton()}
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
      Supprimer cette passkey la rendra inutilisable, vous devrez utiliser un autre moyen pour vous
      connecter ou en générer une nouvelle. Cette action est irréversible.
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
{/snippet}
