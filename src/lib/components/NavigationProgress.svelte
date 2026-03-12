<script>
  import { navigating } from '$app/state';
</script>

{#await navigating.complete}
  <div class="fixed top-0 left-0 right-0 z-50">
    <div class="h-1 bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 animate-shimmer"></div>
  </div>
  <!-- Opcional: Backdrop si tarda más de X tiempo -->
  <div class="fixed inset-0 bg-black/10 z-40"></div>
{:then}
  <!-- Completado -->
{:catch}
  <div class="fixed top-0 left-0 right-0 z-50 bg-red-500 text-white text-center p-2">
    Error al cargar
  </div>
{/await}

<style>
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }

  .animate-shimmer {
    animation: shimmer 1.2s ease-in-out infinite;
  }
</style>
