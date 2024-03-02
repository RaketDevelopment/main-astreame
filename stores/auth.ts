import { defineStore } from 'pinia';
import { nanoid } from 'nanoid';

interface AuthenticateUserPayloadInterface {
  identifier: string;
  password: string;
}

interface RegisterUserPayloadInterface {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface AuthState {
  user: any; // update later
  token: string | null;
  authenticated: boolean;
  loading: boolean;
}

export const useAuthStore = defineStore('auth', {
  persist: {
    storage: persistedState.localStorage,
  },
  state: (): AuthState => ({
    user: null,
    token: null,
    authenticated: false,
    loading: false,
  }),
  actions: {
    async registerUser(
      {
        email,
        password,
        firstName,
        lastName,
      }: RegisterUserPayloadInterface) {
      const config = useRuntimeConfig();
      const router = useRouter();
      const username = nanoid(8);

      // create user entry
      try {
        const result: any = await $fetch(`${config.public.apiUrl}/auth/local/register`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${config.app.apiToken}`,
            'Content-Type': 'application/json'
          },
          body: {
            username,
            email,
            password,
            firstName,
            lastName
          },
        });

        this.authenticated = true;
        this.user = result.user;
        this.token = result.jwt;
        this.loading = false;

        router.push('/');
      } catch (error) {
        if (error instanceof Error) {
          console.error('Registration error:', error.message);
          this.loading = false;
          return { success: false, message: error.message };
        } else {
          // Handle cases where the error is not an Error instance
          console.error("An unknown error occurred", error);
          this.loading = false;
          return { success: false, message: error };
        }
        
      }
    },

    async authenticateUser({ identifier, password }: AuthenticateUserPayloadInterface) {
      const config = useRuntimeConfig();
      const router = useRouter();

      this.loading = true;

      try {
        const result: any = await $fetch(`${config.public.apiUrl}/auth/local`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: {
            identifier,
            password,
          },
        });
        
        this.user = result.user;
        this.token = result.jwt;
        this.authenticated = true;
        this.loading = false;

        router.push('/');
      } catch (error) {
        console.error('Authentication error:', error);
        this.loading = false;
        return false;
      }
    },

    setToken(newToken: string | null) {
      this.token = newToken;
    },

    setUser(newUser: any) {
      this.user = newUser;
    },

    setAuth(auth: boolean) {
      this.authenticated = auth;
    },

    logUserOut() {
      const token = useCookie('token');
      this.authenticated = false;
      token.value = null; // clear the token cookie

      const router = useRouter();
      router.push('/login');
    },

    async emailExists(email: string) {
      const config = useRuntimeConfig();
      this.loading = true;
    
      try {
        const result: any = await $fetch(`${config.public.apiUrl}/users?filters[$and][0][email][$eq]=${email}&fields[0]=email`, {
          method: 'GET', // 'get' is default and can be omitted, but it's here for clarity
          headers: {
            'Authorization': `Bearer ${config.app.apiToken}`,
            'Content-Type': 'application/json'
          },
        });
      
        if (result && result.length > 0) {
          this.loading = false;
          return { exists: true, error: true, message: 'Email has already been taken' };
        } else {
          this.loading = false;
          return { exists: false, error: false, message: 'User can register using this email' };
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error checking email:', error.message);
          this.loading = false;
          return { exists: false, error: true, message: error.message };
        } else {
          // Handle cases where the error is not an Error instance
          console.error('Error checking email:', error);
          this.loading = false;
          return { exists: false, error: true, message: error };
        }
      } 
    }
  }
});