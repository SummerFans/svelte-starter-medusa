import { MEDUSA_PUBLISHABLE_KEY, MEDUSA_BACKEND_URL, NODE_ENV } from '$env/static/private';
import Medusa from 'medusa-store-sdk';

export const sdk = new Medusa({
	baseUrl: MEDUSA_BACKEND_URL,
	debug: NODE_ENV === 'development',
	publishableKey: MEDUSA_PUBLISHABLE_KEY
});
