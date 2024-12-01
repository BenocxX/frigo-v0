<script lang="ts">
  import * as Form from '$lib/components/ui/form/index.js';
  import { makeToastInstance } from '$lib/utils/toasts';
  import type { Product } from '@prisma/client';
  import { newTransactionSchema, type NewTransactionSchema } from './schema';
  import SuperDebug, { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { browser } from '$app/environment';
  import Button from '$lib/components/ui/button/button.svelte';

  type Props = {
    products: Product[];
    data: SuperValidated<Infer<NewTransactionSchema>>;
  };

  const { products, data }: Props = $props();

  const toastInstance = makeToastInstance();

  const form = superForm(data, {
    dataType: 'json',
    validators: zodClient(newTransactionSchema),
    onSubmit: () => toastInstance.loading('Achat en cours...'),
    onResult: ({ result }) => {
      if (toastInstance.isFailure(result)) {
        toastInstance.error("Erreur lors de l'achat.");
      } else {
        toastInstance.success('Achat complété avec succès.');
      }
    },
  });

  const { form: formData, enhance } = form;

  function addProduct(id: number) {
    const tp = $formData.transactionProducts.find((tp) => tp.productId === id);
    if (!tp) {
      $formData.transactionProducts = [
        ...$formData.transactionProducts,
        { productId: id, quantity: 1 },
      ];
      return;
    }

    tp.quantity += 1;

    const index = $formData.transactionProducts.findIndex((tp) => tp.productId === id);
    $formData.transactionProducts[index] = tp;
  }

  function removeProduct(id: number) {
    const tp = $formData.transactionProducts.find((tp) => tp.productId === id);
    if (!tp) return;

    tp.quantity -= 1;

    if (tp.quantity === 0) {
      $formData.transactionProducts = $formData.transactionProducts.filter(
        (tp) => tp.productId !== id
      );
      return;
    }

    const index = $formData.transactionProducts.findIndex((tp) => tp.productId === id);
    $formData.transactionProducts[index] = tp;
  }
</script>

<form method="POST" action="?/newTransaction" use:enhance>
  <Form.Fieldset {form} name="transactionProducts" class="space-y-0">
    <div class="mb-4">
      <Form.Legend class="text-base">Produits</Form.Legend>
      <Form.Description>Sélectionnez les produits que vous souhaitez acheter</Form.Description>
    </div>
    <div class="space-y-2">
      {#each products as product}
        <div class="space-y-1">
          <h4>{product.name} - <span>{product.price}$</span></h4>
          <Button onclick={() => addProduct(product.id)}>+</Button>
          {#if $formData.transactionProducts.find((tp) => tp.productId === product.id)}
            <Button onclick={() => removeProduct(product.id)}>-</Button>
          {/if}
        </div>
      {/each}
      <Form.FieldErrors />
    </div>
  </Form.Fieldset>
  <Form.Button>Acheter</Form.Button>
  {#if browser}
    <SuperDebug data={$formData} />
  {/if}
</form>
