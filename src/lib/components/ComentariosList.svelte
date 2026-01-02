<script>
  import { estados } from '$lib/utils/estados';
  import { formatearFecha } from '$lib/utils/formateador_fecha';
  import { obtenerTipoSegunEstado } from '$lib/utils/tiposComentarios';
  import { SvelteSet } from 'svelte/reactivity';

  let { comentarios } = $props();

  let abiertos = new SvelteSet();

  $effect(() => {
    if (comentarios.length >= 1) {
      abiertos.add(comentarios[0].id);
    }
  });

  function toggle (id) {
    if (abiertos.has(id)) {
      abiertos.delete(id);
    } else {
      abiertos.add(id);
    }
  }
</script>

<div class="space-y-2">
  {#each comentarios as comentario (comentario.id)}
    <div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
      <button
        onclick={() => toggle(comentario.id)}
        class="w-full flex justify-between items-center px-4 py-3 text-left cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
      >
        <div class="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
          {comentario.usuario?.nombre}
        </div>
        <div class="flex items-center gap-2">
          <span
            class="text-xs px-2 py-0.5 rounded-full font-medium
            {comentario.tipo === obtenerTipoSegunEstado(estados.RESUELTO)
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'}">
            {comentario.tipo}
          </span>
          <svg
            class="w-4 h-4 text-gray-600 dark:text-gray-300 transform transition-transform duration-200"
            class:rotate-180={abiertos.has(comentario.id)}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {#if abiertos.has(comentario.id)}
        <div class="px-4 pb-3">
          <p class="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {comentario.texto}
          </p>
          <div class="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {formatearFecha(comentario.fechaComentario)}
          </div>
        </div>
      {/if}
    </div>
  {/each}
</div>
