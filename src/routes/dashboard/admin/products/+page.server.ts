import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { addProductSchema } from './schema.js';
import { db } from '$lib/server/prisma.js';
import { z } from 'zod';

export const load = async () => {
  const products = await db.product.findMany();

  return {
    addProductForm: await superValidate(zod(addProductSchema)),
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
  delete: async (event) => {
    const formData = await event.request.formData();
    const productId = formData.get('productId');

    const result = z.coerce.number().safeParse(productId);
    if (!result.success) {
      return fail(400);
    }

    await db.product.delete({ where: { id: result.data } });
  },
};
