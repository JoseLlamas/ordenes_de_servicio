<script>
  /**
   * @type {{
   *  children?: import('svelte').Snippet
   * }}
   */
  let { children } = $props();
</script>

<div class="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
  <p class="text-sm text-red-800 dark:text-red-200">
    {@render children?.()}
  </p>
</div>
