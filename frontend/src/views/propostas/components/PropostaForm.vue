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
              minlength="5"
              maxlength="200"
              placeholder="Ex.: Análise de Dados Educacionais"
              :disabled="props.disabled"
            />
            <div class="form-hint d-flex align-items-center gap-2 mt-1">
              <i class="bi bi-info-circle" />
              <small class="text-muted">Obrigatório (mín. 5 e máx. 200 caracteres).</small>
            </div>
          </div>

          <div class="col-12">
            <label class="form-label">Descrição / Objetivos <span class="text-danger">*</span></label>
            <textarea
              class="form-control"
              v-model.trim="local.descricao"
              rows="4"
              required
              minlength="10"
              maxlength="2000"
              placeholder="Descreva objetivos e escopo (mínimo 10 caracteres)."
              :disabled="props.disabled"
            />
            <div class="form-hint d-flex align-items-center gap-2 mt-1">
              <i class="bi bi-info-circle" />
              <small class="text-muted">Obrigatório (mín. 10 e máx. 2000 caracteres).</small>
            </div>
          </div>

          <div class="col-12 col-md-4">
            <label class="form-label">Status</label>
            <select class="form-select" v-model="local.status" :disabled="props.disabled">
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
          <!-- Coorientadores -->
          <div class="col-12">
            <div class="d-flex align-items-center justify-content-between gap-2">
              <label class="form-label mb-0">Coorientadores</label>
              <div class="d-flex gap-2">
                <button
                  class="btn btn-sm btn-outline-secondary"
                  type="button"
                  @click="clearCoorientadores"
                  :disabled="props.disabled || (local.coorientadores_ids || []).length === 0"
                >
                  Limpar
                </button>
              </div>
            </div>

            <!-- Regra: orientador (docente logado) NÃO deve aparecer como coorientador -->
            <select
              class="form-select"
              multiple
              size="6"
              v-model="local.coorientadores_ids"
              :disabled="props.disabled"
            >
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

          <!-- Alunos -->
          <div class="col-12">
            <div class="d-flex align-items-center justify-content-between gap-2">
              <label class="form-label mb-0">Alunos</label>
              <div class="d-flex gap-2">
                <button
                  class="btn btn-sm btn-outline-secondary"
                  type="button"
                  @click="clearAlunos"
                  :disabled="props.disabled || (local.alunos_ids || []).length === 0"
                >
                  Limpar
                </button>
              </div>
            </div>

            <select class="form-select" multiple size="6" v-model="local.alunos_ids" :disabled="props.disabled">
              <option v-for="a in alunos" :key="String(a.id_aluno)" :value="String(a.id_aluno)">
                {{ a.nome }}<span v-if="a.email"> ({{ a.email }})</span>
              </option>
            </select>

            <div class="form-hint">Selecione um ou mais alunos (Ctrl/Cmd para seleção múltipla).</div>
          </div>

          <!-- Palavras-chave (MULTI SELECT) -->
          <div class="col-12">
            <div class="d-flex align-items-center justify-content-between gap-2">
              <label class="form-label mb-0">Palavras-chave</label>
              <div class="d-flex gap-2">
                <button
                  class="btn btn-sm btn-outline-secondary"
                  type="button"
                  @click="clearPalavrasChave($event)"
                  :disabled="props.disabled || (local.palavras_chave || []).length === 0"
                >
                  Limpar
                </button>
              </div>
            </div>

            <select
              class="form-select"
              multiple
              size="6"
              v-model="local.palavras_chave"
              :disabled="props.disabled"
            >
              <option v-for="p in palavrasOptions" :key="p" :value="p">
                {{ p }}
              </option>
            </select>

            <div class="form-hint">Selecione uma ou mais palavras-chave (Ctrl/Cmd para seleção múltipla).</div>
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
import { computed, onMounted, reactive, ref, watch, nextTick } from 'vue';
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
const palavrasDisponiveis = ref([]); // pode vir como ["IA", "Web"] OU [{ palavra: "IA" }, ...]
const loadError = ref('');

const local = reactive({
  titulo: '',
  descricao: '',
  status: 'rascunho',
  coorientadores_ids: [],
  alunos_ids: [],
  palavras_chave: []
});

// ===============================
// Regra: Orientador não pode ser coorientador
// ===============================
const auth = useAuthStore();

const orientadorId = computed(() => {
  const u = auth.user || {};
  const id = u.id_docente ?? u.id ?? u.docenteId ?? null;
  return id ? String(id) : null;
});

const docentesCoorientadores = computed(() => {
  const oid = orientadorId.value;
  const list = docentes.value || [];
  if (!oid) return list;
  return list.filter((d) => String(d.id_docente) !== oid);
});

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
// Palavras-chave: normaliza payload do backend
// backend pode retornar:
// - ["IA", "Web"]
// - [{ palavra: "IA" }, { palavra: "Web" }]
// ===============================
const palavrasOptions = computed(() => {
  const raw = palavrasDisponiveis.value || [];
  return raw
    .map((p) => (typeof p === 'string' ? p : p?.palavra))
    .filter((p) => typeof p === 'string' && p.trim().length > 0)
    .map((p) => p.trim());
});

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

// ✅ Alinhado ao Zod do backend:
// - titulo: min 5
// - descricao_objetivos: min 10
const canSubmit = computed(() => {
  return (local.titulo || '').trim().length >= 5 && (local.descricao || '').trim().length >= 10;
});

function clearCoorientadores() {
  local.coorientadores_ids = [];
}

function clearAlunos() {
  local.alunos_ids = [];
}

function clearPalavrasChave(evt) {
  local.palavras_chave = [];

  // Evita o botão ficar "pressionado/cinza" ao virar disabled imediatamente após o clique
  nextTick(() => {
    evt?.currentTarget?.blur?.();
  });
}

async function loadCombos() {
  loadError.value = '';
  try {
    const [doc, alu, pal] = await Promise.all([
      api.get('/api/docentes'),
      api.get('/api/alunos'),
      api.get('/api/palavras-chave')
    ]);

    docentes.value = Array.isArray(doc.data) ? doc.data : [];
    alunos.value = Array.isArray(alu.data) ? alu.data : [];
    palavrasDisponiveis.value = Array.isArray(pal.data) ? pal.data : [];
  } catch (e) {
    loadError.value =
      e?.response?.data?.error ||
      e?.response?.data?.message ||
      e?.message ||
      'Falha ao carregar listas (docentes/alunos/palavras-chave).';
    docentes.value = [];
    alunos.value = [];
    palavrasDisponiveis.value = [];
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
    titulo: (local.titulo || '').trim(),

    // ✅ Envia no campo esperado pelo schema (Zod) do backend
    // O backend ainda tem compatibilidade com "descricao", mas aqui evitamos inconsistência.
    descricao_objetivos: (local.descricao || '').trim(),

    status: local.status,

    coorientadores_ids: filteredCoor.map(String),
    alunos_ids: (local.alunos_ids || []).map(String),
    palavras_chave: (local.palavras_chave || []).map((p) => String(p).trim()).filter(Boolean)
  });
}
</script>
