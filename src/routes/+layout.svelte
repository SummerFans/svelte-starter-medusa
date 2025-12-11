<script lang="ts">
	let { children } = $props();
</script>
<!-- <script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head> -->

{@render children()}
