<script lang="ts" module>
  import { type VariantProps, tv } from 'tailwind-variants';

  export const badgeVariants = tv({
    base: 'inline-flex items-center rounded-md text-xs font-medium ring-1 ring-inset',
    variants: {
      variant: {
        default:
          'bg-gray-50 text-gray-600 ring-gray-500/10 dark:bg-gray-400/10 dark:text-gray-400 dark:ring-gray-400/20',
        success:
          'bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-500/10 dark:text-green-400 dark:ring-green-500/20',
      },
      size: {
        xs: 'px-1.5 py-0.5',
        sm: 'px-2 py-1',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'sm',
    },
  });

  export type BadgeVariant = VariantProps<typeof badgeVariants>['variant'];
  export type BadgeSize = VariantProps<typeof badgeVariants>['size'];

  export type BadgeProps = WithElementRef<HTMLAttributes<HTMLSpanElement>> & {
    variant?: BadgeVariant;
    size?: BadgeSize;
  };
</script>

<script lang="ts">
  import { cn } from '$lib/utils.js';
  import type { WithElementRef } from 'bits-ui';
  import type { HTMLAttributes } from 'svelte/elements';

  let {
    class: className,
    variant = 'default',
    size = 'sm',
    ref = $bindable(null),
    children,
    ...restProps
  }: BadgeProps = $props();
</script>

<span bind:this={ref} class={cn(badgeVariants({ variant, size, className }))} {...restProps}>
  {@render children?.()}
</span>
