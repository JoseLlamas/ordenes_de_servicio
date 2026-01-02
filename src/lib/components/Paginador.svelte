<script>
  import ButtonAccept from './ButtonAccept.svelte';

  /**
   * @template T
   *
   * @type {{
   *  render: import('svelte').Snippet<[any[]]>
   *  clickInPrevious?: (paginaActual: number) => void,
   *  clickInNext?: () => void,
   *  perPagina?: number,
   *  showTopMenu?: boolean,
   *  records: any[]
   * }}
   */
  const {
    render,
    clickInPrevious,
    clickInNext,
    perPagina = 20,
    showTopMenu = true,
    records
  } = $props();

  /**
   *
   * @param {any[]} arreglo
   * @param {number} tamanio
   * @return {any[][]}
   */
  function dividirEnBloques (arreglo, tamanio) {
    const resultado = [];
    for (let i = 0; i < arreglo.length; i += tamanio) {
      resultado.push(arreglo.slice(i, i + tamanio));
    }
    return resultado;
  }

  /**
   * @type {{ paginas: number, registros: any[][], paginaActual: number, total: number }}
   */
  let paginacion = $state({
    paginas: 1,
    registros: [],
    paginaActual: 1,
    total: 0
  });

  $effect(() => {
    if (records.length === 0) {
      paginacion = {
        paginas: 1,
        registros: [],
        paginaActual: 1,
        total: 0
      };
    } else {
      paginacion = {
        paginas: Math.ceil(records.length / perPagina),
        paginaActual: 1,
        registros: dividirEnBloques(records, perPagina),
        total: records.length
      };
    }
  });
</script>

{#snippet botones()}
  <div class="flex justify-center items-center gap-2 mt-4">
    <ButtonAccept onclick={() => {
      if (paginacion.paginaActual > 1) {
        paginacion.paginaActual--;
      }
      clickInPrevious?.(paginacion.paginaActual);
    }}>
      « Anterior
    </ButtonAccept>

    <span class="px-3 py-1 text-sm text-zinc-600 dark:text-zinc-300">
      Página {paginacion.paginaActual} de {paginacion.paginas} de {paginacion.total} resultado(s)
    </span>

    <ButtonAccept onclick={() => {
      if (paginacion.paginaActual < paginacion.paginas) {
        paginacion.paginaActual++;
      }
      clickInNext?.();
    }}>
      Siguiente »
    </ButtonAccept>
  </div>
{/snippet}

<div class="space-y-2">

  {#if paginacion.registros.length > 0}
    {#if showTopMenu}
      {@render botones()}
    {/if}
    {@render render(paginacion.registros[paginacion.paginaActual - 1])}
    {@render botones()}
  {/if}
</div>
