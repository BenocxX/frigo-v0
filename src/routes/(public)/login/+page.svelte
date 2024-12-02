<script lang="ts">
  import type { PageData } from './$types';
  import LoginForm from './login-form.svelte';

  export let data: PageData;
</script>

<div class="mx-auto max-w-96 space-y-4">
  <h1 class="text-center text-3xl">Connexion</h1>
  <LoginForm data={data.form} />
</div>
