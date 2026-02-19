<!-- lib/components/CapturadorFirmaAvanzado.svelte -->
<script>
  import SignaturePad from 'signature_pad';
  import { onMount } from 'svelte';

  /**
   * @type {{
   *   titulo?: string,
   *   onguardar?: (firma: string) => void,
   *   onlimpiar?: () => void,
   *   obligatorio?: boolean,
   *   colorFirma?: string,
   *   class?: string
   * }}
   */
  let {
    titulo = 'Firma',
    onguardar,
    onlimpiar,
    obligatorio = false,
    colorFirma = '#000000',
    class: className = ''
  } = $props();

  /**
   * @type {HTMLCanvasElement | null}
   */
  let canvasRef = $state(null);

  /**
   * @type {SignaturePad | null}
   */
  let signaturePad = $state(null);

  let firmado = $state(false);

  /**
   * @type {string | null}
   */
  let firmaGuardada = $state(null);

  onMount(() => {
    if (canvasRef) {
      // Ajustar tamaño
      resizeCanvas();

      // Inicializar Signature Pad
      signaturePad = new SignaturePad(canvasRef, {
        backgroundColor: 'transparent',
        penColor: colorFirma,
        minWidth: 1,
        maxWidth: 3,
        velocityFilterWeight: 0.7
      });

      // Detectar cuando firma
      signaturePad.addEventListener('beginStroke', () => {
        firmado = true;
      });
    }

    // Redimensionar en cambios de ventana
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  });

  function resizeCanvas () {
    if (!canvasRef) {return;}

    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    const rect = canvasRef.getBoundingClientRect();

    canvasRef.width = rect.width * ratio;
    canvasRef.height = rect.height * ratio;
    canvasRef?.getContext('2d')?.scale(ratio, ratio);

    signaturePad?.clear();
  }

  function limpiar () {
    signaturePad?.clear();
    firmado = false;
    firmaGuardada = null;
    onlimpiar?.();
  }

  function guardar () {
    if (!firmado || signaturePad?.isEmpty()) {return;}

    // Obtener como base64
    const firmaBase64 = signaturePad?.toDataURL('image/png');

    if (firmaBase64 != null) {
      firmaGuardada = firmaBase64;
      onguardar?.(firmaBase64);
    }
  }

  // Métodos públicos
  export function validar () {
    return firmado && !signaturePad?.isEmpty();
  }

  export function reset () {
    limpiar();
  }
</script>

<div class="space-y-3 {className}">
  {#if titulo}
    <div class="text-sm font-semibold text-gray-900 dark:text-gray-100">
      {titulo}
      {#if obligatorio}
        <span class="text-red-500">*</span>
      {/if}
    </div>
  {/if}

  <div class="border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-900">
    <canvas
      bind:this={canvasRef}
      class="w-full h-48 touch-none"
    ></canvas>
  </div>

  <div class="flex gap-2">
    <button
      type="button"
      onclick={limpiar}
      disabled={!firmado}
      class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      Limpiar
    </button>

    <button
      type="button"
      onclick={guardar}
      disabled={!firmado}
      class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      Guardar Firma
    </button>
  </div>

  {#if firmaGuardada}
    <div class="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
      Firma guardada correctamente
    </div>
  {/if}
</div>
