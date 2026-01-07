<script>
    import { enhance } from '$app/forms';
  import { obtenerUsuariosConPermisoAgente } from '$lib/api';
  import { normalizePalabras } from '$lib/utils';
  import Avatar from './Avatar.svelte';
  import ButtonAccept from './ButtonAccept.svelte';
  import ButtonSubmitting from './ButtonSubmitting.svelte';
  import Input from './Input.svelte';
  import Paginador from './Paginador.svelte';

  /**
   * @typedef {Awaited<ReturnType<typeof obtenerUsuariosConPermisoAgente>>[number]} UsuarioConPermisoAgente
  */

  /**
   * @type {{
   *  areaId: number,
   *  ordenServicioId: number
   * }}
   */
  let {
    areaId
  } = $props();

  /**
   * @type {UsuarioConPermisoAgente[]}
   */
  let usuariosConPermisoAgentesSeleccionados = $state([]);

  let loading = $state(false);
  let busqueda = $state('');
  let mostrandoSeleccionados = $state(false);

  /**
   * @type {UsuarioConPermisoAgente[]}
   */
  let usuariosConPermisoAgente = $state([]);

  /**
   * @type {UsuarioConPermisoAgente[]}
   */
  let usuariosConPermisoAgenteParaMostrar = $state([]);

  /**
   *
   * @param {UsuarioConPermisoAgente} agente
   */
  function toggleAgente (agente) {
    const index = usuariosConPermisoAgentesSeleccionados.findIndex(a => a.id === agente.id);
    if (index >= 0) {
      usuariosConPermisoAgentesSeleccionados =
        usuariosConPermisoAgentesSeleccionados.filter(a => a.id !== agente.id);
      usuariosConPermisoAgenteParaMostrar = [...usuariosConPermisoAgentesSeleccionados];
    } else {
      usuariosConPermisoAgentesSeleccionados.push(agente);
      usuariosConPermisoAgente = usuariosConPermisoAgente.filter(a => a.id !== agente.id);
      usuariosConPermisoAgenteParaMostrar = [...usuariosConPermisoAgente];
    }
  }

  function mostrarUsuariosConPermisoAgenteToggle () {
    mostrandoSeleccionados = !mostrandoSeleccionados;
    if (mostrandoSeleccionados) {
      usuariosConPermisoAgenteParaMostrar = [...usuariosConPermisoAgentesSeleccionados];
    } else {
      usuariosConPermisoAgenteParaMostrar = [...usuariosConPermisoAgente];
    }
  }

  function estaSeleccionado (agenteId) {
    return usuariosConPermisoAgentesSeleccionados.some(a => a.id === agenteId);
  }

  function buscarUsuariosConPermisosAgente () {
    const b = busqueda.trim().toUpperCase();
    loading = true;
    void obtenerUsuariosConPermisoAgente(areaId, b)
      .then(result => {
        mostrandoSeleccionados = false;
        const usuariosIds = usuariosConPermisoAgentesSeleccionados.map(u => u.id);
        usuariosConPermisoAgente = result.filter(u => !usuariosIds.includes(u.id));
        usuariosConPermisoAgenteParaMostrar = [...usuariosConPermisoAgente];
      })
      .finally(() => {
        loading = false;
      });
  }

  /**
   *
   * @param {UsuarioConPermisoAgente[]} xs
   */
  const asUsuariosConPermisosAgente = (xs) => xs;
</script>

