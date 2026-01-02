<script>
  import TitleMain from './TitleMain.svelte';
  import { onMount } from 'svelte';

  /**
   * @type {{ title: string, enlaces: Record<string, string> }}
   */
  let { title, enlaces } = $props();

  let isSubMenuOpen = $state(false);

  function closeSubMenu (event) {
    if (!event.target.closest('.submenu-container') && !event.target.closest('button')) {
      isSubMenuOpen = false;
    }
  }

  onMount(() => {
    document.addEventListener('click', closeSubMenu);
    return () => document.removeEventListener('click', closeSubMenu);
  });
</script>

<div class="relative submenu-container flex justify-between mb-2">
  <TitleMain>{title}</TitleMain>
  <button
    class="text-gray-900 dark:text-white"
    onclick={() => isSubMenuOpen = !isSubMenuOpen}
    aria-label="submenu">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  </button>

  {#if isSubMenuOpen}
    <!-- Submenú desplegable debajo del botón -->
    <div class="absolute mt-2 right-0 top-10 opacity-0 transition-opacity duration-300 ease-in-out z-50" class:opacity-100={isSubMenuOpen}>
      <ul class="bg-white dark:bg-gray-700 p-2 rounded-lg shadow-xl space-y-2">
        {#each Object.entries(enlaces) as [texto, url],i(i)}
          <li class="transition transform hover:scale-105">
            <a href={url} class="block text-blue-500 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-400 font-medium py-2 px-3 rounded-md hover:bg-blue-100 dark:hover:bg-blue-800 transition-all ease-in-out">
              {texto}
            </a>
          </li>
        {/each}
      </ul>
    </div>
  {/if}
</div>
