import { handleAuth } from '$lib/hooks/server/handle-auth';
import { handleGuard } from '$lib/hooks/server/handle-guard';
import { sequence } from '@sveltejs/kit/hooks';

export const handle = sequence(handleAuth, handleGuard);
