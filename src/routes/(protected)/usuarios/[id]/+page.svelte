<script>
  import Line from '$lib/components/Line.svelte';
  import TitleMain from '$lib/components/TitleMain.svelte';
  import UsuarioDetalle from '$lib/components/UsuarioDetalle.svelte';

  let { data } = $props();

  const usuario = $derived(data.usuarioDetalle);
</script>

<svelte:head>
  <title>Detalle usuario</title>
</svelte:head>

<TitleMain>
  Detalle
</TitleMain>

<Line class="my-2" />

<UsuarioDetalle {usuario} />
