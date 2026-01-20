<template>
  <div class="d-flex align-items-center justify-content-between mb-3">
    <h1 class="h4 mb-0">Propostas</h1>
  <RouterLink class="btn btn-sm btn-success" to="/propostas/nova">Nova</RouterLink>
  </div>

  <PropostasFilters
    :filtros="store.filtros"
    @apply="applyFilters"
    @reset="resetFilters"
  />

  <PropostasTable :items="store.items" :loading="store.loading" :error="store.error" />
</template>

<script setup>
import { onMounted } from 'vue';
import { usePropostasStore } from '../../../stores/propostasStore';

import PropostasFilters from './components/PropostasFilters.vue';
import PropostasTable from './components/PropostasTable.vue';

const store = usePropostasStore();

onMounted(() => {
  store.fetchPublic();
});

function applyFilters(filtros) {
  store.filtros = { ...store.filtros, ...filtros };
  store.fetchPublic();
}

function resetFilters() {
  store.filtros = { status: '', orientador_id: '' };
  store.fetchPublic();
}
</script>
