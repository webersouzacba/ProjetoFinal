<template>
  <div class="card">
    <div class="card-body">
      <div v-if="loading" class="text-muted d-flex align-items-center gap-2">
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
        Carregando...
      </div>

      <div v-else-if="error" class="alert alert-danger" role="alert">
        {{ error }}
      </div>

      <div v-else>
        <EmptyState
          v-if="!items?.length"
          title="Nenhum aluno encontrado"
          subtitle="Cadastre um novo aluno para iniciar."
          icon="bi bi-person"
        >
          <template #actions>
            <RouterLink v-if="canManage" class="btn btn-outline-primary" to="/alunos/novo">
              <i class="bi bi-plus-lg me-1" />Novo aluno
            </RouterLink>
          </template>
        </EmptyState>

        <div v-else class="table-responsive">
          <table class="table table-sm align-middle">
            <thead>
              <tr>
                <th class="text-muted">ID</th>
                <th>Nome</th>
                <th>Email</th>
                <th style="width: 1%"></th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="a in items"
                :key="a.id_aluno"
                class="row-clickable"
                @click="goDetail(a.id_aluno)"
              >
                <td>{{ a.id_aluno }}</td>
                <td class="fw-semibold">{{ a.nome }}</td>
                <td class="text-muted">{{ a.email || '—' }}</td>

                <td class="text-end">
                  <div class="btn-group" role="group" @click.stop>
                    <RouterLink class="btn btn-sm btn-outline-primary" :to="`/alunos/${a.id_aluno}`">
                      <i class="bi bi-eye me-1" />Detalhes
                    </RouterLink>

                    <RouterLink
                      v-if="canManage"
                      class="btn btn-sm btn-outline-secondary"
                      :to="`/alunos/${a.id_aluno}/editar`"
                      title="Editar"
                    >
                      <i class="bi bi-pencil-square" />
                    </RouterLink>

                    <button
                      v-if="canManage"
                      class="btn btn-sm btn-outline-danger"
                      type="button"
                      title="Excluir"
                      :disabled="deletingId === String(a.id_aluno)"
                      @click.stop="handleDeleteRow(a)"
                    >
                      <span
                        v-if="deletingId === String(a.id_aluno)"
                        class="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      />
                      <i v-else class="bi bi-trash" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div class="text-muted small mt-2">
            * Editar/Excluir disponíveis apenas para docente autenticado.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { api } from '../../../services/apiClient'
import { useAuthStore } from '../../../stores/auth'
import { useUiStore } from '../../../stores/ui'
import EmptyState from '../../../components/ui/EmptyState.vue'

const emit = defineEmits(['deleted'])

const router = useRouter()
const auth = useAuthStore()
const ui = useUiStore()

const deletingId = ref('')

const canManage = computed(() => auth.isAuthenticated && auth.user?.role === 'DOCENTE')

defineProps({
  items: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  error: { type: String, default: '' }
})

function goDetail(id) {
  router.push(`/alunos/${id}`)
}

async function handleDeleteRow(a) {
  if (!a?.id_aluno) return
  if (!canManage.value) return

  const ok = window.confirm(
    `Confirma excluir o aluno #${a.id_aluno}?\n\nEsta ação não pode ser desfeita.`
  )
  if (!ok) return

  deletingId.value = String(a.id_aluno)
  try {
    await api.delete(`/api/alunos/${a.id_aluno}`)
    ui.toast({ kind: 'success', message: 'Aluno excluído com sucesso.' })
    emit('deleted')
  } catch (e) {
    const msg = e?.response?.data?.error || e?.message || 'Falha ao excluir o aluno.'
    ui.toast({ kind: 'danger', message: msg, timeout: 5500 })
  } finally {
    deletingId.value = ''
  }
}
</script>

<style scoped>
.row-clickable {
  cursor: pointer;
}
</style>
