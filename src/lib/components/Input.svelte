<script>
  /**
   * @type {{
   *  label?: string,
   *  type?: string,
   *  id?: string,
   *  value?: string,
   *  class?: string,
   *  required?: boolean,
   *  name?: string,
   *  [key: string]: any
   * }}
   */
  let {
    label,
    type = 'text',
    value = $bindable(),
    required = false,
    'class': classNames = '',
    id,
    name,
    ...props
  } = $props();
</script>

<div class="text-sm font-medium space-y-2">
  {#if label != null}
    <label for={id} class={['block', 'text-gray-700', 'dark:text-gray-300', 'mb-2', required && 'after:content-["*"] after:text-red-500 after:ml-1']}>
      {label}
    </label>
  {/if}
  <div>
    <input
      type={type}
      {id}
      {name}
      {required}
      autocomplete="off"
      bind:value
      class="
        w-full px-4 py-2.5 rounded-lg border
        bg-white dark:bg-gray-900
        border-gray-300 dark:border-gray-600
        text-gray-900 dark:text-white
        placeholder-gray-400 dark:placeholder-gray-500
        focus:border-[#9b1f3d] dark:focus:border-[#9b1f3d]
        focus:outline-none {classNames}
      "
      {...props}
    />
  </div>
</div>

<style>
  input:disabled {
    background-color: #f3f3f3;
    cursor: not-allowed;
  }
</style>
