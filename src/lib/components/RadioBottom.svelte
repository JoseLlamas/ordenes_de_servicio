<script>
  let { classNames = [], label = null, value = $bindable(null), name, ...props } = $props();
</script>

<label class="inline-flex items-center gap-2 cursor-pointer select-none">
  <input
    type="radio"
    {name}
    bind:value={value}
    class={'h-5 w-5 rounded border border-zinc-300 bg-white dark:bg-zinc-900 dark:border-zinc-700 text-blue-600 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all ' + classNames.join(' ')}
    {...props}
  />
  {#if label}
    <span class="text-sm text-zinc-800 dark:text-zinc-100">{label}</span>
  {/if}
</label>
