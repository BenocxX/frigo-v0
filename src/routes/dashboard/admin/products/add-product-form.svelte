<script lang="ts">
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input';
  import { addProductSchema, type AddProductSchema } from './schema';
  import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';

  export let data: SuperValidated<Infer<AddProductSchema>>;

  const form = superForm(data, {
    validators: zodClient(addProductSchema),
  });

  const { form: formData } = form;
</script>

<form method="POST" action="?/create">
  <Form.Field {form} name="name">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Nom du produit</Form.Label>
        <Input {...props} bind:value={$formData.name} />
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
  <Form.Button class="mt-2">Soumettre</Form.Button>
</form>
