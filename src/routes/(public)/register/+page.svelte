<script lang="ts">
  import type { PageData } from './$types';
  import RegisterForm from './register-form.svelte';

  export let data: PageData;
</script>

<div class="mx-auto max-w-96 space-y-4">
  <h1 class="text-center text-3xl">Inscription</h1>
  <RegisterForm data={data.form} />
</div>
