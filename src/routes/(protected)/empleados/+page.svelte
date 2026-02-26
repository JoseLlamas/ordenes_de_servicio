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

  let { form } = $props();

  let fetching = $state(false);

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
