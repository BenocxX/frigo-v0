<script lang="ts">
  import Footer from '$lib/components/custom/structure/footer.svelte';
  import Header from '$lib/components/custom/structure/header.svelte';
  import '../app.css';

  let { children } = $props();
</script>

<div class="flex h-screen flex-col">
  <Header />
  <main class="container mx-auto flex-1 py-8">
    {@render children()}
  </main>
  <Footer />
</div>
