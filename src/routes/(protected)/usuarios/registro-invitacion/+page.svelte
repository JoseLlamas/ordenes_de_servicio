<script>
  import Select from '$lib/components/Select.svelte';
  import ButtonAccept from '$lib/components/ButtonAccept.svelte';
  import { enhance } from '$app/forms';
  import LoadingScreen from '$lib/components/LoadingScreen.svelte';
  import ErrorMessage from '$lib/components/ErrorMessage.svelte';
  import Line from '$lib/components/Line.svelte';
  import TitleMain from '$lib/components/TitleMain.svelte';
  import TitleSection from '$lib/components/TitleSection.svelte';
  import ButtonSecundary from '$lib/components/ButtonSecundary.svelte';
  import { obtenerEmpleadosSinUsuarioPorArea } from '$lib/api';
  import { normalizePalabras } from '$lib/utils/normalize_palabras.js';
  import ConfirmModal from '$lib/components/ConfirmModal.svelte';
  import { confirmBeforeEnhance } from '$lib/actions/confirm_before_enhance.js';
  import InfoMessage from '$lib/components/InfoMessage.svelte';
  import ErrorCard from '$lib/components/ErrorCard.svelte';

  let { data, form } = $props();

  /**
   * @type {typeof data.roles[number] | null}
   */
  let rolSeleccionado = $state(null);

  /**
   * @type {typeof data.areasParaAsignar[number] | null}
  */
  let areaParaAsignarEmpleado = $state(null);

  /**
   * @type {typeof data.areasParaAsignar[number] | null}
  */
 let areaParaAsignarAlcance = $state(null);

  /**
   * @type {Awaited<ReturnType<typeof obtenerEmpleadosSinUsuarioPorArea>>[number] | null}
   */
  let empleadoSeleccionado = $state(null);

  /**
   * @type {typeof data.areasParaAsignar[number][]}
   */
  let areasAccesoSeleccionadas = $state([]);

  let submitting = $state(false);

  /**
   *
   * @param {typeof areasAccesoSeleccionadas[number]} area
   */
  function agregarAreaAcceso (area) {
    if (areasAccesoSeleccionadas.findIndex((ar) => area.id === ar.id) === -1) {
      areasAccesoSeleccionadas.push(area);
    }
  }

  /**
   *
   * @param {typeof areasAccesoSeleccionadas[number]} area
   */
  function borrarAreaAcceso (area) {
    areasAccesoSeleccionadas = areasAccesoSeleccionadas.filter((ar) => ar.id !== area.id);
  }

  /**
   * @type {Awaited<ReturnType<typeof obtenerEmpleadosSinUsuarioPorArea>>}
   */
  let empleados = $state([]);

  function obtenerEmpleadosSinUsuarioHandle () {
    empleados = [];
    empleadoSeleccionado = null;
    if (areaParaAsignarEmpleado == null) {
      return;
    }
    void obtenerEmpleadosSinUsuarioPorArea(areaParaAsignarEmpleado.id)
      .then(result => {
        empleados = result;
      });
  }

  let modal = $state();
</script>

<svelte:head>
  <title>Registro de invitación para empleado</title>
</svelte:head>

<LoadingScreen hidden={!submitting} />

<ConfirmModal bind:this={modal}/>

<TitleMain>
  Registro de invitación
</TitleMain>

<Line class="my-4" />

