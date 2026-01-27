<script>
  /**
   * @type {{
   *  children?: import('svelte').Snippet,
   *  onclose?: () => void,
   *  working?: boolean,
   *  title?: string
   * }}
   */
  let {
    children,
    onclose,
    working = false,
    title
  } = $props();

  /**
   * @type {HTMLDialogElement | undefined}
   */
  let dialog = $state();

  export function open () {
    dialog?.showModal();
  }

  export function close () {
    dialog?.close();
  }
</script>

<!-- Modal -->
<dialog
  bind:this={dialog}
  class="
    fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
    rounded-xl p-6 shadow-3xl backdrop:bg-black/50 backdrop:backdrop-blur-md
    bg-white dark:bg-[#22242b] text-gray-600 dark:text-gray-300
    w-full min-w-sm max-w-4xl
  "
  onkeydown={(event) => {
    if (working && event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
    }
  }}
  oncancel={(e) => {
    if (working) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    }
  }}
  onclose={() => onclose?.()}
>
  <div class="flex items-center justify-between p-3 border-b bg-gray-100 dark:bg-gray-800 rounded-t-xl">
    <!-- Lado izquierdo: Spinner o espacio vacío -->
    <div class="w-5 h-5 flex items-center justify-center">
      {#if working}
        <div class="animate-spin h-5 w-5 border-2 border-gray-400 border-t-transparent rounded-full"></div>
      {/if}
    </div>

    <!-- Centro: Título (crece para ocupar espacio) -->
    <h2 class="text-lg font-semibold flex-1 text-center">
      {title || ''}
    </h2>

    <!-- Lado derecho: Botón cerrar -->
    <button
      disabled={working}
      class="
        w-8 h-8 flex items-center justify-center
        text-gray-500 hover:text-red-500
        disabled:opacity-50 disabled:cursor-not-allowed
        transition text-2xl leading-none
      "
      onclick={() => dialog?.close()}
      aria-label="Cerrar"
    >
      &times;
    </button>
  </div>
  <div class="p-2 space-y-4">
    {@render children?.()}
  </div>
</dialog>
