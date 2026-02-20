<script>
  import { obtenerCategoriasActivoPorArea } from '$lib/api';
  import Input from './Input.svelte';
  import Select from './Select.svelte';
  import ButtonAccept from './ButtonAccept.svelte';
  import ButtonCancel from './ButtonCancel.svelte';
  import LoaderLine from './LoaderLine.svelte';
  import TextArea from './TextArea.svelte';
  import ErrorMessage from './ErrorMessage.svelte';
  import ErrorCard from './ErrorCard.svelte';
  import InfoMessage from './InfoMessage.svelte';

  /**
  * @import { CategoriaActivoDTO } from '$lib/types';
  *
  * @typedef {{ [K in keyof ActivoParam]?: string } & { errorAgregarActivo?: string }} Errors
  *
  * @typedef {{
  *   categoriaActivoId: number | null,
  *   numeroInventario: string,
  *   numeroSerie: string,
  *   marca: string,
  *   modelo: string,
  *   observaciones: string
  * }} ActivoParam
  *
  */

  /**
   *  @type {{
   *    areaId: number,
   *    onAgregar: (activo: ActivoParam) => void,
   *    onCancel?: () => void,
   *    errors?: Errors,
   *    message?: string
   * }}
  */
  let {
    areaId,
    onAgregar,
    onCancel,
    errors,
    message
  } = $props();

  /**
   * @type {CategoriaActivoDTO | null}
   */
  let categoriaActivo = $state(null);

  let numeroInventario = $state('');

  let numeroSerie = $state('');

  let marca = $state('');

  let modelo = $state('');

  let observaciones = $state('');

  let fetching = $state(false);

  /**
   * @type {Awaited<ReturnType<typeof obtenerCategoriasActivoPorArea>>}
   */
  let categoriasActivo = $state([]);

  export function limpiarCampos () {
    numeroInventario = '';
    numeroSerie = '';
    categoriaActivo = null;
    marca = '';
    modelo = '';
    observaciones = '';
  }

  function clicInAceptar () {
    onAgregar?.({
      categoriaActivoId: categoriaActivo != null ? categoriaActivo.id : null,
      numeroInventario: numeroInventario,
      numeroSerie: numeroSerie,
      modelo: modelo,
      marca: marca,
      observaciones: observaciones
    });
  }

  $effect(() => {
    fetching = true;
    obtenerCategoriasActivoPorArea(areaId)
      .then((data) => {
        categoriasActivo = data;
      })
      .finally(() => {
        fetching = false;
      });
  });
</script>

{#if errors?.errorAgregarActivo}
  <ErrorCard>
    {errors.errorAgregarActivo}
  </ErrorCard>
{/if}

{#if message}
  <InfoMessage>
    {message}
  </InfoMessage>
{/if}

<div class="mt-5 grid grid-cols-1 gap-x-6 gap-y-4 lg:grid-cols-4 mb-5">
  {#if fetching}
    <div class="lg:col-span-4">
      <LoaderLine />
    </div>
  {/if}
  <div class="lg:col-span-2">
    <Input
      bind:value={numeroInventario}
      label="Número de inventario"
      id="numeroInventario"
    />
    {#if errors?.numeroInventario}
      <ErrorMessage>
        {errors.numeroInventario}
      </ErrorMessage>
    {/if}
  </div>
  <div class="lg:col-span-2">
    <Input
      bind:value={numeroSerie}
      label="Número de serie"
      id="numeroSerie"
    />
    {#if errors?.numeroSerie}
      <ErrorMessage>
        {errors.numeroSerie}
      </ErrorMessage>
    {/if}
  </div>
  <div class="lg:col-span-2">
    <Select
      id="categoriaActivo"
      label="Categoria"
      bind:value={categoriaActivo}
      required
    >
      {#each categoriasActivo as categoriaActivo(categoriaActivo.id)}
        <option value={categoriaActivo}>{categoriaActivo.descripcion}</option>
      {/each}
    </Select>
    {#if errors?.categoriaActivoId}
      <ErrorMessage>
        {errors.categoriaActivoId}
      </ErrorMessage>
    {/if}
  </div>
  <div class="lg:col-span-2">
    <Input
      bind:value={marca}
      label="marca"
      id="marca"
    />
    {#if errors?.marca}
      <ErrorMessage>
        {errors.marca}
      </ErrorMessage>
    {/if}
  </div>
  <div class="lg:col-span-4">
    <Input
      bind:value={modelo}
      label="modelo"
      id="modelo"
    />
    {#if errors?.modelo}
      <ErrorMessage>
        {errors.modelo}
      </ErrorMessage>
    {/if}
  </div>
  <div class="lg:col-span-4">
    <TextArea
      bind:value={observaciones}
      label="observaciones"
      id="observaciones"
      class="uppercase"
    />
    {#if errors?.observaciones}
      <ErrorMessage>
        {errors.observaciones}
      </ErrorMessage>
    {/if}
  </div>
</div>
<hr />
<div class="flex justify-end gap-2 mt-5">
  <ButtonCancel
    disabled={fetching}
    onclick={() => {
      onCancel?.();
    }}
  >
    Cerrar
  </ButtonCancel>
  <ButtonAccept
    type="button"
    disabled={fetching}
    onclick={() => {
      clicInAceptar();
    }}
  >
    Agregar Activo
  </ButtonAccept>
</div>
