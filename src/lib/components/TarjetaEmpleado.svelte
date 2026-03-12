<script>
    import { escribirNombreCompleto } from '$lib/utils';

  /**
   * @import { EmpleadoDetalleDTO } from '$lib/types';
  */

  /**
   * @type {{
   *   empleado: EmpleadoDetalleDTO,
   *   onDarDeBaja?: (empleado: EmpleadoDetalleDTO) => void,
   *   onCrearOS?: (empleadoId: number) => void,
   *   onBuscarOrdenes?: (empleadoId:number) => void,
   *   class?: string
   * }}
   */
  let {
    empleado,
    onDarDeBaja,
    onCrearOS,
    onBuscarOrdenes,
    class: className = ''
  } = $props();

  /**
   * @param {typeof empleado} empleado
   * @returns {typeof empleado}
   */
  function copiarEmpleado (empleado) {
    return {
      id: empleado.id,
      nombre: empleado.nombre,
      primerApellido: empleado.primerApellido,
      segundoApellido: empleado.segundoApellido,
      activo: empleado.activo,
      cargo: empleado.cargo,
      area: {
        id: empleado.area.id,
        nombre: empleado.area.nombre
      },
      direccionGeneral: {
        id: empleado.direccionGeneral.id,
        nombre: empleado.direccionGeneral.nombre
      }
    };
  }
</script>

<article class="
  group
  bg-white dark:bg-gray-800
  border border-gray-200 dark:border-gray-700
  rounded-xl
  shadow-sm
  hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50
  transition-all duration-300
  overflow-hidden
  {className}
">
  <!-- Header con avatar y info principal -->
  <div class="p-6">
    <div class="flex items-start gap-4">

      <!-- Información principal -->
      <div class="flex-1 min-w-0">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
          {escribirNombreCompleto(empleado)}
        </h3>

        <p class="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
          {empleado.cargo}
        </p>

        <!-- Badge de estado (opcional) -->
        {#if typeof empleado.activo === 'boolean'}
          <span class="
            inline-flex items-center gap-1 px-2 py-0.5 mt-2 rounded-full text-xs font-medium
            {empleado.activo
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
            }
          ">
            <span class="w-1.5 h-1.5 rounded-full {empleado.activo ? 'bg-green-500' : 'bg-gray-500'}"></span>
            {empleado.activo ? 'Activo' : 'Inactivo'}
          </span>
        {/if}
      </div>
    </div>
  </div>

  <!-- Información detallada -->
  <div class="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-y border-gray-200 dark:border-gray-700">
    <dl class="space-y-3">
      <!-- Dirección General -->
      <div class="flex items-start gap-3">
        <svg class="w-5 h-5 text-gray-400 dark:text-gray-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        <div class="flex-1 min-w-0">
          <dt class="text-xs font-medium text-gray-500 dark:text-gray-400">Dirección General</dt>
          <dd class="text-sm text-gray-900 dark:text-gray-100 mt-0.5">{empleado.direccionGeneral.nombre}</dd>
        </div>
      </div>

      <!-- Área -->
      <div class="flex items-start gap-3">
        <svg class="w-5 h-5 text-gray-400 dark:text-gray-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <div class="flex-1 min-w-0">
          <dt class="text-xs font-medium text-gray-500 dark:text-gray-400">Área</dt>
          <dd class="text-sm text-gray-900 dark:text-gray-100 mt-0.5">{empleado.area.nombre}</dd>
        </div>
      </div>
    </dl>
  </div>

  <!-- Acciones -->
  <div class="p-4 bg-white dark:bg-gray-800">
    <!-- Desktop: botones en fila -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-2">
      {#if empleado.activo && onCrearOS != null}
        <button
          type="button"
          onclick={() => onCrearOS(empleado.id)}
          class="
            flex-1 flex items-center justify-center gap-2
            px-4 py-2.5 rounded-lg
            bg-blue-600 hover:bg-blue-700
            text-white font-medium text-sm
            transition-colors
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800
          "
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Crear OS
        </button>
      {/if}

      {#if onBuscarOrdenes != null}
        <button
          type="button"
          onclick={() => onBuscarOrdenes(empleado.id)}
          class="
            flex-1 flex items-center justify-center gap-2
            px-4 py-2.5 rounded-lg
            bg-blue-600 hover:bg-blue-700
            text-white font-medium text-sm
            transition-colors
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800
          "
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Buscar ordenes
        </button>
      {/if}

      {#if empleado.activo && onDarDeBaja != null}
        <button
          type="button"
          onclick={() => onDarDeBaja(copiarEmpleado(empleado))}
          class="
            flex items-center justify-center gap-2
            px-4 py-2.5 rounded-lg
            bg-red-50 hover:bg-red-100
            dark:bg-red-900/20 dark:hover:bg-red-900/30
            text-red-600 dark:text-red-400
            font-medium text-sm
            transition-colors
            focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800
          "
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Dar de baja
        </button>
      {/if}
    </div>

  </div>
</article>
