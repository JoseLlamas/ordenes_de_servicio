<script>
  /**
   * @type {{
   *   texto: string,
   *   maxLineas?: number,
   *   maxCaracteres?: number,
   *   class?: string
   * }}
   */
  let {
    texto,
    maxLineas = 3,
    maxCaracteres,
    class: className = ''
  } = $props();

  let expandido = $state(false);
  let necesitaCortar = $state(false);

  /**
   * @type {HTMLDivElement | undefined}
   */
  let contenedorRef = $state();

  /**
   * Verifica si el texto necesita ser cortado
   */
  $effect(() => {
    if (contenedorRef) {
      const lineHeight = parseInt(window.getComputedStyle(contenedorRef).lineHeight);
      const maxHeight = lineHeight * maxLineas;
      const alturaReal = contenedorRef.scrollHeight;

      necesitaCortar = alturaReal > maxHeight;
    }
  });

  /**
   * Obtiene el texto cortado por caracteres
   */
  const textoMostrado = $derived.by(() => {
    if (expandido) {
      return texto;
    }

    if (maxCaracteres && texto.length > maxCaracteres) {
      return texto.slice(0, maxCaracteres) + '...';
    }

    return texto;
  });

  function toggle () {
    expandido = !expandido;
  }
</script>

<div class="relative {className}">
  <!-- Contenedor del texto -->
  <div
    bind:this={contenedorRef}
    class="
      text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed
      overflow-hidden transition-all duration-300 ease-in-out text-justify
      {expandido ? 'max-h-none' : ''}
    "
    style={!expandido && !maxCaracteres ? `
      display: -webkit-box;
      -webkit-line-clamp: ${maxLineas};
      -webkit-box-orient: vertical;
    ` : ''}
  >
    {textoMostrado}
  </div>

  <!-- Botón Ver más/Ver menos -->
  {#if (necesitaCortar && !maxCaracteres) || (maxCaracteres && texto.length > maxCaracteres)}
    <button
      type="button"
      onclick={toggle}
      class="
        mt-1 text-sm font-semibold text-blue-600 hover:text-blue-700
        dark:text-blue-400 dark:hover:text-blue-300
        transition-colors focus:outline-none focus:underline
      "
    >
      {expandido ? 'Ver menos' : 'Ver más'}
    </button>
  {/if}
</div>
