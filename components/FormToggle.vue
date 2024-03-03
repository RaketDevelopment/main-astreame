<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';

// Define props and emits
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue']);

// Reactive state for the toggle
const value = ref(props.modelValue);

// Method to toggle the value and emit the change
const toggle = () => {
  value.value = !value.value;
  emit('update:modelValue', value.value);
};

// Watch for external changes to modelValue
watch(
  () => props.modelValue,
  (newValue) => {
    value.value = newValue;
  }
);
</script>

<style>
/* You can add additional styles here if needed */
</style>


<template>
  <div
    :class="`cursor-pointer w-14 h-8 flex items-center border-[2px] rounded-full p-1 duration-300 ease-in-out ${
      value ? 'bg-blue-500 border-blue-500' : 'border-charcoal-50 bg-white'
    }`"
    @click="toggle"
  >
    <!-- Circle -->
    <div
      :class="`w-6 h-6 rounded-full shadow-md transform duration-300 ease-in-out ${
        value ? 'translate-x-5 bg-white' : 'bg-charcoal-200'
      }`"
    ></div>
  </div>
</template>