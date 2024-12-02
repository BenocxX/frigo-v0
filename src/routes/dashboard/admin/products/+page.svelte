<script lang="ts">
  import AddProductForm from '$lib/components/custom/forms/products/add-product-form.svelte';
  import PageTitle from '$lib/components/custom/structure/page-title.svelte';
  import ProductListItem from './product-list-item.svelte';

  let { data } = $props();
</script>

<PageTitle title="Liste des produits" subtitle="Gérez les produits du frigo" />
<ul class="mb-8 space-y-2">
  {#each data.products as product}
    <ProductListItem {product} forms={data.forms} />
  {/each}
</ul>
<div class="max-w-96">
  <AddProductForm data={data.forms.add} />
</div>
