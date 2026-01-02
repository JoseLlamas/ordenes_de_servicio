<script>
  /**
   * @type {{
   *  children?: import('svelte').Snippet
   * }}
   */
  let { children } = $props();
</script>

<p class="
  text-yellow-700
  text-xs
  mt-1
  flex
  items-center
  space-x-1
  bg-yellow-100
  rounded-lg
  p-2
  border-l-2
  border-yellow-500"
>
  <span>⚠️</span>
  <span>{@render children?.()}</span>
</p>
