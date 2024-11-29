<script>
  import { Button, buttonVariants } from '$lib/components/ui/button';
  import { page } from '$app/stores';
  import { enhance } from '$app/forms';
</script>

<nav class="bg-white shadow">
  <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
    <div class="relative flex h-16 justify-between">
      <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
        <div class="flex shrink-0 items-center text-xl font-bold">Frigo</div>
        <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
          {#if $page.data.user?.role === 'user'}
            <a
              href="/dashboard/buy"
              class="inline-flex items-center border-b-2 border-indigo-500 px-1 pt-1 text-sm font-medium text-gray-900"
              >Acheter</a
            >
            <a
              href="/dashboard/transactions"
              class="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
              >Transactions</a
            >
          {:else if $page.data.user?.role === 'admin'}
            <a
              href="/dashboard/products"
              class="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
              >Produits</a
            >
            <a
              href="/dashboard/transactions"
              class="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
              >Transactions</a
            >
          {/if}
        </div>
      </div>
      <div
        class="absolute inset-y-0 right-0 flex items-center gap-2 pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0"
      >
        {#if $page.data.user}
          <form method="post" action="/dashboard?/logout" use:enhance>
            <Button type="submit">Logout</Button>
          </form>
        {:else}
          <a href="/login" class={buttonVariants()}>Authentification</a>
        {/if}
      </div>
    </div>
  </div>
</nav>
