import { useAuthStore } from "~/stores/auth";

export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore();
  const config = useRuntimeConfig();
  const router = useRouter();

  if (to.path === '/login') {
    return;
  }

  const validateToken = async () => {
    if (!auth.token) {
      return false;
    }

    try {
      const data: any = await $fetch(`${config.public.apiUrl}/users/me`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });

      if (!data.id) {
        auth.setAuth(false);
        auth.setToken(null);
        auth.setUser(null);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Token validation error:", error);
      auth.setAuth(false);
      auth.setToken(null);
      auth.setUser(null);
      return false;
    }
  };

  const isTokenValid = await validateToken();

  if (!isTokenValid) {
    router.push('/login');
  }
});
