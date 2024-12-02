<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import type { WithElementRef } from 'bits-ui';
  import { cn } from '$lib/utils.js';
  import { fade } from 'svelte/transition';

  let {
    ref = $bindable(null),
    class: className,
    children,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLTableRowElement>> = $props();
</script>

<tr
  bind:this={ref}
  class={cn(
    'border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted dark:hover:bg-muted/20',
    className
  )}
  transition:fade
  {...restProps}
>
  {@render children?.()}
</tr>
