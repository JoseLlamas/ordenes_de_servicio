<script>
  /**
   * @type {{
   *  children?: import('svelte').Snippet
   * }}
   */
  let { children } = $props();
</script>
<p class="
  text-red-500
  text-xs
  mt-1
  flex
  items-center
  space-x-1
  bg-red-100
  rounded-lg
  p-2
  border-l-2
  border-red-500"
>
  <span>⚠️</span>
  <span>{@render children?.()}</span>
</p>
