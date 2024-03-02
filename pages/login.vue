<script setup lang="ts">
import { storeToRefs } from 'pinia'; // import storeToRefs helper hook from pinia
import { useAuthStore } from '~/stores/auth'; // import the auth store we just created

const { authenticateUser } = useAuthStore(); // use authenticateUser action from  auth store

const { authenticated } = storeToRefs(useAuthStore()); // make authenticated state reactive with storeToRefs

const isPasswordReadable = ref(false);

const togglePasswordReadability = () => {
  isPasswordReadable.value = !isPasswordReadable.value;
}

const email = ref('');
const emailError = ref('');
const password = ref('');
const passwordError = ref('');

const handleLogin = async () => {
  emailError.value = '';

  if (email.value === '') {
    emailError.value = 'Please enter your email'
  }

  if (email.value && !validateEmail(email.value)) {
    emailError.value = 'Invalid email address'
  }

  if (email.value && validateEmail(email.value) && password.value === '') {
    passwordError.value = 'Email or password is incorrect'
  }

  await authenticateUser({
    identifier: email.value,
    password: password.value
  }); // call authenticateUser and pass the user object
  
  // redirect to homepage if user is authenticated
  if (!authenticated) {
    passwordError.value = 'Email or password is incorrect'
  }
};
</script>
<template>
  <div>
    <div
      class="w-full p-[24px] bg-white border border-charcoal-50 rounded-[4px] mx-auto max-w-[320px] mt-[48px]">
      <h1 class="heading mb-[24px] text-[1.25rem]">
        Login
      </h1>
      <div>
        <FormGroup
          label="Email"
          classes="mb-[24px]"
          :error-message="emailError">
          <FormInput
            type="email"
            name="email"
            inputId="email"
            v-model="email">
            </FormInput>
        </FormGroup>
        <FormGroup
          label="Password"
          classes="mb-[24px]"
          :error-message="passwordError">
          <FormInput
            :type="isPasswordReadable ? 'text' : 'password'"
            name="password"
            inputId="password"
            v-model="password">
              <template v-slot:button-right>
                <button
                  type="button"
                  class="w-[44px] h-[44px] p-[10px] text-charcoal-500 hover:text-charcoal-900 duration-200 transition-all"
                  @click="togglePasswordReadability">
                  <svg
                    v-if="isPasswordReadable"
                    width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.03555 12.3224C1.96647 12.1151 1.9664 11.8907 2.03536 11.6834C3.42372 7.50972 7.36079 4.5 12.0008 4.5C16.6387 4.5 20.5742 7.50692 21.9643 11.6776C22.0334 11.8849 22.0335 12.1093 21.9645 12.3166C20.5761 16.4903 16.6391 19.5 11.9991 19.5C7.36119 19.5 3.42564 16.4931 2.03555 12.3224Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <svg
                    v-else
                    width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.97993 8.22257C3.05683 9.31382 2.35242 10.596 1.93436 12.0015C3.22565 16.338 7.24311 19.5 11.9991 19.5C12.9917 19.5 13.9521 19.3623 14.8623 19.1049M6.22763 6.22763C7.88389 5.13558 9.86771 4.5 12 4.5C16.756 4.5 20.7734 7.66205 22.0647 11.9985C21.3528 14.3919 19.8106 16.4277 17.772 17.772M6.22763 6.22763L3 3M6.22763 6.22763L9.87868 9.87868M17.772 17.772L21 21M17.772 17.772L14.1213 14.1213M14.1213 14.1213C14.6642 13.5784 15 12.8284 15 12C15 10.3431 13.6569 9 12 9C11.1716 9 10.4216 9.33579 9.87868 9.87868M14.1213 14.1213L9.87868 9.87868" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </template>
            </FormInput>
        </FormGroup>
        <div class="mb-[24px]">
          <button
            type="button"
            class="btn-primary--medium btn-primary--blue w-full"
            @click="handleLogin">
            Login
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
