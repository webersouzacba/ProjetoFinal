<template>
  <PageHeader title="Propostas" subtitle="Lista pública com filtros por status e orientador.">
    <template #actions>
      <RouterLink class="btn btn-primary" to="/propostas/nova">
        <i class="bi bi-plus-lg me-1" />Nova proposta
      </RouterLink>
    </template>
  </PageHeader>

  <PropostasFilters
    :filtros="store.filtros"
    @apply="applyFilters"
    @reset="resetFilters"
  />

  <PropostasTable :items="store.items" :loading="store.loading" :error="store.error" />
</template>

<script setup>
import { onMounted } from 'vue';
import { usePropostasStore } from '../../stores/propostasStore';

import PropostasFilters from './components/PropostasFilters.vue';
import PropostasTable from './components/PropostasTable.vue';
import PageHeader from '../../components/layout/PageHeader.vue';

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
