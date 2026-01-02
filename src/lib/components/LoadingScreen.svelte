<script>
  let {
    hidden,
    onclose = null,
    children = null
  } = $props();
  $effect(() => {
    if (hidden) {
      onclose?.();
    }
  });
</script>

<div
  id="loading-screen"
  class="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
  class:hidden
>
  <div class="flex flex-col items-center space-y-2">
    <div
      class="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"
    ></div>
    {#if children}
      <p class="text-white text-lg mt-4">
        {@render children()}
      </p>
    {:else}
      <p class="text-white text-lg mt-4">
        Trabajando...
      </p>
    {/if}
  </div>
</div>
