<script>
  import { enhance } from '$app/forms';
  import ButtonAccept from '$lib/components/ButtonAccept.svelte';
  import ErrorMessage from '$lib/components/ErrorMessage.svelte';
  import InfoMessage from '$lib/components/InfoMessage.svelte';
  import Input from '$lib/components/Input.svelte';
  import LoadingScreen from '$lib/components/LoadingScreen.svelte';
  import Select from '$lib/components/Select.svelte';
  import TitleSection from '$lib/components/TitleSection.svelte';
  import { confirmBeforeEnhance } from '$lib/actions/confirm_before_enhance';
  import ConfirmModal from '$lib/components/ConfirmModal.svelte';
  import ErrorCard from '$lib/components/ErrorCard.svelte';
  import { obtenerAreasPorDireccion } from '$lib/api/areas';

  let { data, form } = $props();

  /**
   * @type {number | null}
   */
  let direccionGeneralId = $state(null);

  /**
   * @type {number | null}
   */
  let areaId = $state(null);

  /**
   * @type {boolean}
   */
  let fetching = $state(false);

  /**
   * @type {Awaited<ReturnType<typeof obtenerAreasPorDireccion>>}
   */
  let areas = $state([]);

  function obtenerAreasPorDireccionHandle () {
    areas = [];
    areaId = null;
    if (direccionGeneralId === null) {
      return;
    }
    void obtenerAreasPorDireccion(direccionGeneralId)
      .then((result) => {
        areas = result;
      });
  }

  /**
   * @type {ConfirmModal | undefined}
  */
  let confirmModal = $state();
</script>

<svelte:head>
  <title>Registro de empleado</title>
</svelte:head>

<ConfirmModal bind:this={confirmModal} />

<LoadingScreen hidden={!fetching} />

<TitleSection>
  Registro
</TitleSection>


{#if form?.mensaje}
  <InfoMessage>
    {form.mensaje}
  </InfoMessage>
{/if}
{#if form?.error}
  <ErrorCard>
    {form.error}
  </ErrorCard>
{/if}

<form
  method="POST"
  class="mt-3 p-2 grid grid-cols-1 lg:grid-cols-3 gap-x-4 gap-y-2"
  use:confirmBeforeEnhance={{ confirm: () => confirmModal?.confirm({ texto: '¿Está seguro de registrar al empleado?' }) ?? Promise.resolve(false) }}
  use:enhance={() => {
    fetching = true;
    return async ({ update }) => {
      await update();
      fetching = false;
    };
  }}
  novalidate
>
  <div>
    <Select
      label="Dirección general"
      name="direccionGeneralId"
      bind:value={direccionGeneralId}
      onchange={obtenerAreasPorDireccionHandle}
      required
    >
      {#each data.direccionesGenerales as direccionGeneral(direccionGeneral.id)}
        <option value={direccionGeneral.id}>{direccionGeneral.nombre}</option>
      {/each}
    </Select>
    {#if form?.errors?.direccionGeneralId}
      <ErrorMessage>
        {form.errors.direccionGeneralId}
      </ErrorMessage>
    {/if}
  </div>

  <div>
    <Select
      label="Area"
      name="areaId"
      bind:value={areaId}
      required
    >
      {#each areas as area(area.id)}
        <option value={area.id}>{area.nombre}</option>
      {/each}
    </Select>
    {#if form?.errors?.areaId}
      <ErrorMessage>
        {form.errors.areaId}
      </ErrorMessage>
    {/if}
  </div>

  <div>
    <Input
      label="Nombre"
      name="nombre"
      class="uppercase"
      required
    />
    {#if form?.errors?.nombre}
      <ErrorMessage>
        {form.errors.nombre}
      </ErrorMessage>
    {/if}
  </div>

  <div>
    <Input
      label="Primer apellido"
      name="primerApellido"
      class="uppercase"
      required
    />
    {#if form?.errors?.primerApellido}
      <ErrorMessage>
        {form.errors.primerApellido}
      </ErrorMessage>
    {/if}
  </div>

  <div>
    <Input
      label="Segundo apellido"
      name="segundoApellido"
      class="uppercase"
    />
    {#if form?.errors?.segundoApellido}
      <ErrorMessage>
        {form.errors.segundoApellido}
      </ErrorMessage>
    {/if}
  </div>

  <div>
    <Input
      label="Cargo"
      name="cargo"
      class="uppercase"
      required={false}
    />
    {#if form?.errors?.cargo}
      <ErrorMessage>
        {form.errors.cargo}
      </ErrorMessage>
    {/if}
  </div>

  <div class="lg:col-span-3">
    <ButtonAccept class="w-full">
      Guardar
    </ButtonAccept>
  </div>
</form>
