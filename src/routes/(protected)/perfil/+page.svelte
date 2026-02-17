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
  novalidate
  action="?/cambiarPassword"
  class="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-auto space-y-2"
  use:enhance={() => {
    submittingCambioPassword = true;
    return async ({ update }) => {
      await update();
      submittingCambioPassword = false;
    };
  }}
>
  {#if form?.infoCambioPasword}
    <div class="lg:col-span-3">
      <InfoMessage>
        {form.infoCambioPasword}
      </InfoMessage>
    </div>
  {/if}
  {#if form?.errorCambioPassword}
    <div class="lg:col-span-3">
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
      required
    />
    {#if form?.errorsCambioPassword?.passwordActual}
      <ErrorMessage>{form.errorsCambioPassword.passwordActual}</ErrorMessage>
    {/if}
  </div>
  <div>
    <PasswordField
      label="Nueva contraseña"
      name="passwordNuevo"
      id="passwordNuevo"
      placeholder="Mínimo 8 carácteres"
      required
    />
    {#if form?.errorsCambioPassword?.passwordNuevo}
      <ErrorMessage>{form.errorsCambioPassword.passwordNuevo}</ErrorMessage>
    {/if}
  </div>
  <div>
    <PasswordField
      label="Confirmar nueva contraseña"
      name="passwordNuevoConfirmacion"
      id="passwordNuevoConfirmacion"
      placeholder="Ingrese de nuevo su nueva contraseña"
      required
    />
    {#if form?.errorsCambioPassword?.passwordNuevoConfirmacion}
      <ErrorMessage>{form.errorsCambioPassword.passwordNuevoConfirmacion}</ErrorMessage>
    {/if}
  </div>
  <div class="lg:col-span-3">
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
  {#if form?.infoCambioAvatar != null}
    <InfoMessage>
      {form.infoCambioAvatar}
    </InfoMessage>
  {/if}
  {#if form?.errorCambioAvatar != null}
    <ErrorCard>
      {form.errorCambioAvatar}
    </ErrorCard>
  {/if}
  <AvatarField text="Seleccione imagen" />
  {#if form?.errorsCambioAvatar?.name != null}
    <ErrorMessage>{form.errorsCambioAvatar.name}</ErrorMessage>
  {/if}
  {#if form?.errorsCambioAvatar?.size != null}
    <ErrorMessage>{form.errorsCambioAvatar.size}</ErrorMessage>
  {/if}
  {#if form?.errorsCambioAvatar?.type != null}
    <ErrorMessage>{form.errorsCambioAvatar.type}</ErrorMessage>
  {/if}
  <ButtonSubmitting text="Cambiar avatar" submitting={submittingCambioAvatar} class="w-full" />
</form>
