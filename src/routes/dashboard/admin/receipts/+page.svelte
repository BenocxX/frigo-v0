<script lang="ts">
  import PageTitle from '$lib/components/custom/structure/page-title.svelte';
  import Alert from '$lib/components/custom/ui/alerts/alert.svelte';
  import SimpleTable from '$lib/components/custom/ui/tables/simple-table.svelte';
  import * as Table from '$lib/components/ui/table';
  import { formatCurrency, formatDateFrench } from '$lib/utils/format';

  const { data } = $props();
</script>

<PageTitle
  title="Wall of pride 🏆"
  subtitle="Liste des reçus des dettes remboursées des utilisateurs"
/>
{#if data.receipts.length > 0}
  <SimpleTable dataset={data.receipts}>
    {#snippet headRow()}
      <Table.Head class="min-w-[175px]">Utilisateur</Table.Head>
      <Table.Head class="min-w-[175px]">Date</Table.Head>
      <Table.Head class="min-w-[175px]">Moyen de paiement</Table.Head>
      <Table.Head class="text-right">Total</Table.Head>
    {/snippet}
    {#snippet dataRow({ row })}
      <Table.Cell>{row.user.firstname} {row.user.lastname}</Table.Cell>
      <Table.Cell>
        {formatDateFrench(row.createdAt)} à {formatDateFrench(row.createdAt, 'p')}
      </Table.Cell>
      <Table.Cell>
        {row.paymentMethod.charAt(0).toUpperCase() + row.paymentMethod.slice(1)}
      </Table.Cell>
      <Table.Cell class="text-right">{formatCurrency(row.total)}</Table.Cell>
    {/snippet}
  </SimpleTable>
{:else}
  <Alert variant="info">
    {#snippet title()}
      Aucun utilisateur n'a payé sa dette. 😢
    {/snippet}
  </Alert>
{/if}
