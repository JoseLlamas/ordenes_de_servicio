<script>
  import Line from '$lib/components/Line.svelte';
  import TitleMain from '$lib/components/TitleMain.svelte';
  import UsuarioDetalle from '$lib/components/UsuarioDetalle.svelte';
  import Modal from '$lib/components/Modal.svelte';
    import { enhance } from '$app/forms';
    import { escribirNombreCompleto } from '$lib/utils/index.js';
    import ErrorCard from '$lib/components/ErrorCard.svelte';
    import InfoMessage from '$lib/components/InfoMessage.svelte';

  let { data, form } = $props();

  const usuario = $derived(data.usuarioDetalle);

  /**
   * @type {Modal | null}
   */
  let modalResetPasswordRef = $state(null);

  /**
   * @type {Modal | null}
   */
  let modalDarDeBajaRef = $state(null);

  let resetingPassword = $state(false);
  let dandoDeBaja = $state(false);

  /**
   * @type {string | null}
   */
  let nuevaPasswordGenerada = $derived(form?.nuevoPassword ?? null);

  // Para copiar al portapapeles
  function copiarPassword () {
    if (nuevaPasswordGenerada) {
      navigator.clipboard.writeText(nuevaPasswordGenerada);
    }
  }
</script>

<svelte:head>
  <title>Detalle usuario</title>
</svelte:head>

<TitleMain>
  Detalle
</TitleMain>

<Line class="my-2" />

<UsuarioDetalle {usuario} />

