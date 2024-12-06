<script lang="ts">
  import PageTitle from '$lib/components/custom/structure/page-title.svelte';
  import Badge from '$lib/components/custom/ui/badges/badge.svelte';
  import SimpleTable from '$lib/components/custom/ui/tables/simple-table.svelte';
  import * as Table from '$lib/components/ui/table';
  import { formatCurrency, formatDateFrench } from '$lib/utils/format';

  const { data } = $props();
</script>

<PageTitle title="Mes transactions" subtitle="Liste des transactions effectuées" />
{#if data.transactions.length > 0}
  <SimpleTable dataset={data.transactions}>
    {#snippet headRow()}
      <Table.Head class="w-[175px] min-w-[175px]">Date</Table.Head>
      <Table.Head>Produits</Table.Head>
      <Table.Head class="text-right">Total</Table.Head>
      <Table.Head class="w-[200px] text-right">Dette payée</Table.Head>
    {/snippet}
    {#snippet dataRow({ row })}
      <Table.Cell>
        {formatDateFrench(row.createdAt, 'PP')} à {formatDateFrench(row.createdAt, 'p')}
      </Table.Cell>
      <Table.Cell class="flex flex-wrap gap-1">
        {#each row.transactionProducts as { quantity, product }}
          <Badge>
            {quantity}x {product.name}
          </Badge>
        {/each}
      </Table.Cell>
      <Table.Cell class="text-right">{formatCurrency(row.total)}</Table.Cell>
      <Table.Cell class="text-right">{row.payed ? 'Oui' : 'Non'}</Table.Cell>
    {/snippet}
  </SimpleTable>
{:else}
  <p class="rounded-lg bg-card py-4 text-center text-muted-foreground">
    Vous n'avez aucune transactions pour l'instant.
  </p>
{/if}
