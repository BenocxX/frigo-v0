<script lang="ts">
  import { Button, buttonVariants } from '$lib/components/ui/button';
  import { page } from '$app/stores';
  import { enhance } from '$app/forms';
  import LogOut from 'lucide-svelte/icons/log-out';
  import Menu from 'lucide-svelte/icons/menu';
  import Settings from 'lucide-svelte/icons/settings';
  import { cn } from '$lib/utils';
  import ThemeToggle from '../ui/theme-toggle.svelte';
  import * as Sheet from '$lib/components/ui/sheet/index.js';
  import Footer from './footer.svelte';

  const isAdmin = $page.data.user?.role === 'admin';

  const links = [
    { href: '/dashboard/buy', label: 'Acheter', isActive: true },
    { href: '/dashboard/transactions', label: 'Mes transactions', isActive: true },
    { href: '/dashboard/admin/products', label: 'Liste des produits', isActive: isAdmin },
    { href: '/dashboard/admin/transactions', label: 'Liste des transactions', isActive: isAdmin },
  ];

  function getActiveLinks() {
    return links.filter((link) => link.isActive);
  }

  function isCurrentRoute(path: string) {
    return $page.url.pathname === path;
  }
</script>

<nav class="sticky top-0 bg-background shadow">
  <div class="container mx-auto">
    <div class="relative flex h-16 justify-between">
      <div class="flex flex-1 items-stretch justify-start pr-8">
        <div class="bloc my-auto lg:hidden">
          <Sheet.Root>
            <Sheet.Trigger class={buttonVariants({ variant: 'ghost', size: 'icon' })}>
              <Menu class="!size-6" />
            </Sheet.Trigger>
            <Sheet.Content side="left" class="flex flex-col p-0">
              <div class="flex-1 p-6">
                <Sheet.Header>
                  <Sheet.Title class="text-2xl">Frigo</Sheet.Title>
                </Sheet.Header>
                <ul class="my-4">
                  {#each getActiveLinks() as { href, label }}
                    <li>
                      <Sheet.Close>
                        {#snippet child({ props })}
                          <a
                            {...props}
                            {href}
                            class={buttonVariants({
                              variant: isCurrentRoute(href) ? 'secondary' : 'ghost',
                              class: 'w-full justify-start',
                            })}
                          >
                            {label}
                          </a>
                        {/snippet}
                      </Sheet.Close>
                    </li>
                  {/each}
                </ul>
              </div>
              <Sheet.Footer>
                <Footer />
              </Sheet.Footer>
            </Sheet.Content>
          </Sheet.Root>
        </div>
        <div class="ml-4 flex shrink-0 items-center text-xl font-bold">Frigo</div>
        <div class="ml-8 hidden space-x-6 lg:flex">
          {#each getActiveLinks() as { href, label }}
            <a
              {href}
              class={cn(
                'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium transition-colors',
                isCurrentRoute(href)
                  ? 'border-b-2 border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:border-foreground/25 hover:text-foreground/90'
              )}
            >
              {label}
            </a>
          {/each}
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
