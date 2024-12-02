<script lang="ts">
  import { buttonVariants } from '$lib/components/ui/button';
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input';
  import { loginSchema, type LoginSchema } from './schema';
  import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';

  export let data: SuperValidated<Infer<LoginSchema>>;

  const form = superForm(data, {
    validators: zodClient(loginSchema),
  });

  const { form: formData } = form;
</script>

<form method="POST">
  <Form.Field {form} name="username">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Username</Form.Label>
        <Input {...props} bind:value={$formData.username} />
      {/snippet}
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Field {form} name="password">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Password</Form.Label>
        <Input type="password" {...props} bind:value={$formData.password} />
      {/snippet}
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>
  <div class="mt-4 flex flex-col gap-2">
    <Form.Button>Connexion</Form.Button>
    <a href="/login/passkey" class={buttonVariants({ variant: 'outline' })}>Utiliser une passkey</a>
  </div>
  <p class="my-4 text-center">
    Pas de compte?
    <a href="/register" class="link">Inscription</a>
  </p>
</form>
