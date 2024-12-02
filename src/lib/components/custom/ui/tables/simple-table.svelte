<script lang="ts" generics="T">
  import * as Table from '$lib/components/ui/table/index.js';
  import type { Snippet } from 'svelte';

  // TODO: REMOVE WHEN https://github.com/sveltejs/svelte-eslint-parser/issues/306 IS FIXED
  // eslint-disable-next-line no-undef
  type TItem = T;

  type Props = {
    rows: TItem[];
    tableHead: Snippet;
    tableRow: Snippet<[{ row: TItem }]>;
  };

  const { rows, tableHead, tableRow }: Props = $props();
</script>

<Table.Root>
  <Table.Header>
    <Table.Row>
      {@render tableHead()}
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {#each rows as row}
      <Table.Row>
        {@render tableRow({ row })}
      </Table.Row>
    {/each}
  </Table.Body>
</Table.Root>
