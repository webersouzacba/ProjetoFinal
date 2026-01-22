<template>
  <form class="vstack gap-3" @submit.prevent="emitSubmit">
    <!-- Seção 1: Dados principais -->
    <div class="card">
      <div class="card-body">
        <div class="d-flex align-items-center gap-2 mb-3">
          <i class="bi bi-file-earmark-text" />
          <h2 class="h6 mb-0">Dados principais</h2>
        </div>

        <div class="row g-3">
          <div class="col-12">
            <label class="form-label">Título <span class="text-danger">*</span></label>
            <input
              class="form-control"
              v-model.trim="local.titulo"
              required
              maxlength="200"
              placeholder="Ex.: Análise de Dados Educacionais"
            />
            <div class="form-hint d-flex justify-content-between">
              <span>Evite títulos genéricos. Seja específico no tema e recorte.</span>
              <span>{{ local.titulo.length }}/200</span>
            </div>
          </div>

          <div class="col-12 col-md-4">
            <label class="form-label">Status</label>
            <select class="form-select" v-model="local.status">
              <option value="rascunho">rascunho</option>
              <option value="publicada">publicada</option>
              <option value="atribuida">atribuida</option>
              <option value="encerrada">encerrada</option>
            </select>
            <div class="form-hint">Use <strong>rascunho</strong> enquanto estiver ajustando a proposta.</div>
          </div>

          <div class="col-12 col-md-8">
            <label class="form-label">Descrição</label>
            <textarea
              class="form-control"
              v-model.trim="local.descricao"
              rows="6"
              maxlength="2000"
              placeholder="Descreva objetivos, escopo, tecnologias e resultados esperados..."
            />
            <div class="form-hint d-flex justify-content-between">
              <span>Use parágrafos curtos. Isso melhora a legibilidade.</span>
              <span>{{ local.descricao.length }}/2000</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Seção 2: Pessoas -->
    <div class="card">
      <div class="card-body">
        <div class="d-flex align-items-center gap-2 mb-3">
          <i class="bi bi-people" />
          <h2 class="h6 mb-0">Associações</h2>
        </div>

        <div v-if="loadError" class="alert alert-warning">
          {{ loadError }}
        </div>

        <div class="row g-3">
          <div class="col-12">
            <div class="d-flex align-items-center justify-content-between gap-2">
              <label class="form-label mb-0">Coorientadores</label>
              <div class="d-flex gap-2">
                <button class="btn btn-sm btn-outline-secondary" type="button" @click="clearCoorientadores">
                  Limpar
                </button>
              </div>
            </div>
            <select class="form-select" multiple size="6" v-model="local.coorientadores_ids">
              <option v-for="d in docentes" :key="String(d.id_docente)" :value="String(d.id_docente)">
                {{ d.nome }}<span v-if="d.email"> ({{ d.email }})</span>
              </option>
            </select>
            <div class="form-hint">Selecione um ou mais docentes por nome (Ctrl/Cmd para seleção múltipla).</div>
          </div>

          <div class="col-12">
            <div class="d-flex align-items-center justify-content-between gap-2">
              <label class="form-label mb-0">Alunos</label>
              <div class="d-flex gap-2">
                <button class="btn btn-sm btn-outline-secondary" type="button" @click="clearAlunos">
                  Limpar
                </button>
              </div>
            </div>
            <select class="form-select" multiple size="6" v-model="local.alunos_ids">
              <option v-for="a in alunos" :key="String(a.id_aluno)" :value="String(a.id_aluno)">
                {{ a.nome }}<span v-if="a.email"> ({{ a.email }})</span>
              </option>
            </select>
            <div class="form-hint">Selecione um ou mais alunos por nome (Ctrl/Cmd para seleção múltipla).</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Seção 3: Palavras-chave -->
    <div class="card">
      <div class="card-body">
        <div class="d-flex align-items-center gap-2 mb-3">
          <i class="bi bi-tags" />
          <h2 class="h6 mb-0">Palavras-chave</h2>
        </div>

        <select class="form-select" multiple size="6" v-model="local.palavras_chave">
          <option v-for="p in palavrasDisponiveis" :key="p" :value="p">
            {{ p }}
          </option>
        </select>
        <div class="form-hint">
          Lista carregada do BD. Se estiver vazia, verifique o seed ou crie uma proposta contendo palavras-chave.
        </div>

        <div v-if="local.palavras_chave.length" class="mt-2 d-flex flex-wrap gap-1">
          <span v-for="k in local.palavras_chave" :key="k" class="badge badge-soft">
            {{ k }}
          </span>
        </div>
      </div>
    </div>

    <!-- Ações -->
    <div class="d-flex flex-wrap gap-2 justify-content-end">
      <button class="btn btn-primary" type="submit" :disabled="disabled || !canSubmit">
        <span v-if="disabled" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
        {{ mode === 'edit' ? 'Salvar alterações' : 'Criar proposta' }}
      </button>
      <button class="btn btn-outline-secondary" type="button" @click="emit('cancel')" :disabled="disabled">
        Cancelar
      </button>
    </div>
  </form>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';
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
  local.palavras_chave = v?.palavras_chave ?? [];
}

watch(
  () => props.initialValues,
  (v) => applyInitial(v),
  { immediate: true, deep: true }
);

const canSubmit = computed(() => local.titulo.trim().length >= 3);

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

function clearCoorientadores() {
  local.coorientadores_ids = [];
}

function clearAlunos() {
  local.alunos_ids = [];
}

function emitSubmit() {
  if (!canSubmit.value) return;

  emit('submit', {
    titulo: local.titulo,
    descricao: local.descricao,
    status: local.status,
    // backend aceita number; aqui enviamos strings e o backend normaliza
    coorientadores_ids: local.coorientadores_ids,
    alunos_ids: local.alunos_ids,
    palavras_chave: local.palavras_chave
  });
}
</script>