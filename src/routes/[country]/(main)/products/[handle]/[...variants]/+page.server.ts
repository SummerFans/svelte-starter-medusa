import { error } from '@sveltejs/kit';
import type { EntryGenerator, PageServerLoad } from './$types';

export const prerender = true;

export const entries: EntryGenerator = async (): Promise<
	{
		country: string;
		handle: string;
		variants: string;
	}[]
> => {
	return [
		{
			country: 'us',
			handle: 'xxxx',
			variants: 'red/xl'
		}
	];
};

export const load: PageServerLoad = async ({ params }) => {
	const { country, handle } = params;

	const product = {
		handle
	};

	if (product) {
		return {
			product,
			country,
			handle
		};
	}

	error(404, 'Not found');
};
