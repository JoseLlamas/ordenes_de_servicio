<script>
  import { enhance } from '$app/forms';
  import ButtonAccept from '$lib/components/ButtonAccept.svelte';
  import Select from '$lib/components/Select.svelte';
  import Input from '$lib/components/Input.svelte';
  import TextArea from '$lib/components/TextArea.svelte';
  import LoadingScreen from '$lib/components/LoadingScreen.svelte';
  import ButtonSecundary from '$lib/components/ButtonSecundary.svelte';
  import ErrorMessage from '$lib/components/ErrorMessage.svelte';
  import { obtenerAreasPorDireccion, obtenerEmpleadosPorArea, obtenerCategoriasOrdenPorArea } from '$lib/api';
  import { escribirNombreCompleto } from '$lib/utils';
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

  /**
   * @type {ConfirmModal | undefined}
  */
  let confirmModal = $state();

  let fetchingCategoriasOrden = $state(false);

  function handleAreaParaAsignarChange () {
    categoriaOrden = null;
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
            <option value={empleado}>{escribirNombreCompleto(empleado)}</option>
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
  use:confirmBeforeEnhance={{ confirm: () => confirmModal?.confirm({ texto: '¿Desea registrar una nueva orden de servicio?' }) ?? Promise.resolve(false) }}
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
      prioridad: prioridad
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
      }
      submitting = false;
    };
  }}
>
  <ButtonAccept class="w-full">
    Guardar Ticket
  </ButtonAccept>
</form>
