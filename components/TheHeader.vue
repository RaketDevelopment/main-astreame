<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';

const auth = useAuthStore();
</script>
<template>
  <header class="px-[24px] h-[72px] flex justify-between items-center bg-white border-b border-charcoal-50">
    <NuxtLink
      to="/"
      class="block w-[204px] h-auto">
      <img
        src="../assets/images/astreame-logo.png"
        width="408"
        height="96"
        alt="Astreame logo">
    </NuxtLink>
    <div>
      <AccountToggle v-if="auth.authenticated" />
    </div>
  </header>
</template>