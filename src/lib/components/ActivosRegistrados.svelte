<script>
    import SinResultados from './SinResultados.svelte';

  let { activos = $bindable([]), clickInDelete = null } = $props();
</script>

<span
  class="block text-sm font-medium"
>
  Activos registrados
</span>
{#if activos.length > 0}
  <dl class="grid grid-cols-1 gap-4 sm:grid-cols-2  bg-white p-6 shadow-md rounded-lg">
  {#each activos as activo, index(index)}
  <div class="flex justify-between items-center bg-gray-100 p-3 rounded-lg">
    <div class="flex flex-col">
      <dt class="text-sm font-semibold text-gray-500">{activo.numeroSerie}</dt>
      <dd class="text-lg font-medium text-gray-900">{activo.numeroInventario}</dd>
    </div>
    <button
      type="button"
      onclick={() => clickInDelete?.(index)} class="text-red-500 hover:text-red-700 cursor-pointer"
      aria-label="dsf"
    >
      <svg
        class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
      >
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6l-2 14H7L5 6"></path>
        <path d="M10 11v6"></path>
        <path d="M14 11v6"></path>
        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>
      </svg>
    </button>
  </div>
  {/each}
    </dl>
{:else}
  <SinResultados textoAMostrar="Sin activos agregados" />
{/if}
