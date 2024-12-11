<script lang="ts">
  import PageTitle from '$lib/components/custom/structure/page-title.svelte';
  import Alert from '$lib/components/custom/ui/alerts/alert.svelte';
  import SimpleTable from '$lib/components/custom/ui/tables/simple-table.svelte';
  import * as Table from '$lib/components/ui/table';
  import { formatCurrency } from '$lib/utils/format';

  const { data } = $props();
</script>

<PageTitle title="Wall of shame 👹" subtitle="Liste des dettes non-remboursées des utilisateurs" />
{#if data.users.length > 0}
  <SimpleTable dataset={data.users}>
    {#snippet headRow()}
      <Table.Head class="min-w-[175px]">Utilisateur</Table.Head>
      <Table.Head class="text-right">Total</Table.Head>
    {/snippet}
    {#snippet dataRow({ row })}
      <Table.Cell>{row.firstname} {row.lastname}</Table.Cell>
      <Table.Cell class="text-right">{formatCurrency(row.total)}</Table.Cell>
    {/snippet}
  </SimpleTable>
{:else}
  <Alert variant="info">
    {#snippet title()}
      Aucun utilisateur n'a de dettes non remboursées
    {/snippet}
  </Alert>
{/if}
