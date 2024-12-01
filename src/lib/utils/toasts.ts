import type { ActionResult } from '@sveltejs/kit';
import { toast, type ExternalToast } from 'svelte-sonner';

type ToastFunc = (message: string, options?: ExternalToast) => void;

/**
 * Toasts created with this function will have a unique id that is used to show only one toast for
 * multiple states. This is useful when you want to show a loading toast and then replace it with a
 * success or error toast programmatically.
 *
 * Normally, you would use Sonner's `toast.promise()` function to show a loading toast while a promise
 * is pending, and then show a success or error toast when the promise is resolved or rejected. However,
 * this is not possible when using SuperForm since we don't have access to the promise that is created
 * when submitting a form. This function is a workaround to show a loading toast while a form is submitting
 * and then show a success or error toast when the form submission is complete.
 */
export function makeToastInstance(customId?: string) {
  const id = customId ?? Math.random().toString(36).slice(2, 7);

  const loading: ToastFunc = (message, options) => {
    // Add "promise: true" to the options animates the toast transition to a new state
    // See: https://github.com/wobsoriano/svelte-sonner/issues/109
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    toast.loading(message, { id, ...options, promise: true } as any);
  };

  const success: ToastFunc = (message, options) => toast.success(message, { id, ...options });
  const error: ToastFunc = (message, options) => toast.error(message, { id, ...options });
  const info: ToastFunc = (message, options) => toast.info(message, { id, ...options });

  const isFailure = (result: ActionResult) => result.type === 'error' || result.type === 'failure';

  return {
    id,
    loading,
    success,
    error,
    info,
    isFailure,
  };
}

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
