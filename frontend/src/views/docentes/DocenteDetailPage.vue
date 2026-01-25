<template>
  <PageHeader
    title="Detalhe do Docente"
    subtitle="Informações públicas do docente e suas propostas públicas."
  >
    <template #actions>
      <RouterLink class="btn btn-outline-secondary" to="/docentes">
        <i class="bi bi-arrow-left me-1" />Voltar
      </RouterLink>
    </template>
  </PageHeader>

  <div v-if="error" class="alert alert-danger" role="alert">
    {{ error }}
  </div>

  <div v-if="loading" class="text-muted">
    Carregando…
  </div>

  <template v-else>
    <div class="card shadow-sm mb-3">
      <div class="card-body">
        <div class="d-flex flex-wrap align-items-start justify-content-between gap-3">
          <div>
            <h2 class="h5 mb-1">{{ docente?.nome || '—' }}</h2>
            <div class="text-muted">
              <i class="bi bi-envelope me-1" />
              {{ docente?.email || 'E-mail não informado' }}
            </div>
          </div>

          <div class="text-muted small">
            <span class="badge text-bg-light border">
              ID: {{ docente?.id_docente }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="card shadow-sm">
      <div class="card-body">
        <div class="d-flex align-items-center justify-content-between mb-2">
          <h3 class="h6 mb-0">Propostas públicas do docente</h3>

          <button class="btn btn-sm btn-outline-secondary" type="button" @click="fetchPropostas">
            <i class="bi bi-arrow-clockwise me-1" />Atualizar
          </button>
        </div>

        <div v-if="loadingPropostas" class="text-muted">
          Carregando propostas…
        </div>

        <div v-else class="table-responsive">
          <table class="table align-middle mb-0">
            <thead>
              <tr>
                <th>Título</th>
                <th class="text-end">Ações</th>
              </tr>
            </thead>

            <tbody v-if="propostas.length">
              <tr v-for="p in propostas" :key="String(p.id_proposta)">
                <td class="fw-semibold">
                  {{ p.titulo }}
                </td>
                <td class="text-end">
                  <RouterLink
                    class="btn btn-sm btn-outline-primary"
                    :to="`/propostas/${p.id_proposta}`"
                  >
                    <i class="bi bi-eye me-1" />Ver
                  </RouterLink>
                </td>
              </tr>
            </tbody>

            <tbody v-else>
              <tr>
                <td colspan="2" class="text-muted py-4">
                  Nenhuma proposta pública encontrada para este docente.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="text-muted small mt-3">
          Total: {{ propostas.length }}
        </div>
      </div>
    </div>
  </template>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from '../../services/apiClient'
import PageHeader from '../../components/layout/PageHeader.vue'

const props = defineProps({
  id: { type: String, required: true }
})

const loading = ref(false)
const error = ref(null)
const docente = ref(null)

const loadingPropostas = ref(false)
const propostas = ref([])

async function fetchDocente () {
  loading.value = true
  error.value = null

  try {
    const { data } = await api.get(`/api/docentes/${props.id}`)
    docente.value = data || null
  } catch (e) {
    error.value =
      e?.response?.data?.error ||
      e?.response?.data?.message ||
      'Falha ao carregar docente.'
  } finally {
    loading.value = false
  }
}

async function fetchPropostas () {
  // só tenta se docente existir (evita chamada desnecessária em caso de 404)
  if (!docente.value?.id_docente) return

  loadingPropostas.value = true
  try {
    const { data } = await api.get('/api/propostas', {
      params: { orientador_id: String(docente.value.id_docente) }
    })
    propostas.value = Array.isArray(data) ? data : []
  } catch {
    // aqui não bloqueia a página por falha na listagem de propostas
    propostas.value = []
  } finally {
    loadingPropostas.value = false
  }
}

onMounted(async () => {
  await fetchDocente()
  await fetchPropostas()
})
</script>
