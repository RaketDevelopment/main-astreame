<script setup lang="ts">
import { ref as dbRef, onValue, DataSnapshot } from 'firebase/database';
import warningImgSrc from '~/assets/images/icon-warning-white.png';
import heartImgSrc from '~/assets/images/icon-good-white.png';

// Initialize Firebase Database
const nuxtApp = useNuxtApp();
const database = nuxtApp.$firebaseDatabase;

const message = ref<string>('');
const isCritical = ref<boolean>(false);

interface SensorData {
  currentHumidity: number;
  currentTemperature: number;
  sensorBelowStatus: boolean;
  sensorAboveStatus: boolean;
}

// Initialize a reactive state object
const state = ref<{
    currentTemperature: number |null,
    currentHumidity: number | null,
    sensorAboveStatus: boolean | null,
    sensorBelowStatus: boolean | null,
}>({
    currentTemperature: null,
    currentHumidity: null,
    sensorAboveStatus: null,
    sensorBelowStatus: null,
});

const backgroundClass = computed(() => {
  return isCritical.value ? 'bg-red-gradient' : 'bg-green-gradient';
});

const statusIconImage = computed(() => {
  return isCritical.value ? warningImgSrc : heartImgSrc;
});

const updateMessage = (): void  => {
  if ((state.value.currentHumidity && state.value.currentHumidity < 40) && !state.value.sensorBelowStatus) {
    message.value = 'Humidity is on low levels, pumping will start';
    isCritical.value = true;
  } else if ((state.value.currentTemperature && state.value.currentTemperature >= 36) && !state.value.sensorBelowStatus) {
    message.value = 'Temperature is high, pumping will start';
    isCritical.value = true;
  } else if ((state.value.currentHumidity && state.value.currentHumidity >= 40) && (state.value.currentTemperature && state.value.currentTemperature < 36) && state.value.sensorBelowStatus) {
    message.value = 'Humidity/Temperature conditions are met, pumping has stopped';
    isCritical.value = false;
  } else if ((state.value.currentHumidity && state.value.currentHumidity >= 40) && (state.value.currentTemperature && state.value.currentTemperature < 36) && !state.value.sensorBelowStatus) {
    message.value = 'Water level is lower than threshold, pumping will start';
    isCritical.value = true;
  } else if ((state.value.currentHumidity && state.value.currentHumidity >= 40) && (state.value.currentTemperature && state.value.currentTemperature < 36) && state.value.sensorAboveStatus) {
    message.value = 'Water level conditions are met, pumping has stopped';
    isCritical.value = false;
  } else {
    message.value = ''; // Default message or handle other cases as needed
    isCritical.value = false;
  }
}

onMounted(() => {
  const sensorPaths: string[] = ['currentTemperature', 'currentHumidity', 'sensorBelowStatus', 'sensorAboveStatus', 'relayStatus'];
  sensorPaths.forEach((path) => {
    const sensorRef = dbRef(database, path);
    onValue(sensorRef, (snapshot: DataSnapshot) => {
      state.value[path] = snapshot.val() as SensorData;
      // Assuming all sensor data are stored in the same structure
      updateMessage();
    });
  });
});
</script>
<template>
  <div
    class="w-full h-[180px] rounded-[8px] px-[24px] flex items-center"
    :class="backgroundClass">
    <div class="flex-1">
      <p class="text-[16px] font-medium text-white">
        {{ message }}
      </p>
    </div>
    <div class="w-[48px]">
      <img
      :src="statusIconImage"
      width="48"
      height="48"
      class="block w-[48px] h-auto">
    </div>
  </div>
</template>