<script>
  import { enhance } from '$app/forms';
  import Input from '$lib/components/Input.svelte';
  import ButtonSubmitting from '$lib/components/ButtonSubmitting.svelte';
  import ErrorMessage from '$lib/components/ErrorMessage.svelte';
  import TitleSection from '$lib/components/TitleSection.svelte';
  import LoaderLine from '$lib/components/LoaderLine.svelte';
  import SinResultados from '$lib/components/SinResultados.svelte';
  import TarjetaEmpleado from '$lib/components/TarjetaEmpleado.svelte';
  import Paginador from '$lib/components/Paginador.svelte';
  import { goto } from '$app/navigation';
  import Modal from '$lib/components/Modal.svelte';
    import ErrorCard from '$lib/components/ErrorCard.svelte';
    import { escribirNombreCompleto } from '$lib/utils/index.js';

  let { form } = $props();

  let fetching = $state(false);

  let dandoDeBaja = $state(false);

  /**
   * @type {Modal | null}
   */
  let modalDarDeBajaRef = $state(null);

  /**
   * @type {import('$lib/types').EmpleadoDetalleDTO | null}
   */
  let empleadoSeleccionado = $state(null);

  /**
   *
   * @param {NonNullable<NonNullable<typeof form>['empleados']>} xs
   */
  const asEmpleados = (xs) => xs;
</script>

<svelte:head>
  <title>Ver empleados</title>
</svelte:head>

{#snippet imprimirEmpleados(emp)}
  {@const empleados = asEmpleados(emp)}
  <div class="grid grid-cols-1 lg:grid-cols-2">
    {#each empleados as empleado(empleado.id)}
      <TarjetaEmpleado
        empleado={empleado}
        onCrearOS={(empleadoId) => goto(`/ordenes/registro?empleadoId=${empleadoId}`)}
        onBuscarOrdenes={(empleadoId) => goto(`/ordenes?empleadoSolicitanteId=${empleadoId}`)}
        onDarDeBaja={(empleado) => {
          empleadoSeleccionado = empleado;
          modalDarDeBajaRef?.open();
        }}
      />
    {/each}
  </div>
{/snippet}

<TitleSection>
  Ver
</TitleSection>

{#if fetching}
  <LoaderLine />
{/if}
<form
  class="mt-3 p-2 grid grid-cols-1 gap-x-4 gap-y-2 lg:grid-cols-6"
  use:enhance={async () => {
    fetching = true;
    return async ({ update }) => {
      await update();
      fetching = false;
    };
  }}
  action="?/buscar"
  method="POST"
  novalidate
>
  <div class="lg:col-span-2">
    <Input
      name="nombre"
      label="Nombre"
      class="uppercase"
    />
    {#if form?.errors && 'nombre' in form.errors && form.errors.nombre}
      <ErrorMessage>
        {form.errors.nombre}
      </ErrorMessage>
    {/if}
  </div>
  <div class="lg:col-span-2">
    <Input
      name="primerApellido"
      label="Segundo Apellido"
      class="uppercase"
    />
    {#if form?.errors && 'primerApellido' in form.errors && form.errors.primerApellido}
      <ErrorMessage>
        {form.errors.primerApellido}
      </ErrorMessage>
    {/if}
  </div>
  <div class="lg:col-span-2">
    <Input
      name="segundoApellido"
      label="Segundo Apellido"
      class="uppercase"
    />
    {#if form?.errors && 'segundoApellido' in form.errors && form.errors.segundoApellido}
      <ErrorMessage>
        {form.errors.segundoApellido}
      </ErrorMessage>
    {/if}
  </div>
  <div class="lg:col-span-6">
    <ButtonSubmitting class="w-full" submitting={fetching} text="Buscar" />
  </div>
</form>

{#if form?.empleados}
  {#if form.empleados.length > 0}
    <div class="overflow-x-auto">
      <Paginador
        records={form.empleados}
        render={imprimirEmpleados}
        showTopMenu={false}
        perPagina={6}
      />
    </div>
  {:else}
    <SinResultados />
  {/if}
{/if}

<Modal
  bind:this={modalDarDeBajaRef}
  title="Dar de Baja Empleado"
  working={dandoDeBaja}
>
  {#if empleadoSeleccionado != null && empleadoSeleccionado.activo}
    <form
      method="POST"
      action="?/darDeBaja"
      use:enhance={() => {
        dandoDeBaja = true;

        return async ({ update, result }) => {
          await update();
          dandoDeBaja = false;

          if (result.type === 'success') {
            modalDarDeBajaRef?.close();
            empleadoSeleccionado = null;
          }
        };
      }}
    >
      <div class="space-y-4">
        <div class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div class="flex items-start gap-3">
            <svg class="w-6 h-6 text-red-600 dark:text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <h3 class="font-semibold text-red-900 dark:text-red-100">
                ¿Dar de baja este empleado?
              </h3>
              <p class="text-sm text-red-700 dark:text-red-300 mt-1">
                El empleado {escribirNombreCompleto(empleadoSeleccionado)} ya no aparecerá en el sistema.
                Si el empleado tiene usuario, este también será dado de baja. Esta acción puede revertirse después.
              </p>
            </div>
          </div>
        </div>

        <input type="hidden" name="empleadoId" value={empleadoSeleccionado.id} />

        <div class="flex gap-3">
          <button
            type="button"
            onclick={() => modalDarDeBajaRef?.close()}
            disabled={dandoDeBaja}
            class="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-lg font-medium disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={dandoDeBaja}
            class="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium disabled:opacity-50"
          >
            {dandoDeBaja ? 'Procesando...' : 'Sí, Dar de Baja'}
          </button>
        </div>
      </div>
    </form>
  {/if}
</Modal>
