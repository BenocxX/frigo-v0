<script lang="ts">
  import FormErrors from '$lib/components/custom/ui/form/form-errors.svelte';
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input';
  import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { makeFormResultToast } from '$lib/utils/toasts';
  import { resetPasswordSchema, type ResetPasswordSchema } from './schema';

  type Props = {
    class?: string;
    data: SuperValidated<Infer<ResetPasswordSchema>>;
  };

  const { class: className, data }: Props = $props();

  const form = superForm(data, {
    validators: zodClient(resetPasswordSchema),
    onResult: ({ result }) => {
      makeFormResultToast(result, {
        success: 'Mot de passe modifié avec succès.',
        error: 'Erreur lors de la modification.',
      });
    },
  });

  const { form: formData, delayed, enhance } = form;
</script>

<form method="POST" action="?/resetPassword" class={className} use:enhance>
  <FormErrors {form} />
  <Form.Field {form} name="oldPassword">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Ancien mot de passe</Form.Label>
        <Input type="password" {...props} bind:value={$formData.oldPassword} />
      {/snippet}
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Field {form} name="newPassword">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Nouveau mot de passe</Form.Label>
        <Input type="password" {...props} bind:value={$formData.newPassword} />
      {/snippet}
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Field {form} name="confirmNewPassword">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Confirmation du nouveau mot de passe</Form.Label>
        <Input type="password" {...props} bind:value={$formData.confirmNewPassword} />
      {/snippet}
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Button {delayed} class="ml-auto mt-2 w-full sm:w-max">Mettre à jour</Form.Button>
</form>
