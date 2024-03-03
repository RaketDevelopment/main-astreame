<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ref as dbRef, onValue, DataSnapshot, off } from 'firebase/database';
import dayImageSrc from '../assets/images/temp-humi-day-card-image.png';
import nightImageSrc from '../assets/images/temp-humi-night-card-image.png';

const temperature = ref(null); // This ref will hold the temperature value
const humidity = ref(null); // This ref will hold the temperature value

const tempRef = ref();
const humiRef = ref();
const city = ref('Manila');
const country = ref('Philippines');

const formattedDate = formatDate(new Date());

onMounted(async () => {
  const nuxtApp = useNuxtApp();
  const database = nuxtApp.$firebaseDatabase; // Get the database instance provided in your plugin

  tempRef.value = dbRef(database, 'currentTemperature'); // Create a reference to the 'currentTemperature' path
  humiRef.value = dbRef(database, 'currentHumidity'); // Create a reference to the 'currentTemperature' path

  onValue(tempRef.value, (snapshot: DataSnapshot) => {
    temperature.value = snapshot.val();
  });

  onValue(humiRef.value, (snapshot: DataSnapshot) => {
    humidity.value = snapshot.val();
  });

  try {
    const result: any = await $fetch('https://ipapi.co/json/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (result.ok) {
      city.value = result.data.city;
      country.value = result.data.country_name;
    } else {
      console.error('Failed to fetch location data');
    }
  } catch (error) {
    console.error('Error fetching location data:', error);
  }
});

onUnmounted(() => {
  // Clean up the listeners when the component is destroyed
  off(tempRef.value);
  off(humiRef.value);
});

const currentHour = new Date().getHours();
const isDaytime = ref(currentHour >= 4 && currentHour < 17);

const backgroundClass = computed(() => {
  return isDaytime.value ? 'bg-day-gradient' : 'bg-night-gradient';
});

const bgImage = computed(() => {
  return isDaytime.value ? dayImageSrc : nightImageSrc;
});
</script>
<template>
  <div
    v-if="temperature && humidity"
    class="relative h-[180px] rounded-[8px] overflow-hidden"
    :class="backgroundClass">
    <h2 class="heading font-normal text-white text-[72px] absolute top-[12px] z-10"
      :class="isDaytime ? 'right-[24px]' : 'left-[24px]'">
      {{ temperature }}°<sup>c</sup>
    </h2>
    <h3 class="heading font-normal text-white text-[36px] absolute bottom-[12px] z-10"
      :class="isDaytime ? 'right-[12px]' : 'left-[12px]'">
      {{ humidity }}%
    </h3>
    <div
      class="absolute bottom-[24px] z-10"
      :class="isDaytime ? 'left-[24px]' : 'right-[24px] text-end'">
      <p 
        class="text-white text-[14px] font-medium">
        {{ formattedDate }}
      </p>
      <p 
        v-if="city && country"
        class="text-white text-[16px] font-medium">
        {{ city }}, {{ country }}
      </p>
    </div>
    <img
      :src="bgImage"
      class="absolute z-0"
      :class="isDaytime ? 'top-[-80px] left-[24px]' : 'top-[12px] right-[24px]'">
  </div>
</template>