<script lang="ts">
  import PageTitle from '$lib/components/custom/structure/page-title.svelte';
  import SimpleTable from '$lib/components/custom/ui/tables/simple-table.svelte';
  import * as Table from '$lib/components/ui/table';
  import { formatCurrency } from '$lib/utils/format';

  const { data } = $props();
</script>

<PageTitle
  title="Liste des transactions"
  subtitle="Liste des transactions effectuées par les membres"
/>
{#if data.users.length > 0}
  <SimpleTable dataset={data.users}>
    {#snippet headRow()}
      <Table.Head class="w-[175px] min-w-[175px]">Username</Table.Head>
      <Table.Head class="text-right">Total</Table.Head>
    {/snippet}
    {#snippet dataRow({ row })}
      <Table.Cell>{row.username}</Table.Cell>
      <Table.Cell class="text-right">{formatCurrency(row.total)}</Table.Cell>
    {/snippet}
  </SimpleTable>
{:else}
  <p class="rounded-lg bg-card py-4 text-center text-muted-foreground">
    Aucun utilisateur n'a de dettes non remboursées
  </p>
{/if}
