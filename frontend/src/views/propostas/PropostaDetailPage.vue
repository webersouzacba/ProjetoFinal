<template>
  <div class="d-flex align-items-center justify-content-between mb-3">
    <h1 class="h4 mb-0">Detalhes da Proposta</h1>
    <div class="d-flex gap-2">
      <RouterLink class="btn btn-sm btn-outline-secondary" to="/propostas">Voltar</RouterLink>
      <RouterLink v-if="proposta" class="btn btn-sm btn-primary" :to="`/propostas/${proposta.id_proposta}/editar`">
        Editar
      </RouterLink>
    </div>
  </div>

  <div v-if="loading" class="alert alert-info">Carregando...</div>
  <div v-else-if="!proposta" class="alert alert-warning">Proposta não encontrada.</div>

  <div v-else class="card">
    <div class="card-body">
      <div class="mb-2"><strong>ID:</strong> {{ proposta.id_proposta }}</div>
      <div class="mb-2"><strong>Título:</strong> {{ proposta.titulo }}</div>
      <div class="mb-2"><strong>Status:</strong> {{ proposta.status }}</div>

      <div class="mb-3">
        <strong>Descrição</strong>
        <div class="text-muted" v-if="!proposta.descricao">—</div>
        <div v-else>{{ proposta.descricao }}</div>
      </div>

      <div class="mb-3">
        <strong>Orientador</strong>
        <div v-if="proposta.docentes">
          {{ proposta.docentes.nome }} <span class="text-muted">({{ proposta.docentes.email }})</span>
        </div>
        <div v-else class="text-muted">—</div>
      </div>

      <div class="mb-3">
        <strong>Alunos</strong>
        <ul class="mb-0" v-if="(proposta.proposta_alunos || []).length">
          <li v-for="pa in proposta.proposta_alunos" :key="String(pa.id_aluno)">
            {{ pa.alunos?.nome }} <span class="text-muted">({{ pa.alunos?.email }})</span>
          </li>
        </ul>
        <div v-else class="text-muted">—</div>
      </div>

      <div class="mb-3">
        <strong>Coorientadores</strong>
        <ul class="mb-0" v-if="(proposta.proposta_coorientadores || []).length">
          <li v-for="pc in proposta.proposta_coorientadores" :key="String(pc.id_docente)">
            {{ pc.docentes?.nome }} <span class="text-muted">({{ pc.docentes?.email }})</span>
          </li>
        </ul>
        <div v-else class="text-muted">—</div>
      </div>

      <div>
        <strong>Palavras-chave</strong>
        <div v-if="(proposta.proposta_palavras_chave || []).length">
          <span
            v-for="k in proposta.proposta_palavras_chave"
            :key="k.palavra"
            class="badge text-bg-light border me-1"
          >
            {{ k.palavra }}
          </span>
        </div>
        <div v-else class="text-muted">—</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { usePropostasStore } from '../../stores/propostasStore';

const props = defineProps({ id: { type: String, required: true } });

const store = usePropostasStore();
const proposta = ref(null);
const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  proposta.value = await store.fetchPublicDetail(props.id);
  loading.value = false;
});
</script>
