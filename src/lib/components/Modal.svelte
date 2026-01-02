<script>
  /**
   * @type {{
   *  dialog?: HTMLDialogElement,
   *  children?: import('svelte').Snippet,
   *  onclose?: () => void,
   *  fetching?: boolean,
   *  title?: string
   * }}
   */
  let {
    dialog = $bindable(),
    children,
    onclose,
    fetching = false,
    title
  } = $props();
</script>

<!-- Modal -->
<dialog
  bind:this={dialog}
  closedby="any"
  class="
    fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
    rounded-xl p-6 shadow-3xl backdrop:bg-black/50 backdrop:backdrop-blur-md
    bg-white dark:bg-[#22242b] text-gray-600 dark:text-gray-300
    w-full min-w-sm max-w-4xl
  "
  onclose={() => onclose?.()}
>
  <div class="flex items-center justify-between p-3 border-b
   bg-gray-100 dark:bg-gray-800 rounded-t-xl">
    <!-- Spinner -->
    {#if fetching}
      <div class="animate-spin h-5 w-5 border-2 border-gray-400
      border-t-transparent rounded-full"></div>
    {:else}
      <div class="h-5 w-5"></div>
    {/if}

    {#if title}
      <h2 class="text-lg font-semibold">
        {title}
      </h2>
    {/if}

    <button
      class="text-gray-500 hover:text-red-500 transition text-xl leading-none cursor-pointer"
      onclick={() => {
        dialog?.close();
      }}
      aria-label="Cerrar"
    >
      &times;
    </button>
  </div>
  <div class="p-2 space-y-4">
    {@render children?.()}
  </div>
</dialog>
