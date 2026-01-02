<script>
  import Mode from '$lib/components/Mode.svelte';
  import logo from '$lib/assets/logo.png';

  let { children } = $props();
</script>
<Mode />
<div class={['min-h-screen', 'flex', 'flex-col', 'lg:flex-row-reverse']}>

  <main class="flex-2 flex items-center justify-center bg-white dark:bg-[#2b2e37] p-4">
    <div class="bg-gray-100 dark:bg-[#22242b] shadow-lg rounded-lg p-8 w-full min-w-sm max-w-5xl">
      <div class="text-gray-700 dark:text-gray-100 leading-relaxed">
        {@render children?.()}
      </div>
    </div>
  </main>

  <aside class="flex-1 bg-gray-100 dark:bg-[#22242b] text-gray-600 dark:text-gray-300 py-4 lg:py-0">
    <div class="flex flex-col items-center justify-center h-full gap-1 mx-auto px-6 md:px-12">
      <div>
        <h2 class="text-xl font-bold text-gray-800 dark:text-white text-center">
          Desarrollo de Sistemas
        </h2>
        <h3 class="text-xl font-bold text-gray-800 dark:text-white text-center">
          Ordenes de Servicio
        </h3>
      </div>
      <div class="border-t border-gray-300 dark:border-gray-700 mt-6 pt-4 text-center text-sm">
        © 2025 Alcaldia Iztapalapa. Todos los derechos reservados.
      </div>
      <img src={logo} alt="logo iztapalapa" />
    </div>
  </aside>
</div>
