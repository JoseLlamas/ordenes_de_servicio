<script>
  /**
   *  @type {{
   *    class?: string,
   *    label?: string,
   *    checked?: boolean,
   *    name?: string,
   *    id?: string,
   *    [key: string]: any
   *  }}
   */
  let {
    'class': classNames = '',
    name,
    label,
    id,
    checked = $bindable(false),
    ...props
  } = $props();
</script>

<div class="inline-flex items-center gap-2 cursor-pointer select-none">
  <input
    {id}
    {name}
    type="checkbox"
    bind:checked
    class="
      h-5 w-5 rounded border border-zinc-300
      bg-white dark:bg-zinc-900
      dark:border-zinc-700 text-blue-600
      focus:ring-2 focus:ring-blue-500
      disabled:opacity-50 disabled:cursor-not-allowed
      transition-all {classNames}
    "
    {...props}
  />
  {#if typeof label !== 'undefined'}
    <label for={id} class="text-sm text-zinc-800 dark:text-zinc-100">{label}</label>
  {/if}
</div>
