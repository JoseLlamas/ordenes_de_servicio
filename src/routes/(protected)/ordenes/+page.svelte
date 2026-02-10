<!-- src/routes/(protected)/ordenes/+page.svelte -->
<script>
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import ButtonAccept from '$lib/components/ButtonAccept.svelte';
  import Input from '$lib/components/Input.svelte';
  import Select from '$lib/components/Select.svelte';
  import SinResultados from '$lib/components/SinResultados.svelte';
  import {
    formatearFechaRelativa,
    getEstadoColor,
    getPrioridadColor,
    escribirNombreCompleto,
    obtenerInicialesParaAvatar,
    setValueQueryString
  } from '$lib/utils';

  let { data } = $props();

  /**
   * @type {{
   *  fecha: string,
   *  estado: string | null,
   *  prioridad: string | null
   * }}
   */
  let filtrosSeleccionados = $state({
    fecha: '',
    estado: null,
    prioridad: null
  });

  let filtrosCache = { ...filtrosSeleccionados };

  /**
   *
   * @param {number} nuevaPagina
   * @param {typeof filtrosCache} filtros
   */
  function irAPagina (nuevaPagina, filtros) {
    const url = new URL(page.url);
    setValueQueryString(url, 'pagina', nuevaPagina.toString());
    setValueQueryString(url, 'fecha', filtros.fecha);
    setValueQueryString(url, 'estado', filtros.estado);
    setValueQueryString(url, 'prioridad', filtros.prioridad);
    goto(url.toString(), { invalidateAll: true, replaceState: false });
  }

  function buscar () {
    filtrosCache = { ...filtrosSeleccionados };
    irAPagina(1, filtrosCache);
  }

  let paginasVisibles = $derived.by(() => {
    const { paginaActual, totalPaginas } = data.paginacion;
    const paginas = [];

    let inicio = Math.max(1, paginaActual - 3);
    let fin = Math.min(totalPaginas, paginaActual + 3);

    if (paginaActual <= 4) {
      fin = Math.min(7, totalPaginas);
    }
    if (paginaActual >= totalPaginas - 3) {
      inicio = Math.max(1, totalPaginas - 6);
    }

    for (let i = inicio; i <= fin; i++) {
      paginas.push(i);
    }
    return paginas;
  });
</script>

<svelte:head>
  <title>Órdenes de Servicio</title>
</svelte:head>

<!-- Header -->
<div class="mb-6 sm:mb-8">
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    <div>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Gestiona y da seguimiento a todas las órdenes
      </p>
    </div>
  </div>
</div>

<!-- Filtros -->
<div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 mb-6">
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
    <div>
      <Input
        label="Fecha"
        type="date"
        bind:value={filtrosSeleccionados.fecha}
      />
    </div>

    <div>
      <Select
        label="Estado"
        bind:value={filtrosSeleccionados.estado}
      >
        <option value="NUEVO">Nuevo</option>
        <option value="PROCESO">Proceso</option>
        <option value="PENDIENTE">Pendiente</option>
        <option value="RESUELTO">Resuelto</option>
        <option value="CERRADO">Cerrado</option>
        <option value="CANCELADO">Cancelado</option>
      </Select>
    </div>

    <div>
      <Select
        label="Prioridad"
        bind:value={filtrosSeleccionados.prioridad}
      >
        <option value="BAJA">Baja</option>
        <option value="MEDIA">Media</option>
        <option value="ALTA">Alta</option>
        <option value="CRITICA">Crítica</option>
      </Select>
    </div>

    <div class="lg:col-span-3">
      <ButtonAccept
        type="button"
        class="w-full"
        onclick={buscar}
      >
        Enviar
      </ButtonAccept>
    </div>
  </div>
</div>

