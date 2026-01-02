<script>
  /**
   * @type {{
   *  children?: import('svelte').Snippet
   * }}
   */
  let { children } = $props();
</script>

<h1 class="text-3xl font-bold text-gray-800 dark:text-white">
  {@render children?.()}
</h1>
