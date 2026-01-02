<script>
  import { page } from '$app/state';
  import imgForbidden from '$lib/assets/website-error-403-forbidden.svg';
  import imgNotFound from '$lib/assets/error-404-1170x658.jpg';

  const imagenes = {
    404: imgNotFound,
    403: imgForbidden
  };
</script>

<div class="flex flex-col items-center justify-center px-4 py-8 gap-4 min-h-screen h-auto">
  <div class="max-w-lg text-center">
    <h1 class="text-6xl font-bold text-red-600 dark:text-red-500 mb-4">{page.status}</h1>
    <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Ocurrió un error</h2>
    <p class="text-gray-600 dark:text-gray-400 mb-6">{page.error?.message ?? 'Ha ocurrido un problema inesperado.'}</p>
    <a href="/" class="inline-block bg-gray-900 text-white dark:bg-white dark:text-gray-900 px-6 py-2 rounded-xl shadow hover:opacity-90 transition">
      Volver al inicio
    </a>
  </div>
  {#if imagenes[page.status] !== 'undefined'}
    <img src={imagenes[page.status]} alt="imagen" class="object-cover max-w-2xl"/>
  {/if}
</div>
