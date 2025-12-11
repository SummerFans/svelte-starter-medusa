import { error } from '@sveltejs/kit';
import type { EntryGenerator, PageServerLoad } from './$types';

export const prerender = true;


export const entries: EntryGenerator = async (): Promise<any> => {

  return [{
    country: 'us',
    handle: 'collections',
    page: "1",
  }]
}


export const load: PageServerLoad = async ({ params }: any) => {

  const { country, handle, page } = params;

  const collections: any = []

  if (collections) {
    return {
      country,
      handle,
      collections,
      page,
    };
  }
  error(404, 'Not found')
}