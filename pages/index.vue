<script setup lang="ts">
import type { Header, Item, ServerOptions } from "vue3-easy-data-table"
import { useAuthStore } from '~/stores/auth';

const config = useRuntimeConfig();
const auth = useAuthStore();

const items = ref<Item[]>([]);

const loading = ref(false);
const serverItemsLength = ref(0);
const serverOptions = ref<ServerOptions>({
  page: 1,
  rowsPerPage: 25,
  sortBy: 'name',
  sortType: 'asc',
});

const loadFromServer = () => {
  loading.value = true;
  
  $fetch( `${config.public.apiUrl}/temperatures-humidities/?pagination[page]=${serverOptions.value.page}&pagination[pageSize]=${serverOptions.value.rowsPerPage}&publicationState=preview&populate[address][populate][0]=country&sort[0]=createdAt:desc`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${auth.token}`,
      'Content-Type': 'application/json'
    }
  })
  .then((data: any) => {
    items.value = data.data.map((item: any) => {
    return {
      id: item.id,
      temperature: item.attributes.temperature,
      humidity: item.attributes.humidity,
      timestamp: formatTimestamp(item.attributes.publishedAt),
    }
  });
  serverItemsLength.value = data.meta.pagination.total;
  loading.value = false;
  })
  .catch((error) => {
    console.error('Error fetching data:', error); // Error handling
    loading.value = false;
  });
};

const headers: Header[] = [
  { text: "Temperature", value: "temperature" },
  { text: "Humidity", value: "humidity" },
  { text: "Timestamp", value: "timestamp" },
];

loadFromServer();

watch(serverOptions, (value) => { loadFromServer(); }, { deep: true });
</script>

<style scoped>
.entries-table {
  --easy-table-body-item-padding: 10px 15px;
}
</style>

<template>
  <div class="p-[24px] max-w-[1140px] mx-auto">
    <div class="w-full flex flex-wrap gap-[24px]">
      <div class="md:w-1/2">
        <TempHumiCard />
      </div>
      <div class="w-full">
        <div
          v-if="items && items.length > 0"
          class="py-[24px]">
          <EasyDataTable
            v-model:server-options="serverOptions"
            :server-items-length="serverItemsLength"
            :loading="loading"
            :headers="headers"
            table-class-name="entries-table"
            :items="items">
            <template #item-temperature="{ temperature }">
              {{ temperature }}°C
            </template>
            <template #item-humidity="{ humidity }">
              {{ humidity }}%
            </template>
            <template #pagination="{ prevPage, nextPage, isFirstPage, isLastPage }">
              <button
                :disabled="isFirstPage"
                @click="prevPage"
                class="btn-secondary--xs btn-secondary--blue cursor-pointer mr-[4px]">
                Previous
              </button>
              <button
                :disabled="isLastPage"
                @click="nextPage"
                class="btn-secondary--xs btn-secondary--blue cursor-pointer ml-[4px]">
                Next
              </button>
            </template>
          </EasyDataTable>
        </div>
      </div>
    </div>
  </div>
</template>