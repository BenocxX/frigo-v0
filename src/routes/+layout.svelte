<script lang="ts">
  import '../app.css';
  import Footer from '$lib/components/custom/structure/footer.svelte';
  import Header from '$lib/components/custom/structure/header.svelte';
  import { ModeWatcher } from 'mode-watcher';
  import { Toaster } from '$lib/components/ui/sonner';
  import Alert from '$lib/components/custom/ui/alerts/alert.svelte';
  import { page } from '$app/stores';
  import { formatCurrency } from '$lib/utils/format';
  import { FREEZE_DEBT_AMOUNT, WARNING_DEBT_AMOUNT } from '$lib/utils/constants';

  let { children } = $props();
</script>

<Toaster richColors />
<ModeWatcher />
<div class="flex h-screen flex-col">
  <Header />
  {#if $page.data.user && $page.url.pathname !== '/dashboard/settings' && (!$page.data.user?.firstname || !$page.data.user?.lastname)}
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
  {#if $page.data.user && $page.url.pathname !== '/dashboard/pay' && $page.data.totalDebt && $page.data.totalDebt > WARNING_DEBT_AMOUNT}
    {@const debt = $page.data.totalDebt}
    <Alert class="rounded-none" variant={debt > FREEZE_DEBT_AMOUNT ? 'danger' : 'warning'}>
      {#snippet title()}
        {#if debt > 50}
          Dette trop élevée
        {:else}
          Tu commences à avoir une grosse dette.
        {/if}
      {/snippet}
      {#snippet description()}
        {#if debt > FREEZE_DEBT_AMOUNT}
          Ta dette est trop élevée. Tu dois la rembourser pour continuer à utiliser le Frigo.
        {:else}
          Pour permettre le bon fonctionnement du Frigo, nous demandons à ce que les dettes soient
          remboursées régulièrement. Pense à rembourser ta dette, sinon nous allons bloquer ton
          compte et tu ne pourras plus utiliser le Frigo jusqu'à ce que ta dette soit remboursée.
        {/if}
      {/snippet}
      {#snippet actions({ classes })}
        <a href="/dashboard/pay" class={classes}>Payer ma dette de {formatCurrency(debt)}</a>
      {/snippet}
    </Alert>
  {/if}
  <main class="container mx-auto flex-1 py-8">
    {@render children()}
  </main>
  <Footer />
</div>
