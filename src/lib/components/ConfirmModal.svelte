<script>
  /**
   * @type {HTMLDialogElement | undefined}
   */
  let dialog = $state();

  /**
   * @type {((value: any) => void) | null}
   */
  let resolver = $state(null);

  let estado = $state({ title: '', texto: '' });

  /**
   *
   * @param {{ title?: string, texto?: string }} [param0]
   * @return {Promise<boolean>}
   */
  export async function confirm ({
    title = 'Confirmar Acción',
    texto = '¿Seguro que quieres continuar con esta acción?' } = {}) {
    estado.title = title;
    estado.texto = texto;
    dialog?.showModal();
    return new Promise((resolve) => {
      resolver = resolve;
    });
  }

  function clicInCancelar () {
    dialog?.close();
  }

  function clicInAceptar () {
    dialog?.close();
    resolver?.(true);
    resolver = null;
  }
</script>

<dialog
  bind:this={dialog}
  onclose={() => {
    if (resolver != null) {
      resolver(false);
      resolver = null;
    }
  }}
  class="
    fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
    rounded-xl p-2 shadow-3xl backdrop:bg-black/50 backdrop:backdrop-blur-md
    bg-white dark:bg-[#22242b] text-gray-600 dark:text-gray-300
  "
>
  <div class="flex items-center justify-between p-3 border-b
   bg-gray-100 dark:bg-gray-800 rounded-t-xl">
    <div class="h-5 w-5"></div>

    <h2 class="text-lg font-semibold">
      {estado.title}
    </h2>

    <button
      class="text-gray-500 hover:text-red-500 transition text-xl leading-none cursor-pointer"
      onclick={() => clicInCancelar()}
      aria-label="Cerrar"
    >
      &times;
    </button>
  </div>
  <div class="p-2 space-y-4">
    <p class="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
      {estado.texto}
    </p>
    <div class="mt-6 flex justify-end gap-3">
      <button
        type="button"
        class="px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600
                text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
        onclick={() => clicInCancelar()}
      >
        Cancelar
      </button>
      <button
        type="button"
        class="px-4 py-2 rounded-lg bg-[#9b1f3d] text-white font-medium
                hover:opacity-90 transition"
        onclick={() => clicInAceptar()}
      >
        Aceptar
      </button>
    </div>
  </div>
</dialog>
