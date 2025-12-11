import { error } from '@sveltejs/kit';
import type { EntryGenerator, PageServerLoad } from './$types';

export const prerender = true;

export const entries: EntryGenerator = async (): Promise<any> => {

  return []
}

export const load: PageServerLoad = async ({ params }) => {

  const { country, category_handle, page } = params;

  let pageNum = 0;
  let categorys = category_handle.split('/')
  if (/^\d+/ig.test(page)) {
    pageNum = parseInt(page)
  } else {
    categorys.push(page)
  }

  const category = categorys.at(-1)

  if (category) {
    return {
      country,
      page: pageNum,
      category,
      categorys
    }
  }
  error(404, 'Not Found')
}