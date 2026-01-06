<script>
  /**
   * @type {{
   *  text: string,
   *  class?: string,
   *  submitting: boolean,
   *  type?: 'submit' | 'reset' | 'button',
   *  [key: string]: any
   * }}
   */
  let {
    'class': classNames = '',
    submitting,
    text,
    type = 'submit',
    ...props
  } = $props();
</script>
<button
  disabled={submitting}
  class="
    inline-flex items-center justify-center gap-2 bg-[#9b1f3d] text-white py-2.5
    px-6 rounded-lg font-medium hover:bg-[#7f182f] transition-colors
    cursor-pointer {classNames}"
  {type}
  {...props}
>
  {#if submitting}
    <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    Guardando...
  {:else}
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
    </svg>
    {text}
  {/if}
</button>

<style>
  button:disabled {
    background-color: #f3f3f3;
    cursor: not-allowed;
  }
</style>
