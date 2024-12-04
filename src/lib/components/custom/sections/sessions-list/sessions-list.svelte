<script lang="ts">
  import type { Session } from '@prisma/client';
  import AlertDialogConfirm from '../../ui/dialogs/alert-dialog-confirm.svelte';
  import { Button } from '$lib/components/ui/button';
  import Trash from 'lucide-svelte/icons/trash';
  import { Separator } from '$lib/components/ui/separator';
  import { formatDatePPP, formatTimeBetween } from '$lib/utils/format';
  import Badge from '../../ui/badges/badge.svelte';
  import DeleteSessionForm from '../../forms/sessions/delete-session-form.svelte';
  import type { Infer, SuperValidated } from 'sveltekit-superforms';
  import type { DeleteSessionSchema } from '../../forms/sessions/schema';

  type Props = {
    sessions: Session[];
    deleteForm: SuperValidated<Infer<DeleteSessionSchema>>;
  };

  const { sessions, deleteForm }: Props = $props();
</script>

<div class="grid grid-cols-1 gap-x-8 gap-y-10 py-12 md:grid-cols-3">
  <div>
    <h2 class="font-semibold">Sessions</h2>
    <p class="mt-1 text-sm/6 text-muted-foreground">
      Gérez vos sessions actives et déconnectez-vous de celles que vous ne reconnaissez pas.
    </p>
  </div>
  <div class="flex flex-col gap-4 md:col-span-2">
    {#if sessions.length > 0}
      <ul class="space-y-4">
        {#each sessions as session, index}
          {@render sessionListItem({ session })}
          {#if index < sessions.length - 1}
            <Separator />
          {/if}
        {/each}
      </ul>
    {:else}
      <p class="text-center text-muted-foreground">Aucune session n'a été trouvée.</p>
    {/if}
  </div>
</div>

{#snippet sessionListItem({ session }: { session: Session })}
  <li class="flex items-center justify-between">
    <div class="pr-8">
      <p>{session.name}</p>
      <div class="mt-1 flex flex-wrap gap-1.5">
        <Badge>Créée le {formatDatePPP(session.createdAt)}</Badge>
        <Badge>Expire dans {formatTimeBetween(session.expiresAt)}</Badge>
        <Badge>
          Dernière utilisation il y a {formatTimeBetween(session.lastUsed)}
        </Badge>
      </div>
    </div>
    <div class="flex items-center gap-2">
      <AlertDialogConfirm>
        {#snippet trigger({ props })}
          <Button {...props} size="icon" variant="destructive">
            <Trash />
          </Button>
        {/snippet}
        {#snippet title()}
          Êtes-vous sûr de vouloir supprimer cette session ?
        {/snippet}
        {#snippet description()}
          La session sera définitivement supprimée et vous serez déconnecté de cet appareil.
        {/snippet}
        {#snippet action({ props })}
          <DeleteSessionForm {session} data={deleteForm} buttonProps={props} />
        {/snippet}
      </AlertDialogConfirm>
    </div>
  </li>
{/snippet}
