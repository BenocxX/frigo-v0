<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import Trash from 'lucide-svelte/icons/trash';
  import AddProductForm from './add-product-form.svelte';

  let { data } = $props();
</script>

<h1 class="mb-2 text-2xl">Liste des produits</h1>
<ul class="mb-8 space-y-2">
  {#each data.products as product}
    <li class="flex items-center gap-4">
      <span>{product.name} - {product.price} $</span>
      <form method="POST" action="?/delete">
        <input type="hidden" name="productId" value={product.id} />
        <Button size="icon-sm" variant="destructive" type="submit">
          <Trash />
        </Button>
      </form>
    </li>
  {/each}
</ul>
<div class="max-w-96">
  <AddProductForm data={data.form} />
</div>
