<script lang="ts">
  import AddProductForm from './add-product-form.svelte';
  import ProductListItem from './product-list-item.svelte';

  let { data } = $props();
</script>

<h1 class="mb-2 text-2xl">Liste des produits</h1>
<ul class="mb-8 space-y-2">
  {#each data.products as product}
    <ProductListItem {product} />
  {/each}
</ul>
<div class="max-w-96">
  <AddProductForm data={data.addProductForm} />
</div>
