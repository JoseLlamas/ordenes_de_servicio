<!-- lib/components/InputBusqueda.svelte -->
<script>
  /**
   * @type {{
   *  label?: string,
   *  value?: string,
   *  placeholder?: string,
   *  class?: string,
   *  disabled?: boolean,
   *  loading?: boolean,
   *  onsearch?: (valor: string) => void,
   *  onclear?: () => void,
   *  showClearButton?: boolean,
   *  id?: string,
   *  name?: string,
   *  [key: string]: any
   * }}
   */
  let {
    label,
    value = $bindable(''),
    placeholder = 'Buscar...',
    disabled = false,
    loading = false,
    onsearch,
    onclear,
    showClearButton = true,
    'class': classNames = '',
    id,
    name,
    ...props
  } = $props();

  /**
   * @type {HTMLInputElement | undefined}
   */
  let inputRef = $state();

  function handleSearch () {
    if (disabled || loading) {
      return;
    }
    onsearch?.(value);
  }

  function handleClear () {
    value = '';
    onclear?.();
    inputRef?.focus();
  }

  function handleKeydown (event) {
    if (event.key === 'Enter') {
      handleSearch();
    }
  }
</script>

<div class="text-sm font-medium space-y-2">
  {#if label != null}
    <label for={id} class="block text-gray-700 dark:text-gray-300 mb-2">
      {label}
    </label>
  {/if}

  <div class="relative">
    <!-- Input -->
    <input
      bind:this={inputRef}
      type="text"
      {id}
      {name}
      {placeholder}
      {disabled}
      autocomplete="off"
      bind:value
      onkeydown={handleKeydown}
      class="
        w-full px-4 py-2.5 pr-24 rounded-lg border
        bg-white dark:bg-gray-900
        border-gray-300 dark:border-gray-600
        text-gray-900 dark:text-white
        placeholder-gray-400 dark:placeholder-gray-500
        focus:border-[#9b1f3d] dark:focus:border-[#9b1f3d]
        focus:outline-none
        disabled:bg-gray-100 dark:disabled:bg-gray-800
        disabled:cursor-not-allowed
        {classNames}
      "
      {...props}
    />

    <!-- Botones a la derecha -->
    <div class="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
      <!-- Botón limpiar (X) -->
      {#if showClearButton && value.length > 0 && !loading}
        <button
          type="button"
          onclick={handleClear}
          disabled={disabled}
          class="
            p-1.5 rounded-md
            text-gray-400 hover:text-gray-600
            dark:text-gray-500 dark:hover:text-gray-300
            hover:bg-gray-100 dark:hover:bg-gray-700
            transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed
          "
          aria-label="Limpiar búsqueda"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      {/if}

      <!-- Botón buscar (lupa) -->
      <button
        type="button"
        onclick={handleSearch}
        disabled={disabled || loading}
        class="
          p-1.5 rounded-md
          bg-[#9b1f3d] hover:bg-[#7a1830]
          text-white
          transition-colors
          disabled:opacity-50 disabled:cursor-not-allowed
        "
        aria-label="Buscar"
      >
        {#if loading}
          <!-- Spinner -->
          <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        {:else}
          <!-- Lupa -->
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        {/if}
      </button>
    </div>
  </div>
</div>
