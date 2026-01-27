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
            <div class="form-hint d-flex align-items-center gap-2 mt-1">
              <i class="bi bi-info-circle" />
              <small class="text-muted">Até 200 caracteres.</small>
            </div>
          </div>

          <div class="col-12">
            <label class="form-label">Descrição</label>
            <textarea
              class="form-control"
              v-model.trim="local.descricao"
              rows="4"
              maxlength="2000"
              placeholder="Descreva brevemente o objetivo e o escopo da proposta."
            />
            <div class="form-hint d-flex align-items-center gap-2 mt-1">
              <i class="bi bi-info-circle" />
              <small class="text-muted">Campo opcional (até 2000 caracteres).</small>
            </div>
          </div>

          <div class="col-12 col-md-4">
            <label class="form-label">Status</label>
            <select class="form-select" v-model="local.status">
              <option value="rascunho">Rascunho</option>
              <option value="publicada">Publicada</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Seção 2: Associações -->
    <div class="card">
      <div class="card-body">
        <div class="d-flex align-items-center gap-2 mb-3">
          <i class="bi bi-diagram-3" />
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

            <!-- Regra: orientador (docente logado) NÃO deve aparecer como coorientador -->
            <select class="form-select" multiple size="6" v-model="local.coorientadores_ids">
              <option
                v-for="d in docentesCoorientadores"
                :key="String(d.id_docente)"
                :value="String(d.id_docente)"
              >
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

            <div class="form-hint">Selecione um ou mais alunos (Ctrl/Cmd para seleção múltipla).</div>
          </div>

          <div class="col-12">
            <label class="form-label">Palavras-chave</label>

            <div class="d-flex flex-wrap gap-2">
              <span
                v-for="p in local.palavras_chave"
                :key="p"
                class="badge text-bg-secondary d-inline-flex align-items-center gap-2"
              >
                {{ p }}
                <button class="btn btn-sm btn-link p-0 text-white" type="button" @click="removePalavra(p)">
                  <i class="bi bi-x-lg" />
                </button>
              </span>
            </div>

            <div class="input-group mt-2">
              <select class="form-select" v-model="newPalavra">
                <option value="">-- selecione --</option>
                <option v-for="p in palavrasDisponiveis" :key="p.palavra" :value="p.palavra">
                  {{ p.palavra }}
                </option>
              </select>
              <button class="btn btn-outline-primary" type="button" @click="addPalavra" :disabled="!newPalavra">
                Adicionar
              </button>
            </div>

            <div class="form-hint">Escolha palavras-chave para facilitar a busca e categorização da proposta.</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Ações -->
    <div class="d-flex justify-content-end gap-2">
      <button class="btn btn-outline-secondary" type="button" @click="emit('cancel')" :disabled="props.disabled">
        Cancelar
      </button>
      <button class="btn btn-primary" type="submit" :disabled="!canSubmit || props.disabled">
        <i class="bi bi-check2-circle me-1" />Salvar
      </button>
    </div>
  </form>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { api } from '../../../services/apiClient';
import { useAuthStore } from '../../../stores/auth';

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

const newPalavra = ref('');

// ===============================
// Regra: Orientador não pode ser coorientador
// ===============================
const auth = useAuthStore();

// Mantém robusto a possíveis variações de payload (id, id_docente, docenteId)
const orientadorId = computed(() => {
  const u = auth.user || {};
  const id = u.id_docente ?? u.id ?? u.docenteId ?? null;
  return id ? String(id) : null;
});

// Lista filtrada para seleção de coorientadores
const docentesCoorientadores = computed(() => {
  const oid = orientadorId.value;
  const list = docentes.value || [];
  if (!oid) return list;
  return list.filter((d) => String(d.id_docente) !== oid);
});

// Se vier “sujo” (seed/edição antiga), remove automaticamente o orientador da seleção
watch(
  () => orientadorId.value,
  (oid) => {
    if (!oid) return;
    if (Array.isArray(local.coorientadores_ids)) {
      local.coorientadores_ids = local.coorientadores_ids.filter((x) => String(x) !== oid);
    }
  },
  { immediate: true }
);

// ===============================

function applyInitial(v) {
  local.titulo = v?.titulo ?? '';
  local.descricao = v?.descricao ?? '';
  local.status = v?.status ?? 'rascunho';
  local.coorientadores_ids = Array.isArray(v?.coorientadores_ids) ? [...v.coorientadores_ids] : [];
  local.alunos_ids = Array.isArray(v?.alunos_ids) ? [...v.alunos_ids] : [];
  local.palavras_chave = Array.isArray(v?.palavras_chave) ? [...v.palavras_chave] : [];
}

watch(
  () => props.initialValues,
  (v) => applyInitial(v),
  { immediate: true, deep: true }
);

const canSubmit = computed(() => {
  return (local.titulo || '').trim().length > 0;
});

function addPalavra() {
  const p = (newPalavra.value || '').trim();
  if (!p) return;
  if (!local.palavras_chave.includes(p)) local.palavras_chave.push(p);
  newPalavra.value = '';
}

function removePalavra(p) {
  local.palavras_chave = local.palavras_chave.filter((x) => x !== p);
}

function clearCoorientadores() {
  local.coorientadores_ids = [];
}

function clearAlunos() {
  local.alunos_ids = [];
}

async function loadCombos() {
  loadError.value = '';
  try {
    // IMPORTANTE: endpoints corretos no backend são /api/*
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
      e?.message ||
      'Falha ao carregar listas (docentes/alunos/palavras-chave).';
  }
}

onMounted(loadCombos);

function emitSubmit() {
  if (!canSubmit.value) return;

  // Defesa extra: garante que o orientador não vai no payload de coorientadores
  const filteredCoor = orientadorId.value
    ? (local.coorientadores_ids || []).filter((x) => String(x) !== orientadorId.value)
    : (local.coorientadores_ids || []);

  emit('submit', {
    titulo: local.titulo,
    descricao: local.descricao,
    status: local.status,
    // Nota: front envia strings; backend normaliza
    coorientadores_ids: filteredCoor,
    alunos_ids: local.alunos_ids,
    palavras_chave: local.palavras_chave
  });
}
</script>
