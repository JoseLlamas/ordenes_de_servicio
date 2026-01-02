<script>
  let { children = null } = $props();
</script>

<div class="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
  <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
    {@render children?.()}
  </h2>
</div>
