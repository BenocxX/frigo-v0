<script lang="ts">
  import * as Form from '$lib/components/ui/form/index.js';
  import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
  import { deletePasskeySchema, type DeletePasskeySchema } from './schema';
  import type { Passkey } from '@prisma/client';
  import { makeFormResultToast } from '$lib/utils/toasts';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { Input } from '$lib/components/ui/input';
  import { type ButtonProps } from '$lib/components/ui/button';
  import Trash from 'lucide-svelte/icons/trash';

  type Props = {
    passkey: Passkey;
    data: SuperValidated<Infer<DeletePasskeySchema>>;
    buttonProps: ButtonProps;
  };

  const { passkey, data, buttonProps }: Props = $props();

  const form = superForm(data, {
    id: `delete-passkey-${passkey.id}`,
    validators: zodClient(deletePasskeySchema),
    onResult: ({ result }) => {
      makeFormResultToast(result, {
        success: 'Passkey suprimée avec succès.',
        error: 'Erreur lors de la suppression.',
      });
    },
  });

  const { form: formData, delayed, enhance } = form;

  $formData.passkeyId = passkey.id;
</script>

<form method="POST" action="?/deletePasskey" class="w-full sm:w-max" use:enhance>
  <Form.Field {form} name="passkeyId">
    <Form.Control>
      {#snippet children({ props })}
        <Input type="hidden" {...props} bind:value={$formData.passkeyId} />
      {/snippet}
    </Form.Control>
  </Form.Field>
  <Form.Button {...buttonProps} {delayed} class="w-full" variant="destructive">
    Supprimer la passkey
    <Trash />
  </Form.Button>
</form>
