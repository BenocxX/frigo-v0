<script lang="ts">
  import PasskeyLoginForm from './passkey-login-form.svelte';

  const { data } = $props();
</script>

<div class="mx-auto max-w-96 space-y-4">
  <h1 class="text-center text-3xl">Connexion</h1>
  <PasskeyLoginForm data={data.form} />
</div>