{#if form?.error}
  <ErrorCard>
    {form.error}
  </ErrorCard>
{/if}

{#if form?.token}
  <InfoMessage>
    El token de la invitación es <strong>{form.token}</strong>
  </InfoMessage>
{/if}

<div class="grid grid-cols-1 md:grid-cols-4 gap-2">
  <div class="md:col-span-4">
    <TitleSection>
      Empleado
    </TitleSection>
  </div>
  <div class="md:col-span-2">
    <Select
      label="Area"
      bind:value={areaParaAsignarEmpleado}
      id="areaParaAsignarEmpleado"
      onchange={obtenerEmpleadosSinUsuarioHandle}
    >
      {#each data.areasParaAsignar as areaParaAsignar(areaParaAsignar.id)}
        <option value={areaParaAsignar}>{areaParaAsignar.nombre}</option>
      {/each}
    </Select>
  </div>
  <div class="md:col-span-2">
    <Select
      label="Empleado"
      required
      id="empleado"
      bind:value={empleadoSeleccionado}
    >
      {#each empleados as empleado(empleado.id)}
        <option value={empleado}>{normalizePalabras(empleado.nombre, empleado.primerApellido, empleado.segundoApellido ?? '')}</option>
      {/each}
    </Select>
    {#if form?.errors && form.errors.empleadoId}
      <ErrorMessage>
        {form.errors.empleadoId}
      </ErrorMessage>
    {/if}
  </div>
  <div class="md:col-span-4">
    <TitleSection>
      Rol
    </TitleSection>
  </div>
  <div class="md:col-span-4 grid grid-cols-1 md:grid-cols-4 gap-4">
    {#each data.roles as rol(rol.id)}
      <div class="relative">
        <input
          type="radio"
          id="rol-{rol.id}"
          name="rolId"
          value={rol}
          bind:group={rolSeleccionado}
          class="peer sr-only"
        />
        <label
          for="rol-{rol.id}"
          class="
            block cursor-pointer rounded-lg border-2 p-5 transition-all
            border-gray-200 dark:border-gray-700
            bg-white dark:bg-gray-800
            hover:border-gray-300 dark:hover:border-gray-600
            hover:shadow-md
            peer-checked:border-blue-500 dark:peer-checked:border-blue-400
            peer-checked:ring-2 peer-checked:ring-blue-500/20 dark:peer-checked:ring-blue-400/20
            peer-checked:bg-blue-50/50 dark:peer-checked:bg-blue-950/20
          "
        >
          <!-- Indicador de selección -->
          <div class="absolute top-4 right-4">
            <div class="
              h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all
              {rolSeleccionado?.id === rol.id
                ? 'border-blue-500 dark:border-blue-400 bg-blue-500 dark:bg-blue-400'
                : 'border-gray-300 dark:border-gray-600'}
            ">
              {#if rolSeleccionado?.id === rol.id}
                <svg class="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 12 12">
                  <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                </svg>
              {/if}
            </div>
          </div>

          <!-- Header del rol -->
          <div class="pr-8">
            <div class="flex items-start justify-between gap-4">
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  {rol.nombre}
                </h3>
                {#if rol.descripcion}
                  <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {rol.descripcion}
                  </p>
                {/if}
              </div>
            </div>

            <!-- Badge de cantidad de permisos -->
            <div class="mt-3 flex items-center gap-2">
              <svg class="h-4 w-4 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span class="text-sm text-gray-600 dark:text-gray-400">
                {rol.permisos?.length || 0} {rol.permisos?.length === 1 ? 'permiso' : 'permisos'}
              </span>
            </div>

            <!-- Lista de permisos -->
            <div class="mt-4 space-y-2">
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Permisos incluidos:
              </p>
              <div class="flex flex-wrap gap-2">
                {#each rol.permisos as permiso(permiso.id)}
                  <div
                    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs
                      bg-gray-100 dark:bg-gray-700/50
                      text-gray-700 dark:text-gray-300
                      border border-gray-200 dark:border-gray-600"
                    title={permiso.texto || `${permiso.accion} ${permiso.sujeto}`}
                  >
                    <span class="font-medium text-green-600 dark:text-green-400">
                      {permiso.accion}
                    </span>
                    <span class="text-gray-400 dark:text-gray-500">·</span>
                    <span class="text-purple-600 dark:text-purple-400">
                      {permiso.sujeto}
                    </span>
                  </div>
                {/each}
              </div>
            </div>
          </div>
        </label>
      </div>
    {/each}
  </div>
  {#if form?.errors && form.errors.rolId}
    <div class="md:col-span-4">
      <ErrorMessage>
        {form.errors.rolId}
      </ErrorMessage>
    </div>
  {/if}
  <div class="md:col-span-4">
    <TitleSection>
      Alcance del rol
    </TitleSection>
  </div>
  <div class="md:col-span-2">
    <Select
      label="Area"
      bind:value={areaParaAsignarAlcance}
      id="areaParaAsignarAlcance"
    >
      {#each data.areasParaAsignar as area(area.id)}
        <option value={area}>{area.nombre}</option>
      {/each}
    </Select>
  </div>
  <div class="md:col-span-2 flex items-center justify-center">
    <ButtonSecundary
      class="w-full"
      onclick={() => {
        if (areaParaAsignarAlcance != null) {
          agregarAreaAcceso(areaParaAsignarAlcance);
        }
      }}
    >
      Agregar area
    </ButtonSecundary>
  </div>
  <div class="md:col-span-4">
    {#if areasAccesoSeleccionadas.length > 0}
      <div class="
        rounded-lg border p-4 space-y-2
        bg-gray-50 dark:bg-gray-800/50
        border-gray-200 dark:border-gray-700
      ">
        {#each areasAccesoSeleccionadas as areaAcceso(areaAcceso.id)}
          <div class="
            flex items-center justify-between gap-3 p-3 rounded-lg transition-colors
            bg-white dark:bg-gray-800
            border border-gray-200 dark:border-gray-700
            hover:border-gray-300 dark:hover:border-gray-600
          ">
            <div class="flex items-center gap-3 flex-1 min-w-0">
              <svg class="h-5 w-5 text-gray-400 dark:text-gray-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span class="text-gray-900 dark:text-white font-medium truncate">
                {areaAcceso.nombre}
              </span>
            </div>
            <button
              type="button"
              class="
                shrink-0 p-1.5 rounded-lg transition-colors
                text-gray-400 dark:text-gray-500
                hover:text-red-600 dark:hover:text-red-400
                hover:bg-red-50 dark:hover:bg-red-950/30
                focus:outline-none focus:ring-2 focus:ring-red-500/50
              "
              title="Quitar {areaAcceso.nombre}"
              onclick={() => {
                borrarAreaAcceso(areaAcceso);
              }}
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        {/each}
      </div>
    {:else}
      <div class="
        text-center py-8 rounded-lg border-2 border-dashed
        bg-gray-50 dark:bg-gray-800/50
        border-gray-300 dark:border-gray-700
      ">
        <svg class="mx-auto h-10 w-10 text-gray-400 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
          No hay areas agregadas
        </p>
      </div>
    {/if}
  </div>
  {#if form?.errors && form.errors.areasAccesoId}
    <div class="md:col-span-4">
      <ErrorMessage>
        {form.errors.areasAccesoId}
      </ErrorMessage>
    </div>
  {/if}
  <form
    class="md:col-span-4"
    method="POST"
    use:confirmBeforeEnhance={{ confirm: () => modal.confirm({ texto: '¿Seguro de registrar la invitación?' }) }}
    use:enhance={({ formData }) => {
      submitting = true;
      const data = {
        empleadoId: empleadoSeleccionado?.id ?? null,
        rolId: rolSeleccionado?.id ?? null,
        areasAccesoId: areasAccesoSeleccionadas.map((a) => a.id)
      };
      formData.set('data', JSON.stringify(data));
      return async ({ update, result }) => {
        await update();
        if (result.type === 'success') {
          areaParaAsignarEmpleado = null;
          areaParaAsignarAlcance = null;
          empleadoSeleccionado = null;
          rolSeleccionado = null;
          areasAccesoSeleccionadas = [];
        }
        submitting = false;
      };
    }}
  >
    <ButtonAccept class="w-full">
      Registrar invitación
    </ButtonAccept>
  </form>
</div>
