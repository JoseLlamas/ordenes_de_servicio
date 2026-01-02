<script>
  import { onMount } from 'svelte';

  let { children = null, theme = $bindable('light') } = $props();

  onMount(() => {
    const storedTheme = localStorage.getItem('theme') ?? 'light';
    theme = storedTheme;
    document.documentElement.classList.toggle('dark', theme === 'dark');
  });
  $effect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  });
</script>

{@render children?.()}
