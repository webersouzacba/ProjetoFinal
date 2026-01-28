<template>
  <PageHeader title="Docentes" subtitle="Listagem de docentes cadastrados.">
    <template #actions>
      <RouterLink class="btn btn-outline-secondary" to="/">
        <i class="bi bi-house me-1" />Início
      </RouterLink>

      <!-- Política final: CRUD de docentes disponível mesmo sem login (bootstrap acadêmico) -->
      <RouterLink class="btn btn-primary" to="/docentes/novo">
        <i class="bi bi-plus-lg me-1" />Novo docente
      </RouterLink>
    </template>
  </PageHeader>

  <DocentesTable :items="items" :loading="loading" :error="error" @deleted="load" />
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import PageHeader from '../../components/layout/PageHeader.vue'
import DocentesTable from './components/DocentesTable.vue'

import { api } from '../../services/apiClient'
import { useUiStore } from '../../stores/ui'

const ui = useUiStore()

const loading = ref(false)
const error = ref('')
const items = ref([])

async function load() {
  loading.value = true
  error.value = ''
  try {
    const { data } = await api.get('/api/docentes')
    items.value = Array.isArray(data) ? data : []
  } catch (e) {
    error.value = e?.response?.data?.error || e?.message || 'Falha ao carregar docentes.'
    ui.toast({ kind: 'danger', message: error.value, timeout: 5500 })
    items.value = []
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>
