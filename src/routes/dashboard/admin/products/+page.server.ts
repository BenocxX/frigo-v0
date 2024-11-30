import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { db } from '$lib/server/prisma.js';
import {
  addProductSchema,
  deleteProductSchema,
} from '$lib/components/custom/forms/products/schema';

export const load = async () => {
  const products = await db.product.findMany();

  return {
    forms: {
      add: await superValidate(zod(addProductSchema)),
      delete: await superValidate(zod(deleteProductSchema)),
    },
    products,
  };
};

export const actions = {
  create: async (event) => {
    const form = await superValidate(event, zod(addProductSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    await db.product.create({
      data: form.data,
    });

    return { form };
  },
  deleteProduct: async (event) => {
    const form = await superValidate(event, zod(deleteProductSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    await db.product.delete({ where: { id: form.data.productId } });
  },
};
