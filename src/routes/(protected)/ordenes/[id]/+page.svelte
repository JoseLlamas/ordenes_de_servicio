<script>
  import Avatar from '$lib/components/Avatar.svelte';
  import {
    formatearFecha,
    formatearFechaRelativa,
    getEstadoColor,
    escribirNombreCompleto,
    getPrioridadColor,
    formatearFechaShort
  } from '$lib/utils';
  import SelectorAgentesMultiple from '$lib/components/SelectorAgentesMultiple.svelte';
  import { enhance } from '$app/forms';
  import ButtonAccept from '$lib/components/ButtonAccept.svelte';
  import LoadingScreen from '$lib/components/LoadingScreen.svelte';
  import ErrorMessage from '$lib/components/ErrorMessage.svelte';
  import InfoMessage from '$lib/components/InfoMessage.svelte';
  import TextArea from '$lib/components/TextArea.svelte';
  import { confirmBeforeEnhance } from '$lib/actions/confirm_before_enhance.js';
  import ConfirmModal from '$lib/components/ConfirmModal.svelte';
  import Modal from '$lib/components/Modal.svelte';
  import Observacion from '$lib/components/Observacion.svelte';
  import Paginador from '$lib/components/Paginador.svelte';
  import logo from '$lib/assets/logo.png';
  import VerMas from '$lib/components/VerMas.svelte';
  import FormAgregarActivo from '$lib/components/FormAgregarActivo.svelte';
    import Input from '$lib/components/Input.svelte';
    import Select from '$lib/components/Select.svelte';

  let { data, form } = $props();

  let ordenServicio = $derived(data.ordenServicio);

  let observaciones = $derived([...data.ordenServicio.observaciones].toReversed());

  let observacionParaMostrar = $derived.by(() => {
    if (ordenServicio.estado === 'CANCELADO') {
      return observaciones.find(observacion => observacion.tipo === 'CANCELACION') ?? null;
    }
    return observaciones.find(observacion => observacion.tipo === 'SOLUCION') ?? null;
  });

  /**
   * @type {ConfirmModal | undefined}
  */
  let confirmModal = $state();

  let tabActual = $state('detalles');

  const tabs = $derived([
    { id: 'detalles', nombre: 'Detalles', icono: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { id: 'activos', nombre: 'Activos', icono: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', badge: ordenServicio.activos.length || 0 },
    { id: 'observaciones', nombre: 'Observaciones', icono: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', badge: ordenServicio.observaciones.length || 0 }
  ]);


  /*-------- Asignacion -----------*/

  /**
   * @type {Modal | undefined}
   */
  let modalAsignacion = $state();

  let submittingAsignacion = $state(false);

  /**
   * @type {SelectorAgentesMultiple | undefined}
   */
  let selectorAgentesMultiple = $state();

  /**
   * @type {HTMLFormElement | undefined}
   */
  let formAsignacion = $state();

  /**
   * @type {number[]}
   */
  let agentesParaAsignarId = $state([]);

  /**
   *
   * @param {number[]} agentesId
   */
  function handleAsignarAgentes (agentesId) {
    agentesParaAsignarId = agentesId;
    formAsignacion?.requestSubmit();
  }

  /*--- Asignacion ---*/

  /*----------- desasignacion agente  -----------*/

  /**
   * @type {number | null}
   */
  let agenteRemoviendoId = $state(null);

  /*------------- desasignacion agente -------------*/

  /*---------- cambio de estado  -------------*/

  let submittingNuevoEstado = $state(false);

  /**
   * @type {Omit<typeof data.ordenServicio['estado'], 'NUEVO'> | null}
   */
  let nuevoEstado = $state(null);

  let textoLabelNuevoEstado = $derived.by(() => {
    if (nuevoEstado === 'PROCESO') {
      return 'Ingrese una observación (opcional)';
    } else if (nuevoEstado === 'PENDIENTE') {
      return 'Especifique la razón por la que la orden entra en espera (obligatorio)';
    } else if (nuevoEstado === 'RESUELTO') {
      return 'Especifique la solución que se dio (obligatorio)';
    } else if (nuevoEstado === 'CERRADO') {
      return 'Ingrese cualquier observación de cierre (opcional)';
    } else if (nuevoEstado === 'CANCELADO') {
      return 'Especifique la razón por la que fue cancelado la OS (obligatorio)';
    } else {
      return 'Ingrese una observación';
    }
  });

  /*------------------ cambio estado --------------*/

  /*--------------- agregar activo ----------------*/

  /**
  * @type {FormAgregarActivo | undefined}
  */
  let formAgregarActivo = $state();

  let submittingAgregarActivo = $state(false);

  /**
   * @type {HTMLFormElement | undefined}
   */
  let htmlFormAgregarActivo = $state();

  /**
   * @type {Modal | undefined}
   */
  let modalAgregarActivo = $state();

  /**
   * @type {{
   *  categoriaActivoId: number | null,
   *  numeroInventario: string,
   *  numeroSerie: string,
   *  marca: string,
   *  modelo: string,
   *  observaciones: string
   * } | null}
  */
  let activoParaAgregar = $state(null);

  function handleAgregarActivo (activo) {
    activoParaAgregar = activo;
    htmlFormAgregarActivo?.requestSubmit();
  }

  /*---------------agregar activo------------------*/

  /* --------------Eliminando activo ------------ */

  /**
   * @type {number | null}
  */
  let activoEliminandoId = $state(null);

  /*----------------eliminando activo ----------- */

  /*---------------modificar------------------------*/

  /**
   * @type {Modal | undefined}
  */
  let modalModificarOrden = $state();

  /*--------------modificar-----------------------*/

  let showLoadingScreen = $derived(submittingNuevoEstado
    || submittingAgregarActivo
    || submittingAsignacion
    || activoEliminandoId != null
    || agenteRemoviendoId != null);

</script>

<svelte:head>
  <title>Orden #{ordenServicio.id}</title>
</svelte:head>

{#snippet imprimirObservaciones(observaciones)}
  <div class="space-y-3">
    {#each observaciones as obs (obs.id)}
      <Observacion
        observacion={obs}
      />
    {/each}
  </div>
{/snippet}

<LoadingScreen hidden={!showLoadingScreen} />
<ConfirmModal bind:this={confirmModal} />

<Modal
  bind:this={modalAsignacion}
  title="Asignar agentes"
>
  <SelectorAgentesMultiple
    areaId={ordenServicio.areaAsignada.id}
    bind:this={selectorAgentesMultiple}
    onAsignar={handleAsignarAgentes}
    oncancel={() => modalAsignacion?.close()}
    errors={{ ...form?.errorsAsignacionAgentes, errorAsignacionAgentes: form?.errorAsignacionAgentes }}
    message={form?.messageAsignacionAgentes}
  />
  <form
    bind:this={formAsignacion}
    method="POST"
    action="?/asignarAgentes"
    class="hidden"
    use:enhance={({ formData }) => {
      formData.set('data', JSON.stringify({
        ordenServicioId: ordenServicio.id,
        agentesId: [...agentesParaAsignarId]
      }));
      submittingAsignacion = true;
      return async ({ update, result }) => {
        await update();
        submittingAsignacion = false;
        if (result.status === 200) {
          agentesParaAsignarId = [];
          selectorAgentesMultiple?.limpiar();
        }
      };
    }}
  ></form>
</Modal>

<Modal
  title="Agregar nuevo activo"
  bind:this={modalAgregarActivo}
>
  <FormAgregarActivo
    areaId={ordenServicio.areaAsignada.id}
    onCancel={() => {
      modalAgregarActivo?.close();
    }}
    onAgregar={handleAgregarActivo}
    bind:this={formAgregarActivo}
    errors={{ ...form?.errorsAgregarActivo, errorAgregarActivo: form?.errorAgregarActivo }}
    message={form?.messageAgregarActivo}
  />
  <form
    action="?/agregarActivo"
    method="POST"
    bind:this={htmlFormAgregarActivo}
    class="hidden"
    use:enhance={({ formData }) => {
      submittingAgregarActivo = true;
      formData.set('data', JSON.stringify({
        ordenServicioId: ordenServicio.id,
        ...activoParaAgregar
      }));
      return async ({ update, result }) => {
        await update();
        if (result.status === 200) {
          formAgregarActivo?.limpiarCampos();
          activoParaAgregar = null;
        }
        submittingAgregarActivo = false;
      };
    }}
  ></form>
</Modal>

<Modal
  bind:this={modalModificarOrden}
  title="Modificar orden"
>
  <div class="mt-2 grid grid-cols-1 gap-x-4 gap-y-2 lg:grid-cols-8">
    <div class="lg:col-span-4">
      <Input
        label="Teléfono"
        name="telefonoSolicitante"
        id="telefono"
        value={ordenServicio.telefonoSolicitante}
        required
      />
    </div>
    <div class="lg:col-span-4">
      <Select
        name="tipoEntrada"
        value={ordenServicio.tipoEntrada}
        label="Entrada"
        id="entrada"
        required
      >
        <option value="PRESENCIAL">Presencial</option>
        <option value="LLAMADA_TELEFONICA">Llamada telefónica</option>
        <option value="OFICIO">Oficio</option>
        <option value="INDICACION_SUPERIOR">Indicación superior</option>
      </Select>
    </div>
    <div class="lg:col-span-4">
      <Input
        label="Número oficio"
        name="numeroOficio"
        class="uppercase"
        id="numeroOficio"
        value={ordenServicio.numeroOficio ?? ''}
      />
    </div>
    <div class="lg:col-span-4">
      <Select
        label="Categoría"
        id="categoria"
        required
      >
      </Select>
    </div>
    <div class="lg:col-span-4">
      <Input
        label="Otro"
        id="otroCategoriaOrden"
        class="uppercase"
        value={ordenServicio.otroCategoriaOrden ?? ''}
      />
    </div>
    <div class="lg:col-span-4">
      <Select
        label="Prioridad"
        id="prioridad"
        value={ordenServicio.prioridad}
        required
      >
        <option value="BAJA">Baja</option>
        <option value="MEDIA">Media</option>
        <option value="ALTA">Alta</option>
        <option value="CRITICA">Crítica</option>
      </Select>
    </div>
    <div class="lg:col-span-8">
      <TextArea
        name="descripcion"
        id="descripcion"
        label="Descripción del reporte"
        class="uppercase"
        value={ordenServicio.descripcion}
        required
      />
    </div>
  </div>
</Modal>

<!-- Header -->
<div class="print:hidden bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
  <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
    <div class="flex-1">
      <div class="flex items-center gap-3 mb-2">
        <a
          title="regresar"
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
        Creado {formatearFechaRelativa(ordenServicio.creadoEn)}
      </p>
    </div>

    <div class="flex flex-wrap gap-2">

      <button
        onclick={() => modalModificarOrden?.open()}
        class="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-2">
        Editar
      </button>

      <button
        onclick={() => modalAsignacion?.open()}
        class="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-2">
        Asignar
      </button>

      <button
        onclick={() => window.print()}
        class="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors flex items-center gap-2"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
        </svg>
        Imprimir
      </button>

    </div>

  </div>
</div>

<!-- Tabs -->
<div class="bg-white print:hidden dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
  <div class="border-b border-gray-200 dark:border-gray-700">
    <nav class="flex -mb-px overflow-x-auto">
      {#each tabs as tab, index (index)}
        <button
          onclick={() => tabActual = tab.id}
          class="flex-0 px-6 py-4 text-sm font-medium border-b-2 transition-colors {
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
            <VerMas
              texto={ordenServicio.descripcion}
            />
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

              <div class="bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <div class="flex items-center justify-between mb-3">
                  <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Agentes Asignados
                  </p>
                  {#if ordenServicio.agentes.length > 0}
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                      {ordenServicio.agentes.length}
                    </span>
                  {/if}
                </div>

                {#if form?.errorsDesasignacionAgente?.agenteId}
                  <ErrorMessage>{form.errorsDesasignacionAgente.agenteId}</ErrorMessage>
                {/if}

                {#if form?.errorDesasignacionAgente}
                  <ErrorMessage>{form.errorDesasignacionAgente}</ErrorMessage>
                {/if}

                {#if ordenServicio.agentes.length === 0}
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
                    {#each ordenServicio.agentes as agente (agente.id)}
                      <div class="flex items-start gap-3 p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                        <Avatar
                          size="medium"
                          avatar={agente.avatar}
                          usuarioNombreCompleto={escribirNombreCompleto(agente.empleado)}
                          rolNombre="Agente"
                        />

                        <div class="flex-1 min-w-0">
                          <p class="text-sm font-medium text-gray-900 dark:text-white">
                            {escribirNombreCompleto(agente.empleado)}
                          </p>
                          <p class="text-xs text-gray-500 dark:text-gray-400">
                            @{agente.nombreUsuario}
                          </p>
                        </div>

                        <!-- Botón de eliminar -->
                        <form
                          method="POST"
                          action="?/desasignarAgente"
                          use:confirmBeforeEnhance={{ confirm: () => confirmModal?.confirm({ texto: '¿Desea desasignar a este agente?' }) ?? Promise.resolve(false) }}
                          use:enhance={() => {
                            agenteRemoviendoId = agente.id;
                            return async ({ update }) => {
                              await update();
                              agenteRemoviendoId = null;
                            };
                          }}
                        >
                          <input type="hidden" name="agenteId" value={agente.id} />
                          <input type="hidden" name="ordenServicioId" value={ordenServicio.id} />
                          <button
                            type="submit"
                            disabled={agenteRemoviendoId === agente.id}
                            class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed dark:hover:bg-red-950/30 dark:hover:text-red-400"
                            title="Quitar asignación"
                          >
                            {#if agenteRemoviendoId === agente.id}
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
                  <div>
                    <dt class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Tipo de Entrada
                    </dt>
                    <dd class="text-sm text-gray-900 dark:text-white mt-1">
                      {ordenServicio.tipoEntrada}
                    </dd>
                  </div>

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

                  <div>
                    <dt class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Teléfono Solicitante
                    </dt>
                    <dd class="text-sm text-gray-900 dark:text-white mt-1">
                      {ordenServicio.telefonoSolicitante}
                    </dd>
                  </div>

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
                        Por: {escribirNombreCompleto(ordenServicio.cerradoPor.empleado)}
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
                        Por: {escribirNombreCompleto(ordenServicio.canceladoPor.empleado)}
                      </p>
                    {/if}
                  </div>
                {/if}
              </div>
            </div>

          </div>
        </div>

        {#if observacionParaMostrar != null}
          <div>
            <Observacion
              observacion={observacionParaMostrar}
            />
          </div>
        {/if}

      </div>

    {:else if tabActual === 'activos'}
      <!-- ==================== TAB ACTIVOS ==================== -->
      <div>
        {#if form?.errorEliminarActivo}
          <ErrorMessage>
            {form.errorEliminarActivo}
          </ErrorMessage>
        {/if}
        {#if form?.messageEliminarActivo}
          <InfoMessage>
            {form.messageEliminarActivo}
          </InfoMessage>
        {/if}
        {#if ordenServicio.activos && ordenServicio.activos.length > 0}
          <div class="mb-4 flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Total: {ordenServicio.activos.length} {ordenServicio.activos.length === 1 ? 'activo' : 'activos'}
            </h3>
            <button
              onclick={() => modalAgregarActivo?.open()}
              class="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg transition-colors"
            >
              Agregar activo
            </button>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {#each ordenServicio.activos as activo(activo.id)}
              <div class="group bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg transition-all relative">

                <form
                  method="POST"
                  action="?/eliminarActivo"
                  use:confirmBeforeEnhance={{ confirm: () => confirmModal?.confirm({ texto: '¿Desea eliminar el activo?' }) ?? Promise.resolve(false) }}
                  use:enhance={() => {
                    activoEliminandoId = activo.id;
                    return async ({ update }) => {
                      await update();
                      activoEliminandoId = null;
                    };
                  }}
                >
                  <input type="hidden" name="activoId" value={activo.id} />
                  <input type="hidden" name="ordenServicioId" value={ordenServicio.id} />
                  <button
                    type="submit"
                    aria-label="Eliminar activo {activo.numeroInventario}"
                    disabled={activoEliminandoId === activo.id}
                    class="
                      absolute top-3 right-3 p-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100
                      text-gray-400 dark:text-gray-500
                      hover:text-red-600 dark:hover:text-red-400
                      hover:bg-red-50 dark:hover:bg-red-950/30
                    "
                  >
                    {#if activoEliminandoId === activo.id}
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
                  <div class="pt-2 border-t border-gray-200 dark:border-gray-700">
                    <span class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                      {activo.categoriaActivo.descripcion}
                    </span>
                  </div>

                  <!-- Observaciones -->
                  {#if activo.observaciones}
                    <div class="pt-2 border-t border-gray-200 dark:border-gray-700">
                      <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Observaciones</p>
                      <VerMas texto={activo.observaciones} />
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
              <button
                onclick={() => modalAgregarActivo?.open()}
                class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <svg class="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Agregar activo
              </button>
            </div>
          </div>
        {/if}
      </div>
    {:else if tabActual === 'observaciones'}
      <div class="space-y-4">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Observaciones
          </h3>
          <span class="text-sm text-gray-500 dark:text-gray-400">
            {ordenServicio.observaciones.length} {ordenServicio.observaciones.length === 1 ? 'observación' : 'observaciones'}
          </span>
        </div>

        <!-- Lista -->
        {#if observaciones.length > 0}
          <Paginador
            records={observaciones}
            render={imprimirObservaciones}
            perPagina={5}
          />
        {:else}
          <!-- Empty State -->
          <div class="flex flex-col items-center justify-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
            <svg class="w-12 h-12 text-gray-400 dark:text-gray-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              No hay observaciones registradas
            </p>
          </div>
        {/if}
      </div>
    {/if}
  </div>
</div>

<div class="block print:hidden bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
  <div class="flex flex-col gap-6 lg:flex-row lg:justify-around lg:gap-0">

    <button
      class="px-4 py-2 rounded-lg text-sm font-medium bg-[#9b1f3d] text-white hover:bg-[#7f182f] transition-colors"
      onclick={() => nuevoEstado = 'PROCESO'}
      >
      Iniciar
    </button>

    <button
      class="px-4 py-2 rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-colors"
      onclick={() => nuevoEstado = 'PENDIENTE'}
    >
      Pediente
    </button>

    <button
      class="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
      onclick={() => nuevoEstado = 'RESUELTO'}
    >
      Solucionar
    </button>

    <button
      class="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
      onclick={() => nuevoEstado = 'CERRADO'}
    >
      Cerrar
    </button>

    <button
      class="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
      onclick={() => nuevoEstado = 'CANCELADO'}
    >
      Cancelar
    </button>
  </div>
  {#if nuevoEstado != null}
    <form
      action="?/cambiarEstado"
      method="POST"
      class="flex flex-col gap-3 pt-5"
      use:confirmBeforeEnhance={{ confirm: () => confirmModal?.confirm() ?? Promise.resolve(false) }}
      use:enhance={({ formData }) => {
        submittingNuevoEstado = true;
        formData.set('ordenServicioId', ordenServicio.id.toString());
        formData.set('nuevoEstado', String(nuevoEstado ?? ''));
        return async ({ update }) => {
          await update();
          submittingNuevoEstado = false;
        };
      }}
    >

    {#if form?.errorCambiarEstado}
      <ErrorMessage>{form.errorCambiarEstado}</ErrorMessage>
    {/if}
    {#if form?.messageCambiarEstado}
      <InfoMessage>{form.messageCambiarEstado}</InfoMessage>
    {/if}
    {#if form?.errorsCambiarEstado?.nuevoEstado}
      <ErrorMessage>{form.errorsCambiarEstado.nuevoEstado}</ErrorMessage>
    {/if}
    {#if form?.errorsCambiarEstado?.observacion}
      <ErrorMessage>{form.errorsCambiarEstado.observacion}</ErrorMessage>
    {/if}
      <div class="flex flex-col gap-3 items-stretch w-full">
        <TextArea
          name="observacion"
          id="observacion"
          label={textoLabelNuevoEstado}
          class="uppercase"
        />
        <ButtonAccept
          type="submit"
        >
          Enviar
        </ButtonAccept>
      </div>
    </form>
  {/if}
</div>

<!-- Contenedor principal - fondo gris en pantalla, blanco en impresión -->
<div class="hidden print:block  bg-gray-100 print:bg-white py-8 print:py-0">
  <!-- Contenido imprimible - márgenes automáticos en impresión -->
  <div class="bg-white print:bg-white p-8 print:p-0 shadow-lg print:shadow-none">
    <!-- Header -->
    <header class="mb-4 pb-4 border-b border-gray-800">
      <div class="flex justify-between items-start">
        <div>
          <img src={logo} alt="logo" width="90%"/>
        </div>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">ORDEN DE SERVICIO</h1>
        </div>
        <div class="text-right">
          <div class="text-2xl font-bold text-gray-900">#{ordenServicio.id}</div>
          <div class="text-sm text-gray-600">
            {formatearFechaShort(ordenServicio.creadoEn)}
          </div>
        </div>
      </div>
    </header>

    <!-- Información General -->
    <section class="mb-4">

      <div class="grid grid-cols-2 gap-x-8 gap-y-4">
        <div>
          <dt class="text-sm font-medium text-gray-600">Area</dt>
          <dd class="mt-1 text-base text-gray-900">
            {ordenServicio.areaSolicitante.nombre}
          </dd>
        </div>

        <div>
          <dt class="text-sm font-medium text-gray-600">Solicitante</dt>
          <dd class="mt-1 text-base text-gray-900">
            {escribirNombreCompleto(ordenServicio.empleadoSolicitante)}
          </dd>
        </div>

        <div>
          <dt class="text-sm font-medium text-gray-600">Área Asignada</dt>
          <dd class="mt-1 text-base text-gray-900">{ordenServicio.areaAsignada.nombre}</dd>
        </div>

        <div>
          <dt class="text-sm font-medium text-gray-600">Categoría</dt>
          <dd class="mt-1">
            <span class="inline-flex items-center rounded-full text-sm  text-gray-900">
              {ordenServicio.otroCategoriaOrden != null
                ? ordenServicio.otroCategoriaOrden
                : ordenServicio.categoriaOrden.descripcion}
            </span>
          </dd>
        </div>

      </div>
    </section>

    <!-- Descripción -->
    <section class="mb-2 print:break-inside-avoid h-38 overflow-hidden">
      <h2 class="text-lg font-semibold text-gray-900 border-b border-gray-300 pb-1 mb-2">
        Descripción del Servicio
      </h2>
      <p class="text-gray-900 whitespace-pre-wrap leading-relaxed text-justify line-clamp-4">
        {ordenServicio.descripcion}
      </p>
    </section>

    {#if ordenServicio.estado === 'CANCELADO' || ordenServicio.estado === 'CERRADO'}
      <div class="overflow-y-hidden h-42">
        <section class="text-right my-2">
          {#if ordenServicio.cerradoEn != null}
            <div class="text-sm text-gray-600">
              Cerrado {formatearFecha(ordenServicio.cerradoEn)}
            </div>
          {/if}
          {#if ordenServicio.canceladoEn != null}
            <div class="text-sm text-gray-600">
              Cancelado {formatearFecha(ordenServicio.canceladoEn)}
            </div>
          {/if}
        </section>

        {#if observacionParaMostrar != null}
          <section class="print:break-inside-avoid">
            <h2 class="text-lg font-semibold text-gray-900 border-b border-gray-300 pb-1 mb-2">
              {observacionParaMostrar.tipo === 'CANCELACION' ? 'Razón de la cancelación' : 'Procedimiento realizado para atender el reporte'}
            </h2>
            <p class="text-gray-900 whitespace-pre-wrap leading-relaxed text-justify line-clamp-3">
              {observacionParaMostrar.observacion}
            </p>
          </section>
        {/if}
      </div>
    {:else}
      <div class="h-44"></div>
    {/if}

    <!-- Espacio para firmas -->
    <section class="mt-8 pt-2 border-t border-gray-300 print:break-inside-avoid">

      <div class="grid grid-cols-2 gap-8">
        <div class="text-center">
          <div class="h-18 mb-2"></div>
          <div class="border-t-2 border-gray-900 pt-2">
            <p class="text-sm text-gray-900 font-medium">Firma Solicitante</p>
            <p class="text-xs text-gray-600 mt-1">{escribirNombreCompleto(ordenServicio.empleadoSolicitante)}</p>
          </div>
        </div>

        <div class="text-center">
          <div class="h-18 mb-2"></div>
          <div class="border-t-2 border-gray-900 pt-2">
            <p class="text-sm text-gray-900 font-medium">Firma Agente</p>
          </div>
        </div>

      </div>
    </section>

    <section class="border-t-2 mt-2 pt-2 border-dashed border-gray-300 print:break-inside-avoid">
      <div class="flex justify-between items-start">
        <div>
          <img src={logo} alt="logo" width="60%"/>
        </div>
        <div>
          <h1 class="font-bold text-gray-900">ORDEN DE SERVICIO</h1>
        </div>
        <div class="text-right">
          <div class="text-sm font-bold text-gray-900">#{ordenServicio.id}</div>
          <div class="text-sm text-gray-600">
            {formatearFechaShort(ordenServicio.creadoEn)}
          </div>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-x-8 gap-y-4">
        <div>
          <dt class="text-sm font-medium text-gray-600">Area</dt>
          <dd class="mt-1 text-base text-gray-900">
            {ordenServicio.areaSolicitante.nombre}
          </dd>
        </div>
        <div>
          <dt class="text-sm font-medium text-gray-600">Solicitante</dt>
          <dd class="mt-1 text-base text-gray-900">
            {escribirNombreCompleto(ordenServicio.empleadoSolicitante)}
          </dd>
        </div>
        <div>
          <dt class="text-sm font-medium text-gray-600">Atendió</dt>
          <dd class="mt-1 text-base text-gray-900">{escribirNombreCompleto(ordenServicio.creadoPor.empleado)}</dd>
        </div>
      </div>
    </section>

  </div>
</div>
