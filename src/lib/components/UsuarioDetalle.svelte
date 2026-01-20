<script>
  import Avatar from './Avatar.svelte';
  import { escribirNombreCompleto } from '$lib/utils';

  /**
   * @type {{
   *   usuario: import('$lib/types').UsuarioDetalleDTO
   * }}
   */
  let { usuario } = $props();

  // Colores por rol
  const coloresRol = {
    'Administrador': 'bg-red-400',
    'Encargado': 'bg-blue-400',
    'Agente': 'bg-cyan-400',
    'Capturista': 'bg-yellow-400'
  };

  let colorRol = $derived(coloresRol[usuario.rol.nombre] ?? 'bg-rol-capturista');
  let nombreCompleto = $derived(escribirNombreCompleto(usuario.empleado));
</script>

<div>
  <!-- Header con avatar -->
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
    <!-- Banner superior con color del rol -->
    <div class={['h-18', colorRol]}></div>

    <!-- Contenido del perfil -->
    <div class="px-6 pb-6 -mt-16">
      <Avatar
        size="large"
        usuarioNombreCompleto={nombreCompleto}
        rolNombre={usuario.rol.nombre}
        avatar={usuario.avatar}
      />
      <!-- Información principal -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {nombreCompleto}
        </h1>

        <p class="text-lg text-gray-600 dark:text-gray-400 mb-3">
          @{usuario.nombreUsuario}
        </p>

        <div class="flex flex-wrap items-center gap-3">
          <!-- Badge de estado -->
          {#if usuario.activo}
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
              <span class="w-2 h-2 bg-green-500 rounded-full"></span>
              Activo
            </span>
          {:else}
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400">
              <span class="w-2 h-2 bg-red-500 rounded-full"></span>
              Inactivo
            </span>
          {/if}

          <!-- Badge de rol -->
          <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" />
              <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
            </svg>
            {usuario.rol.nombre}
          </span>
        </div>
      </div>

    </div>
  </div>

  <!-- Grid de información -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
    <!-- Información Personal -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        Información Personal
      </h2>

      <dl class="space-y-4">
        <div>
          <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
            Nombre Completo
          </dt>
          <dd class="mt-1 text-sm text-gray-900 dark:text-white">
            {nombreCompleto}
          </dd>
        </div>

        <div>
          <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
            Cargo
          </dt>
          <dd class="mt-1 text-sm text-gray-900 dark:text-white">
            {usuario.empleado.cargo ?? 'No registrado'}
          </dd>
        </div>
      </dl>
    </div>

    <!-- Información Organizacional -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        Información Organizacional
      </h2>

      <dl class="space-y-4">
        <div>
          <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
            Área
          </dt>
          <dd class="mt-1 text-sm text-gray-900 dark:text-white">
            {usuario.empleado.area.nombre}
          </dd>
        </div>

        <div>
          <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
            Dirección General
          </dt>
          <dd class="mt-1 text-sm text-gray-900 dark:text-white">
            {usuario.empleado.direccionGeneral.nombre}
          </dd>
        </div>

        <div>
          <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
            Rol del Sistema
          </dt>
          <dd class="mt-1">
            <span class="inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" />
                <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
              </svg>
              {usuario.rol.nombre}
            </span>
          </dd>
        </div>
      </dl>
    </div>

    <!-- Permisos (solo si tiene permisos) -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 lg:col-span-2">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        Permisos
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {#each usuario.rol.permisos as permiso(permiso.id)}
          <div class="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            <svg class="w-4 h-4 text-green-500 flex-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
            </svg>
            <span class="text-sm text-gray-700 dark:text-gray-300">
              {permiso.texto}
            </span>
          </div>
        {/each}
      </div>
    </div>

    <!-- Áreas de Acceso (si tiene) -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 lg:col-span-2">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
        </svg>
        Áreas de Acceso Adicionales
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {#if usuario.areasAcceso != null}
          {#each usuario.areasAcceso as area(area.id)}
            <div class="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
              <svg class="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
              </svg>
              <span class="text-sm text-gray-700 dark:text-gray-300">
                {area.nombre}
              </span>
            </div>
          {/each}
        {:else}
          <div class="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            <svg class="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
            </svg>
            <span class="text-sm text-gray-700 dark:text-gray-300">
              A todas las areas
            </span>
          </div>
        {/if}
      </div>
    </div>

  </div>
</div>
