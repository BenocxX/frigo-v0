import { AuthService } from '$lib/server/services/auth-service.js';
import { redirect } from '@sveltejs/kit';

export const load = async () => {
  redirect(302, '/dashboard/buy');
};

export const actions = {
  logout: async (event) => {
    const authService = new AuthService();
    await authService.logout(event);

    return redirect(302, '/login');
  },
};
