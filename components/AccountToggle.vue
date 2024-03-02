<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';

const auth = useAuthStore();
const router = useRouter();

const isDropdownOpen = ref(false);
const dropdownButtonElement = ref<HTMLElement | null>(null);
const dropdownElement = ref<HTMLElement | null>(null);

const handleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
}

const handleLogout = () => {
  auth.logUserOut();
  router.push('/login');
}

const handleSelectClickOutside = () => {
  isDropdownOpen.value = false;
}
</script>

<template>
  <div v-click-outside="handleSelectClickOutside" class="relative">
    <button
        ref="dropdownButtonElement"
        @click="handleDropdown"
        type="button"
        class="w-[40px] h-[40px] p-[8px]"
    >
      <img
          class="block"
          src="../assets/images/icon-user-circle.svg"
          width="24"
          height="24"
          alt="user circle icon"
      />
    </button>
    <div
        ref="dropdownElement"
        v-if="isDropdownOpen"
        class="absolute w-[220px] top-full right-0 border border-charcoal-50 shadow-[0_2px_4px_rgba(0,0,0,.08)] min-h-[200px] bg-white rounded-[5px] z-[9999]">
      <div class="p-[20px] text-center">
        <div class="w-[64px] h-[64px] rounded-full bg-blue-500 mx-auto mb-[12px]"></div>
        <h3 class="text-blue-700 text-[12px] leading-[16px] text-center font-bold mb-[2px]">
          {{ auth.user.firstName }} {{ auth.user.lastName }}
        </h3>
      </div>
      <div>
        <ul class="flex flex-col pb-[10px]">
          <li>
            <button
                @click="handleLogout"
                class="w-full block p-[10px] text-charcoal-500 text-center  border-t border-charcoal-50 bg-white hover:bg-charcoal-10 hover:text-blue-500 transition-all duration-200"
            >
              Log out
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>