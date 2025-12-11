<script lang="ts">
	import { page } from '$app/state';

	const { url } = page.data;
</script>

<h1>Welcome to SvelteKit</h1>
<p>enable:prerender 001</p>
<p>{url}</p>
