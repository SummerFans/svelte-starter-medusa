import { DEFAULT_REGION, MEDUSA_BACKEND_URL, MEDUSA_PUBLISHABLE_KEY } from '$env/static/private';
import { PUBLIC_BASE_URL } from '$env/static/public';
import { redirect, type Handle, type RequestEvent } from '@sveltejs/kit';
import { paraglideMiddleware } from '$lib/paraglide/server';

const regionMapCache = {
	regionMap: new Map<string, HttpTypes.StoreRegion>(),
	regionMapUpdated: Date.now()
};

const getRegionMap = async (cacheId: string): Promise<Map<string, HttpTypes.StoreRegion>> => {
	const { regionMap, regionMapUpdated } = regionMapCache;

	if (!MEDUSA_BACKEND_URL) {
		throw new Error(
			'Middleware.ts: Error fetching regions. Did you set up regions in your Medusa Admin and define a MEDUSA_BACKEND_URL environment variable? Note that the variable is no longer named NEXT_PUBLIC_MEDUSA_BACKEND_URL.'
		);
	}

	// response.headers.set('Cache-Tag', `${currentTags}, post_${postId}`);
	if (!regionMap.keys().next().value || regionMapUpdated < Date.now() - 3600 * 1000) {
		// Fetch regions from Medusa. We can't use the JS client here because middleware is running on Edge and the client needs a Node environment.
		const { regions } = await fetch(`${MEDUSA_BACKEND_URL}/store/regions`, {
			headers: {
				'x-publishable-api-key': MEDUSA_PUBLISHABLE_KEY,
				'cache-Tag': `regions-${cacheId}`,
				'cache-control': 'public, max-age=3600, stale-while-revalidate=86400'
			}
		}).then(async (response) => {
			const json = await response.json();

			if (!response.ok) {
				throw new Error(json.message);
			}

			return json;
		});

		if (!regions?.length) {
			throw new Error('No regions found. Please set up regions in your Medusa Admin.');
		}

		// Create a map of country codes to regions.
		regions.forEach((region: HttpTypes.StoreRegion) => {
			region.countries?.forEach((c) => {
				regionMapCache.regionMap.set(c.iso_2 ?? '', region);
			});
		});

		regionMapCache.regionMapUpdated = Date.now();
	}

	return regionMapCache.regionMap;
};

const getCountryCode = (
	event: RequestEvent,
	regionMap: Map<string, HttpTypes.StoreRegion | number>
): string | undefined => {
	try {
		let countryCode;
		const cfCountryCode = event.request.headers.get('cf-ipcountry')?.toLocaleLowerCase();

		const urlCountryCode = event.url.pathname.split('/')[1]?.toLowerCase();

		if (urlCountryCode && regionMap.has(urlCountryCode)) {
			countryCode = urlCountryCode;
		} else if (cfCountryCode && regionMap.has(cfCountryCode)) {
			countryCode = cfCountryCode;
		} else if (regionMap.has(DEFAULT_REGION)) {
			countryCode = DEFAULT_REGION;
		} else if (regionMap.keys().next().value) {
			countryCode = regionMap.keys().next().value;
		}

		return countryCode;
	} catch (error) {
		console.error(error);
		if (process.env.NODE_ENV === 'development') {
			console.error(
				'Middleware.ts: Error getting the country code. Did you set up regions in your Medusa Admin and define a MEDUSA_BACKEND_URL environment variable? Note that the variable is no longer named NEXT_PUBLIC_MEDUSA_BACKEND_URL.'
			);
		}
	}
};

const ignoredPathRegex = new RegExp(
	/^\/(api|admin|login|register)\/.*|\.(ico|png|jpg|jpeg|gif|svg|webp|css|js|woff|woff2|ttf|otf)$|^\/(_app|_assets)\/.*|^\/(images|assets)\/.*|^\/favicon\.ico$/
);

const handleParaglide: Handle = async ({ event, resolve }) => {
	if (ignoredPathRegex.test(event.url.pathname)) {
		// check if the url is a static asset
		// 检查 URL 是否为静态资源
		return resolve(event);
	}

	const cacheIdCookie = event.cookies.get('_medusa_cache_id') || crypto.randomUUID();

	const regionMap = await getRegionMap(cacheIdCookie);

	const countryCode = regionMap && (await getCountryCode(event, regionMap));

	const urlHasCountryCode = countryCode && event.url.pathname.split('/')[1].includes(countryCode);

	// if one of the country codes is in the url and the cache id is set, return next
	// 如果 URL 中包含国家/地区代码且已设置缓存 ID，则返回下一个
	if (urlHasCountryCode && cacheIdCookie) {
		return paraglideMiddleware(event.request, ({ request: localizedRequest, locale }) => {
			event.request = localizedRequest;
			return resolve(event, {
				transformPageChunk: ({ html }: { html: string }) => html.replace('%paraglide.lang%', locale)
			});
		});
	}

	// if one of the country codes is in the url and the cache id is not set, set the cache id and redirect
	// 如果 URL 中包含国家/地区代码且未设置缓存 ID，则设置缓存 ID 并重定向。
	if (urlHasCountryCode && !cacheIdCookie) {
		event.cookies.set('_medusa_cache_id', cacheIdCookie, {
			path: '/',
			maxAge: 60 * 60 * 24
		});
		throw redirect(307, `${PUBLIC_BASE_URL}/${urlHasCountryCode}${event.url.pathname}`);
	}

	const redirectPath = event.url.pathname === '/' ? '' : event.url.pathname;

	const queryString = event.url.search ? event.url.search : '';

	// If no country code is set, we redirect to the relevant region.
	// 如果没有设置国家代码，我们将重定向到相关地区。
	if (!urlHasCountryCode && countryCode) {
		throw redirect(307, `${event.url.origin}/${countryCode}${redirectPath}${queryString}`);
	} else if (!urlHasCountryCode && !countryCode) {
		// Handle case where no valid country code exists (empty regions)
		// 处理不存在有效国家代码的情况（空区域）
		// throw error(500, {
		// 	message: 'Authentication required to access this resource.'
		// });
    throw redirect(307, `${event.url.origin}/${countryCode}${redirectPath}${queryString}?=1`);
	}

	return paraglideMiddleware(event.request, ({ request: localizedRequest, locale }) => {
		event.request = localizedRequest;
		return resolve(event, {
			transformPageChunk: ({ html }: { html: string }) => html.replace('%paraglide.lang%', locale)
		});
	});
};

export const handle: Handle = handleParaglide;
