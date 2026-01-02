<script>
  /**
   * @type {{ class?: string, [key: string]: any }}
   */
  let {
    'class': classNames = '',
    ...props
  } = $props();
</script>

<hr class="border border-b-zinc-800 dark:border-b-zinc-100 {classNames}" {...props} />
