<script lang="ts" generics="T">
  import * as Table from '$lib/components/ui/table/index.js';
  import type { Snippet } from 'svelte';

  // TODO: REMOVE WHEN https://github.com/sveltejs/svelte-eslint-parser/issues/306 IS FIXED
  // eslint-disable-next-line no-undef
  type TItem = T;

  type Props = {
    dataset: TItem[];
    headRow: Snippet;
    headRowChild?: Snippet;
    dataRow: Snippet<[{ row: TItem }]>;
    dataRowChild?: Snippet<[{ row: TItem }]>;
    finalRow?: Snippet;
    finalRowChild?: Snippet;
  };

  const { dataset, headRow, headRowChild, dataRow, dataRowChild, finalRow, finalRowChild }: Props =
    $props();
</script>

<Table.Root>
  <Table.Header>
    {@render headRowRenderer()}
  </Table.Header>
  <Table.Body>
    {#each dataset as row}
      {@render dataRowRenderer({ row })}
    {/each}
    {@render finalRowRenderer()}
  </Table.Body>
</Table.Root>

{#snippet headRowRenderer()}
  {#if headRowChild}
    {@render headRowChild()}
  {:else if headRow}
    <Table.Row>
      {@render headRow()}
    </Table.Row>
  {/if}
{/snippet}

{#snippet dataRowRenderer({ row }: { row: TItem })}
  {#if dataRowChild}
    {@render dataRowChild({ row })}
  {:else if dataRow}
    <Table.Row>
      {@render dataRow({ row })}
    </Table.Row>
  {/if}
{/snippet}

{#snippet finalRowRenderer()}
  {#if finalRowChild}
    {@render finalRowChild()}
  {:else if finalRow}
    <Table.Row>
      {@render finalRow()}
    </Table.Row>
  {/if}
{/snippet}
