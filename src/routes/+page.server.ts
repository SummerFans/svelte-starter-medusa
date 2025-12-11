import type { PageServerLoad } from './$types';
import { MEDUSA_BACKEND_URL } from '$env/static/private';

// 1. 启用预渲染
export const prerender = true;

export const load: PageServerLoad = async () => {
  return {
    url: MEDUSA_BACKEND_URL || 'none2'
  }
}


// import type PageServerData from './$types';
// export async function load({ platform }: PageServerData) {

//   // 3. 将处理后的安全数据返回给客户端
//   return {
//     url: platform.env.API_SECRET_KEY
//   };
// }