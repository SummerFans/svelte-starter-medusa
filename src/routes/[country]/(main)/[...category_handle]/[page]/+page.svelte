<script lang="ts">
	import { page } from '$app/state';
	const { categorys,category, page: pageNum } = page.data;
</script>

<h1>Categorys:{categorys.join('/')}</h1>
<p>Category:{category}</p>
<p>page:{pageNum}</p>
