<script>
  import Avatar from '$lib/components/Avatar.svelte';
import { formatearFecha, normalizePalabras } from '$lib/utils';
  let { data } = $props();

  const { ordenServicio } = $derived(data);

  let tabActual = $state('detalles');

  const tabs = [
    { id: 'detalles', nombre: 'Detalles', icono: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { id: 'activos', nombre: 'Activos', icono: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', badge: ordenServicio.activos?.length || 0 },
    { id: 'historial', nombre: 'Historial', icono: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' }
  ];

  /**
   * Mapeo de estados a colores
   * @param {string} estado
   */
  function getEstadoColor (estado) {
    const colores = {
      'NUEVO': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800',
      'en_progreso': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
      'cerrado': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800',
      'cancelado': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800'
    };
    return colores[estado] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
  }

  /**
   * Mapeo de prioridades a colores
   * @param {string} prioridad
   */
  function getPrioridadColor (prioridad) {
    const colores = {
      'baja': 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 border-gray-200 dark:border-gray-700',
      'media': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
      'alta': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-800',
      'urgente': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800'
    };
    return colores[prioridad] || colores.media;
  }

  /**
   * Formatear nombre completo
   * @param {{ nombre: string, primerApellido: string, segundoApellido: string | null }} persona
   */
  function escribirNombreCompleto (persona) {
    return normalizePalabras(persona.nombre, persona.primerApellido, persona.segundoApellido ?? '');
  }

  /**
   * Obtener iniciales
   * @param {{ nombre: string, primerApellido: string }} persona
   */
  function getIniciales (persona) {
    return `${persona.nombre.charAt(0)}${persona.primerApellido.charAt(0)}`;
  }
</script>

<svelte:head>
  <title>Orden #{ordenServicio.id} - {ordenServicio.categoriaOrden.descripcion}</title>
</svelte:head>

<!-- Header -->
<div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
  <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
    <div class="flex-1">
      <div class="flex items-center gap-3 mb-2">
        <a
          href="/ordenes"
          class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </a>
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Orden #{ordenServicio.id}
        </h1>
        <span class="inline-flex px-3 py-1 rounded-lg text-xs font-medium border {getEstadoColor(ordenServicio.estado)}">
          {ordenServicio.estado.replace('_', ' ').toUpperCase()}
        </span>
        <span class="inline-flex px-3 py-1 rounded-lg text-xs font-medium border {getPrioridadColor(ordenServicio.prioridad)}">
          {ordenServicio.prioridad.toUpperCase()}
        </span>
      </div>
      <p class="text-sm text-gray-600 dark:text-gray-400">
        {ordenServicio.categoriaOrden.descripcion}
      </p>
      <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">
        Creado el {formatearFecha(ordenServicio.creadoEn)}
      </p>
    </div>

    <!-- Botones de acción -->
    <div class="flex flex-wrap gap-2">
      <button class="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        Editar
      </button>

      {#if ordenServicio.estado === 'NUEVO'}
        <button class="px-4 py-2 rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-colors flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Cerrar
        </button>
      {/if}

      <button class="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
        </svg>
        Imprimir
      </button>
    </div>
  </div>
</div>

<!-- Tabs -->
<div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
  <div class="border-b border-gray-200 dark:border-gray-700">
    <nav class="flex -mb-px overflow-x-auto">
      {#each tabs as tab, index (index)}
        <button
          onclick={() => tabActual = tab.id}
          class="flex-shrink-0 px-6 py-4 text-sm font-medium border-b-2 transition-colors {
            tabActual === tab.id
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
          }"
        >
          <div class="flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={tab.icono} />
            </svg>
            <span>{tab.nombre}</span>
            {#if tab.badge !== undefined && tab.badge > 0}
              <span class="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-blue-600 dark:bg-blue-500 rounded-full">
                {tab.badge}
              </span>
            {/if}
          </div>
        </button>
      {/each}
    </nav>
  </div>

  <div class="p-6">
    {#if tabActual === 'detalles'}
      <!-- ==================== TAB DETALLES ==================== -->
      <div class="space-y-6">

        <!-- Descripción -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Descripción
          </h3>
          <div class="bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <p class="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {ordenServicio.descripcion}
            </p>
          </div>
        </div>

        <!-- Grid de información -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

          <!-- Personal -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Personal Involucrado
            </h3>

            <div class="space-y-4">
              <!-- Solicitante -->
              <div class="bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                  Solicitante
                </p>
                <div class="flex items-start gap-3">
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 dark:text-white">
                      {escribirNombreCompleto(ordenServicio.empleadoSolicitante)}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      #{ordenServicio.empleadoSolicitante.numeroEmpleado ?? 'N/A'}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      {ordenServicio.empleadoSolicitante.cargo}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Encargado -->
              <div class="bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                  Encargado
                </p>
                <div class="flex items-start gap-3">
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 dark:text-white">
                      {escribirNombreCompleto(ordenServicio.encargadoAreaAsignada)}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      #{ordenServicio.encargadoAreaAsignada.numeroEmpleado ?? 'N/A'}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      {ordenServicio.encargadoAreaAsignada.cargo}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Creado por -->
              <div class="bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                  Creado por
                </p>
                <div class="flex items-start gap-3">
                  <Avatar
                    size="medium"
                    avatar={ordenServicio.creadoPor.avatar}
                    usuarioNombreCompleto={escribirNombreCompleto(ordenServicio.creadoPor.empleado)}
                    rolNombre={ordenServicio.creadoPor.rol.nombre}
                  />
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 dark:text-white">
                      {escribirNombreCompleto(ordenServicio.creadoPor.empleado)}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      @{ordenServicio.creadoPor.nombreUsuario}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Detalles y Áreas -->
          <div class="space-y-6">

            <!-- Áreas -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Áreas
              </h3>

              <div class="bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-3">
                <div>
                  <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                    Área Solicitante
                  </p>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    {ordenServicio.areaSolicitante.nombre}
                  </p>
                </div>

                <div>
                  <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                    Área Asignada
                  </p>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    {ordenServicio.areaAsignada.nombre}
                  </p>
                </div>
              </div>
            </div>

            <!-- Información adicional -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Información Adicional
              </h3>

              <div class="bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <dl class="space-y-3">
                  {#if ordenServicio.tipoEntrada}
                    <div>
                      <dt class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Tipo de Entrada
                      </dt>
                      <dd class="text-sm text-gray-900 dark:text-white mt-1">
                        {ordenServicio.tipoEntrada}
                      </dd>
                    </div>
                  {/if}

                  {#if ordenServicio.numeroOficio}
                    <div>
                      <dt class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Número de Oficio
                      </dt>
                      <dd class="text-sm text-gray-900 dark:text-white mt-1">
                        {ordenServicio.numeroOficio}
                      </dd>
                    </div>
                  {/if}

                  {#if ordenServicio.telefonoSolicitante}
                    <div>
                      <dt class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Teléfono Solicitante
                      </dt>
                      <dd class="text-sm text-gray-900 dark:text-white mt-1">
                        {ordenServicio.telefonoSolicitante}
                      </dd>
                    </div>
                  {/if}

                  {#if ordenServicio.otroCategoriaOrden}
                    <div>
                      <dt class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Otra Categoría
                      </dt>
                      <dd class="text-sm text-gray-900 dark:text-white mt-1">
                        {ordenServicio.otroCategoriaOrden}
                      </dd>
                    </div>
                  {/if}
                </dl>
              </div>
            </div>

            <!-- Fechas -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Fechas
              </h3>

              <div class="bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-3">
                <div>
                  <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                    Creado
                  </p>
                  <p class="text-sm text-gray-900 dark:text-white">
                    {formatearFecha(ordenServicio.creadoEn)}
                  </p>
                </div>

                {#if ordenServicio.cerradoEn}
                  <div>
                    <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                      Cerrado
                    </p>
                    <p class="text-sm text-gray-900 dark:text-white">
                      {formatearFecha(ordenServicio.cerradoEn)}
                    </p>
                    {#if ordenServicio.cerradoPor}
                      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Por: {ordenServicio.cerradoPor.empleado.nombre} {ordenServicio.cerradoPor.empleado.primerApellido}
                      </p>
                    {/if}
                  </div>
                {/if}

                {#if ordenServicio.canceladoEn}
                  <div>
                    <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                      Cancelado
                    </p>
                    <p class="text-sm text-gray-900 dark:text-white">
                      {formatearFecha(ordenServicio.canceladoEn)}
                    </p>
                    {#if ordenServicio.canceladoPor}
                      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Por: {ordenServicio.canceladoPor.empleado.nombre} {ordenServicio.canceladoPor.empleado.primerApellido}
                      </p>
                    {/if}
                  </div>
                {/if}
              </div>
            </div>

          </div>
        </div>
      </div>

    {:else if tabActual === 'activos'}
      <!-- ==================== TAB ACTIVOS ==================== -->
      <div>
        {#if ordenServicio.activos && ordenServicio.activos.length > 0}
          <div class="mb-4 flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Total: {ordenServicio.activos.length} {ordenServicio.activos.length === 1 ? 'activo' : 'activos'}
            </h3>
            <button class="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg transition-colors">
              Agregar activo
            </button>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {#each ordenServicio.activos as activo(activo.id)}
              <div class="group bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg transition-all relative">

                <!-- Botón eliminar (solo aparece en hover) -->
                <button
                  type="button"
                  aria-label="Eliminar activo {activo.numeroInventario}"
                  class="
                    absolute top-3 right-3 p-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100
                    text-gray-400 dark:text-gray-500
                    hover:text-red-600 dark:hover:text-red-400
                    hover:bg-red-50 dark:hover:bg-red-950/30
                  "
                >
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6l-2 14H7L5 6"></path>
                    <path d="M10 11v6"></path>
                    <path d="M14 11v6"></path>
                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>
                  </svg>
                </button>

                <div class="space-y-3 pr-6">
                  <!-- Inventario -->
                  <div>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Inventario</p>
                    <p class="text-sm font-semibold text-gray-900 dark:text-white">
                      {activo.numeroInventario ?? 'N/A'}
                    </p>
                  </div>

                  <!-- Serie -->
                  <div>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Serie</p>
                    <p class="text-sm font-medium text-gray-900 dark:text-white">
                      {activo.numeroSerie ?? 'N/A'}
                    </p>
                  </div>

                  <!-- Marca y Modelo -->
                  <div class="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                    <div>
                      <p class="text-xs text-gray-500 dark:text-gray-400">Marca</p>
                      <p class="text-sm text-gray-900 dark:text-white truncate">
                        {activo.marca ?? 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p class="text-xs text-gray-500 dark:text-gray-400">Modelo</p>
                      <p class="text-sm text-gray-900 dark:text-white truncate">
                        {activo.modelo ?? 'N/A'}
                      </p>
                    </div>
                  </div>

                  <!-- Categoría -->
                  {#if activo.categoriaActivo}
                    <div class="pt-2 border-t border-gray-200 dark:border-gray-700">
                      <span class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                        {activo.categoriaActivo.descripcion}
                      </span>
                    </div>
                  {/if}

                  <!-- Observaciones -->
                  {#if activo.observaciones}
                    <div class="pt-2 border-t border-gray-200 dark:border-gray-700">
                      <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Observaciones</p>
                      <p class="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                        {activo.observaciones}
                      </p>
                    </div>
                  {/if}
                </div>
              </div>
            {/each}
          </div>
        {:else}
          <!-- Estado vacío -->
          <div class="text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              No hay activos
            </h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Esta orden no tiene activos asociados
            </p>
            <div class="mt-6">
              <button class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                <svg class="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Agregar activo
              </button>
            </div>
          </div>
        {/if}
      </div>

    {:else if tabActual === 'historial'}
      <!-- ==================== TAB HISTORIAL ==================== -->
      <div>
        <div class="flow-root">
          <ul class="-mb-8">
            <!-- Evento: Creado -->
            <li>
              <div class="relative pb-8">
                <span class="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700" aria-hidden="true"></span>
                <div class="relative flex items-start space-x-3">
                  <div>
                    <div class="relative px-1">
                      <div class="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 ring-8 ring-white dark:ring-gray-800">
                        <svg class="h-5 w-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div class="min-w-0 flex-1">
                    <div>
                      <div class="text-sm">
                        <span class="font-medium text-gray-900 dark:text-white">
                          {ordenServicio.creadoPor.empleado.nombre} {ordenServicio.creadoPor.empleado.primerApellido}
                        </span>
                        <span class="text-gray-500 dark:text-gray-400"> creó la orden</span>
                      </div>
                      <p class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                        {formatearFecha(ordenServicio.creadoEn)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </li>

            <!-- Evento: Cerrado (si existe) -->
            {#if ordenServicio.cerradoEn && ordenServicio.cerradoPor}
              <li>
                <div class="relative pb-8">
                  <span class="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700" aria-hidden="true"></span>
                  <div class="relative flex items-start space-x-3">
                    <div>
                      <div class="relative px-1">
                        <div class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 ring-8 ring-white dark:ring-gray-800">
                          <svg class="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div class="min-w-0 flex-1">
                      <div>
                        <div class="text-sm">
                          <span class="font-medium text-gray-900 dark:text-white">
                            {ordenServicio.cerradoPor.empleado.nombre} {ordenServicio.cerradoPor.empleado.primerApellido}
                          </span>
                          <span class="text-gray-500 dark:text-gray-400"> cerró la orden</span>
                        </div>
                        <p class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                          {formatearFecha(ordenServicio.cerradoEn)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            {/if}

            <!-- Evento: Cancelado (si existe) -->
            {#if ordenServicio.canceladoEn && ordenServicio.canceladoPor}
              <li>
                <div class="relative pb-8">
                  <div class="relative flex items-start space-x-3">
                    <div>
                      <div class="relative px-1">
                        <div class="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 ring-8 ring-white dark:ring-gray-800">
                          <svg class="h-5 w-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div class="min-w-0 flex-1">
                      <div>
                        <div class="text-sm">
                          <span class="font-medium text-gray-900 dark:text-white">
                            {ordenServicio.canceladoPor.empleado.nombre} {ordenServicio.canceladoPor.empleado.primerApellido}
                          </span>
                          <span class="text-gray-500 dark:text-gray-400"> canceló la orden</span>
                        </div>
                        <p class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                          {formatearFecha(ordenServicio.canceladoEn)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            {/if}
          </ul>
        </div>

        <!-- Mensaje si no hay eventos -->
        {#if !ordenServicio.cerradoEn && !ordenServicio.canceladoEn}
          <div class="mt-8 text-center py-8 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            <p class="text-sm text-gray-500 dark:text-gray-400">
              No hay más eventos en el historial
            </p>
          </div>
        {/if}
      </div>
    {/if}
  </div>
</div>
