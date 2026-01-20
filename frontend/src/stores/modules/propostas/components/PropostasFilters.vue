<template>
  <div class="card mb-3">
    <div class="card-body">
      <form class="row g-2" @submit.prevent="apply">
        <div class="col-12 col-md-4">
          <label class="form-label">Status</label>
          <select v-model="local.status" class="form-select">
            <option value="">(todos)</option>
            <option value="rascunho">rascunho</option>
            <option value="publicada">publicada</option>
            <option value="atribuida">atribuida</option>
            <option value="encerrada">encerrada</option>
          </select>
        </div>

        <div class="col-12 col-md-4">
          <label class="form-label">Minhas propostas (orientador_id)</label>
          <input v-model="local.orientador_id" class="form-control" placeholder="ex.: 1" />
        </div>

        <div class="col-12 col-md-4 d-flex align-items-end gap-2">
          <button class="btn btn-primary w-100" type="submit">Aplicar</button>
          <button class="btn btn-outline-secondary w-100" type="button" @click="reset">Limpar</button>
        </div>
      </form>

      <small class="text-muted d-block mt-2">
        Backend: <code>/api/propostas?status=...</code> e <code>&amp;orientador_id=...</code>
      </small>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue';

const props = defineProps({
  filtros: { type: Object, required: true }
});
const emit = defineEmits(['apply', 'reset']);

const local = reactive({ status: '', orientador_id: '' });

watch(
  () => props.filtros,
  (f) => {
    local.status = f.status || '';
    local.orientador_id = f.orientador_id || '';
  },
  { immediate: true, deep: true }
);

function apply() {
  emit('apply', { ...local });
}

function reset() {
  emit('reset');
}
</script>
