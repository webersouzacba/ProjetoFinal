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
          title="Nenhum docente encontrado"
          subtitle="Cadastre um novo docente para iniciar."
          icon="bi bi-people"
        >
          <template #actions>
            <RouterLink v-if="canManage" class="btn btn-outline-primary" to="/docentes/novo">
              <i class="bi bi-plus-lg me-1" />Novo docente
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
                v-for="d in items"
                :key="d.id_docente"
                class="row-clickable"
                @click="goDetail(d.id_docente)"
              >
                <td>{{ d.id_docente }}</td>
                <td class="fw-semibold">{{ d.nome }}</td>
                <td class="text-muted">{{ d.email || '—' }}</td>

                <td class="text-end">
                  <div class="btn-group" role="group" @click.stop>
                    <RouterLink class="btn btn-sm btn-outline-primary" :to="`/docentes/${d.id_docente}`">
                      <i class="bi bi-eye me-1" />Detalhes
                    </RouterLink>

                    <RouterLink
                      v-if="canManage"
                      class="btn btn-sm btn-outline-secondary"
                      :to="`/docentes/${d.id_docente}/editar`"
                      title="Editar"
                    >
                      <i class="bi bi-pencil-square" />
                    </RouterLink>

                    <button
                      v-if="canManage"
                      class="btn btn-sm btn-outline-danger"
                      type="button"
                      title="Excluir"
                      :disabled="deletingId === String(d.id_docente)"
                      @click.stop="handleDeleteRow(d)"
                    >
                      <span
                        v-if="deletingId === String(d.id_docente)"
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
  router.push(`/docentes/${id}`)
}

async function handleDeleteRow(d) {
  if (!d?.id_docente) return
  if (!canManage.value) return

  const ok = window.confirm(
    `Confirma excluir o docente #${d.id_docente}?\n\nEsta ação não pode ser desfeita.`
  )
  if (!ok) return

  deletingId.value = String(d.id_docente)
  try {
    await api.delete(`/api/docentes/${d.id_docente}`)
    ui.toast({ kind: 'success', message: 'Docente excluído com sucesso.' })
    emit('deleted')
  } catch (e) {
    const msg = e?.response?.data?.error || e?.message || 'Falha ao excluir o docente.'
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
