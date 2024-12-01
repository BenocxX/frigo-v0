import { newTransactionSchema } from '$lib/components/custom/forms/transactions/schema';
import { db } from '$lib/server/prisma';
import { fail, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async () => {
  const products = await db.product.findMany();

  return {
    newTransactionForm: await superValidate(zod(newTransactionSchema)),
    products,
  };
};

export const actions = {
  newTransaction: async (event) => {
    const form = await superValidate(event, zod(newTransactionSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    const productIds = form.data.transactionProducts.map((p) => p.productId);
    const products = await db.product.findMany({ where: { id: { in: productIds } } });
    const hasMissingProducts = products.length !== form.data.transactionProducts.length;
    if (hasMissingProducts) {
      return setError(form, 'transactionProducts._errors', "Certains produits n'existent pas");
    }

    const hasNegativeQuantity = form.data.transactionProducts.some((p) => p.quantity < 0);
    if (hasNegativeQuantity) {
      return setError(form, 'transactionProducts._errors', 'La quantité doit être supérieure à 0');
    }

    await db.transaction.create({
      data: {
        userId: event.locals.user!.id,
        transactionProducts: {
          create: form.data.transactionProducts,
        },
      },
    });
  },
};