<div class="mt-8 border-t-2 border-red-200 dark:border-red-800 pt-6">
  <div class="bg-red-50 dark:bg-red-950/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-6">

    <!-- Header -->
    <div class="flex items-start gap-3 mb-6">
      <svg class="w-6 h-6 text-red-600 dark:text-red-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <div>
        <h2 class="text-lg font-bold text-red-900 dark:text-red-100">
          Zona de Peligro
        </h2>
        <p class="text-sm text-red-700 dark:text-red-300 mt-1">
          Estas acciones son irreversibles o requieren confirmación adicional.
        </p>
      </div>
    </div>

    <!-- Acciones -->
    <div class="space-y-4">

      <!-- Resetear Contraseña -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-white dark:bg-gray-800 border border-red-200 dark:border-red-700 rounded-lg">
        <div class="flex-1">
          <h3 class="font-semibold text-gray-900 dark:text-gray-100">
            Resetear Contraseña
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Genera una nueva contraseña aleatoria para este usuario. La contraseña actual se invalidará inmediatamente.
          </p>
        </div>

        <button
          type="button"
          onclick={() => modalResetPasswordRef?.open()}
          class="
            shrink-0
            px-4 py-2 rounded-lg
            bg-yellow-100 hover:bg-yellow-200
            dark:bg-yellow-900/30 dark:hover:bg-yellow-900/50
            text-yellow-700 dark:text-yellow-300
            font-medium text-sm
            transition-colors
            border border-yellow-300 dark:border-yellow-700
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          Resetear Contraseña
        </button>
      </div>

      <!-- Dar de Baja -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-white dark:bg-gray-800 border border-red-200 dark:border-red-700 rounded-lg">
        <div class="flex-1">
          <h3 class="font-semibold text-gray-900 dark:text-gray-100">
            Dar de Baja Usuario
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Desactiva este usuario. No podrá iniciar sesión ni acceder al sistema. Esta acción puede revertirse después.
          </p>
          {#if !usuario.activo}
            <span class="inline-flex items-center gap-1 px-2 py-1 mt-2 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
              <span class="w-1.5 h-1.5 rounded-full bg-gray-500"></span>
              Usuario ya inactivo
            </span>
          {/if}
        </div>

        <button
          onclick={() => modalDarDeBajaRef?.open()}
          type="button"
          disabled={!usuario.activo}
          class="
            shrink-0
            px-4 py-2 rounded-lg
            bg-red-100 hover:bg-red-200
            dark:bg-red-900/30 dark:hover:bg-red-900/50
            text-red-700 dark:text-red-300
            font-medium text-sm
            transition-colors
            border border-red-300 dark:border-red-700
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          Dar de Baja
        </button>
      </div>

    </div>
  </div>
</div>

<!-- Modal: Resetear Contraseña -->
<Modal
  bind:this={modalResetPasswordRef}
  title="Resetear Contraseña"
  working={resetingPassword}
  onclose={() => nuevaPasswordGenerada = null}
>
  {#if form?.errorResetPassword}
    <ErrorCard>
      {form.errorResetPassword}
    </ErrorCard>
  {/if}
  {#if nuevaPasswordGenerada}
    <!-- Mostrar nueva contraseña generada -->
    <div class="space-y-4">
      <div class="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <div class="flex items-start gap-3">
          <svg class="w-6 h-6 text-green-600 dark:text-green-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div class="flex-1">
            <h3 class="font-semibold text-green-900 dark:text-green-100">
              Contraseña generada exitosamente
            </h3>
            <p class="text-sm text-green-700 dark:text-green-300 mt-1">
              Comparte esta contraseña con el usuario de forma segura. No podrás verla de nuevo.
            </p>
          </div>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium mb-2" for="nuevaPasswordGenerada">Nueva Contraseña</label>
        <div class="flex gap-2">
          <input
            id="nuevaPasswordGenerada"
            type="text"
            readonly
            value={nuevaPasswordGenerada}
            class="flex-1 px-4 py-3 font-mono text-lg bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg"
          />
          <button
            type="button"
            onclick={copiarPassword}
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            title="Copiar"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
      </div>

      <div class="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <div class="flex items-start gap-2 text-sm text-yellow-800 dark:text-yellow-200">
          <svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p>
            Asegúrate de compartir esta contraseña con el usuario de forma segura. El usuario deberá cambiarla en su próximo inicio de sesión.
          </p>
        </div>
      </div>

      <button
        type="button"
        onclick={() => {
          modalResetPasswordRef?.close();
          nuevaPasswordGenerada = null;
        }}
        class="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-lg font-medium"
      >
        Cerrar
      </button>
    </div>
  {:else}
    <!-- Confirmación para resetear -->
    <form
      method="POST"
      action="?/resetPassword"
      use:enhance={() => {
        resetingPassword = true;

        return async ({ update }) => {
          await update({ invalidateAll: false });
          resetingPassword = false;
        };
      }}
    >
      <div class="space-y-4">
        <div class="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div class="flex items-start gap-3">
            <svg class="w-6 h-6 text-yellow-600 dark:text-yellow-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <h3 class="font-semibold text-yellow-900 dark:text-yellow-100">
                ¿Estás seguro?
              </h3>
              <p class="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                Se generará una nueva contraseña aleatoria para <strong>{usuario.nombreUsuario}</strong>. La contraseña actual dejará de funcionar inmediatamente.
              </p>
            </div>
          </div>
        </div>

        <input type="hidden" name="usuarioId" value={usuario.id} />

        <div class="flex gap-3">
          <button
            type="button"
            onclick={() => modalResetPasswordRef?.close()}
            disabled={resetingPassword}
            class="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-lg font-medium disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={resetingPassword}
            class="flex-1 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium disabled:opacity-50"
          >
            {resetingPassword ? 'Generando...' : 'Sí, Resetear Contraseña'}
          </button>
        </div>
      </div>
    </form>
  {/if}
</Modal>

<!-- Modal: Dar de Baja -->
<Modal
  bind:this={modalDarDeBajaRef}
  title="Dar de Baja Usuario"
  working={dandoDeBaja}
>
  {#if form?.errorDarDeBaja}
    <ErrorCard>
      {form.errorDarDeBaja}
    </ErrorCard>
  {/if}
  <form
    method="POST"
    action="?/darDeBaja"
    use:enhance={() => {
      dandoDeBaja = true;

      return async ({ update, result }) => {
        await update({ invalidateAll: true });
        dandoDeBaja = false;

        if (result.type === 'success') {
          modalDarDeBajaRef?.close();
        }
      };
    }}
  >
    <div class="space-y-4">
      <div class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <div class="flex items-start gap-3">
          <svg class="w-6 h-6 text-red-600 dark:text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <h3 class="font-semibold text-red-900 dark:text-red-100">
              ¿Desactivar este usuario?
            </h3>
            <p class="text-sm text-red-700 dark:text-red-300 mt-1">
              El usuario <strong>{usuario.nombreUsuario}</strong> ({escribirNombreCompleto(usuario.empleado)}) no podrá acceder al sistema. Esta acción puede revertirse después.
            </p>
          </div>
        </div>
      </div>

      <input type="hidden" name="usuarioId" value={usuario.id} />

      <div class="flex gap-3">
        <button
          type="button"
          onclick={() => modalDarDeBajaRef?.close()}
          disabled={dandoDeBaja}
          class="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-lg font-medium disabled:opacity-50"
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={dandoDeBaja}
          class="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium disabled:opacity-50"
        >
          {dandoDeBaja ? 'Procesando...' : 'Sí, Dar de Baja'}
        </button>
      </div>
    </div>
  </form>
</Modal>
