import { DEFAULT_REGION } from '$env/static/private';
import { PUBLIC_BASE_URL } from '$env/static/public';
import { error, redirect, type Handle, type RequestEvent } from "@sveltejs/kit";
import { paraglideMiddleware } from '$lib/paraglide/server';


const handleParaglide: Handle = async ({ event, resolve }) => {


  // const currentCountryCode = getCountryCode(event, countries).toLocaleLowerCase();

  // const urlHasCountryCode = currentCountryCode && event.url.pathname.split("/")[1].includes(currentCountryCode)

  if (event.url.pathname.split("/")[1] == '') {
    throw redirect(302, `${PUBLIC_BASE_URL}/${DEFAULT_REGION}${event.url.pathname}`);

    // 当前url和记录中的不存在
    // throw redirect(302, `${PUBLIC_BASE_URL}/${currentCountryCode}${event.url.pathname}`);
  }

  return paraglideMiddleware(event.request, ({ request: localizedRequest, locale }) => {
    event.request = localizedRequest;
    return resolve(event, {
      transformPageChunk: ({ html }) =>
        html
          .replace(
            '%paraglide.lang%',
            locale
          )
    });
  })
}

export const handle: Handle = handleParaglide;