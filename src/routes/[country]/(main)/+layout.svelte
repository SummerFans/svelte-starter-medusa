<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	// import { CART_API_ACTIONS } from '$lib/constants';
	// import { cart } from '$lib/stores/cart';
	// import Header from '$lib/components/layout/Header/index.svelte';
	// import Footer from '$lib/components/layout/Footer/index.svelte';

	let { children } = $props();

	// let { collections } = page.data;

	// onMount(async () => {
	// 	try {
	// 		const res = await fetch('/api/cart', {
	// 			method: 'POST',
	// 			headers: {
	// 				'Content-Type': `application/json`
	// 			},
	// 			body: JSON.stringify({
	// 				action: CART_API_ACTIONS.GET_CART
	// 			})
	// 		});
	// 		const result = (await res.json()) as { data: any; message: string; success: boolean };
	// 		if (result?.data) {
	// 			cart.set(result?.data);
	// 		}
	// 	} catch (e) {
	// 		console.error(e);
	// 	}
	// });
</script>

<!-- <Header /> -->
<div>
  <nav>
    <li>Link</li>
    <li>Link</li>
  </nav>
	{@render children()}
</div>
<!-- <Footer {collections} /> -->
