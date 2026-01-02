<script>
  /**
   * @type {{
   *  children?: import('svelte').Snippet
   * }}
   */
  let { children } = $props();
</script>

<h1 class="text-2xl font-semibold text-gray-700 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
  {@render children?.()}
</h1>
