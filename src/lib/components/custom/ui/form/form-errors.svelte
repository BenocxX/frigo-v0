<script lang="ts">
  import { cn } from '$lib/utils';
  import type { SuperForm } from 'sveltekit-superforms';

  type Props = {
    class?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form: SuperForm<any, any>;
  };

  const { class: className, form }: Props = $props();
  const { errors } = form;
</script>

{#if $errors._errors}
  <ul class={cn('ml-4 list-disc', className)}>
    {#each $errors._errors as error}
      <li class="text-destructive">{error}</li>
    {/each}
  </ul>
{/if}
