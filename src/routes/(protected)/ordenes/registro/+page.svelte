<script>
  import { enhance } from '$app/forms';
  import ButtonAccept from '$lib/components/ButtonAccept.svelte';
  import Select from '$lib/components/Select.svelte';
  import Input from '$lib/components/Input.svelte';
  import TextArea from '$lib/components/TextArea.svelte';
  import LoadingScreen from '$lib/components/LoadingScreen.svelte';
  import FormAgregarActivo from '$lib/components/FormAgregarActivo.svelte';
  import ButtonSecundary from '$lib/components/ButtonSecundary.svelte';
  import ErrorMessage from '$lib/components/ErrorMessage.svelte';
  import { obtenerAreasPorDireccion, obtenerEmpleadosPorArea, obtenerCategoriasOrdenPorArea } from '$lib/api';
  import { normalizePalabras } from '$lib/utils/normalize_palabras.js';
  import SinResultados from '$lib/components/SinResultados.svelte';
  import InfoMessage from '$lib/components/InfoMessage.svelte';
  import ErrorCard from '$lib/components/ErrorCard.svelte';
  import ConfirmModal from '$lib/components/ConfirmModal.svelte';
  import { confirmBeforeEnhance } from '$lib/actions/confirm_before_enhance.js';
    import LoaderLine from '$lib/components/LoaderLine.svelte';

  let { data, form } = $props();

  let submitting = $state(false);

  /**
   * @type {(typeof data.areasParaAsignar[number]) | null}
  */
  let areaParaAsignar = $state(null);

  /**
   * @type {(typeof data.direccionesGenerales[number] | null)}
  */
  let direccionGeneralEmpleadoSolicitante = $state(null);

  /**
   * @type {Awaited<ReturnType<typeof obtenerAreasPorDireccion>>[number] | null}
   */
  let areaEmpleadoSolicitante = $state(null);

  /**
   * @type {Awaited<ReturnType<typeof obtenerEmpleadosPorArea>>[number] | null}
   */
  let empleadoSolicitante = $state(null);

  /**
   * @type {string | null}
   */
  let tipoEntrada = $state(null);

  /**
   * @type {string}
   */
  let telefonoSolicitante = $state('');

  /**
   * @type {string}
   */
  let numeroOficio = $state('');

  /**
   * @type {Awaited<ReturnType<typeof obtenerCategoriasOrdenPorArea>>[number] | null}
   */
  let categoriaOrden = $state(null);

  /**
   * @type {string}
  */
  let otroCategoriaOrden = $state('');

  /**
   * @type {string | null}
   */
  let prioridad = $state(null);

  /**
   * @type {string}
   */
  let descripcion = $state('');

  /**
   * @type {FormAgregarActivo | undefined}
   */
  let formAgregarActivo = $state();

  /**
   * @type {Array<{
   *  idT: number,
   *  numeroInventario: string | null,
   *  numeroSerie: string | null,
   *  categoriaActivo: {
   *    id: number,
   *    descripcion: string
   *  },
   *  marca: string | null,
   *  modelo: string | null,
   *  observaciones: string | null
   * }>}
   */
  let activos = $state([]);

  /**
   *
   * @param {typeof activos[number]} activo
   */
  function borrarActivo (activo) {
    activos = activos.filter((itm) => itm.idT !== activo.idT);
  }

  /**
   * @type {Awaited<ReturnType<typeof obtenerCategoriasOrdenPorArea>>}
   */
  let categoriasOrden = $state([]);

  /**
   * @type {Awaited<ReturnType<typeof obtenerAreasPorDireccion>>}
   */
  let areas = $state([]);

  /**
   * @type {Awaited<ReturnType<typeof obtenerEmpleadosPorArea>>}
   */
  let empleados = $state([]);

  let i = 0;

  /**
   *
   * @param {Omit<(typeof activos)[number], 'idT'>} activo
   */
  function agregarActivo (activo) {
    activos.push({ idT: ++i, ...activo });
  }

  /**
   * @type {ConfirmModal | undefined}
  */
  let confirmModal = $state();

  let fetchingCategoriasOrden = $state(false);

  function handleAreaParaAsignarChange () {
    categoriaOrden = null;
    activos = [];
    categoriasOrden = [];
    if (areaParaAsignar == null) {
      return;
    }
    fetchingCategoriasOrden = true;
    void obtenerCategoriasOrdenPorArea(areaParaAsignar.id)
      .then(result => {
        categoriasOrden = result;
      })
      .catch(() => {
        categoriasOrden = [];
      })
      .finally(() => {
        fetchingCategoriasOrden = false;
      });
  }

  let fetchingAreas = $state(false);

  function handleDireccionGeneralChange () {
    areas = [];
    areaEmpleadoSolicitante = null;
    empleadoSolicitante = null;
    if (direccionGeneralEmpleadoSolicitante == null) {
      return;
    }
    fetchingAreas = true;
    void obtenerAreasPorDireccion(direccionGeneralEmpleadoSolicitante.id)
      .then(result => {
        areas = result;
      })
      .catch(() => {
        areas = [];
      })
      .finally(() => {
        fetchingAreas = false;
      });
  }

  let fetchingEmpleados = $state(false);

  function handleAreaChange () {
    empleadoSolicitante = null;
    empleados = [];
    if (areaEmpleadoSolicitante == null) {
      return;
    }
    fetchingEmpleados = true;
    void obtenerEmpleadosPorArea(areaEmpleadoSolicitante.id)
      .then((result) => {
        empleados = result;
      })
      .catch(() => {
        empleados = [];
      })
      .finally(() => {
        fetchingEmpleados = false;
      });
  }
