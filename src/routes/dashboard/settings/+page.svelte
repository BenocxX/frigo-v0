<script lang="ts">
  import ResetPasswordForm from '$lib/components/custom/forms/auth/reset-password-form.svelte';
  import PasskeyList from './passkey-list.svelte';

  let { data } = $props();
</script>

<div>
  <h1 class="mb-8 text-4xl">Paramètres</h1>
  <PasskeyList
    forms={{
      delete: data.deletePasskeyForm,
      rename: data.renamePasskeyForm,
    }}
    passkeys={data.passkeys}
  />
  <div class="grid grid-cols-1 gap-x-8 gap-y-10 border-b pb-12 pt-12 md:grid-cols-3">
    <div>
      <h2 class="font-semibold">Mot de passe</h2>
      <p class="mt-1 text-sm/6 text-muted-foreground">
        Vous pouvez changer votre mot de passe ici.
      </p>
    </div>
    <ResetPasswordForm class="flex flex-col gap-4 md:col-span-2" data={data.resetPasswordForm} />
  </div>
  <div class="grid grid-cols-1 gap-x-8 gap-y-10 pb-12 pt-12 md:grid-cols-3">
    <div>
      <h2 class="font-semibold">Sessions</h2>
      <p class="mt-1 text-sm/6 text-muted-foreground">
        Vous pouvez voir les sessions actives et les déconnecter.
      </p>
    </div>
    <div class="flex flex-col gap-4 md:col-span-2">Sessions actives</div>
  </div>
</div>
