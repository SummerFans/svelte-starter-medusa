import type { PageServerLoad } from './$types';

export const prerender = true;


export async function entries() {

  return []
}


export const load: PageServerLoad = async ({ params }: any) => {

  const { country, handle, page } = params;

  return {
    country,
    handle,
    collections: [],
    page,
  };
}