<template>
  <div class="container-fluid">
    <div class="d-flex align-items-start justify-content-between flex-wrap gap-2 mb-3">
      <div>
        <h3 class="mb-1">Documentos do Projeto</h3>
        <div class="text-muted">
          Lista automática do que estiver disponível na pasta <code>docs/</code> do repositório.
        </div>
      </div>

      <div class="d-flex align-items-center gap-2">
        <button class="btn btn-outline-secondary" type="button" @click="load" :disabled="loading">
          <i class="bi bi-arrow-repeat me-1" />Atualizar
        </button>
      </div>
    </div>

    <div v-if="error" class="alert alert-danger border-0">
      <i class="bi bi-exclamation-triangle-fill me-2" />{{ error }}
    </div>

    <div v-else-if="loading" class="text-muted">
      <i class="bi bi-hourglass-split me-2" />Carregando documentos...
    </div>

    <div v-else>
      <div v-if="items.length === 0" class="alert alert-light border">
        Nenhum documento encontrado em <code>docs/</code>.
      </div>

      <div v-else class="row g-3">
        <div v-for="d in items" :key="d.name" class="col-12 col-md-6 col-lg-4">
          <div class="card h-100 shadow-sm">
            <div class="card-body">
              <div class="d-flex align-items-start justify-content-between gap-2">
                <div class="me-auto">
                  <div class="fw-semibold">{{ d.name }}</div>
                  <div class="text-muted small mt-1">
                    {{ formatSize(d.sizeBytes) }} • atualizado em {{ formatDate(d.modifiedAt) }}
                  </div>
                </div>
                <span class="badge text-bg-light">
                  {{ fileExt(d.name) }}
                </span>
              </div>

              <div class="d-grid mt-3">
                <a class="btn btn-primary" :href="docUrl(d)" target="_blank" rel="noopener">
                  <i class="bi bi-box-arrow-up-right me-1" />Abrir
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="text-muted small mt-4">
        <i class="bi bi-info-circle me-1" />
        Os links apontam para <code>/docs/&lt;arquivo&gt;</code> servido pelo back-end.
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import api from '../services/apiClient'
import { apiBaseUrl } from '../services/apiBase'

const items = ref([])
const loading = ref(false)
const error = ref('')

function fileExt(name) {
  const i = (name || '').lastIndexOf('.')
  if (i < 0) return 'ARQ'
  return name.substring(i + 1).toUpperCase()
}

function formatSize(bytes) {
  const n = Number(bytes || 0)
  if (n < 1024) return `${n} B`
  const kb = n / 1024
  if (kb < 1024) return `${kb.toFixed(1)} KB`
  const mb = kb / 1024
  return `${mb.toFixed(1)} MB`
}

function formatDate(iso) {
  try {
    const d = new Date(iso)
    return d.toLocaleString()
  } catch {
    return '—'
  }
}

function docUrl(d) {
  const base = (apiBaseUrl() || '').replace(/\/+$/, '')
  const url = d?.url || ''
  return `${base}${url}`
}

async function load() {
  loading.value = true
  error.value = ''
  try {
    const { data } = await api.get('/api/documentos')
    items.value = Array.isArray(data) ? data : []
  } catch (e) {
    error.value = e?.response?.data?.error || 'Falha ao carregar documentos.'
    items.value = []
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>
