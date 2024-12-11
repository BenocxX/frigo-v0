<script lang="ts">
  import { page } from '$app/stores';
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input';
  import { makeFormResultToast } from '$lib/utils/toasts';
  import { updateNamesSchema, type UpdateNamesSchema } from './schema';
  import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';

  type Props = {
    class?: string;
    data: SuperValidated<Infer<UpdateNamesSchema>>;
  };

  const { class: className, data }: Props = $props();

  const form = superForm(data, {
    validators: zodClient(updateNamesSchema),
    onResult: ({ result }) => {
      makeFormResultToast(result, {
        success: 'Modification complété avec succès.',
        error: 'Erreur lors de la modification.',
      });
    },
  });

  const { enhance } = form;
</script>

<form method="POST" action="?/updateNames" class={className} use:enhance>
  <div class="flex w-full flex-col gap-2 sm:flex-row">
    <Form.Field {form} name="username" class="flex-1">
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>Nom d'utilisateur</Form.Label>
          <Input {...props} bind:value={$page.data.user!.username} />
        {/snippet}
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>
    <Form.Field {form} name="firstname" class="flex-1">
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>Prénom</Form.Label>
          <Input {...props} bind:value={$page.data.user!.firstname} />
        {/snippet}
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>
    <Form.Field {form} name="lastname" class="flex-1">
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>Nom</Form.Label>
          <Input {...props} bind:value={$page.data.user!.lastname} />
        {/snippet}
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>
  </div>
  <Form.Button>Soumettre</Form.Button>
</form>
