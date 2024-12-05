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
    dataRow: Snippet<[{ row: TItem; index: number }]>;
    dataRowChild?: Snippet<[{ row: TItem; index: number }]>;
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
    {#each dataset as row, index}
      {@render dataRowRenderer({ row, index })}
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

{#snippet dataRowRenderer({ row, index }: { row: TItem; index: number })}
  {#if dataRowChild}
    {@render dataRowChild({ row, index })}
  {:else if dataRow}
    <Table.Row>
      {@render dataRow({ row, index })}
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
