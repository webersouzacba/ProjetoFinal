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
          title="Nenhuma proposta encontrada"
          subtitle="Ajuste os filtros para refinar a consulta."
          icon="bi bi-search"
        >
          <template #actions>
            <RouterLink
              v-if="canManage"
              class="btn btn-outline-primary"
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
        </EmptyState>

        <div v-else class="table-responsive">
          <table class="table table-sm align-middle">
            <thead>
              <tr>
                <th class="text-muted">ID</th>
                <th>Título</th>
                <th>Status</th>
                <th>Orientador</th>
                <th style="width: 1%"></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="p in items"
                :key="p.id_proposta"
                class="row-clickable"
                @click="goDetail(p.id_proposta)"
              >
                <td>{{ p.id_proposta }}</td>
                <td>
                  <div class="fw-semibold">{{ p.titulo }}</div>
                  <div class="text-muted small" v-if="p.docentes?.email">
                    {{ p.docentes.email }}
                  </div>
                </td>
                <td><StatusBadge :value="p.status" /></td>
                <td>{{ p.docentes?.nome || '-' }}</td>

                <td class="text-end">
                  <div class="btn-group" role="group" @click.stop>
                    <RouterLink
                      class="btn btn-sm btn-outline-primary"
                      :to="`/propostas/${p.id_proposta}`"
                    >
                      <i class="bi bi-eye me-1" />Detalhes
                    </RouterLink>

                    <RouterLink
                      v-if="canEditRow(p)"
                      class="btn btn-sm btn-outline-secondary"
                      :to="`/propostas/${p.id_proposta}/editar`"
                      title="Editar (somente orientador)"
                    >
                      <i class="bi bi-pencil-square" />
                    </RouterLink>

                    <button
                      v-if="canEditRow(p)"
                      class="btn btn-sm btn-outline-danger"
                      type="button"
                      title="Excluir (somente orientador)"
                      :disabled="deletingId === String(p.id_proposta)"
                      @click.stop="handleDeleteRow(p)"
                    >
                      <span
                        v-if="deletingId === String(p.id_proposta)"
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
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../../stores/auth'
import { usePropostasStore } from '../../../stores/propostasStore'
import { useUiStore } from '../../../stores/ui'
import EmptyState from '../../../components/ui/EmptyState.vue';
import StatusBadge from '../../../components/ui/StatusBadge.vue';

const router = useRouter();
const auth = useAuthStore()
const store = usePropostasStore()
const ui = useUiStore()

const deletingId = ref('')

const canManage = computed(() => auth.isAuthenticated && auth.user?.role === 'DOCENTE')

defineProps({
  items: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  error: { type: String, default: '' }
});

function goDetail(id) {
  router.push(`/propostas/${id}`);
}

function canEditRow(p) {
  if (!auth.isAuthenticated) return false
  if (auth.user?.role !== 'DOCENTE') return false
  const idOrientador = p?.id_orientador
  const idDocente = auth.user?.id_docente ?? auth.user?.id ?? auth.user?.docenteId
  return Boolean(idOrientador != null && idDocente != null && String(idOrientador) === String(idDocente))
}

async function handleDeleteRow(p) {
  if (!p?.id_proposta) return
  if (!canEditRow(p)) return

  const ok = window.confirm(
    `Confirma excluir a proposta #${p.id_proposta}?\n\nEsta ação não pode ser desfeita.`
  )
  if (!ok) return

  deletingId.value = String(p.id_proposta)
  try {
    await store.deleteMine(p.id_proposta)
    ui.toast({ kind: 'success', message: 'Proposta excluída com sucesso.' })
    await store.fetchPublic()
  } catch (e) {
    const msg = e?.response?.data?.error || e?.message || 'Falha ao excluir a proposta.'
    ui.toast({ kind: 'danger', message: msg, timeout: 5500 })
  } finally {
    deletingId.value = ''
  }
}
</script>
