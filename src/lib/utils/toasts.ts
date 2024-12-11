import type { ActionResult } from '@sveltejs/kit';
import { toast } from 'svelte-sonner';

export function makeFormResultToast(
  result: ActionResult,
  options: {
    success: string;
    error: string;
  }
) {
  if (result.type === 'error' || result.type === 'failure') {
    return toast.error(options.error);
  }

  return toast.success(options.success);
}
