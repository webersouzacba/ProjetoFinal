<template>
  <!-- ✅ root único para satisfazer vue/valid-template-root -->
  <div>
    <PageHeader
      title="Detalhe do Docente"
      subtitle="Informações públicas do docente e suas propostas públicas."
    >
      <template #actions>
        <RouterLink class="btn btn-outline-secondary" to="/docentes">
          <i class="bi bi-arrow-left me-1" />Voltar
        </RouterLink>

        <RouterLink
          class="btn btn-outline-primary"
          :to="`/docentes/${props.id}/editar`"
        >
          <i class="bi bi-pencil me-1" />Editar
        </RouterLink>

        <button
  
          class="btn btn-outline-danger"
          type="button"
          :disabled="deleting"
          @click="handleDelete"
        >
          <span v-if="deleting" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
          <i v-else class="bi bi-trash me-1" />Excluir
        </button>
      </template>
    </PageHeader>

    <div v-if="error" class="alert alert-danger" role="alert">
      {{ error }}
    </div>

    <div v-else-if="loading" class="text-muted">
      Carregando…
    </div>

    <template v-else>
      <div class="card shadow-sm mb-3">
        <div class="card-body">
          <div class="d-flex flex-wrap align-items-start justify-content-between gap-3">
            <div>
              <h2 class="h5 mb-1">{{ docenteNome }}</h2>
              <div class="text-muted">
                <i class="bi bi-envelope me-1" />
                {{ docenteEmail }}
              </div>
            </div>

            <div class="text-muted small">
              <span class="badge text-bg-light border">
                ID: {{ docenteId }}
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
                  <td class="fw-semibold">{{ p.titulo }}</td>
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
      <div v-if="!canManage" class="alert alert-warning mt-3" role="alert">
        <strong>Ambiente académico:</strong> o cadastro/edição de docentes está disponível sem login
        para facilitar a validação da prova de conceito (simulação).
      </div>

        </div>
      </div>
    </template>
  </div>
</template>



<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import PageHeader from '../../components/layout/PageHeader.vue'
import { api } from '../../services/apiClient'
import { useAuthStore } from '../../stores/auth'
import { useUiStore } from '../../stores/ui'
import { deleteDocente, normalizeApiError } from '../../services/api'

const props = defineProps({
  id: { type: String, required: true }
})

const loading = ref(false)
const error = ref(null)
const docente = ref(null)

const auth = useAuthStore()
const ui = useUiStore()
const canManage = computed(() => auth.isAuthenticated && auth.user?.role === 'DOCENTE')

const deleting = ref(false)

const loadingPropostas = ref(false)
const propostas = ref([])

// ✅ Evita optional chaining no template (resolve "Unexpected token .")
const docenteNome = computed(() => (docente.value && docente.value.nome) ? docente.value.nome : '—')
const docenteEmail = computed(() => (docente.value && docente.value.email) ? docente.value.email : 'E-mail não informado')
const docenteId = computed(() => (docente.value && docente.value.id_docente) ? docente.value.id_docente : '—')

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
  if (!docente.value || !docente.value.id_docente) return

  loadingPropostas.value = true
  try {
    const { data } = await api.get('/api/propostas', {
      params: { orientador_id: String(docente.value.id_docente) }
    })
    propostas.value = Array.isArray(data) ? data : []
  } catch {
    propostas.value = []
  } finally {
    loadingPropostas.value = false
  }
}

onMounted(async () => {
  await fetchDocente()
  await fetchPropostas()
})

async function handleDelete () {
  if (!docente.value?.id_docente) return
  const ok = window.confirm('Confirma a exclusão deste docente?')
  if (!ok) return

  deleting.value = true
  try {
    await deleteDocente(String(docente.value.id_docente))
    ui.toast({ kind: 'success', message: 'Docente excluído com sucesso.' })
    window.location.assign('/docentes')
  } catch (e) {
    const msg = normalizeApiError(e).message || 'Falha ao excluir docente.'
    ui.toast({ kind: 'danger', message: msg, timeout: 5500 })
  } finally {
    deleting.value = false
  }
}
</script>
