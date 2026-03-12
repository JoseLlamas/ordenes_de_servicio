<script>
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import NavigationProgress from '$lib/components/NavigationProgress.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<NavigationProgress />
{@render children()}
