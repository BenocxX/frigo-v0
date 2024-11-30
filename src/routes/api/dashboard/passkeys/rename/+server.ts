import { json } from '@sveltejs/kit';

export const POST = async () => {
  console.log('Rename');

  return json({ hello: 'world' });
};
