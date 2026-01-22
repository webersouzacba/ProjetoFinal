<template>
  <form class="card card-body" @submit.prevent="emitSubmit">
    <div class="row g-3">
      <div class="col-12">
        <label class="form-label">Título</label>
        <input
          class="form-control"
          v-model="local.titulo"
          required
          maxlength="200"
          placeholder="Ex.: Análise de Dados Educacionais"
        />
      </div>

      <div class="col-12">
        <label class="form-label">Descrição</label>
        <textarea
          class="form-control"
          v-model="local.descricao"
          rows="5"
          placeholder="Descreva objetivos e escopo..."
        />
      </div>

      <div class="col-12 col-md-4">
        <label class="form-label">Status</label>
        <select class="form-select" v-model="local.status">
          <option value="rascunho">rascunho</option>
          <option value="publicada">publicada</option>
          <option value="atribuida">atribuida</option>
          <option value="encerrada">encerrada</option>
        </select>
      </div>

      <!-- ✅ Coorientadores por nome -->
      <div class="col-12">
        <label class="form-label">Coorientadores</label>
        <select class="form-select" multiple v-model="local.coorientadores_ids">
          <option
            v-for="d in docentes"
            :key="String(d.id_docente)"
            :value="String(d.id_docente)"
          >
            {{ d.nome }}<span v-if="d.email"> ({{ d.email }})</span>
          </option>
        </select>
        <div class="form-text">Selecione um ou mais docentes por nome.</div>
      </div>

      <!-- ✅ Alunos por nome -->
      <div class="col-12">
        <label class="form-label">Alunos</label>
        <select class="form-select" multiple v-model="local.alunos_ids">
          <option
            v-for="a in alunos"
            :key="String(a.id_aluno)"
            :value="String(a.id_aluno)"
          >
            {{ a.nome }}<span v-if="a.email"> ({{ a.email }})</span>
          </option>
        </select>
        <div class="form-text">Selecione um ou mais alunos por nome.</div>
      </div>

      <!-- ✅ Palavras-chave via enum (BD) -->
      <div class="col-12">
        <label class="form-label">Palavras-chave</label>
        <select class="form-select" multiple v-model="local.palavras_chave">
          <option v-for="p in palavrasDisponiveis" :key="p" :value="p">
            {{ p }}
          </option>
        </select>
        <div class="form-text">
          Lista carregada do BD (sem interface de manutenção). Se estiver vazia, crie 1 proposta com palavras-chave ou
          adicione palavras no seed.
        </div>
      </div>

      <div class="col-12 d-flex gap-2">
        <button class="btn btn-primary" type="submit" :disabled="disabled">
          {{ mode === 'edit' ? 'Salvar' : 'Criar' }}
        </button>
        <button class="btn btn-outline-secondary" type="button" @click="emit('cancel')">
          Cancelar
        </button>
      </div>

      <div v-if="loadError" class="col-12">
        <div class="alert alert-warning mb-0">
          {{ loadError }}
        </div>
      </div>
    </div>
  </form>
</template>

<script setup>
import { onMounted, reactive, ref, watch } from 'vue';
import { api } from '../../../services/apiClient';


const props = defineProps({
  mode: { type: String, default: 'create' },
  initialValues: { type: Object, required: true },
  disabled: { type: Boolean, default: false }
});

const emit = defineEmits(['submit', 'cancel']);

const docentes = ref([]);
const alunos = ref([]);
const palavrasDisponiveis = ref([]);
const loadError = ref('');

const local = reactive({
  titulo: '',
  descricao: '',
  status: 'rascunho',
  coorientadores_ids: [],
  alunos_ids: [],
  palavras_chave: []
});

function applyInitial(v) {
  local.titulo = v?.titulo ?? '';
  local.descricao = v?.descricao ?? '';
  local.status = v?.status ?? 'rascunho';
  local.coorientadores_ids = (v?.coorientadores_ids ?? []).map(String);
  local.alunos_ids = (v?.alunos_ids ?? []).map(String);
  local.palavras_chave = (v?.palavras_chave ?? []);
}

watch(
  () => props.initialValues,
  (v) => applyInitial(v),
  { immediate: true, deep: true }
);

async function loadCombos() {
  loadError.value = '';
  try {
    const [doc, alu, pal] = await Promise.all([
      api.get('/api/docentes'),
      api.get('/api/alunos'),
      api.get('/api/palavras-chave')
    ]);

    docentes.value = doc.data || [];
    alunos.value = alu.data || [];
    palavrasDisponiveis.value = pal.data || [];
  } catch (e) {
    loadError.value =
      e?.response?.data?.error ||
      e.message ||
      'Falha ao carregar listas (docentes/alunos/palavras-chave).';
  }
}

onMounted(loadCombos);

function emitSubmit() {
  emit('submit', {
    titulo: local.titulo,
    descricao: local.descricao,
    status: local.status,
    // backend aceita number; aqui enviamos strings, o zod já normaliza (e o repo converte)
    coorientadores_ids: local.coorientadores_ids,
    alunos_ids: local.alunos_ids,
    palavras_chave: local.palavras_chave
  });
}
</script>
