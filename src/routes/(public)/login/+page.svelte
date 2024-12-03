<script lang="ts">
  import LoginForm from '$lib/components/custom/forms/auth/login-form.svelte';
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<div class="mx-auto max-w-96 space-y-4">
  <h1 class="text-center text-3xl">Connexion</h1>
  <LoginForm data={data.form} />
</div>
