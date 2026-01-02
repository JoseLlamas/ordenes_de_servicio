<script>
  let { children = null } = $props();
</script>

<div class="w-full flex justify-end mb-2">
  <div class="relative max-w-[75%] px-4 py-2 text-sm shadow rounded-2xl bg-green-500 text-white rounded-br-none before:content-[''] before:absolute before:top-2 before:right-0 before:translate-x-full before:border-l-[8px] before:border-t-[8px] before:border-t-transparent before:border-l-green-500">
    {@render children?.()}
  </div>
</div>

<div class="w-full flex justify-start mb-2">
  <div class="relative max-w-[75%] px-4 py-2 text-sm shadow rounded-2xl bg-gray-200 text-gray-900 rounded-bl-none before:content-[''] before:absolute before:top-2 before:left-0 before:-translate-x-full before:border-r-[8px] before:border-t-[8px] before:border-t-transparent before:border-r-gray-200">
    {@render children?.()}
  </div>
</div>
