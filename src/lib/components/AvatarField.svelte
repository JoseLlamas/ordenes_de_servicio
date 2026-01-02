<script>

  /**
   * @type {{ text: string }}
   */
  let { text } = $props();

  /**
   * @type {File | null}
   */
  let selectedFile = $state(null);
</script>

<div class="flex flex-col items-center gap-4">

  <!-- Input de archivo -->
  <div class="text-center">
    <label class="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      {text}
      <input
        type="file"
        name="avatar"
        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
        class="hidden"
        onchange={(event) => {
          /**
           * @type {HTMLInputElement}
           */
          const target = /** $type {any} */ (event.target);
          selectedFile = target.files?.[0] ?? null;
        }}
      />
    </label>

  </div>

  {#if selectedFile != null}
    <p class="mt-2 text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      {selectedFile.name}
    </p>
  {/if}

  <p class="text-gray-500 dark:text-gray-400 text-xs text-center">
    JPG, PNG, WebP • Máx. 5MB
  </p>
</div>
