<script lang="ts">
  import '../app.css';
  import Footer from '$lib/components/custom/structure/footer.svelte';
  import Header from '$lib/components/custom/structure/header.svelte';
  import { ModeWatcher } from 'mode-watcher';
  import { Toaster } from '$lib/components/ui/sonner';
  import Alert from '$lib/components/custom/ui/alerts/alert.svelte';
  import { page } from '$app/stores';

  let { children } = $props();
</script>

<Toaster richColors />
<ModeWatcher />
<div class="flex h-screen flex-col">
  <Header />
  {#if !$page.data.user?.firstname || !$page.data.user?.lastname}
    <Alert class="rounded-none" variant="warning">
      {#snippet title()}
        Attention! Prénom et nom requis.
      {/snippet}
      {#snippet description()}
        Pour faciliter la gestion des paiements, nous avons besoin de votre prénom et nom. Veuillez
        mettre à jour votre profile dans les paramètres.
      {/snippet}
      {#snippet actions({ classes })}
        <a href="/dashboard/settings" class={classes}>Paramètres</a>
      {/snippet}
    </Alert>
  {/if}
  <!-- {#if $page.data.totalDebt && $page.data.totalDebt > 30}
    <Alert class="rounded-none" variant="warning">
      {#snippet title()}
        Attention! Prénom et nom requis.
      {/snippet}
      {#snippet description()}
        Pour faciliter la gestion des paiements, nous avons besoin de votre prénom et nom. Veuillez
        mettre à jour votre profile dans les paramètres.
      {/snippet}
      {#snippet actions({ classes })}
        <a href="/dashboard/settings" class={classes}>Paramètres</a>
      {/snippet}
    </Alert>
  {/if} -->
  <main class="container mx-auto flex-1 py-8">
    {@render children()}
  </main>
  <Footer />
</div>
