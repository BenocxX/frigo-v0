<script lang="ts">
  import type { Product } from '@prisma/client';
  import DeleteProductForm from '$lib/components/custom/forms/products/delete-product-form.svelte';
  import type { Infer, SuperValidated } from 'sveltekit-superforms';
  import type { DeleteProductSchema } from '$lib/components/custom/forms/products/schema';

  type Props = {
    product: Product;
    forms: {
      delete: SuperValidated<Infer<DeleteProductSchema>>;
    };
  };

  const { product, forms }: Props = $props();
</script>

<li class="flex items-center gap-4">
  <span>{product.name} - {product.price} $</span>
  <DeleteProductForm {product} data={forms.delete} />
</li>
