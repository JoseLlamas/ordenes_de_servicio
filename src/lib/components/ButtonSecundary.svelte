<script>
  /**
   * @type {{
   *  children?: import('svelte').Snippet,
   *  class?: string,
   *  [key: string]: any
   * }}
   */
  let {
    children,
    'class': classNames = '',
    ...props
  } = $props();
</script>

<button
  class={[
    'bg-[#1f9b7b]', // Color complementario al rojo
    'text-white',
    'py-2',
    'px-4',
    'rounded-md',
    'hover:bg-[#187f63]', // Un poco más oscuro al hacer hover
    'transition-colors',
    'cursor-pointer'
  ].concat(classNames.split(' '))}
  {...props}
>
  {@render children?.()}
</button>

<style>
  button:disabled {
    background-color: #f3f3f3;
    cursor: not-allowed;
  }
</style>
