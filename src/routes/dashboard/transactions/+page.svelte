<script lang="ts">
  import { formatDatePPP, formatTimeBetween } from '$lib/utils/format';

  const { data } = $props();
</script>

<h1 class="mb-8 text-4xl">Transactions</h1>
{#if data.transactions.length > 0}
  <ul class="list-disc space-y-4">
    {#each data.transactions as transaction, index}
      <li>
        <p>Transaction #{index + 1}</p>
        <p
          class="mt-1 flex flex-col gap-1 text-sm text-muted-foreground sm:flex-row sm:items-center"
        >
          Faites le {formatDatePPP(transaction.createdAt)}, il y a
          {formatTimeBetween(transaction.createdAt)}.
        </p>
      </li>
    {/each}
  </ul>
{:else}
  <p class="text-muted-foreground">Vous n'avez pas encore effectué de transactions.</p>
{/if}
