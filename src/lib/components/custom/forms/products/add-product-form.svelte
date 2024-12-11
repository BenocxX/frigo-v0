<script lang="ts">
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input';
  import { makeFormResultToast } from '$lib/utils/toasts';
  import { addProductSchema, type AddProductSchema } from './schema';
  import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';

  type Props = {
    data: SuperValidated<Infer<AddProductSchema>>;
  };

  const { data }: Props = $props();

  const form = superForm(data, {
    validators: zodClient(addProductSchema),
    onResult: ({ result }) => {
      makeFormResultToast(result, {
        success: 'Ajout du produit complété avec succès.',
        error: "Erreur lors de l'ajout du produit.",
      });
    },
  });

  const { form: formData, delayed, enhance } = form;
</script>

<form method="POST" action="?/create" use:enhance>
  <Form.Field {form} name="name">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Nom du produit</Form.Label>
        <Input {...props} bind:value={$formData.name} />
      {/snippet}
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Field {form} name="description">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Courte description du produit</Form.Label>
        <Input {...props} bind:value={$formData.description} />
      {/snippet}
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Field {form} name="imageURL">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>URL d'une image</Form.Label>
        <Input {...props} bind:value={$formData.imageURL} />
      {/snippet}
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Field {form} name="price">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Prix</Form.Label>
        <Input {...props} bind:value={$formData.price} />
      {/snippet}
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Button {delayed} class="mt-2">Soumettre</Form.Button>
</form>
