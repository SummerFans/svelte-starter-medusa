import { error } from '@sveltejs/kit';
import type { EntryGenerator, PageServerLoad } from './$types';

export const prerender = true;

export const entries: EntryGenerator = async (): Promise<any> => {

  return []
}

export const load: PageServerLoad = async ({ params }) => {

  const { country, handle, variants } = params;

  const product = null

  if (product) {
    return {
      country,
      handle
    }
  }

  error(404, 'Not found');
}