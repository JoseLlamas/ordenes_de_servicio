<script>
  import { enhance } from '$app/forms';
  import PasswordField from '$lib/components/PasswordField.svelte';
  import Input from '$lib/components/Input.svelte';
  import ButtonSubmitting from '$lib/components/ButtonSubmitting.svelte';
  import ErrorMessage from '$lib/components/ErrorMessage.svelte';
  import ErrorCard from '$lib/components/ErrorCard.svelte';
  import InfoMessage from '$lib/components/InfoMessage.svelte';

  let { form } = $props();

</script>

<svelte:head>
  <title>Registro de usuario</title>
</svelte:head>

<div>

  <div class="text-center mb-8">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
      Crear Cuenta
    </h1>
    <p class="text-gray-600 dark:text-gray-400">
      Completa el formulario para registrarte
    </p>
  </div>

  <div class="bg-white dark:bg-[#2b2e37] rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
    <form
      method="POST"
      action="?/registro"
      use:enhance
      class="space-y-5"
      novalidate
    >

      <div>
        <Input label="token" id="token" name="token" placeholder="Ingrese el token" required />
        {#if form?.errors?.token}
          <ErrorMessage>
            {form.errors.token}
          </ErrorMessage>
        {/if}
      </div>

      <div>
        <Input label="Nombre de usuario" id="nombreUsuario" name="nombreUsuario" placeholder="Ingresar su nombre de usuario" required />
        {#if form?.errors?.nombreUsuario}
          <ErrorMessage>
            {form.errors.nombreUsuario}
          </ErrorMessage>
        {/if}
      </div>

      <div>
        <PasswordField name="password" label="Contraseña" id="password" placeholder="Mínimo de 8 carácteres" autocomplete="off" required />
        {#if form?.errors?.password}
          <ErrorMessage>
            {form.errors.password}
          </ErrorMessage>
        {/if}
      </div>

      <div>
        <PasswordField name="confirmPassword" id="confirmPassword" label="Confirmar contraseña" placeholder="Repite tu contraseña" required />
        {#if form?.errors?.confirmPassword}
          <ErrorMessage>
            {form.errors.confirmPassword}
          </ErrorMessage>
        {/if}
      </div>


      {#if form?.info}
        <InfoMessage>
          {form.info}
        </InfoMessage>
      {/if}

      {#if form?.error}
        <ErrorCard>
          {form.error}
        </ErrorCard>
      {/if}

      <ButtonSubmitting text="Registrarse" submitting={false} class="w-full" />
    </form>

    <!-- Link a login -->
    <div class="mt-4 text-center">
      <p class="text-sm text-gray-600 dark:text-gray-400">
        ¿Ya tienes cuenta?
        <a href="/login" class="text-blue-600 dark:text-blue-400 hover:underline">
          Inicia sesión
        </a>
      </p>
    </div>
  </div>
</div>
