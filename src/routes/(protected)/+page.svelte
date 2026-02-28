<script>
  let busqueda = $state('');

  function handleBuscar (e) {
    e.preventDefault();
    if (busqueda.trim()) {
      window.location.href = `/ordenes/${busqueda}`;
    }
  }
</script>

<div class="min-h-screen bg-linear-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-6">
  <div class="max-w-2xl w-full">
    <!-- Logo y título -->
    <div class="text-center mb-12">
      <h1 class="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        OS
      </h1>
      <p class="text-xl text-gray-600 dark:text-gray-400">
        Ordenes de Servicio
      </p>
    </div>

    <!-- Búsqueda -->
    <form onsubmit={handleBuscar} class="mb-8">
      <div class="relative">
        <input
          type="text"
          bind:value={busqueda}
          placeholder="Buscar orden por folio"
          class="
            w-full px-6 py-4 pl-14 rounded-2xl
            bg-white dark:bg-gray-800
            border-2 border-gray-200 dark:border-gray-700
            text-gray-900 dark:text-gray-100
            placeholder-gray-400 dark:placeholder-gray-500
            focus:border-blue-500 dark:focus:border-blue-500
            focus:outline-none
            shadow-lg
          "
        />
        <svg class="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </form>

  </div>
</div>
