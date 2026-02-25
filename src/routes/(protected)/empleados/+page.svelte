<script>
  import { enhance } from '$app/forms';
  import Input from '$lib/components/Input.svelte';
  import ButtonSubmitting from '$lib/components/ButtonSubmitting.svelte';
  import ErrorMessage from '$lib/components/ErrorMessage.svelte';
  import TitleSection from '$lib/components/TitleSection.svelte';
  import LoaderLine from '$lib/components/LoaderLine.svelte';
  import SinResultados from '$lib/components/SinResultados.svelte';
    import Link from '$lib/components/Link.svelte';

  let { form } = $props();

  let fetching = $state(false);

</script>

<svelte:head>
  <title>Ver empleados</title>
</svelte:head>

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
    <table class="min-w-full divide-y divide-gray-200 text-sm">
      <thead class="bg-gray-100 text-gray-700 text-left">
        <tr class="hidden lg:table-row">
          <th class="py-2 px-4">Nombre</th>
          <th class="py-2 px-4">Primer Apellido</th>
          <th class="py-2 px-4">Segundo Apellido</th>
          <th class="py-2 px-4">Dirección General</th>
          <th class="py-2 px-4">Area</th>
          <th class="py-2 px-4">Cargo</th>
          <th class="py-2 px-4">Activo</th>
          <th class="py-2 px-4">Acción</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200">
        {#each form.empleados as empleado(empleado.id)}
        <!-- Repetir este bloque por cada item -->
          <tr class="block lg:table-row border-b lg:border-none p-4 lg:p-0">
            <!-- Nombre -->
            <td class="py-2 px-4 lg:table-cell block">
              <span class="lg:hidden font-semibold">Nombre:</span>
              {empleado.nombre}
            </td>
            <!-- Primer Apellido -->
            <td class="py-2 px-4 lg:table-cell block">
              <span class="lg:hidden font-semibold">Primer Apellido:</span>
              {empleado.primerApellido}
            </td>
            <!-- Segundo Apellido -->
            <td class="py-2 px-4 lg:table-cell block">
              <span class="lg:hidden font-semibold">Segundo Apellido:</span>
              {empleado.segundoApellido ?? 'N/A'}
            </td>
            <td class="py-2 px-4 lg:table-cell block">
              <span class="lg:hidden font-semibold">Dirección General:</span>
              {empleado.direccionGeneral.nombre}
            </td>
            <td class="py-2 px-4 lg:table-cell block">
              <span class="lg:hidden font-semibold">Area:</span>
              {empleado.area.nombre}
            </td>
            <td class="py-2 px-4 lg:table-cell block">
              <span class="lg:hidden font-semibold">Cargo:</span>
              {empleado.cargo ?? 'N/A'}
            </td>
            <td class="py-2 px-4 lg:table-cell block">
              <span class="lg:hidden font-semibold">Activo</span>
              {empleado.activo ? 'Si' : 'No'}
            </td>
            <td class="py-2 px-4 lg:table-cell block">
              <span class="lg:hidden font-semibold">Activo</span>
              {#if empleado.activo}
                <Link
                  variant="secondary"
                  size="sm"
                  href={`/ordenes/registro?empleadoId=${empleado.id}`}
                >
                  Crear OS
                </Link>
              {:else}
                ...
              {/if}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  {:else}
    <SinResultados />
  {/if}
{/if}
