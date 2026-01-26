<template>
  <div>
    <PageHeader
      title="Docentes"
      subtitle="Listagem pública de docentes disponíveis para orientar propostas."
    >
      <template #actions>
        <div class="d-flex gap-2">
          <RouterLink class="btn btn-outline-secondary" to="/">
            <i class="bi bi-arrow-left me-1" />Voltar
          </RouterLink>

          <RouterLink
            v-if="canManage"
            class="btn btn-primary"
            to="/docentes/novo"
          >
            <i class="bi bi-plus-circle me-1" />Novo docente
          </RouterLink>
        </div>
      </template>
    </PageHeader>

    <div class="card shadow-sm">
      <div class="card-body">
        <div class="d-flex flex-wrap gap-2 align-items-center justify-content-between mb-3">
          <div class="input-group" style="max-width: 520px;">
            <span class="input-group-text">
              <i class="bi bi-search" />
            </span>
            <input
              v-model.trim="q"
              type="text"
              class="form-control"
              placeholder="Pesquisar por nome ou e-mail…"
            />
          </div>

          <button class="btn btn-outline-secondary" type="button" @click="fetchDocentes">
            <i class="bi bi-arrow-clockwise me-1" />Atualizar
          </button>
        </div>

        <div v-if="error" class="alert alert-danger mb-3" role="alert">
          {{ error }}
        </div>

        <div v-if="loading" class="text-muted">
          Carregando docentes…
        </div>

        <div v-else class="table-responsive">
          <table class="table align-middle mb-0">
            <thead>
              <tr>
                <th>Nome</th>
                <th class="d-none d-md-table-cell">E-mail</th>
                <th class="text-end">Ações</th>
              </tr>
            </thead>

            <tbody v-if="filtered.length">
              <tr v-for="d in filtered" :key="String(d.id_docente)">
                <td class="fw-semibold">
                  {{ d.nome }}
                </td>

                <td class="d-none d-md-table-cell text-muted">
                  {{ d.email || '—' }}
                </td>

                <td class="text-end">
                  <RouterLink
                    class="btn btn-sm btn-outline-primary"
                    :to="`/docentes/${d.id_docente}`"
                  >
                    <i class="bi bi-eye me-1" />Detalhe
                  </RouterLink>
                </td>
              </tr>
            </tbody>

            <tbody v-else>
              <tr>
                <td colspan="3" class="text-muted py-4">
                  Nenhum docente encontrado.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="text-muted small mt-3">
          Total: {{ filtered.length }}
        </div>

        <div v-if="!canManage" class="alert alert-info mt-3 mb-0" role="alert">
          Para criar, editar ou remover docentes, faça login como docente.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import PageHeader from '../../components/layout/PageHeader.vue'
import { getDocentes, normalizeApiError } from '../../services/api'
import { useAuthStore } from '../../stores/auth'

const auth = useAuthStore()
const canManage = computed(() => !!auth?.token && auth?.user?.role === 'DOCENTE')

const loading = ref(false)
const error = ref(null)
const docentes = ref([])
const q = ref('')

const filtered = computed(() => {
  const term = (q.value || '').toLowerCase()
  if (!term) return docentes.value

  return docentes.value.filter((d) => {
    const nome = (d.nome || '').toLowerCase()
    const email = (d.email || '').toLowerCase()
    return nome.includes(term) || email.includes(term)
  })
})

async function fetchDocentes () {
  loading.value = true
  error.value = null

  try {
    const data = await getDocentes()
    docentes.value = Array.isArray(data) ? data : []
  } catch (e) {
    error.value = normalizeApiError(e).message || 'Falha ao carregar docentes.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchDocentes()
})
</script>
