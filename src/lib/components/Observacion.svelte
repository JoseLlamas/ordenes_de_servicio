<!-- lib/components/Observacion.svelte -->
<script>
  import { escribirNombreCompleto, formatearFecha, formatearFechaRelativa } from '$lib/utils';
  import Avatar from './Avatar.svelte';
  import VerMas from './VerMas.svelte';

  /**
   * @type {{
   *   observacion: import('$lib/types').OrdenServicioDetalleDTO['observaciones'][number],
   *   compact?: boolean
   * }}
   */
  let {
    observacion,
    compact = false
  } = $props();

  function getTipoBadgeClasses (tipo) {
    const clases = {
      SEGUIMIENTO: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
      PENDIENTE: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
      SOLUCION: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
      CIERRE: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800'
    };
    return clases[tipo] || clases.SEGUIMIENTO;
  }

</script>

<article
  class="
    bg-white dark:bg-gray-800
    rounded-lg border border-gray-200 dark:border-gray-700
    {compact ? 'p-3' : 'p-4 sm:p-5'}
    hover:shadow-md transition-shadow
  "
>
  <!-- Header -->
  <div class="flex items-start gap-3 mb-3">
    <!-- Avatar -->
    <div class="shrink-0">
      <Avatar
        avatar={observacion.creadoPor.avatar}
        usuarioNombreCompleto={escribirNombreCompleto(observacion.creadoPor.empleado)}
        rolNombre={observacion.creadoPor.rol.nombre}
        size={compact ? 'small' : 'medium'}
      />
    </div>

    <!-- Info usuario y metadata -->
    <div class="flex-1 min-w-0">
      <!-- Usuario -->
      <div class="flex flex-wrap items-center gap-2 mb-1">
        <h4 class="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base truncate">
          {escribirNombreCompleto(observacion.creadoPor.empleado)}
        </h4>

        <span class="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">
          • {observacion.creadoPor.rol.nombre}
        </span>
      </div>

      <!-- Metadata: Tipo + Fecha -->
      <div class="flex flex-wrap items-center gap-2">
        <!-- Badge tipo -->
        <span
          class="
            inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border
            {getTipoBadgeClasses(observacion.tipo)}
          "
        >
          {observacion.tipo}
        </span>

        <!-- Fecha -->
        <time
          datetime={observacion.creadoEn instanceof Date ? observacion.creadoEn.toISOString() : observacion.creadoEn}
          title={formatearFechaRelativa(observacion.creadoEn)}
          class="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1"
        >
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {formatearFecha(observacion.creadoEn)}
        </time>
      </div>
    </div>
  </div>

  <!-- Contenido de la observación -->

  <div class="bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4 text-justify">
    <VerMas
      texto={observacion.observacion}
    />
  </div>
</article>
