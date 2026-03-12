<script>
  import Mode from '$lib/components/Mode.svelte';
  import LogoutButton from '$lib/components/LogoutButton.svelte';
  import logo from '$lib/assets/logo.png';
  import Avatar from '$lib/components/Avatar.svelte';
  import { escribirNombreCompleto } from '$lib/utils';
  import InputBusqueda from '$lib/components/InputBusqueda.svelte';
  import { goto } from '$app/navigation';

  let { children, data } = $props();

  let theme = $state('light');
  let isSidebarOpen = $state(false);

  function toggleDarkMode () {
    theme = theme === 'dark' ? 'light' : 'dark';
  }

  function toggleSidebar () {
    isSidebarOpen = !isSidebarOpen;
  }

  function closeSidebar () {
    isSidebarOpen = false;
  }

  // Menú de navegación
  const menuItems = [
    { href: '/', icon: '🏠', label: 'Inicio' },
    { href: '/dashboard', icon: '📊', label: 'Dashboard' },
    { href: '/ordenes', icon: '🎫', label: 'Ordenes' },
    { href: '/empleados', icon: '👔', label: 'Empleados' },
    { href: '/usuarios', icon: '👥', label: 'Usuarios' },
    { href: '/perfil', icon: '👤', label: 'Mi perfil' }
  ];

  /**
   *
   * @param {string} value
   */
  function onSearchOS (value) {
    const v = value.trim();
    if (!(/^[0-9]{6,}$/.test(v))) {
      return;
    }
    goto(`/ordenes/${value}`);
  }

</script>

<Mode bind:theme />

<div class="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
  <!-- Sidebar Desktop -->
  <aside
    class="print:hidden hidden lg:flex lg:flex-col lg:w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700"
  >
    <!-- Logo -->
    <div class="flex items-center justify-center h-16 px-4 border-b border-gray-200 dark:border-gray-700">
      <img src={logo} alt="Logo" class="h-10 w-auto" />
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto py-4">
      <div class="px-3 space-y-1">
        {#each menuItems as item, i (i)}
          <a
            href={item.href}
            class="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
          >
            <span class="text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
            <span class="font-medium">{item.label}</span>
          </a>
        {/each}
      </div>
    </nav>

    <!-- Sidebar Footer -->
    <div class="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
      <InputBusqueda onsearch={onSearchOS}
      placeholder="Folio"
      />
      <button
        onclick={toggleDarkMode}
        class="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
      >
        <span>{theme === 'dark' ? '☀️' : '🌙'}</span>
        <span>{theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}</span>
      </button>
      <LogoutButton />
    </div>
  </aside>

  <!-- Mobile Sidebar Overlay -->
  {#if isSidebarOpen}
    <div
      class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity"
      onclick={closeSidebar}
      role="button"
      tabindex="0"
      onkeydown={(e) => e.key === 'Escape' && closeSidebar()}
    ></div>
  {/if}

  <!-- Mobile Sidebar -->
  <aside
    class={`print:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 transform transition-transform duration-300 ease-in-out lg:hidden ${
      isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
    }`}
  >
    <!-- Logo & Close Button -->
    <div class="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
      <img src={logo} alt="Logo" class="h-10 w-auto" />
      <button
        onclick={closeSidebar}
        class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        title="menu"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto py-4">
      <div class="px-3 space-y-1">
        {#each menuItems as item, i(i)}
          <a
            href={item.href}
            onclick={closeSidebar}
            class="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <span class="text-xl">{item.icon}</span>
            <span class="font-medium">{item.label}</span>
          </a>
        {/each}
      </div>
    </nav>

    <!-- Mobile Sidebar Footer -->
    <div class="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
      <InputBusqueda
        onsearch={onSearchOS}
        placeholder="Folio"
      />
      <button
        onclick={toggleDarkMode}
        class="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
      >
        <span>{theme === 'dark' ? '☀️' : '🌙'}</span>
        <span>{theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}</span>
      </button>
      <LogoutButton />
    </div>
  </aside>

  <!-- Main Content -->
  <div class="flex-1 flex flex-col overflow-hidden">
    <!-- Top Header -->
    <header class="print:hidden h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 lg:px-6">
      <!-- Mobile Menu Button -->
      <button
        onclick={toggleSidebar}
        class="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        title="menu"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <!-- Page Title (Desktop) -->
      <div class="hidden lg:block">
        <h1 class="text-xl font-bold text-gray-800 dark:text-gray-100">
          Ordenes de servicio
        </h1>
      </div>

      <!-- Logo (Mobile) -->
      <div class="lg:hidden">
        <img src={logo} alt="Logo" class="h-8 w-auto" />
      </div>

      <!-- User Info -->
      <div class="flex items-center gap-3">
        <div class="hidden sm:block text-right">
          <p class="text-sm font-medium text-gray-700 dark:text-gray-300">@{data.usuario.nombreUsuario}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400">{data.usuario.rol.nombre}</p>
        </div>
        <div class="relative">
          <Avatar
            size="small"
            usuarioNombreCompleto={escribirNombreCompleto(data.usuario.empleado)}
            avatar={data.usuario.avatar}
            rolNombre={data.usuario.rol.nombre}
          />
        </div>
      </div>
    </header>

    <!-- Main Content Area -->
    <main class="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4 lg:p-6 print:overflow-hidden">
      <div class="max-w-7xl mx-auto">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 print:border-0 print:p-0 print:shadow-none">
          <div class="text-gray-700 dark:text-gray-100">
            {@render children?.()}
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-white print:hidden dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4 px-4 lg:px-6">
      <div class="max-w-7xl mx-auto">
        <div class="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div class="flex flex-wrap justify-center gap-4">
            <a href="/about" class="hover:text-gray-900 dark:hover:text-gray-200 transition-colors">Acerca de</a>
          </div>
          <p class="text-center sm:text-right">
            © 2026 Alcaldía Iztapalapa. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  </div>
</div>
