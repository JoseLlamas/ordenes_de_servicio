<script>
  import { obtenerInicialesParaAvatar } from '$lib/utils';

  /**
   * @type {{
   *  size: 'small' | 'medium' | 'large',
   *  usuarioNombreCompleto: string,
   *  rolNombre: string,
   *  avatar: string | null
   * }}
   */
  let { size, usuarioNombreCompleto, rolNombre, avatar } = $props();

  const coloresRol = {
    'Administrador': 'bg-red-200',
    'Encargado': 'bg-blue-200',
    'Agente': 'bg-cyan-200',
    'Capturista': 'bg-yellow-200'
  };

  let sizeW = $derived({ 'small': 'w-10', 'medium': 'w-16', 'large': 'w-32' }[size]);
  let sizeH = $derived({ 'small': 'h-10', 'medium': 'h-16', 'large': 'h-32' }[size]);
  let backgroundColor = $derived(coloresRol[rolNombre] ?? coloresRol['Capturista']);
  let borderSize = $derived({ 'small': 'border', 'medium': 'border-2', 'large': 'border-4' }[size]);
  let textSize = $derived({ 'small': undefined, 'medium': 'text-3xl', 'large': 'text-4xl' }[size]);
</script>

{#if avatar != null}
  <img
    src={`/${avatar}`}
    alt="Avatar"
    class={[sizeW, sizeH, 'rounded-full', 'ring-2', 'ring-gray-200', 'dark:ring-gray-700', backgroundColor]}
  />
{:else}
  <div
    class={[
      sizeW,
      sizeH,
      backgroundColor,
      borderSize,
      'border-white',
      'dark:border-gray-100',
      'flex',
      'items-center',
      'justify-center',
      'text-white',
      'font-bold',
      textSize,
      'shadow-lg',
      'rounded-full'
    ]}
  >
    {obtenerInicialesParaAvatar(usuarioNombreCompleto)}
  </div>
{/if}
