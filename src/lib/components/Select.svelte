<script>
  /**
   * @type {{
   *  class?: string,
   *  id?: string,
   *  label?: string,
   *  required?: boolean,
   *  children?: import('svelte').Snippet,
   *  name?: string,
   *  value?: any,
   *  [key: string]: any
   * }}
   */
  let {
    class: classNames = '',
    label,
    id,
    required = false,
    children,
    name,
    value = $bindable(),
    ...props
  } = $props();
</script>

<div class="text-sm font-medium space-y-2">
  {#if typeof label !== 'undefined'}
    <label
      for={id}
      class="block text-gray-700 dark:text-gray-300 mb-2 {required ? 'after:content-["*"] after:text-red-500 after:ml-1' : ''}"
    >
      {label}
    </label>
  {/if}
  <div>
    <select
      {id}
      {name}
      bind:value
      autocomplete="off"
      class="
        w-full px-4 py-2.5 pr-12 rounded-lg border
        bg-white dark:bg-gray-900
        border-gray-300 dark:border-gray-600
        text-gray-900 dark:text-white
        placeholder-gray-400 dark:placeholder-gray-500
        focus:border-[#9b1f3d] dark:focus:border-[#9b1f3d]
        focus:outline-none {classNames}
      "
      {...props}
    >
      <option value={null}>Seleccione una opción</option>
      {@render children?.()}
    </select>
  </div>
</div>

<style>
  select:disabled {
    background-color: #f3f3f3;
    cursor: not-allowed;
  }
</style>
