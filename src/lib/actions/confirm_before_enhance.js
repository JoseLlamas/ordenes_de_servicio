/**
 *
 * @param {HTMLFormElement} node
 * @param {{ confirm: (opts?: { title?: string, message?: string}) => Promise<boolean> }} params
 * @returns
 */
export function confirmBeforeEnhance (node, params) {
  let bypass = false;

  /**
   *
   * @param {SubmitEvent} ev
   * @returns
   */
  async function onSubmit (ev) {
    // si venimos de un submit "autorizado", dejamos pasar
    if (bypass) {return;}

    // 1) Bloquea este submit (para que enhance NO corra)
    ev.preventDefault();
    ev.stopPropagation();
    ev.stopImmediatePropagation();

    const button = ev.submitter;

    if (button instanceof HTMLButtonElement || button instanceof HTMLInputElement) {
      button.disabled = true;
    }

    // 2) Pide confirmación
    const ok = await params.confirm?.({
      title: 'Confirmar envío',
      message: '¿Deseas continuar con esta acción?'
    });

    if (!ok) {
      if (button instanceof HTMLButtonElement || button instanceof HTMLInputElement) {
        button.disabled = false;
      }
      return;
    }

    // 3) Autoriza el siguiente submit y relánzalo
    bypass = true;
    try {
      node.requestSubmit(button ?? undefined); // enhance atrapará ESTE submit
    } finally {
      // devuelve el guard a estado normal en el próximo turno
      queueMicrotask(() => {
        if (button instanceof HTMLButtonElement || button instanceof HTMLInputElement) {
          button.disabled = false;
        }
        bypass = false;
      });
    }
  }

  node.addEventListener('submit', onSubmit);
  return {
    destroy () {
      node.removeEventListener('submit', onSubmit);
    }
  };
}
