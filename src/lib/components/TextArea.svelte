<script>
  /**
   * @type {{
   *  label?: string,
   *  value?: string,
   *  disabled?: boolean,
   *  required?: boolean,
   *  class?: string,
   *  rows?: number,
   *  id?: string,
   *  name?: string,
   *  [key: string]: any
   * }}
   */
  let {
    label,
    value = $bindable(''),
    disabled = $bindable(false),
    required = false,
    'class': classNames = '',
    rows = 4,
    name,
    id,
    ...props
  } = $props();
</script>

<div class="text-sm font-medium space-y-2">
  {#if typeof label !== 'undefined'}
    <label
      for={id}
      class={['block', required && 'after:content-["*"] after:text-red-500 after:ml-1']}
    >
      {label}
    </label>
  {/if}
  <textarea
    {rows}
    {disabled}
    {name}
    {id}
    bind:value
    class="
      block w-full px-4 py-2.5 pr-12 rounded-lg border
      bg-white dark:bg-gray-900
      border-gray-300 dark:border-gray-600
      text-gray-900 dark:text-white
      placeholder-gray-400 dark:placeholder-gray-500
      focus:border-[#9b1f3d] dark:focus:border-[#9b1f3d]
      focus:outline-none {classNames}
    "
    {...props}
  ></textarea>
</div>
