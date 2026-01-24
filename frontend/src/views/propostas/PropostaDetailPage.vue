<template>
  <PageHeader title="Detalhes da proposta" subtitle="Visualização completa (pública) da proposta selecionada.">
    <template #actions>
      <RouterLink class="btn btn-outline-secondary" to="/propostas">
        <i class="bi bi-arrow-left me-1" />Voltar
      </RouterLink>

      <RouterLink
        v-if="canEdit"
        class="btn btn-primary"
        :to="`/propostas/${proposta.id_proposta}/editar`"
      >
        <i class="bi bi-pencil-square me-1" />Editar
      </RouterLink>
    </template>
  </PageHeader>

  <div v-if="loading" class="alert alert-info">
    <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />Carregando...
  </div>
  <div v-else-if="!proposta" class="alert alert-warning">Proposta não encontrada.</div>

  <div v-else class="row g-3">
    <div class="col-12 col-lg-8">
      <div class="card">
        <div class="card-body">
          <div class="d-flex flex-wrap align-items-start justify-content-between gap-2">
            <div>
              <div class="text-muted small">Proposta #{{ proposta.id_proposta }}</div>
              <h2 class="h5 mb-2">{{ proposta.titulo }}</h2>
            </div>
            <div>
              <StatusBadge :value="proposta.status" />
            </div>
          </div>

          <hr />

          <h3 class="h6 mb-2">Descrição</h3>
          <div class="text-muted" v-if="!proposta.descricao">—</div>
          <div v-else class="text-break" style="white-space: pre-wrap">{{ proposta.descricao }}</div>
        </div>
      </div>
    </div>

    <div class="col-12 col-lg-4">
      <div class="card mb-3">
        <div class="card-body">
          <h3 class="h6 mb-3">Responsáveis</h3>

          <div class="mb-3">
            <div class="text-muted small">Orientador</div>
            <div v-if="proposta.docentes" class="fw-semibold">
              {{ proposta.docentes.nome }}
              <span v-if="proposta.docentes.email" class="text-muted fw-normal">({{ proposta.docentes.email }})</span>
            </div>
            <div v-else class="text-muted">—</div>
          </div>

          <div>
            <div class="text-muted small">Coorientadores</div>
            <ul class="mb-0 ps-3" v-if="(proposta.proposta_coorientadores || []).length">
              <li v-for="pc in proposta.proposta_coorientadores" :key="String(pc.id_docente)">
                {{ pc.docentes?.nome }}
                <span v-if="pc.docentes?.email" class="text-muted">({{ pc.docentes.email }})</span>
              </li>
            </ul>
            <div v-else class="text-muted">—</div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <h3 class="h6 mb-3">Alunos e palavras-chave</h3>

          <div class="mb-3">
            <div class="text-muted small">Alunos</div>
            <ul class="mb-0 ps-3" v-if="(proposta.proposta_alunos || []).length">
              <li v-for="pa in proposta.proposta_alunos" :key="String(pa.id_aluno)">
                {{ pa.alunos?.nome }}
                <span v-if="pa.alunos?.email" class="text-muted">({{ pa.alunos.email }})</span>
              </li>
            </ul>
            <div v-else class="text-muted">—</div>
          </div>

          <div>
            <div class="text-muted small">Palavras-chave</div>
            <div v-if="(proposta.proposta_palavras_chave || []).length" class="d-flex flex-wrap gap-1">
              <span
                v-for="k in proposta.proposta_palavras_chave"
                :key="k.palavra"
                class="badge badge-soft"
              >
                {{ k.palavra }}
              </span>
            </div>
            <div v-else class="text-muted">—</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { usePropostasStore } from '../../stores/propostasStore';
import { useAuthStore } from '../../stores/auth'

import PageHeader from '../../components/layout/PageHeader.vue';
import StatusBadge from '../../components/ui/StatusBadge.vue';

const props = defineProps({ id: { type: String, required: true } });

const store = usePropostasStore();
const auth = useAuthStore()
const proposta = ref(null);
const loading = ref(false);

const canEdit = computed(() => {
  if (!auth.isAuthenticated) return false
  if (auth.user?.role !== 'DOCENTE') return false
  if (!proposta.value) return false
  // Autorização contextual: só o orientador da proposta pode editar.
  const emailOrientador = proposta.value?.docentes?.email
  return Boolean(emailOrientador && auth.user?.email && emailOrientador === auth.user.email)
})

onMounted(async () => {
  loading.value = true;
  proposta.value = await store.fetchPublicDetail(props.id);
  loading.value = false;
});
</script>
