<script>
  import Paginador from '$lib/components/Paginador.svelte';
  import Select from '$lib/components/Select.svelte';
  import ErrorMessage from '$lib/components/ErrorMessage.svelte';
  import { enhance } from '$app/forms';
  import UsuarioResumenTarjeta from '$lib/components/UsuarioResumenTarjeta.svelte';
  import SinResultados from '$lib/components/SinResultados.svelte';
  import ButtonSubmitting from '$lib/components/ButtonSubmitting.svelte';
  import Checkbox from '$lib/components/Checkbox.svelte';

  let { data, form } = $props();

  const areasParaAsignar = $derived(data.areasParaAsignar);
  const usuariosResumenes = $derived(form?.usuariosResumenes ?? null);

  let fetching = $state(false);

  /**
   * @param {NonNullable<typeof usuariosResumenes>} a
   */
  const asUsuarioResumenes = (a) => a;
</script>

<svelte:head>
  <title>Usuarios registrados</title>
</svelte:head>

{#snippet imprimirListaUsuarios(ur)}
  {@const usuariosResumenes = asUsuarioResumenes(ur)}
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {#each usuariosResumenes as usuarioResumen (usuarioResumen.id)}
      <div>
        <UsuarioResumenTarjeta {usuarioResumen} />
      </div>
    {/each}
  </div>
{/snippet}

<form
  method="POST"
  use:enhance={() => {
    fetching = true;
    return async ({ update }) => {
      await update();
      fetching = false;
    };
  }}
  class="grid grid-cols-1 lg:grid-cols-3 gap-4"
>

  <div class="lg:col-span-2">
    <Select
      label="Area"
      name="areaId"
      id="areaParaAsignar"
    >
      {#each areasParaAsignar as area(area.id)}
        <option value={area.id}>{area.nombre}</option>
      {/each}
    </Select>
    {#if form?.errors?.areaId}
      <ErrorMessage>
        {form.errors.areaId}
      </ErrorMessage>
    {/if}
  </div>

  <div class="flex items-center justify-center">
    <Checkbox
      label="¿Sólo activos?"
      name="soloActivos"
    />
  </div>

  <div class="lg:col-span-3">
    <ButtonSubmitting
      text="Buscar"
      submitting={fetching}
      class="w-full"
    />
  </div>
</form>

{#if usuariosResumenes != null}
  {#if usuariosResumenes.length > 0}
    <Paginador
      records={usuariosResumenes}
      render={imprimirListaUsuarios}
    />
  {:else}
    <SinResultados />
  {/if}
{/if}
