<script lang="ts">
  import { enhance } from '$app/forms';
  import { makeToastInstance } from '$lib/utils/toasts';
  import type { Product } from '@prisma/client';
  import { Button } from '$lib/components/ui/button';
  import Trash from 'lucide-svelte/icons/trash';

  const { product }: { product: Product } = $props();

  const toastInstance = makeToastInstance();
</script>

<li class="flex items-center gap-4">
  <span>{product.name} - {product.price} $</span>
  <form
    method="POST"
    action="?/delete"
    use:enhance={() => {
      toastInstance.loading('Suppression du produit en cours...');

      return async ({ result, update }) => {
        if (toastInstance.isFailure(result)) {
          toastInstance.error('Erreur lors de la suppression du produit');
        } else {
          toastInstance.success('Produit supprimé avec succès');
        }
        update();
      };
    }}
  >
    <input type="hidden" name="productId" value={product.id} />
    <Button size="icon-sm" variant="destructive" type="submit">
      <Trash />
    </Button>
  </form>
</li>
