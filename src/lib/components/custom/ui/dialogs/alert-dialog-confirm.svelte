<script lang="ts">
  import type { Snippet } from 'svelte';
  import { AlertDialog as AlertDialogBits } from 'bits-ui';
  import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';

  type Props = AlertDialogBits.RootProps & {
    trigger: Snippet<[{ props: Record<string, unknown> }]>;
    title: Snippet;
    description: Snippet;
    cancel?: Snippet;
    action: Snippet<[{ props: Record<string, unknown> }]>;
  };

  let {
    open = $bindable(false),
    children,
    trigger,
    title,
    description,
    cancel,
    action,
    ...restProps
  }: Props = $props();
</script>

<AlertDialog.Root bind:open {...restProps}>
  <AlertDialog.Trigger>
    {#snippet child({ props })}
      {@render trigger({ props })}
    {/snippet}
  </AlertDialog.Trigger>
  <AlertDialog.Portal>
    <AlertDialog.Content>
      <AlertDialog.Header>
        <AlertDialog.Title>
          {@render title()}
        </AlertDialog.Title>
        <AlertDialog.Description>
          {@render description()}
        </AlertDialog.Description>
      </AlertDialog.Header>
      {@render children?.()}
      <AlertDialog.Footer>
        <AlertDialog.Cancel>
          {#if cancel}
            {@render cancel()}
          {:else}
            Annuler
          {/if}
        </AlertDialog.Cancel>
        <AlertDialog.Cancel>
          {#snippet child({ props })}
            <AlertDialog.Action {...props}>
              {#snippet child({ props: actionProps })}
                {@render action({ props: { ...actionProps, class: '' } })}
              {/snippet}
            </AlertDialog.Action>
          {/snippet}
        </AlertDialog.Cancel>
      </AlertDialog.Footer>
    </AlertDialog.Content>
  </AlertDialog.Portal>
</AlertDialog.Root>
