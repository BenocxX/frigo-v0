<script lang="ts">
  import type { Passkey } from '@prisma/client';
  import * as Form from '$lib/components/ui/form/index.js';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { makeToastInstance } from '$lib/utils/toasts';
  import { renamePasskeySchema, type RenamePasskeySchema } from './schema';

  type Props = {
    passkey: Passkey;
    data: SuperValidated<Infer<RenamePasskeySchema>>;
    onDoneEditing: () => void;
  };

  const { passkey, data, onDoneEditing }: Props = $props();

  const toastInstance = makeToastInstance();

  const form = superForm(data, {
    id: `rename-passkey-${passkey.id}`,
    validators: zodClient(renamePasskeySchema),
    onSubmit: () => toastInstance.loading('Modification en cours...'),
    onResult: ({ result }) => {
      if (toastInstance.isFailure(result)) {
        toastInstance.error('Erreur lors de la modification.');
      } else {
        toastInstance.success('Passkey modifiée avec succès.');
        onDoneEditing();
      }
    },
  });

  const { form: formData, enhance } = form;

  $formData.passkeyId = passkey.id;
  $formData.name = passkey.name;
</script>

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
  <Button type="button" variant="secondary" class="mr-2" onclick={onDoneEditing}>Annuler</Button>
  <Button type="submit">Sauvegarder</Button>
</form>
