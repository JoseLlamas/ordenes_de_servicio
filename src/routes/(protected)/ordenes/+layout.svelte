<script>
  import TitleWithMenu from '$lib/components/TitleWithMenu.svelte';

  let { children } = $props();
</script>

<div class="print:hidden">
  <TitleWithMenu
    title="Ordenes de servicio"
    enlaces={{ 'Ver ordenes': '/ordenes', 'Registrar nueva orden': '/ordenes/registro' }}
  />
</div>

<div class="mt-4">
  {@render children()}
</div>
