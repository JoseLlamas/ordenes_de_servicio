<script>
  import { escribirNombreCompleto } from '$lib/utils';
  import Avatar from './Avatar.svelte';

  /**
   * @type {{
   *  usuarioResumen: import('$lib/types').UsuarioResumenDTO
   * }}
   */
  let { usuarioResumen: usuario } = $props();

  let nombreCompleto = $derived(escribirNombreCompleto(usuario.empleado));
</script>

<div
  class="group block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-blue-500 dark:hover:border-blue-400"
>
  <!-- Header con borde de color -->
  <div class="relative">
    <!-- Borde superior de color -->
    <div class="absolute top-0 left-0 right-0 h-1"></div>

    <div class="p-5 border-b border-gray-100 dark:border-gray-700">
      <div class="flex items-start justify-between gap-4">
        <!-- Avatar + Info -->
        <div class="flex items-center gap-3 flex-1 min-w-0">
          <!-- Avatar -->
          <Avatar
            size="medium"
            usuarioNombreCompleto={nombreCompleto}
            rolNombre={usuario.rol.nombre}
            avatar={usuario.avatar}
          />

          <!-- Nombre y username -->
          <div class="flex-1 min-w-0">
            <h3 class="font-semibold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {nombreCompleto}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
              <a href={`/usuarios/${usuario.id}`}>@{usuario.nombreUsuario}</a>
            </p>
          </div>
        </div>

        <!-- Badge de estado -->
        {#if usuario.activo}
          <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 flex-shrink-0">
            Activo
          </span>
        {:else}
          <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 flex-shrink-0">
            Inactivo
          </span>
        {/if}
      </div>
    </div>
  </div>

  <!-- Body -->
  <div class="p-5 space-y-3">
    <div class="flex items-start gap-3">
      <svg class="w-5 h-5 text-gray-400 dark:text-gray-500 flex-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
      <div class="flex-1 min-w-0">
        <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium mb-0.5">
          Área
        </p>
        <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
          {usuario.empleado.area.nombre}
        </p>
      </div>
    </div>

    <!-- Cargo -->
    {#if usuario.empleado.cargo != null}
      <div class="flex items-start gap-3">
        <svg class="w-5 h-5 text-gray-400 dark:text-gray-500 flex-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <div class="flex-1 min-w-0">
          <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium mb-0.5">
            Cargo
          </p>
          <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
            {usuario.empleado.cargo}
          </p>
        </div>
      </div>
    {/if}
  </div>

  <!-- Footer con rol -->
  <div class="px-5 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700">
    <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg">
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" />
        <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
      </svg>
      <span class="text-sm font-semibold">
        {usuario.rol.nombre}
      </span>
    </div>
  </div>
</div>
