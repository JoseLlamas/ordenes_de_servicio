<script>
    import { enhance } from '$app/forms';
    import { normalizePalabras } from '$lib/utils/normalize_palabras';

    let { ticket, agente } = $props();

</script>
<form
  action="?/borrarAgente"
  method="POST"
  class="flex flex-col sm:flex-row gap-1 pt-1"
  use:enhance={() => {
    return async ({ update }) => {
      await update();
    };
  }}
>
  <span>
    {normalizePalabras(
      agente.empleado.nombre,
      agente.empleado.primerApellido,
      agente.empleado.segundoApellido
    )}
  </span>
  <input type="hidden" name="ticketId" value={ticket.id} />
  <input type="hidden" name="agenteId" value={agente.id} />
  <button
    class="text-red-500 hover:text-red-700 cursor-pointer"
    aria-label="dsf"
  >
    <svg
      class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
    >
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6l-2 14H7L5 6"></path>
      <path d="M10 11v6"></path>
      <path d="M14 11v6"></path>
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>
    </svg>
  </button>
</form>
