<script setup lang="ts">
import { ref as dbRef, onValue, DataSnapshot, off } from 'firebase/database';
import warningImgSrc from '~/assets/images/icon-warning-white.png';
import heartImgSrc from '~/assets/images/icon-good-white.png';

// Initialize Firebase Database
const nuxtApp = useNuxtApp();
const database = nuxtApp.$firebaseDatabase;

const message = ref<string>('');
const isCritical = ref<boolean>(false);

const sensorRefs = ref<any[]>([]);

const temperatureThreshold = ref();
const humidityThreshold = ref();

const temperatureThresholdRef = ref();
const humidityThresholdRef = ref();

interface SensorData {
  currentHumidity: number;
  currentTemperature: number;
  sensorBelowStatus: boolean;
  sensorAboveStatus: boolean;
  relayStatus: boolean;
}

// Initialize a reactive state object
const state = ref<{
    currentTemperature: number |null,
    currentHumidity: number | null,
    sensorAboveStatus: boolean | null,
    sensorBelowStatus: boolean | null,
    relayStatus: boolean | null,
}>({
    currentTemperature: null,
    currentHumidity: null,
    sensorAboveStatus: null,
    sensorBelowStatus: null,
    relayStatus: null,
});

const backgroundClass = computed(() => {
  return isCritical.value ? 'bg-red-gradient' : 'bg-green-gradient';
});

const statusIconImage = computed(() => {
  return isCritical.value ? warningImgSrc : heartImgSrc;
});

const updateMessage = (): void  => {
  /**
   * 1
   * 2
   */

  if (state.value.sensorAboveStatus && !state.value.relayStatus) {
    message.value = 'Water level is at max ';
    isCritical.value = false;
  } else if ((state.value.currentTemperature && state.value.currentTemperature >= temperatureThreshold.value) && (state.value.currentHumidity && state.value.currentHumidity < humidityThreshold.value) && !state.value.sensorAboveStatus && state.value.relayStatus) {
    message.value = 'Humidity is on low levels and temperature is high, pumping will start';
    isCritical.value = true;
  } else if (!state.value.sensorBelowStatus && state.value.relayStatus) {
    message.value = 'Water level is lower than threshold, currently pumping';
    isCritical.value = true;
  } else if ((state.value.currentHumidity && state.value.currentHumidity < humidityThreshold.value) && state.value.relayStatus && !state.value.sensorAboveStatus) {
    message.value = 'Humidity is on low levels, pumping will start';
    isCritical.value = true;
  } else if ((state.value.currentTemperature && state.value.currentTemperature >= temperatureThreshold.value) && state.value.relayStatus && !state.value.sensorAboveStatus) {
    message.value = 'Temperature is high, pumping will start';
    isCritical.value = true;
  } else if ((state.value.currentTemperature && state.value.currentTemperature < temperatureThreshold.value) && (state.value.currentHumidity && state.value.currentHumidity >= humidityThreshold.value) && !state.value.relayStatus) {
    message.value = 'All conditions are met.';
    isCritical.value = false;
  } else if (state.value.sensorBelowStatus && !state.value.sensorAboveStatus && state.value.relayStatus) {
    message.value = 'Currently pumping';
    isCritical.value = true;
  }
}

onMounted(() => {
  sensorRefs.value = [];
  const sensorPaths: string[] = ['currentTemperature', 'currentHumidity', 'sensorBelowStatus', 'sensorAboveStatus', 'relayStatus'];
  sensorPaths.forEach((path) => {
    const sensorRef = dbRef(database, path);
    sensorRefs.value.push(sensorRef);
    onValue(sensorRef, (snapshot: DataSnapshot) => {
      state.value[path] = snapshot.val() as SensorData;
      // Assuming all sensor data are stored in the same structure
      updateMessage();
    });
  });

  temperatureThresholdRef.value = dbRef(database, 'temperatureThreshold');
  humidityThresholdRef.value = dbRef(database, 'humidityThreshold');

  onValue(temperatureThresholdRef.value, (snapshot) => {
    if (snapshot.exists()) {
      temperatureThreshold.value = snapshot.val();
    }
  });

  onValue(humidityThresholdRef.value, (snapshot) => {
    if (snapshot.exists()) {
      humidityThreshold.value = snapshot.val();
    }
  });
});

onUnmounted(() => {
  // Clean up the listeners when the component is destroyed
  sensorRefs.value.forEach((sensorRef: any) => {
    off(sensorRef);
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