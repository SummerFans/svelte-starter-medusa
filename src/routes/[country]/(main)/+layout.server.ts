// import { getFeaturedProduct } from "$lib/server/medusa/collections";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ params, locals }) => {
  // const { country } = locals;
  // const { collections } = await getFeaturedProduct(params.country);

  return {
    // collections,
    // country
  }
}