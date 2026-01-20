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

      <div class="col-12">
        <label class="form-label">Coorientadores (IDs separados por vírgula)</label>
        <input class="form-control" v-model="coorientadoresText" placeholder="Ex.: 2,3" />
        <div class="form-text">POC: informe IDs existentes de docentes.</div>
      </div>

      <div class="col-12">
        <label class="form-label">Alunos (IDs separados por vírgula)</label>
        <input class="form-control" v-model="alunosText" placeholder="Ex.: 1,4" />
        <div class="form-text">POC: informe IDs existentes de alunos.</div>
      </div>

      <div class="col-12">
        <label class="form-label">Palavras-chave (separadas por vírgula)</label>
        <input class="form-control" v-model="palavrasText" placeholder="Ex.: ia, educação, analytics" />
      </div>

      <div class="col-12 d-flex gap-2">
        <button class="btn btn-primary" type="submit" :disabled="disabled">
          {{ submitLabel }}
        </button>
        <RouterLink class="btn btn-outline-secondary" to="/propostas">Cancelar</RouterLink>
      </div>
    </div>
  </form>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue';

const props = defineProps({
  modelValue: { type: Object, required: true },
  disabled: { type: Boolean, default: false },
  submitLabel: { type: String, default: 'Salvar' }
});

const emit = defineEmits(['submit', 'update:modelValue']);

const local = reactive({
  titulo: '',
  descricao: '',
  status: 'rascunho',
  coorientadores_ids: [],
  alunos_ids: [],
  palavras_chave: []
});

const coorientadoresText = ref('');
const alunosText = ref('');
const palavrasText = ref('');

function parseIds(text) {
  return text
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => Number(s))
    .filter((n) => Number.isFinite(n));
}

function parseWords(text) {
  return text
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function syncFromModel() {
  const m = props.modelValue || {};
  local.titulo = m.titulo ?? '';
  local.descricao = m.descricao ?? '';
  local.status = m.status ?? 'rascunho';
  local.coorientadores_ids = m.coorientadores_ids ?? [];
  local.alunos_ids = m.alunos_ids ?? [];
  local.palavras_chave = m.palavras_chave ?? [];

  coorientadoresText.value = (local.coorientadores_ids || []).join(',');
  alunosText.value = (local.alunos_ids || []).join(',');
  palavrasText.value = (local.palavras_chave || []).join(',');
}

watch(
  () => props.modelValue,
  () => syncFromModel(),
  { immediate: true, deep: true }
);

watch(coorientadoresText, (v) => {
  local.coorientadores_ids = parseIds(v);
});

watch(alunosText, (v) => {
  local.alunos_ids = parseIds(v);
});

watch(palavrasText, (v) => {
  local.palavras_chave = parseWords(v);
});

const payload = computed(() => ({
  titulo: local.titulo,
  descricao: local.descricao,
  status: local.status,
  coorientadores_ids: local.coorientadores_ids,
  alunos_ids: local.alunos_ids,
  palavras_chave: local.palavras_chave
}));

function emitSubmit() {
  emit('submit', payload.value);
}

watch(
  payload,
  (v) => {
    emit('update:modelValue', v);
  },
  { deep: true }
);
</script>
