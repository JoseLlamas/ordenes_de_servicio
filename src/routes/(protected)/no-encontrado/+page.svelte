<script>
  import { goto } from '$app/navigation';
  import img from '$lib/assets/error-404-1170x658.jpg';
</script>

<svelte:head>
  <title>Recurso no encontrado</title>
</svelte:head>

<div class="flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
  <div class="max-w-md w-full text-center space-y-2">

    <!-- Icono -->
    <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 mb-6">
      <svg class="w-10 h-10 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    </div>

    <!-- Título -->
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
      Recurso no encontrado
    </h1>

    <!-- Descripción -->
    <p class="text-gray-600 dark:text-gray-400 mb-8">
      No se encontró el recurso solicitado. Si crees que esto es un error, contacta a un administrador.
    </p>

    <!-- Botones -->
    <div class="flex flex-col sm:flex-row gap-3 justify-center">
      <button
        onclick={() => window.history.back()}
        class="px-6 py-2.5 rounded-lg font-medium border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        Volver
      </button>
      <button
        onclick={() => goto('/')}
        class="px-6 py-2.5 rounded-lg font-medium bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
      >
        Ir al inicio
      </button>
    </div>
    <img src={img} alt="forbidden" class="block" />
  </div>
</div>
