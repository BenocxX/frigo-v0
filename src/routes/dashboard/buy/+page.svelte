<script lang="ts">
  import * as Form from '$lib/components/ui/form/index.js';
  import { superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { newTransactionSchema } from '$lib/components/custom/forms/transactions/schema.js';
  import { makeFormResultToast } from '$lib/utils/toasts.js';
  import type { Product } from '@prisma/client';
  import Plus from 'lucide-svelte/icons/plus';
  import Minus from 'lucide-svelte/icons/minus';
  import Trash from 'lucide-svelte/icons/trash';
  import { TableCell, TableHead } from '$lib/components/ui/table/index.js';
  import Separator from '$lib/components/ui/separator/separator.svelte';
  import { fade } from 'svelte/transition';
  import { Button } from '$lib/components/ui/button';
  import { formatCurrency } from '$lib/utils/format.js';
  import SimpleTable from '$lib/components/custom/ui/tables/simple-table.svelte';

  const { data } = $props();

  const form = superForm(data.newTransactionForm, {
    dataType: 'json',
    validators: zodClient(newTransactionSchema),
    onResult: ({ result }) => {
      makeFormResultToast(result, {
        success: 'Achat complété avec succès.',
        error: "Erreur lors de l'achat.",
      });
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

  function deleteProduct(id: number) {
    $formData.transactionProducts = $formData.transactionProducts.filter(
      (tp) => tp.productId !== id
    );
  }
</script>

<form method="POST" action="?/newTransaction" class="flex flex-col gap-6" use:enhance>
  <Form.Fieldset {form} name="transactionProducts" class="space-y-0">
    <div class="mb-8">
      <Form.Legend class="mb-2 text-4xl">Acheter des produits</Form.Legend>
      <Form.Description class="text-lg"
        >Sélectionnez les produits que vous souhaitez acheter.</Form.Description
      >
    </div>
    <ul role="list" class="mb-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {#each data.products as product}
        {@render addProductButton(product)}
      {/each}
    </ul>
    <Form.FieldErrors />
  </Form.Fieldset>
  {#if $formData.transactionProducts.length > 0}
    <div transition:fade={{ duration: 250 }} class="flex flex-col gap-4">
      <Separator />
      <h3 class="text-xl">Produits dans le panier</h3>
      <SimpleTable rows={$formData.transactionProducts}>
        {#snippet tableHead()}
          <TableHead class="w-full whitespace-nowrap">Nom</TableHead>
          <TableHead class="text-right">Quantité</TableHead>
          <TableHead class="text-right">Prix</TableHead>
          <TableHead class="text-right">Supprimer</TableHead>
        {/snippet}
        {#snippet tableRow({ row })}
          {@const product = data.products.find((p) => p.id === row.productId)!}
          <TableCell class="font-medium">{product?.name}</TableCell>
          <TableCell class="text-right">{row.quantity}</TableCell>
          <TableCell class="text-right">{formatCurrency(product.price * row.quantity)}</TableCell>
          <TableCell class="flex w-max items-center gap-2">
            <Button size="icon" variant="secondary" onclick={() => addProduct(row.productId)}>
              <Plus />
            </Button>
            <Button size="icon" variant="secondary" onclick={() => removeProduct(row.productId)}>
              <Minus />
            </Button>
            <Button size="icon" variant="secondary" onclick={() => deleteProduct(row.productId)}>
              <Trash />
            </Button>
          </TableCell>
        {/snippet}
      </SimpleTable>
      <Form.Button class="w-max">Acheter</Form.Button>
    </div>
  {/if}
</form>

{#snippet addProductButton(product: Product)}
  {@const quantity =
    $formData.transactionProducts.find((tp) => tp.productId === product.id)?.quantity ?? 0}

  <li class="col-span-1 rounded-lg bg-card shadow">
    <div class="flex w-full items-center justify-between space-x-6 p-6">
      <div class="flex-1 truncate">
        <div class="flex items-center space-x-3">
          <h3 class="truncate text-sm font-medium text-card-foreground">{product.name}</h3>
          <!-- <span
            class="inline-flex shrink-0 items-center rounded-full bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20"
          >
            Admin
          </span> -->
        </div>
        <!-- <p class="mt-1 truncate text-sm text-gray-500">Regional Paradigm Technician</p> -->
      </div>
      <!-- <img
        class="size-10 shrink-0 rounded-full dark:bg-muted"
        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60"
        alt=""
      /> -->
    </div>
    <div class="flex border-t">
      <div
        class="flex flex-1 rounded-bl-lg border-r text-green-600 transition-all only:rounded-br-lg only:border-r-0 hover:bg-green-100 hover:text-green-700 dark:hover:bg-green-950/40 dark:hover:text-green-500"
      >
        <button
          type="button"
          onclick={() => addProduct(product.id)}
          class="flex flex-1 items-center justify-center gap-2 py-4"
        >
          <Plus />
          Ajouter
          {#if quantity > 0}
            <span>({quantity})</span>
          {/if}
        </button>
      </div>
      {#if quantity > 0}
        <div
          class={'flex flex-1 rounded-br-lg border-r text-red-600 transition-colors hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-950/40 dark:hover:text-red-500'}
        >
          <button
            type="button"
            onclick={() => removeProduct(product.id)}
            class="flex flex-1 items-center justify-center gap-2 py-4"
          >
            <Minus />
            Retirer
          </button>
        </div>
      {/if}
    </div>
  </li>
{/snippet}
