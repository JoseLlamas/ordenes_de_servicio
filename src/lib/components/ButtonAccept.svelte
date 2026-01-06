<script>
  /**
   * @type {{
   * class?: string,
   * children?: import('svelte').Snippet,
   * type?: 'submit' | 'reset' | 'button',
   * [key: string]: any
   * }}
   */
  let {
    'class': classNames = '',
    children,
    type = 'submit',
    ...props
  } = $props();
</script>
<button
  class="bg-[#9b1f3d] text-white py-2 px-4 rounded-md hover:bg-[#7f182f]
    transition-colors cursor-pointer {classNames}"
  {type}
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