{#snippet imprimirUsuariosConPermisoAgente(a)}
  {@const agentes = asUsuariosConPermisosAgente(a)}
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
    {#each agentes as agente (agente.id)}
      <button
        type="button"
        onclick={() => toggleAgente(agente)}
        class="relative flex items-center gap-3 p-4 bg-white border-2 rounded-xl cursor-pointer transition-all duration-200 text-left
              {estaSeleccionado(agente.id)
                ? 'border-blue-500 bg-blue-50 dark:border-blue-600 dark:bg-blue-950/30'
                : 'border-gray-200 hover:border-gray-300 hover:shadow-md dark:bg-gray-800 dark:border-gray-700 dark:hover:border-gray-600'
              }"
      >
        <!-- Checkbox -->
        <div class="flex-0 w-5 h-5 border-2 rounded flex items-center justify-center transition-all
                    {estaSeleccionado(agente.id)
                      ? 'bg-blue-500 border-blue-500 dark:bg-blue-600 dark:border-blue-600'
                      : 'bg-white border-gray-300 dark:bg-gray-700 dark:border-gray-600'
                    }">
          {#if estaSeleccionado(agente.id)}
            <svg class="w-3.5 h-3.5 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          {/if}
        </div>

        <!-- Avatar -->
        <Avatar
          size="medium"
          avatar={agente.avatar}
          rolNombre={agente.rol.nombre}
          usuarioNombreCompleto={normalizePalabras(agente.empleado.nombre, agente.empleado.primerApellido, agente.empleado.segundoApellido ?? '')}
        />

        <!-- Info -->
        <div class="flex-1 min-w-0">
          <h4 class="font-semibold text-sm text-gray-900 truncate dark:text-gray-100">
            {normalizePalabras(agente.empleado.nombre, agente.empleado.primerApellido, agente.empleado.segundoApellido ?? '')}
          </h4>
          <p class="text-xs text-gray-500 truncate dark:text-gray-400">
            {agente.nombreUsuario}
          </p>
          <span class="inline-block mt-1.5 px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-medium dark:bg-gray-700 dark:text-gray-300">
            {agente.rol.nombre}
          </span>
        </div>
      </button>
    {/each}
  </div>
{/snippet}

<div class="space-y-4">
  <!-- Header -->
  <div class="space-y-3">
    <!-- Título con contador -->
    <div class="flex items-center gap-3">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
        Seleccionar Agentes
      </h3>
      {#if true}
        <button
          type="submit"
          onclick={mostrarUsuariosConPermisoAgenteToggle}
          class="cursor-pointer"
        >
          <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
            { mostrandoSeleccionados ? 'bg-blue-500 text-white dark:bg-blue-600' : 'bg-green-500 text-white dark:bg-green-600' }">
            {usuariosConPermisoAgentesSeleccionados.length} seleccionado(s) { mostrandoSeleccionados ? '(No Mostrar)' : '(Mostrar)'}
          </span>
        </button>
      {/if}
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-x-4 gap-y-2">
      <div class="lg:col-span-3">
        <Input
          placeholder="Buscar por nombre"
          bind:value={busqueda}
          class="uppercase"
        />
      </div>
      <div>
        <ButtonSubmitting
          submitting={loading}
          text="Buscar"
          type="button"
          class="w-full"
          onclick={buscarUsuariosConPermisosAgente}
        />
      </div>
    </div>
  </div>

  <!-- Contenido -->
  {#if loading}
    <!-- Loading State -->
    <div class="flex flex-col items-center justify-center py-12 space-y-4">
      <div class="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin dark:border-gray-700 dark:border-t-blue-600"></div>
      <p class="text-sm text-gray-500 dark:text-gray-400">Cargando agentes...</p>
    </div>
  {:else}
    {#if usuariosConPermisoAgenteParaMostrar.length === 0}
      <!-- Empty State -->
      <div class="flex flex-col items-center justify-center py-12 space-y-4">
        <svg class="w-16 h-16 text-gray-400 dark:text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          No se encontraron agentes
        </p>
      </div>
    {:else}
      <Paginador
        records={usuariosConPermisoAgenteParaMostrar}
        perPagina={6}
        showTopMenu={false}
        render={imprimirUsuariosConPermisoAgente}
      />
    {/if}
  {/if}
</div>

<form
  method="POST"
  action="?/asignar"
  use:enhance={({ formData }) => {
    return async ({ update }) => {
      await update();
    };
  }}
>
  <ButtonAccept class="w-full">
    Asignar
  </ButtonAccept>
</form>
