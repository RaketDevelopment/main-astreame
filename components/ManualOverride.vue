<script setup lang="ts">
import { ref as dbRef, onValue, set, off } from 'firebase/database';

const manualOverrideStatus = ref(false);
const relayStatus = ref(false);

const manualOverrideStatusRef = ref();
const relayStatusRef = ref();

// Initialize Firebase Database
const nuxtApp = useNuxtApp();
const database = nuxtApp.$firebaseDatabase;


// Function to update Firebase
const updateFirebase = (path: string, value: boolean) => {
  const statusRef = dbRef(database, path);
  set(statusRef, value);
};

// Watchers to update Firebase when values change
watch(manualOverrideStatus, (newValue) => {
  updateFirebase('manualOverrideStatus', newValue);
  if (!newValue) {
    relayStatus.value = false; // Ensure this also updates Firebase
  }
});

watch(relayStatus, (newValue) => {
  updateFirebase('relayStatus', newValue);
});

// Fetch initial values from Firebase
onMounted(() => {
  // References to Firebase paths
  manualOverrideStatusRef.value = dbRef(database, 'manualOverrideStatus');
  relayStatusRef.value = dbRef(database, 'relayStatus');

  onValue(manualOverrideStatusRef.value, (snapshot) => {
    if (snapshot.exists()) {
      manualOverrideStatus.value = snapshot.val();
    }
  });

  onValue(relayStatusRef.value, (snapshot) => {
    if (snapshot.exists()) {
      relayStatus.value = snapshot.val();
    }
  });
});

watch((manualOverrideStatus), (newValue) => {
  if (!newValue) {
    relayStatus.value = false;
  }
});

onUnmounted(() => {
  // Clean up the listeners when the component is destroyed
  off(manualOverrideStatusRef.value);
  off(relayStatusRef.value);
});
</script>

<template>
  <div class="w-full">
    <FormGroup
      label="Manual override?"
      classes="mb-[12px]">
      <FormToggle v-model="manualOverrideStatus" />
    </FormGroup>
    <FormGroup
      v-if="manualOverrideStatus"
      label="Relay status"
      classes="mb-[24px]">
      <FormToggle v-model="relayStatus" />
    </FormGroup>
  </div>
</template>