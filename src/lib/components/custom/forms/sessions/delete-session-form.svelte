<script lang="ts">
  import * as Form from '$lib/components/ui/form/index.js';
  import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
  import { deleteSessionSchema, type DeleteSessionSchema } from './schema';
  import type { Session } from '@prisma/client';
  import { makeToastInstance } from '$lib/utils/toasts';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { Input } from '$lib/components/ui/input';
  import { Button, type ButtonProps } from '$lib/components/ui/button';
  import Trash from 'lucide-svelte/icons/trash';

  type Props = {
    session: Session;
    data: SuperValidated<Infer<DeleteSessionSchema>>;
    buttonProps: ButtonProps;
  };

  const { session, data, buttonProps }: Props = $props();

  const toastInstance = makeToastInstance();

  const form = superForm(data, {
    id: `delete-session-${session.id}`,
    validators: zodClient(deleteSessionSchema),
    onSubmit: () => toastInstance.loading('Suppression en cours...'),
    onResult: ({ result }) => {
      if (toastInstance.isFailure(result)) {
        toastInstance.error('Erreur lors de la suppression.');
      } else {
        toastInstance.success('Session supprimée avec succès.');
      }
    },
  });

  const { form: formData, enhance } = form;

  $formData.sessionId = session.id;
</script>

<form method="POST" action="?/deleteSession" class="w-full sm:w-max" use:enhance>
  <Form.Field {form} name="sessionId">
    <Form.Control>
      {#snippet children({ props })}
        <Input type="hidden" {...props} bind:value={$formData.sessionId} />
      {/snippet}
    </Form.Control>
  </Form.Field>
  <Button {...buttonProps} type="submit" class="w-full" variant="destructive">
    Supprimer la session
    <Trash />
  </Button>
</form>
