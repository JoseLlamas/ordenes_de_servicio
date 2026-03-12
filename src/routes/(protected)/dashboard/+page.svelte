<script>
  import TitleMain from '$lib/components/TitleMain.svelte';
  import Select from '$lib/components/Select.svelte';
  import ButtonAccept from '$lib/components/ButtonAccept.svelte';
  import SinResultados from '$lib/components/SinResultados.svelte';
  import { escribirNombreCompleto } from '$lib/utils';
  import Avatar from '$lib/components/Avatar.svelte';
  import Paginador from '$lib/components/Paginador.svelte';
  import { enhance } from '$app/forms';
  import Line from '$lib/components/Line.svelte';
  import TitleSection from '$lib/components/TitleSection.svelte';
  import LoadingScreen from '$lib/components/LoadingScreen.svelte';
    import Checkbox from '$lib/components/Checkbox.svelte';

  /**
   * @typedef {Exclude<NonNullable<typeof form>['agentes'], undefined>[number]} Agente
   */

  let { data, form } = $props();

  let fetchingAgentes = $state(false);
  let soloLibres = $state(false);

  let agentes = $derived.by(() => {
    if (form?.agentes == null) {
      return [];
    }
    if (!soloLibres) {
      return [...form.agentes];
    }
    return [...form.agentes].filter((agente) => agente.ordenServicioId == null);
  });

  /**
   * @param {Agente[]} xs
   */
  const asAgentes = (xs) => xs;
</script>

<svelte:head>
  <title>Ordenes de Servicio - Dashboard -</title>
</svelte:head>

{#snippet imprimirAgentes(a)}
  {@const agentes = asAgentes(a)}
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
    {#each agentes as agente (agente.id)}
      <div
        class="relative flex items-center gap-3 p-4 bg-white border-2 rounded-xl cursor-pointer transition-all duration-200 text-left
        border-gray-200 hover:border-gray-300 hover:shadow-md dark:bg-gray-800 dark:border-gray-700 dark:hover:border-gray-600"
      >
        <!-- Avatar -->
        <Avatar
          size="medium"
          avatar={agente.avatar}
          rolNombre={agente.rol.nombre}
          usuarioNombreCompleto={escribirNombreCompleto(agente.empleado)}
        />

        <!-- Info -->
        <div class="flex-1 min-w-0">
          <h4 class="font-semibold text-sm text-gray-900 truncate dark:text-gray-100">
            {escribirNombreCompleto(agente.empleado)}
          </h4>
          <p class="text-xs text-gray-500 truncate dark:text-gray-400">
            {agente.nombreUsuario}
          </p>
          {#if agente.ordenServicioId != null}
            <span class="inline-block mt-1.5 px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-medium dark:bg-gray-700 dark:text-gray-300">
              Trabajando en {agente.ordenServicioId}
            </span>
          {/if}
        </div>
      </div>
    {/each}
  </div>
{/snippet}

<LoadingScreen hidden={!fetchingAgentes} />

<TitleMain>
  DashBoard
</TitleMain>

<Line
  class="my-2"
/>

<div class="space-y-2">
  <div class="space-y-4">
    <TitleSection>
      Agentes
    </TitleSection>
    <div class="p-2">
      <form
        method="POST"
        action="?/obtenerAgentesPorArea"
        use:enhance={() => {
          fetchingAgentes = true;
          return async ({ update }) => {
            update();
            fetchingAgentes = false;
          };
        }}
      >
        <div class="grid grid-cols-1 gap-2">
          <div>
            <Select
              name="areaParaAsignarId"
            >
              {#each data.areasParaAsignar as areaParaAsignar(areaParaAsignar.id)}
                <option value={areaParaAsignar.id}>{areaParaAsignar.nombre}</option>
              {/each}
            </Select>
          </div>
          <div>
            <ButtonAccept
              type="submit"
              class="w-full"
            >
              Buscar
            </ButtonAccept>
          </div>
        </div>
      </form>
    </div>
    <div class="flex justify-end">
      <Checkbox
        label="Sólo libres"
        bind:checked={soloLibres}
      />
    </div>
    {#if agentes.length > 0}
      <Paginador
        records={agentes}
        render={imprimirAgentes}
        showTopMenu={false}
      />
    {:else}
      <SinResultados />
    {/if}
  </div>
</div>
