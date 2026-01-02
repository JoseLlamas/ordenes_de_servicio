<script>
  import TitleWithMenu from '$lib/components/TitleWithMenu.svelte';

  let { children } = $props();
</script>

<TitleWithMenu
  title="Empleados"
  enlaces={{ 'Ver Empleados': '/empleados', 'Registrar empleado': '/empleados/registro' }}
/>

{@render children()}
