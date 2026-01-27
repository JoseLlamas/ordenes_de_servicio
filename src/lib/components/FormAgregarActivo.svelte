<script>
  import { obtenerCategoriasActivoPorArea } from '$lib/api';
  import Input from './Input.svelte';
  import Select from './Select.svelte';
  import Modal from './Modal.svelte';
  import ButtonAccept from './ButtonAccept.svelte';
  import ButtonCancel from './ButtonCancel.svelte';
  import { validateRegistroActivo } from '$lib/validators';
  import LoaderLine from './LoaderLine.svelte';
  import ErrorMessage from './ErrorMessage.svelte';
  import TextArea from './TextArea.svelte';

  /**
   * @import { CategoriaActivoDTO } from '$lib/types';
   *
   * @typedef {Extract<Awaited<ReturnType<typeof validateRegistroActivo>>, { errors: any}>['errors']} Errors
   * @typedef {Extract<Awaited<ReturnType<typeof validateRegistroActivo>>, { values: any}>['values']} Activo
   *
  */

  /**
   *  @type {{
   *    areaId?: number,
   *    clicInAdd: (activo: Activo) => void
   * }}
   */
  let {
    areaId,
    clicInAdd
  } = $props();

  /**
   * @type {Errors | null}
   */
  let errors = $state(null);

  /**
   * @type {CategoriaActivoDTO | null}
   */
  let categoriaActivo = $state(null);

  let numeroInventario = $state('');

  let numeroSerie = $state('');

  let marca = $state('');

  let modelo = $state('');

  let observaciones = $state('');

  /**
   * @type {Modal | undefined}
   */
  let modal = $state();

  let working = $state(false);

  /**
   * @type {Awaited<ReturnType<typeof obtenerCategoriasActivoPorArea>>}
   */
  let categoriasActivo = $state([]);

  export async function open () {
    modal?.open();
    working = true;
    if (typeof areaId !== 'undefined') {
      categoriasActivo = await obtenerCategoriasActivoPorArea(areaId);
    } else {
      categoriasActivo = [];
    }
    working = false;
  }

  function limpiarCampos () {
    numeroInventario = '';
    numeroSerie = '';
    categoriaActivo = null;
    marca = '';
    modelo = '';
    observaciones = '';
    errors = null;
  }

  async function addActivo () {
    working = true;
    const validationResult = await validateRegistroActivo({
      numeroInventario,
      numeroSerie,
      categoriaActivo: categoriaActivo !== null
        ? { id: categoriaActivo.id, descripcion: categoriaActivo.descripcion }
        : null,
      marca,
      modelo,
      observaciones
    });
    if ('errors' in validationResult) {
      errors = validationResult.errors;
      working = false;
      return;
    }
    clicInAdd(validationResult.values);
    limpiarCampos();
    working = false;
  }
</script>

<Modal
  {working}
  bind:this={modal}
  title="Agregar Activo"
  onclose={() => limpiarCampos()}
>
  <div class="mt-5 grid grid-cols-1 gap-x-6 gap-y-4 lg:grid-cols-4 mb-5">
    {#if working}
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
        <ErrorMessage>{errors.numeroInventario}</ErrorMessage>
      {/if}
    </div>
    <div class="lg:col-span-2">
      <Input
        bind:value={numeroSerie}
        label="Número de serie"
        id="numeroSerie"
      />
      {#if errors?.numeroSerie}
        <ErrorMessage>{errors.numeroSerie}</ErrorMessage>
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
      {#if errors?.categoriaActivo}
        <ErrorMessage>{errors.categoriaActivo}</ErrorMessage>
      {/if}
    </div>
    <div class="lg:col-span-2">
      <Input
        bind:value={marca}
        label="marca"
        id="marca"
      />
      {#if errors?.marca}
        <ErrorMessage>{errors.marca}</ErrorMessage>
      {/if}
    </div>
    <div class="lg:col-span-4">
      <Input
        bind:value={modelo}
        label="modelo"
        id="modelo"
      />
      {#if errors?.modelo}
        <ErrorMessage>{errors.modelo}</ErrorMessage>
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
        <ErrorMessage>{errors.observaciones}</ErrorMessage>
      {/if}
    </div>
  </div>
  <hr />
  <div class="flex justify-end gap-2 mt-5">
    <ButtonCancel
      disabled={working}
      onclick={() => {
        modal?.close();
      }}
    >
      Cerrar
    </ButtonCancel>
    <ButtonAccept
      onclick={() => void addActivo()}
      type="button"
      disabled={working}
    >
      Agregar Activo
    </ButtonAccept>
  </div>
</Modal>
