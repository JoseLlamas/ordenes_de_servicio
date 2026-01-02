<script>
  import { enhance } from '$app/forms';
  import Input from '$lib/components/Input.svelte';
  import ErrorMessage from '$lib/components/ErrorMessage.svelte';
  import PasswordField from '$lib/components/PasswordField.svelte';
  import ButtonSubmitting from '$lib/components/ButtonSubmitting.svelte';
  import ErrorCard from '$lib/components/ErrorCard.svelte';

  let { form } = $props();
  let logeando = $state(false);
</script>

<svelte:head>
  <title>inicio de sesión</title>
</svelte:head>

<div>

  <div class="text-center mb-8">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
      Inicio de sesión
    </h1>
    <p class="text-gray-600 dark:text-gray-400">
      Completa el formulario para iniciar sesión
    </p>
  </div>

  <div class="bg-white dark:bg-[#2b2e37] rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
    <form
      method="POST"
      use:enhance={() => {
        logeando = true;
        return async ({ update }) => {
          await update();
          logeando = false;
        };
      }}
      class="space-y-5"
    >
      <div>
        <Input label='Nombre de usuario' name="username" required id="username" />
        {#if form?.errors?.username}
          <ErrorMessage>
            {form.errors.username}
          </ErrorMessage>
        {/if}
      </div>
      <div>
        <PasswordField name="password" label="Contraseña" id="password" required />
        {#if form?.errors?.password}
          <ErrorMessage>
            {form.errors.password}
          </ErrorMessage>
        {/if}
      </div>

      {#if form?.error}
        <ErrorCard>
          {form.error}
        </ErrorCard>
      {/if}

      <ButtonSubmitting text="Registrarse" class="w-full" submitting={logeando} />
    </form>

    <div class="mt-4 text-center">
      <p class="text-sm text-gray-600 dark:text-gray-400">
        ¿No tienes cuenta?
        <a href="/registro" class="text-blue-600 dark:text-blue-400 hover:underline">
          Registrate
        </a>
      </p>
    </div>
  </div>
</div>
