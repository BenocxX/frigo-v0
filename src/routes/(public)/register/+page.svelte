<script lang="ts">
  import RegisterForm from '$lib/components/custom/forms/auth/register-form.svelte';
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<div class="mx-auto max-w-96 space-y-4">
  <h1 class="text-center text-3xl">Inscription</h1>
  <RegisterForm data={data.form} />
</div>
