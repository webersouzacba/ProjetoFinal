<template>
  <form class="card mb-3" @submit.prevent="onApply">
    <div class="card-body">
      <div class="d-flex align-items-center gap-2 mb-3">
        <i class="bi bi-funnel" />
        <h2 class="h6 mb-0">Filtros</h2>
      </div>

    <div class="row g-2 align-items-end">
      <div class="col-12 col-md-3">
        <label class="form-label">Status</label>
        <select class="form-select" v-model="local.status">
          <option value="">(todos)</option>
          <option value="rascunho">rascunho</option>
          <option value="publicada">publicada</option>
          <option value="atribuida">atribuida</option>
          <option value="encerrada">encerrada</option>
        </select>
      </div>

      <div class="col-12 col-md-3">
        <label class="form-label">Orientador (ID)</label>
        <input
          class="form-control"
          v-model.trim="local.orientador_id"
          placeholder="ex.: 1"
          inputmode="numeric"
        />
      </div>

      <div class="col-12 col-md-6 d-flex gap-2">
        <button class="btn btn-primary" type="submit">
          <i class="bi bi-check2 me-1" />Aplicar
        </button>
        <button class="btn btn-outline-secondary" type="button" @click="onReset">
          <i class="bi bi-x-lg me-1" />Limpar
        </button>
      </div>
    </div>
    </div>
  </form>
</template>

<script setup>
import { reactive, watch } from 'vue';

const props = defineProps({
  filtros: { type: Object, required: true }
});

const emit = defineEmits(['apply', 'reset']);

const local = reactive({
  status: props.filtros.status || '',
  orientador_id: props.filtros.orientador_id || ''
});

watch(
  () => props.filtros,
  (f) => {
    local.status = f.status || '';
    local.orientador_id = f.orientador_id || '';
  },
  { deep: true }
);

function onApply() {
  emit('apply', { status: local.status, orientador_id: local.orientador_id });
}

function onReset() {
  local.status = '';
  local.orientador_id = '';
  emit('reset');
}
</script>
