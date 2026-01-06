<script>
  /**
   * @type {{
   *  children?: import('svelte').Snippet,
   *  class?: string,
   *  type?: 'submit' | 'reset' | 'button',
   *  [key: string]: any
   * }}
   */
  let {
    children,
    'class': classNames = '',
    type = 'submit',
    ...props
  } = $props();
</script>

<button
  class="bg-[#1f9b7b] text-white py-2 px-4 rounded-md hover:bg-[#187f63] transition-colors cursor-pointer {classNames}"
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