</script>

<svelte:head>
  <title>Registro de orden de servicio</title>
</svelte:head>

<ConfirmModal
  bind:this={confirmModal}
/>

<LoadingScreen hidden={!submitting} />

<FormAgregarActivo
  bind:this={formAgregarActivo}
  areaId={areaParaAsignar?.id}
  clicInAdd={(activo) => {
    agregarActivo(activo);
  }}
/>

<div class="space-y-12 text-gray-700 dark:text-gray-100">
  <div class="border-b border-gray-900/10 p-4">
    <h2 class="text-base/7 font-semibold">
      Registro de nueva orden de servicio
    </h2>
    <p class="mt-1 text-sm/6 ">
      Ingrese los datos que se le solicitan.
    </p>
    <p class="mt-1 text-sm/6 ">
      Los campos con <span class="text-red-500">*</span> son obligatorios.
    </p>
    {#if form?.folio}
      <InfoMessage>
        Registro efectuado con número de folio #{form.folio}, puede ver la orden haciendo click <a href={`/ordenes/${form.folio}`}>aquí</a>
      </InfoMessage>
    {/if}
    {#if form?.error}
      <ErrorCard>
        {form.error}
      </ErrorCard>
    {/if}
    <div class="mt-2 grid grid-cols-1 gap-x-4 gap-y-2 lg:grid-cols-8">

      <div class="lg:col-span-8">
        <Select
          bind:value={areaParaAsignar}
          label="Area a asignar"
          id="areaParaAsignar"
          required
          onchange={handleAreaParaAsignarChange}
        >
          {#each data.areasParaAsignar as areaAAsignar(areaAAsignar.id)}
            <option value={areaAAsignar}>{areaAAsignar.nombre}</option>
          {/each}
        </Select>
        {#if form?.errors?.areaParaAsignarId}
          <ErrorMessage>{form.errors.areaParaAsignarId}</ErrorMessage>
        {/if}
        {#if fetchingCategoriasOrden}
          <LoaderLine />
        {/if}
      </div>

      <div class="lg:col-span-8">
        <hr />
        <h3 class="text-base/5 font-semibold p-2">
          Datos del solicitante
        </h3>
      </div>

      <div class="lg:col-span-4">
        <Select
          bind:value={direccionGeneralEmpleadoSolicitante}
          label="Dirección general"
          id="direccionGeneralSolicitante"
          onchange={handleDireccionGeneralChange}
        >
          {#each data.direccionesGenerales as direccionGeneral(direccionGeneral.id)}
            <option value={direccionGeneral}>{direccionGeneral.nombre}</option>
          {/each}
        </Select>
        {#if fetchingAreas}
          <LoaderLine />
        {/if}
      </div>

      <div class="lg:col-span-4">
        <Select
          bind:value={areaEmpleadoSolicitante}
          label="Area"
          id="areaSolicitante"
          onchange={handleAreaChange}
        >
          {#each areas as area(area.id)}
            <option value={area}>{area.nombre}</option>
          {/each}
        </Select>
        {#if fetchingEmpleados}
          <LoaderLine />
        {/if}
      </div>

      <div class="lg:col-span-4">
        <Select
          bind:value={empleadoSolicitante}
          label="Empleado solicitante"
          name="solicitanteId"
          id="empleadoSolicitante"
          required
        >
          {#each empleados as empleado(empleado.id)}
            <option value={empleado}>{normalizePalabras(empleado.nombre, empleado.primerApellido, empleado.segundoApellido ?? '')}</option>
          {/each}
        </Select>
        {#if form?.errors?.empleadoSolicitanteId}
          <ErrorMessage>{form.errors.empleadoSolicitanteId}</ErrorMessage>
        {/if}
      </div>

      <div class="lg:col-span-4">
        <Input
          label="Teléfono"
          name="telefonoSolicitante"
          id="telefono"
          bind:value={telefonoSolicitante}
          required
        />
        {#if form?.errors?.telefonoSolicitante}
          <ErrorMessage>{form.errors.telefonoSolicitante}</ErrorMessage>
        {/if}
      </div>

      <div class="lg:col-span-4">
        <Select
          name="entradaId"
          label="Entrada"
          id="entrada"
          required
          bind:value={tipoEntrada}
        >
          <option value="PRESENCIAL">Presencial</option>
          <option value="LLAMADA_TELEFONICA">Llamada telefónica</option>
          <option value="OFICIO">Oficio</option>
          <option value="INDICACION_SUPERIOR">Indicación superior</option>
        </Select>
        {#if form?.errors?.tipoEntrada}
          <ErrorMessage>{form.errors.tipoEntrada}</ErrorMessage>
        {/if}
      </div>

      <div class="lg:col-span-4">
        <Input
          label="Número oficio"
          name="numeroOficio"
          class="uppercase"
          id="numeroOficio"
          bind:value={numeroOficio}
        />
        {#if form?.errors?.numeroOficio}
          <ErrorMessage>{form.errors.numeroOficio}</ErrorMessage>
        {/if}
      </div>

      <div class="lg:col-span-8">
        <hr />
        <h3 class="text-base/5 font-semibold p-2">
          Datos del reporte
        </h3>
      </div>

      <div class="lg:col-span-4">
        <Select
          bind:value={categoriaOrden}
          label="Categoría"
          id="categoria"
          required
        >
          {#each categoriasOrden as categoriaOrden(categoriaOrden.id)}
            <option value={categoriaOrden}>{categoriaOrden.descripcion}</option>
          {/each}
        </Select>
        {#if form?.errors?.categoriaOrdenId}
          <ErrorMessage>{form.errors.categoriaOrdenId}</ErrorMessage>
        {/if}
      </div>

      <div class="lg:col-span-4">
        <Input
          bind:value={otroCategoriaOrden}
          label="Otro"
          id="otro"
          class="uppercase"
        />
        {#if form?.errors?.otroCategoriaOrden}
          <ErrorMessage>{form.errors.otroCategoriaOrden}</ErrorMessage>
        {/if}
      </div>

      <div class="lg:col-span-4">
        <Select
          label="Prioridad"
          bind:value={prioridad}
          id="prioridad"
          required
        >
          <option value="BAJA">Baja</option>
          <option value="MEDIA">Media</option>
          <option value="ALTA">Alta</option>
          <option value="CRITICA">Crítica</option>
        </Select>
        {#if form?.errors?.prioridad}
          <ErrorMessage>{form.errors.prioridad}</ErrorMessage>
        {/if}
      </div>

      <div class="lg:col-span-4">
        <div class="flex justify-center items-center h-full p-1">
          <ButtonSecundary
            type="button"
             class="w-full"
             onclick={() => void formAgregarActivo?.open()}>
            Agregar activo
          </ButtonSecundary>
        </div>
      </div>

      <div class="lg:col-span-8">
        {#if activos.length > 0}
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {#each activos as activo(activo.idT)}
              <div class="group relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg transition-all">
                <div class="flex items-start justify-between mb-3">
                  <div class="flex-1">
                    <span class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                      {activo.categoriaActivo.descripcion}
                    </span>
                  </div>
                  <button
                    onclick={() => borrarActivo(activo)}
                    type="button"
                    aria-label="Eliminar activo {activo.numeroInventario}"
                    class="
                      p-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100
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
                </div>

                <!-- Info principal -->
                <div class="space-y-2">
                  <div>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Inventario</p>
                    <p class="text-sm font-semibold text-gray-900 dark:text-white">
                      {activo.numeroInventario ?? 'N/A'}
                    </p>
                  </div>

                  <div>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Serie</p>
                    <p class="text-sm font-medium text-gray-900 dark:text-white">
                      {activo.numeroSerie ?? 'N/A'}
                    </p>
                  </div>

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
          <SinResultados textoAMostrar="Sin activos agregados" />
        {/if}
      </div>

      <div class="lg:col-span-8">
        <TextArea
          name="descripcion"
          id="descripcion"
          label="Descripción del reporte"
          bind:value={descripcion}
          class="uppercase"
          required
        />
        {#if form?.errors?.descripcion}
          <ErrorMessage>{form.errors.descripcion}</ErrorMessage>
        {/if}
      </div>

    </div>

  </div>
</div>

<form
  method="POST"
  use:confirmBeforeEnhance={{ confirm: () => confirmModal?.confirm({}) ?? Promise.resolve(false) }}
  use:enhance={async ({ formData }) => {
    submitting = true;
    const data = {
      descripcion: descripcion,
      areaParaAsignarId: areaParaAsignar?.id ?? null,
      empleadoSolicitanteId: empleadoSolicitante?.id ?? null,
      telefonoSolicitante: telefonoSolicitante,
      tipoEntrada: tipoEntrada,
      numeroOficio: numeroOficio,
      categoriaOrdenId: categoriaOrden?.id ?? null,
      categoriaOrdenText: categoriaOrden?.descripcion ?? null,
      otroCategoriaOrden: otroCategoriaOrden,
      prioridad: prioridad,
      activos: activos.map(activo => {
        const nActivo = {
          numeroInventario: activo.numeroInventario,
          numeroSerie: activo.numeroSerie,
          categoriaActivoId: activo.categoriaActivo.id,
          marca: activo.marca,
          modelo: activo.modelo,
          observaciones: activo.observaciones
        };
        return nActivo;
      })
    };
    formData.append('data', JSON.stringify(data));
    return async ({ update, result }) => {
      await update();
      if (result.status === 200) {
        direccionGeneralEmpleadoSolicitante = null;
        areaEmpleadoSolicitante = null;
        empleadoSolicitante = null;
        descripcion = '';
        areaParaAsignar = null;
        telefonoSolicitante = '';
        tipoEntrada = null;
        numeroOficio = '';
        categoriaOrden = null;
        otroCategoriaOrden = '';
        prioridad = null;
        activos = [];
      }
      submitting = false;
    };
  }}
>
  <ButtonAccept class="w-full">
    Guardar Ticket
  </ButtonAccept>
</form>
