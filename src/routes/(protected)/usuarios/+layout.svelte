<script>
  import TitleWithMenu from '$lib/components/TitleWithMenu.svelte';

  let { children } = $props();
</script>

<TitleWithMenu
  title="Usuarios"
  enlaces={{ 'Ver usuarios': '/usuarios', 'Registrar invitación': '/usuarios/registro-invitacion' }}
/>

{@render children()}
