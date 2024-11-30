<script lang="ts">
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input';
  import { makeToastInstance } from '$lib/utils/toasts';
  import type { Product } from '@prisma/client';
  import { deleteProductSchema, type DeleteProductSchema } from './schema';
  import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { Button } from '$lib/components/ui/button';
  import Trash from 'lucide-svelte/icons/trash';

  type Props = {
    product: Product;
    data: SuperValidated<Infer<DeleteProductSchema>>;
  };

  const { product, data }: Props = $props();

  const toastInstance = makeToastInstance();

  const form = superForm(data, {
    id: `delete-product-${product.id}`,
    validators: zodClient(deleteProductSchema),
    onSubmit: () => toastInstance.loading('Suppression du produit en cours...'),
    onResult: ({ result }) => {
      if (toastInstance.isFailure(result)) {
        toastInstance.error('Erreur lors de la suppression du produit');
      } else {
        toastInstance.success('Produit supprimé avec succès');
      }
    },
  });

  const { form: formData, enhance } = form;
  $formData.productId = product.id;
</script>

<form method="POST" action="?/deleteProduct" use:enhance>
  <Form.Field {form} name="productId">
    <Form.Control>
      {#snippet children({ props })}
        <Input type="hidden" {...props} bind:value={$formData.productId} />
      {/snippet}
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>
  <Button size="icon-sm" variant="destructive" type="submit">
    <Trash />
  </Button>
</form>
