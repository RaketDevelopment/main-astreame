<script setup lang="ts">
import { ref, watch } from 'vue';

interface Props {
  name: string;
  inputId: string;
  type: string;
  modelValue: string | number;
  disabled?: boolean;
  min?: number | null
  placeholder?: string
  
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  min: null,
  placeholder: ''
})
const inputValue = ref(props.modelValue);

const emit = defineEmits(['update:modelValue']);

// Watch for changes in props.modelValue and update inputValue
watch(() => props.modelValue, (newModelValue) => {
  inputValue.value = newModelValue;
});

// Watch for changes in inputValue and emit an event
watch(inputValue, (newValue) => {
  emit('update:modelValue', newValue);
});
</script>

<template>
  <div class="relative">
    <input
      v-if="props.min"
      :type="props.type"
      :id="props.inputId"
      :name="props.name"
      v-model="inputValue"
      :disabled="props.disabled"
      :min="props.min"
      :placeholder="props.placeholder"
      class="w-full border border-charcoal-50 rounded-[4px] px-[12px] pt-[11px] pb-[12px] outline-blue-500">
    <input
      v-else
      :type="props.type"
      :id="props.inputId"
      :name="props.name"
      v-model="inputValue"
      :disabled="props.disabled"
      :placeholder="props.placeholder"
      class="w-full border border-charcoal-50 rounded-[4px] px-[12px] pt-[11px] pb-[12px] outline-blue-500">
      <div class="absolute top-0 right-[4px]">
        <slot name="button-right"></slot>
      </div>
  </div>
</template>