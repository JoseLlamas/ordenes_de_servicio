<script>
  import ConfirmModal from './ConfirmModal.svelte';
  import { confirmBeforeEnhance } from '$lib/actions/confirm_before_enhance';

  let confirmModal = $state();
</script>

<ConfirmModal bind:this={confirmModal} />

<form
  method="POST"
  action="/logout"
  class="inline"
  use:confirmBeforeEnhance={{ confirm: () => confirmModal.confirm({ texto: '¿Desea cerrar su sesión?' }) }}
>
  <button
    type="submit"
    class="text-red-600 hover:underline block px-3 py-2 rounded hover:bg-gray-300 hover:dark:text-[#2b2e37] cursor-pointer w-full text-left"
  >
    Cerrar sesión
  </button>
</form>
