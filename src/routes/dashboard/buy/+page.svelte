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
  import * as Table from '$lib/components/ui/table/index.js';
  import Separator from '$lib/components/ui/separator/separator.svelte';
  import { fade } from 'svelte/transition';
  import { Button } from '$lib/components/ui/button';
  import { formatCurrency } from '$lib/utils/format.js';
  import SimpleTable from '$lib/components/custom/ui/tables/simple-table.svelte';
  import PageTitle from '$lib/components/custom/structure/page-title.svelte';

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

  function calculateTotal() {
    return $formData.transactionProducts.reduce((acc, tp) => {
      const product = data.products.find((p) => p.id === tp.productId)!;
      return acc + product.price * tp.quantity;
    }, 0);
  }
</script>

<PageTitle
  title="Acheter des produits"
  subtitle="Sélectionnez les produits que vous souhaitez acheter"
/>
<form method="POST" action="?/newTransaction" class="flex flex-col gap-6" use:enhance>
  <Form.Fieldset {form} name="transactionProducts" class="space-y-0">
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
      <SimpleTable dataset={$formData.transactionProducts}>
        {#snippet headRow()}
          <Table.Head class="w-full whitespace-nowrap">Nom</Table.Head>
          <Table.Head class="text-right">Quantité</Table.Head>
          <Table.Head class="text-right">Prix</Table.Head>
          <Table.Head class="text-right">Actions</Table.Head>
        {/snippet}
        {#snippet dataRow({ row })}
          {@const product = data.products.find((p) => p.id === row.productId)!}
          <Table.Cell class="font-medium">{product?.name}</Table.Cell>
          <Table.Cell class="text-right">{row.quantity}</Table.Cell>
          <Table.Cell class="text-right">
            {formatCurrency(product.price * row.quantity)}
          </Table.Cell>
          <Table.Cell class="flex w-max items-center gap-2">
            <Button size="icon" variant="secondary" onclick={() => addProduct(row.productId)}>
              <Plus />
            </Button>
            <Button size="icon" variant="secondary" onclick={() => removeProduct(row.productId)}>
              <Minus />
            </Button>
            <Button size="icon" variant="secondary" onclick={() => deleteProduct(row.productId)}>
              <Trash />
            </Button>
          </Table.Cell>
        {/snippet}
        {#snippet finalRowChild()}
          <Table.Row class="text-muted-foreground hover:bg-transparent dark:hover:bg-transparent">
            <Table.Cell>Total</Table.Cell>
            <Table.Cell class="text-right"></Table.Cell>
            <Table.Cell class="text-right">{formatCurrency(calculateTotal())}</Table.Cell>
            <Table.Cell>
              <Form.Button class="w-full">Acheter</Form.Button>
            </Table.Cell>
          </Table.Row>
        {/snippet}
      </SimpleTable>
    </div>
  {/if}
</form>

{#snippet addProductButton(product: Product)}
  {@const quantity =
    $formData.transactionProducts.find((tp) => tp.productId === product.id)?.quantity ?? 0}

  <li class="col-span-1 rounded-lg bg-card shadow">
    <div class="flex w-full items-center justify-between space-x-6 px-6 py-4">
      <img class="size-14 shrink-0" src={product.imageURL} alt="" />
      <div class="flex-1 truncate">
        <div class="flex items-center gap-2">
          <h3 class="truncate text-xl font-medium text-card-foreground">{product.name}</h3>
          <span
            class="inline-flex h-max shrink-0 items-center rounded-full bg-neutral-200 px-2.5 py-1 text-xs font-medium dark:bg-neutral-700"
          >
            {formatCurrency(product.price)}
          </span>
        </div>
        <p class="truncate text-sm text-muted-foreground">{product.description}</p>
      </div>
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
          class={'flex flex-1 rounded-br-lg text-red-600 transition-colors hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-950/40 dark:hover:text-red-500'}
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