<!-- Lista de Órdenes -->
<div class="space-y-2">
  {#each data.ordenesServicio as orden (orden.id)}
    <a
      href="/ordenes/{orden.id}"
      class="block bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 sm:p-6 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700 transition-all group"
    >
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
        <div class="flex-1 min-w-0">
          <!-- ID y Badges -->
          <div class="flex flex-wrap items-center gap-2 mb-2">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
              OS-{orden.id}
            </h3>

            <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border {getEstadoColor(orden.estado)}">
              <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
              {orden.estado}
            </span>

            <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border {getPrioridadColor(orden.prioridad)}">
              {orden.prioridad}
            </span>

            {#if orden.numeroOficio}
              <span class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800">
                Oficio: {orden.numeroOficio}
              </span>
            {/if}
          </div>

          <!-- Descripción -->
          <p class="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-3 text-justify">
            {orden.descripcion}
          </p>

          <!-- Categoría -->
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs text-gray-700 dark:text-gray-300">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            {orden.categoriaOrden.descripcion}
            {#if orden.otroCategoriaOrden != null}
              - {orden.otroCategoriaOrden}
            {/if}
          </span>
        </div>

        <!-- Fecha -->
        <div class="text-sm text-gray-500 dark:text-gray-400">
          {formatearFechaRelativa(orden.creadoEn)}
        </div>
      </div>

      <!-- Info Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
        <!-- Solicitante -->
        <div class="flex items-start gap-3">
          <div class="shrink-0 w-10 h-10 bg-linear-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
            {obtenerInicialesParaAvatar(escribirNombreCompleto(orden.empleadoSolicitante))}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">
              Solicitante
            </p>
            <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
              {escribirNombreCompleto(orden.empleadoSolicitante)}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
              {orden.areaSolicitante.nombre}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              Tel: {orden.telefonoSolicitante}
            </p>
          </div>
        </div>

        <!-- Área Asignada -->
        <div class="flex items-start gap-3">
          <div class="shrink-0 w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <svg class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">
              Asignada a
            </p>
            <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
              {orden.areaAsignada.nombre}
            </p>
          </div>
        </div>

      </div>
    </a>
  {/each}

  {#if data.ordenesServicio.length === 0}
    <SinResultados />
  {/if}
</div>

<!-- Paginación inline -->
{#if data.ordenesServicio.length > 0}
  <div class="mt-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
    <div class="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3">
      <!-- Info de registros -->
      <div class="text-sm text-gray-700 dark:text-gray-300">
        Mostrando
        <span class="font-medium">{(data.paginacion.paginaActual - 1) * data.paginacion.porPagina + 1}</span>
        a
        <span class="font-medium">{Math.min(data.paginacion.paginaActual * data.paginacion.porPagina, data.paginacion.totalRegistros)}</span>
        de
        <span class="font-medium">{data.paginacion.totalRegistros}</span>
        resultados
      </div>

      <!-- Controles -->
      <div class="flex items-center gap-2">

        <!-- Anterior -->
        <button
          onclick={() => irAPagina(data.paginacion.paginaActual - 1, filtrosCache)}
          disabled={!(data.paginacion.paginaActual > 1)}
          class="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          Anterior
        </button>

        <!-- Números -->
        <div class="hidden sm:flex gap-1">
          {#if paginasVisibles[0] > 1}
            <button
              onclick={() => irAPagina(1, filtrosCache)}
              class="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              1
            </button>
            {#if paginasVisibles[0] > 2}
              <span class="px-2 py-1.5 text-gray-500">...</span>
            {/if}
          {/if}

          {#each paginasVisibles as numeroPagina(numeroPagina)}
            <button
              onclick={() => irAPagina(numeroPagina, filtrosCache)}
              class="px-3 py-1.5 border rounded-lg text-sm font-medium transition-colors
                      {numeroPagina === data.paginacion.paginaActual
                        ? 'bg-blue-500 text-white border-blue-500 dark:bg-blue-600'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700'
                      }"
            >
              {numeroPagina}
            </button>
          {/each}

          {#if paginasVisibles[paginasVisibles.length - 1] < data.paginacion.totalPaginas}
            {#if paginasVisibles[paginasVisibles.length - 1] < data.paginacion.totalPaginas - 1}
              <span class="px-2 py-1.5 text-gray-500">...</span>
            {/if}
            <button
              onclick={() => irAPagina(data.paginacion.totalPaginas, filtrosCache)}
              class="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              {data.paginacion.totalPaginas}
            </button>
          {/if}
        </div>

        <!-- Siguiente -->
        <button
          onclick={() => irAPagina(data.paginacion.paginaActual + 1, filtrosCache)}
          disabled={!(data.paginacion.paginaActual < data.paginacion.totalPaginas)}
          class="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          Siguiente
        </button>
      </div>
    </div>
  </div>
{/if}
