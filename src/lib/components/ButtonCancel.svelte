<script>
  let {
    children,
    classNames = [],
    ...props
  } = $props();
</script>

<button
  class={[
    'bg-gray-500', // Gris neutral para indicar "Cancelar"
    'text-white',
    'py-2',
    'px-4',
    'rounded-md',
    'hover:bg-gray-600', // Un poco más oscuro al hacer hover
    'transition-colors',
    'cursor-pointer'
  ].concat(...classNames)}
  {...props}
>
  {@render children?.()}
</button>
