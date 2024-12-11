<script lang="ts" module>
  import { type VariantProps, tv } from 'tailwind-variants';

  export const alertVariants = tv({
    slots: {
      root: 'rounded-md p-4',
      icon: 'size-5',
      title: 'text-sm font-medium',
      description: 'mt-2 text-sm',
      action: buttonVariants({ variant: 'ghost', size: 'sm' }),
    },
    variants: {
      variant: {
        info: {
          root: 'bg-blue-50 dark:bg-blue-950/50',
          icon: 'text-blue-500',
          title: 'text-blue-800 dark:text-blue-500',
          description: 'text-blue-700 dark:text-blue-600',
          action:
            'text-blue-800 hover:bg-blue-100 hover:text-blue-900 dark:text-blue-500 dark:hover:bg-blue-950 dark:hover:text-blue-400',
        },
        success: {
          root: 'bg-green-50 dark:bg-green-950/50',
          icon: 'text-green-500',
          title: 'text-green-800 dark:text-green-500',
          description: 'text-green-700 dark:text-green-600',
          action:
            'text-green-800 hover:bg-green-100 hover:text-green-900 dark:text-green-500 dark:hover:bg-green-950 dark:hover:text-green-400',
        },
        warning: {
          root: 'bg-yellow-50 dark:bg-yellow-950/50',
          icon: 'text-yellow-500',
          title: 'text-yellow-800 dark:text-yellow-500',
          description: 'text-yellow-700 dark:text-yellow-600',
          action:
            'text-yellow-800 hover:bg-yellow-100 hover:text-yellow-900 dark:text-yellow-500 dark:hover:bg-yellow-950 dark:hover:text-yellow-400',
        },
        danger: {
          root: 'bg-red-50 dark:bg-red-950/50',
          icon: 'text-red-500',
          title: 'text-red-800 dark:text-red-500',
          description: 'text-red-700 dark:text-red-600',
          action:
            'text-red-800 hover:bg-red-100 hover:text-red-900 dark:text-red-500 dark:hover:bg-red-950 dark:hover:text-red-400',
        },
      },
    },
    defaultVariants: {
      variant: 'warning',
    },
  });

  export type AlertVariant = VariantProps<typeof alertVariants>['variant'];

  export type AlertProps = Omit<WithElementRef<HTMLAttributes<HTMLDivElement>>, 'title'> & {
    title: Snippet;
    description?: Snippet;
    descriptionChild?: Snippet;
    actions?: Snippet<[{ classes: string }]>;
    variant?: AlertVariant;
  };
</script>

<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { WithElementRef } from 'bits-ui';
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from '$lib/utils';
  import { buttonVariants } from '$lib/components/ui/button';

  const {
    title,
    description,
    descriptionChild,
    actions,
    variant,
    class: className,
  }: AlertProps = $props();

  const {
    root: rootClasses,
    icon: iconClasses,
    title: titleClasses,
    description: descriptionClasses,
    action: actionClasses,
  } = alertVariants({ variant });
</script>

<div class={cn(rootClasses(), className)}>
  <div class="flex">
    <div class="shrink-0">
      <svg
        class={iconClasses()}
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
        data-slot="icon"
      >
        {#if variant === 'info'}
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z"
            clip-rule="evenodd"
          />
        {:else if variant === 'success'}
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
            clip-rule="evenodd"
          />
        {:else if variant === 'warning'}
          <path
            fill-rule="evenodd"
            d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
            clip-rule="evenodd"
          />
        {:else}
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z"
            clip-rule="evenodd"
          />
        {/if}
      </svg>
    </div>
    <div class="ml-3">
      <h3 class={titleClasses()}>
        {@render title()}
      </h3>
      {#if description || descriptionChild}
        <div class={descriptionClasses()}>
          {#if descriptionChild}
            {@render descriptionChild()}
          {:else if description}
            <p>
              {@render description()}
            </p>
          {/if}
        </div>
      {/if}
      {#if actions}
        <div class="mt-4">
          <div class="-mx-2 -my-1.5 flex gap-2">
            {@render actions({ classes: actionClasses() })}
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>
