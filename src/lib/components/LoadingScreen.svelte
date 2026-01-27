<script>
  /**
   * @type {{
   *  hidden?: boolean,
   *  onclose?: () => void,
   *  children?: import('svelte').Snippet
   * }}
   */
  let {
    hidden = true,
    onclose,
    children
  } = $props();

  /**
   * @type {HTMLDialogElement | null}
   */
  let dialogRef = $state(null);

  $effect(() => {
    if (!dialogRef) {
      return;
    }

    if (hidden) {
      dialogRef.close();
    } else {
      dialogRef.showModal();
    }
  });

  function handleClose () {
    onclose?.();
  }
</script>

<dialog
  bind:this={dialogRef}
  onclose={handleClose}
  onkeydown={(event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
    }
  }}
  oncancel={(e) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
  }}
  class="backdrop:bg-black/70 bg-transparent border-0 outline-0"
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
</dialog>

<style>
  /* Centrar el dialog */
  dialog {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    margin: 0;
    padding: 0;
  }

  /* Animación de entrada (opcional) */
  dialog[open] {
    animation: fadeIn 0.2s ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  }
</style>
