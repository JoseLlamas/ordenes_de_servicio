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
    type = 'button',
    ...props
  } = $props();
</script>

<button
  {type}
  class="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors cursor-pointer {classNames}"
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
