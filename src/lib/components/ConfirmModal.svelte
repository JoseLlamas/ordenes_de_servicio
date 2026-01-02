<script>
  import Modal from './Modal.svelte';

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
   * @param {{ title?: string, texto?: string }} param0
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
    resolver?.(false);
    resolver = null;
  }

  function clicInAceptar () {
    dialog?.close();
    resolver?.(true);
    resolver = null;
  }

</script>

<Modal
  bind:dialog={dialog}
  title={estado.title}
>
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
</Modal>
