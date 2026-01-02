<script>
  import Line from '$lib/components/Line.svelte';
  import TitleSection from '$lib/components/TitleSection.svelte';
  import { enhance } from '$app/forms';
  import ErrorMessage from '$lib/components/ErrorMessage.svelte';
  import UsuarioDetalle from '$lib/components/UsuarioDetalle.svelte';
  import InfoMessage from '$lib/components/InfoMessage.svelte';
  import AvatarField from '$lib/components/AvatarField.svelte';
  import ButtonSubmitting from '$lib/components/ButtonSubmitting.svelte';
  import ErrorCard from '$lib/components/ErrorCard.svelte';
  import PasswordField from '$lib/components/PasswordField.svelte';

  let { data, form } = $props();

  const usuario = $derived(data.usuario);
  let submittingCambioPassword = $state(false);
  let submittingCambioAvatar = $state(false);
</script>

<svelte:head>
  <title>Perfil del usuario - {usuario.nombreUsuario} -</title>
</svelte:head>

<TitleSection>
  Tu perfil
</TitleSection>

<UsuarioDetalle {usuario} />

<Line class="my-2" />

<TitleSection>Actualizar contraseña</TitleSection>

<form
  method="POST"
  action="?/cambiarPassword"
  class="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-auto space-y-2"
  use:enhance={() => {
    submittingCambioPassword = true;
    return async ({ update }) => {
      await update();
      submittingCambioPassword = false;
    };
  }}
>
  {#if typeof form?.infoCambioPasword !== 'undefined'}
    <div class="sm:col-span-3">
      <InfoMessage>
        {form.infoCambioPasword}
      </InfoMessage>
    </div>
  {/if}
  {#if typeof form?.errorCambioPassword !== 'undefined'}
    <div class="sm:col-span-3">
      <ErrorCard>
        {form.errorCambioPassword}
      </ErrorCard>
    </div>
  {/if}
  <div>
    <PasswordField
      label="Contraseña actual"
      name="passwordActual"
      id="passwordActual"
      placeholder="Ingrese su contraseña actual"
    />
    {#if typeof form?.errorsCambioPassword?.passwordActual !== 'undefined'}
      <ErrorMessage>{form.errorsCambioPassword.passwordActual}</ErrorMessage>
    {/if}
  </div>
  <div>
    <PasswordField
      label="Nueva contraseña"
      name="passwordNuevo"
      id="passwordNuevo"
      placeholder="Mínimo 8 carácteres"
    />
    {#if typeof form?.errorsCambioPassword?.passwordNuevo !== 'undefined'}
      <ErrorMessage>{form.errorsCambioPassword.passwordNuevo}</ErrorMessage>
    {/if}
  </div>
  <div>
    <PasswordField
      label="Confirmar nueva contraseña"
      name="passwordNuevoConfirmacion"
      id="passwordNuevoConfirmacion"
      placeholder="Ingrese de nuevo su nueva contraseña"
    />
    {#if typeof form?.errorsCambioPassword?.passwordNuevoConfirmacion !== 'undefined'}
      <ErrorMessage>{form.errorsCambioPassword.passwordNuevoConfirmacion}</ErrorMessage>
    {/if}
  </div>
  <div class="sm:col-span-3">
    <ButtonSubmitting class="w-full" text="Cambiar contraseña" submitting={submittingCambioPassword} />
  </div>
</form>

<Line class="my-2" />

<TitleSection>
  Cambiar avatar
</TitleSection>

<form
  method="POST"
  enctype="multipart/form-data"
  action="?/cambiarAvatar"
  use:enhance={() => {
    submittingCambioAvatar = true;
    return async ({ update }) => {
      await update();
      submittingCambioAvatar = false;

    };
  }}
  class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-auto p-4 space-y-2"
>
  {#if typeof form?.infoCambioAvatar !== 'undefined'}
    <InfoMessage>
      {form.infoCambioAvatar}
    </InfoMessage>
  {/if}
  {#if typeof form?.errorCambioAvatar !== 'undefined'}
    <ErrorCard>
      {form.errorCambioAvatar}
    </ErrorCard>
  {/if}
  <AvatarField text="Seleccione imagen" />
  {#if typeof form?.errorsCambioAvatar?.name !== 'undefined'}
    <ErrorMessage>{form.errorsCambioAvatar.name}</ErrorMessage>
  {/if}
  {#if typeof form?.errorsCambioAvatar?.size !== 'undefined'}
    <ErrorMessage>{form.errorsCambioAvatar.size}</ErrorMessage>
  {/if}
  {#if typeof form?.errorsCambioAvatar?.type !== 'undefined'}
    <ErrorMessage>{form.errorsCambioAvatar.type}</ErrorMessage>
  {/if}
  <ButtonSubmitting text="Cambiar avatar" submitting={submittingCambioAvatar} class="w-full" />
</form>
