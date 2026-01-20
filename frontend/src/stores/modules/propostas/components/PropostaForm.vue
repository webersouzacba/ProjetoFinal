<template>
  <div class="card">
    <div class="card-body">
      <h2 class="h5 mb-3">{{ title }}</h2>

      <div v-if="submitError" class="alert alert-danger">
        <strong>Erro:</strong> {{ submitError.message }}
      </div>

      <Form :validation-schema="schema" :initial-values="initialValues" @submit="onSubmit">
        <div class="row g-2">
          <div class="col-12">
            <label class="form-label">Título</label>
            <Field name="titulo" class="form-control" />
            <ErrorMessage name="titulo" class="text-danger small" />
          </div>

          <div class="col-12">
            <label class="form-label">Descrição</label>
            <Field name="descricao" as="textarea" rows="4" class="form-control" />
            <ErrorMessage name="descricao" class="text-danger small" />
          </div>

          <div class="col-12 col-md-4">
            <label class="form-label">Status</label>
            <Field name="status" as="select" class="form-select">
              <option value="rascunho">rascunho</option>
              <option value="publicada">publicada</option>
              <option value="atribuida">atribuida</option>
              <option value="encerrada">encerrada</option>
            </Field>
            <ErrorMessage name="status" class="text-danger small" />
          </div>

          <div class="col-12 col-md-4">
            <label class="form-label">ID do Orientador</label>
            <Field name="id_orientador" class="form-control" placeholder="ex.: 1" />
            <ErrorMessage name="id_orientador" class="text-danger small" />
            <small class="text-muted">POC: usado para “minhas propostas” sem OAuth.</small>
          </div>

          <div class="col-12 col-md-4">
            <label class="form-label">Palavras-chave (separadas por vírgula)</label>
            <input v-model="keywordsText" class="form-control" placeholder="ex.: IA, web, dados" />
          </div>

          <div class="col-12 d-flex gap-2 mt-2">
            <button class="btn btn-primary" type="submit" :disabled="submitting">
              {{ submitting ? 'Salvando...' : 'Salvar' }}
            </button>
            <button class="btn btn-outline-secondary" type="button" @click="$emit('cancel')">
              Cancelar
            </button>
          </div>

          <div class="col-12 mt-2">
            <small class="text-muted">
              CRUD depende de endpoints no backend (POST/PUT/DELETE). Se ainda não existirem, o front vai acusar erro — está ok na POC.
            </small>
          </div>
        </div>
      </Form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { Form, Field, ErrorMessage } from 'vee-validate';
import { propostaFormSchema as schema } from '../schemas/propostaSchemas';

const props = defineProps({
  mode: { type: String, required: true }, // 'create' | 'edit'
  initialValues: { type: Object, required: true }
});

const emit = defineEmits(['submit', 'cancel']);

const submitting = ref(false);
const submitError = ref(null);

const keywordsText = ref('');

watch(
  () => props.initialValues,
  (v) => {
    const kws = v?.palavras_chave || v?.proposta_palavras_chave?.map((x) => x.palavra) || [];
    keywordsText.value = Array.isArray(kws) ? kws.join(', ') : '';
  },
  { immediate: true, deep: true }
);

const title = computed(() => (props.mode === 'edit' ? 'Editar Proposta' : 'Nova Proposta'));

async function onSubmit(values) {
  submitError.value = null;
  submitting.value = true;

  try {
    const palavras_chave = keywordsText.value
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      titulo: values.titulo,
      descricao: values.descricao || null,
      status: values.status,
      id_orientador: values.id_orientador,
      palavras_chave
    };

    await emit('submit', payload);
  } catch (err) {
    submitError.value = err?.message ? err : { message: 'Erro ao salvar.' };
  } finally {
    submitting.value = false;
  }
}
</script>
