<script lang="ts">
  import { Button, buttonVariants } from '$lib/components/ui/button';
  import { page } from '$app/stores';
  import { enhance } from '$app/forms';
  import LogOut from 'lucide-svelte/icons/log-out';
  import Settings from 'lucide-svelte/icons/settings';
  import { cn } from '$lib/utils';
  import ThemeToggle from '../ui/theme-toggle.svelte';

  function isActiveRoute(path: string) {
    return $page.url.pathname === path;
  }
</script>

<nav class="sticky top-0 bg-background shadow">
  <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
    <div class="relative flex h-16 justify-between">
      <div class="flex flex-1 items-stretch justify-start px-8">
        <div class="flex shrink-0 items-center text-xl font-bold">Frigo</div>
        <div class="ml-8 flex space-x-6">
          {#if $page.data.user?.role === 'user'}
            {@render link('/dashboard/buy', 'Acheter')}
            {@render link('/dashboard/transactions', 'Transactions')}
          {:else if $page.data.user?.role === 'admin'}
            {@render link('/dashboard/admin/products', 'Produits')}
            {@render link('/dashboard/admin/transactions', 'Transactions')}
          {/if}
        </div>
      </div>
      <div
        class="absolute inset-y-0 right-0 flex items-center gap-2 pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0"
      >
        <ThemeToggle />
        {#if $page.data.user}
          <a
            href="/dashboard/settings"
            class={buttonVariants({ variant: 'outline', size: 'icon' })}
          >
            <Settings />
          </a>
          <form method="post" action="/dashboard?/logout" use:enhance>
            <Button type="submit" variant="outline" size="icon">
              <LogOut />
            </Button>
          </form>
        {:else}
          <a href="/login" class={buttonVariants()}>Connexion</a>
        {/if}
      </div>
    </div>
  </div>
</nav>

{#snippet link(href: string, label: string)}
  <a
    {href}
    class={cn(
      'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium transition-colors',
      isActiveRoute(href)
        ? 'border-b-2 border-primary text-foreground'
        : 'border-transparent text-muted-foreground hover:border-foreground/25 hover:text-foreground/90'
    )}
  >
    {label}
  </a>
{/snippet}
