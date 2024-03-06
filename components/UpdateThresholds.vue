<script setup lang="ts">
import { ref as dbRef, onValue, set, off } from 'firebase/database';

const temperatureThreshold = ref();
const humidityThreshold = ref();

const temperatureThresholdRef = ref();
const humidityThresholdRef = ref();
const sensorRestartRef = ref();

// Initialize Firebase Database
const nuxtApp = useNuxtApp();
const database = nuxtApp.$firebaseDatabase;


// Function to update Firebase
const updateFirebase = (path: string, value: boolean) => {
  const statusRef = dbRef(database, path);
  set(statusRef, value);
};

// Fetch initial values from Firebase
onMounted(() => {
  // References to Firebase paths
  temperatureThresholdRef.value = dbRef(database, 'temperatureThreshold');
  humidityThresholdRef.value = dbRef(database, 'humidityThreshold');
  sensorRestartRef.value = dbRef(database, 'sensorRestart');

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

const handleUpdateTemperatureThreshold = () => {
  updateFirebase('temperatureThreshold', temperatureThreshold.value);
  updateFirebase('sensorRestart', true);
}

const handleUpdateHumidityThreshold = () => {
  updateFirebase('humidityThreshold', temperatureThreshold.value);
  updateFirebase('sensorRestart', true);
}
</script>

<template>
  <div class="flex flex-wrap w-full gap-[24px]">
    <div class="w-full md:w-4/12 flex gap-[24px]">
      <div class="flex-1">
        <FormGroup
          label="Temperature Threshold (°C)"
          classes="mb-[12px]">
          <FormInput
            type="text"
            name="temperatureThreshold"
            inputId="temperatureThreshold"
            v-model="temperatureThreshold">
          </FormInput>
        </FormGroup>
      </div>
      <div>
        <button
          type="button"
          class="btn-primary--medium btn-primary--blue w-full mt-[22px]"
          @click="handleUpdateTemperatureThreshold">
          Update
        </button>
      </div>
    </div>
    <div class="w-full md:w-4/12 flex gap-[24px]">
      <div class="flex-1">
        <FormGroup
          label="Humidity Threshold (%)"
          classes="mb-[12px]">
          <FormInput
            type="text"
            name="humidityThreshold"
            inputId="humidityThreshold"
            v-model="humidityThreshold">
          </FormInput>
        </FormGroup>
      </div>
      <div>
        <button
          type="button"
          class="btn-primary--medium btn-primary--blue w-full mt-[22px]"
          @click="handleUpdateHumidityThreshold">
          Update
        </button>
      </div>
    </div>
  </div>
</template>