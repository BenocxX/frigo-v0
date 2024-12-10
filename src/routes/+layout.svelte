<script lang="ts">
  import '../app.css';
  import Footer from '$lib/components/custom/structure/footer.svelte';
  import Header from '$lib/components/custom/structure/header.svelte';
  import { ModeWatcher } from 'mode-watcher';
  import { Toaster } from '$lib/components/ui/sonner';

  let { children } = $props();
</script>

<Toaster richColors />
<ModeWatcher />
<div class="flex h-screen flex-col">
  <Header />
  <main class="container mx-auto flex-1 py-8">
    {@render children()}
  </main>
  <Footer />
</div>
