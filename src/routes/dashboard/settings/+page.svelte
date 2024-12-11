<script lang="ts">
  import ResetPasswordForm from '$lib/components/custom/forms/auth/reset-password-form.svelte';
  import UpdateNamesForm from '$lib/components/custom/forms/user/update-names-form.svelte';
  import PasskeyList from '$lib/components/custom/sections/passkeys-list/passkey-list.svelte';
  import SessionsList from '$lib/components/custom/sections/sessions-list/sessions-list.svelte';
  import PageTitle from '$lib/components/custom/structure/page-title.svelte';

  let { data } = $props();
</script>

<PageTitle title="Paramètres" subtitle="Gérez vos paramètres de sécurité" />
<div class="border-t pb-12 pt-12">
  <div class="grid grid-cols-1 gap-x-8 gap-y-10 border-b pb-12 md:grid-cols-3">
    <div>
      <h2 class="font-semibold">Modifications des noms</h2>
      <p class="mt-1 text-sm/6 text-muted-foreground">
        Vous pouvez mettre à jour votre username, prénom et nom ici.
      </p>
    </div>
    <UpdateNamesForm data={data.updateNamesForm} class="flex flex-col gap-4 md:col-span-2" />
  </div>
  <PasskeyList
    forms={{
      delete: data.deletePasskeyForm,
      rename: data.renamePasskeyForm,
    }}
    passkeys={data.passkeys}
    passkeyRegistrationOptions={data.passkeyRegistrationOptions}
  />
  <div class="grid grid-cols-1 gap-x-8 gap-y-10 border-b py-12 md:grid-cols-3">
    <div>
      <h2 class="font-semibold">Mot de passe</h2>
      <p class="mt-1 text-sm/6 text-muted-foreground">
        Vous pouvez changer votre mot de passe ici.
      </p>
    </div>
    <ResetPasswordForm class="flex flex-col gap-4 md:col-span-2" data={data.resetPasswordForm} />
  </div>
  <SessionsList
    sessions={data.sessions}
    currentSessionPublicId={data.currentSessionPublicId}
    deleteForm={data.deleteSessionForm}
  />
</div>
