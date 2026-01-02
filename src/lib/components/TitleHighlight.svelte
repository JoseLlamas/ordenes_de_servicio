<script>
  /**
   * @type {{
   *  children?: import('svelte').Snippet
   * }}
   */
  let { children } = $props();
</script>

<h1 class="text-4xl font-extrabold text-[#9b1f3d] drop-shadow-sm">
  {@render children?.()}
</h1>
