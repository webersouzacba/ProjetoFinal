<template>
  <div>
    <PageHeader
      title="Alunos"
      subtitle="Gestão de alunos (CRUD autenticado)."
    >
      <template #actions>
        <RouterLink class="btn btn-outline-secondary" to="/">
          <i class="bi bi-arrow-left me-1" />Voltar
        </RouterLink>

        <RouterLink class="btn btn-primary" to="/alunos/nova">
          <i class="bi bi-person-plus me-1" />Novo aluno
        </RouterLink>
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

          <button class="btn btn-outline-secondary" type="button" @click="fetchAlunos">
            <i class="bi bi-arrow-clockwise me-1" />Atualizar
          </button>
        </div>

        <div v-if="error" class="alert alert-danger mb-3" role="alert">
          {{ error }}
        </div>

        <div v-if="loading" class="text-muted">
          Carregando alunos…
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
              <tr v-for="a in filtered" :key="String(a.id_aluno)">
                <td class="fw-semibold">{{ a.nome }}</td>
                <td class="d-none d-md-table-cell text-muted">{{ a.email || '—' }}</td>
                <td class="text-end">
                  <RouterLink class="btn btn-sm btn-outline-primary" :to="`/alunos/${a.id_aluno}`">
                    <i class="bi bi-eye me-1" />Detalhe
                  </RouterLink>
                </td>
              </tr>
            </tbody>

            <tbody v-else>
              <tr>
                <td colspan="3" class="text-muted py-4">Nenhum aluno encontrado.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="text-muted small mt-3">Total: {{ filtered.length }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import PageHeader from '../../components/layout/PageHeader.vue'
import { getAlunos, normalizeApiError } from '../../services/api'

const loading = ref(false)
const error = ref(null)
const alunos = ref([])
const q = ref('')

const filtered = computed(() => {
  const term = (q.value || '').toLowerCase()
  if (!term) return alunos.value

  return alunos.value.filter((a) => {
    const nome = (a.nome || '').toLowerCase()
    const email = (a.email || '').toLowerCase()
    return nome.includes(term) || email.includes(term)
  })
})

async function fetchAlunos () {
  loading.value = true
  error.value = null

  try {
    const data = await getAlunos()
    alunos.value = Array.isArray(data) ? data : []
  } catch (e) {
    error.value = normalizeApiError(e).message || 'Falha ao carregar alunos.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchAlunos)
</script>
