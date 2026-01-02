<script>
  /**
   * @type {{
   *  children?: import('svelte').Snippet
   * }}
   */
  let { children } = $props();
</script>

<h1 class="text-sm font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
  {@render children?.()}
</h1>
