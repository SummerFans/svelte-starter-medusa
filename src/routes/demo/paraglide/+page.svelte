<script lang="ts">
	import { setLocale } from '$lib/paraglide/runtime';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { m } from '$lib/paraglide/messages.js';
</script>

<h1>{m.hello_world({ name: 'SvelteKit User' })}</h1>
<div>
	<button onclick={() => setLocale('en-us')}>en-us</button>
	<button onclick={() => setLocale('en-uk')}>en-uk</button>
	<button onclick={() => setLocale('de-de')}>de-de</button>
	<button onclick={() => setLocale('zh-cn')}>zh-cn</button>
</div>
<p>
	If you use VSCode, install the 2
</p>
