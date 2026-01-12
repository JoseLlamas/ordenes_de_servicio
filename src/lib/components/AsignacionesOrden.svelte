<!-- src/lib/components/AsignacionesOrden.svelte -->
<script>
  import { enhance } from '$app/forms';
  import Avatar from '$lib/components/Avatar.svelte';
  import { normalizePalabras } from '$lib/utils';

  /**
   * @import { OrdenServicioDetalleDTO } from '$lib/types';
   * @typedef {OrdenServicioDetalleDTO['agentes'][number]} Agente
   */

  /**
   * @type {{
   *  ordenServicioId: number,
   *  agentes: Agente[]
   * }}
   */
  let {
    ordenServicioId,
    agentes = []
  } = $props();

  /**
   * @type {number | null}
   */
  let removiendoId = $state(null);
</script>

<div class="bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
  <div class="flex items-center justify-between mb-3">
    <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
      Agentes Asignados
    </p>
    {#if agentes.length > 0}
      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
        {agentes.length}
      </span>
    {/if}
  </div>

  {#if agentes.length === 0}
    <div class="text-center py-6">
      <svg class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
        No hay agentes asignados
      </p>
    </div>
  {:else}
    <div class="space-y-3">
      {#each agentes as agente (agente.id)}
        <div class="flex items-start gap-3 p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <Avatar
            size="medium"
            avatar={agente.avatar}
            usuarioNombreCompleto={normalizePalabras(agente.empleado.nombre, agente.empleado.primerApellido, agente.empleado.segundoApellido ?? '')}
            rolNombre={agente.rol.nombre}
          />

          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 dark:text-white">
              {normalizePalabras(agente.empleado.nombre, agente.empleado.primerApellido, agente.empleado.segundoApellido ?? '')}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              @{agente.nombreUsuario}
            </p>
          </div>

          <!-- Botón de eliminar -->
          <form
            method="POST"
            action="?/desasignar"
            use:enhance={() => {
              removiendoId = agente.id;
              return async ({ update }) => {
                await update();
                removiendoId = null;
              };
            }}
          >
            <input type="hidden" name="asignacionId" value={agente.id} />
            <input type="hidden" name="ordenId" value={ordenServicioId} />
            <button
              type="submit"
              disabled={removiendoId === agente.id}
              class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed dark:hover:bg-red-950/30 dark:hover:text-red-400"
              title="Quitar asignación"
            >
              {#if removiendoId === agente.id}
                <svg class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              {:else}
                <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
              {/if}
            </button>
          </form>
        </div>
      {/each}
    </div>
  {/if}
</div>
