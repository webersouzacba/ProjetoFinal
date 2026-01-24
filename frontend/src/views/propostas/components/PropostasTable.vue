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
                  <RouterLink
                    class="btn btn-sm btn-outline-primary"
                    :to="`/propostas/${p.id_proposta}`"
                    @click.stop
                  >
                    <i class="bi bi-eye me-1" />Detalhes
                  </RouterLink>
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
import { computed } from 'vue'
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../../stores/auth'
import EmptyState from '../../../components/ui/EmptyState.vue';
import StatusBadge from '../../../components/ui/StatusBadge.vue';

const router = useRouter();
const auth = useAuthStore()

const canManage = computed(() => auth.isAuthenticated && auth.user?.role === 'DOCENTE')

defineProps({
  items: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  error: { type: String, default: '' }
});

function goDetail(id) {
  router.push(`/propostas/${id}`);
}
</script>
