<script>
  /**
   * @type {{
   * class?: string,
   * children?: import('svelte').Snippet
   * [key: string]: any
   * }}
   */
  let {
    'class': classNames = '',
    children,
    ...props
  } = $props();
</script>
<button
  class={[
    'bg-[#9b1f3d]',
    'text-white',
    'py-2',
    'px-4',
    'rounded-md',
    'hover:bg-[#7f182f]',
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
