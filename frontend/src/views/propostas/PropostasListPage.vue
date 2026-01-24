<template>
<PageHeader title="Propostas" subtitle="Lista pública com filtros por status e orientador.">
  <template #actions>
    <RouterLink class="btn btn-outline-secondary" to="/">
      <i class="bi bi-arrow-left me-1" />Voltar
    </RouterLink>

    <RouterLink
      v-if="canManage"
      class="btn btn-primary"
      to="/propostas/nova"
    >
      <i class="bi bi-plus-lg me-1" />Nova proposta
    </RouterLink>

    <RouterLink
      v-else
      class="btn btn-outline-primary"
      :to="{ name: 'login', query: { redirect: '/propostas/nova' } }"
    >
      <i class="bi bi-box-arrow-in-right me-1" />Entrar para criar
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
import { computed, onMounted } from 'vue';
import { usePropostasStore } from '../../stores/propostasStore';
import { useAuthStore } from '../../stores/auth'

import PropostasFilters from './components/PropostasFilters.vue';
import PropostasTable from './components/PropostasTable.vue';
import PageHeader from '../../components/layout/PageHeader.vue';

const store = usePropostasStore();
const auth = useAuthStore()

const canManage = computed(() => auth.isAuthenticated && auth.user?.role === 'DOCENTE')

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
