<template>
  <div class="d-flex align-items-center justify-content-between mb-3">
    <h1 class="h4 mb-0">{{ isEdit ? 'Editar Proposta' : 'Nova Proposta' }}</h1>
    <RouterLink class="btn btn-sm btn-outline-secondary" to="/propostas">Voltar</RouterLink>
  </div>

  <PropostaForm
    :mode="isEdit ? 'edit' : 'create'"
    :initial-values="initialValues"
    @submit="handleSubmit"
    @cancel="goBack"
  />

  <div v-if="toast" class="alert mt-3" :class="toast.kind === 'ok' ? 'alert-success' : 'alert-danger'">
    {{ toast.message }}
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { usePropostasStore } from '../../stores/propostasStore';
import PropostaForm from './components/PropostaForm.vue';

const props = defineProps({ id: { type: String, default: null } });

const router = useRouter();
const store = usePropostasStore();

const toast = ref(null);
const isEdit = computed(() => !!props.id);

const initialValues = ref({
  titulo: '',
  descricao: '',
  status: 'rascunho',
  coorientadores_ids: [],
  alunos_ids: [],
  palavras_chave: []
});

onMounted(async () => {
  if (!isEdit.value) return;

  const p = await store.fetchPublicDetail(props.id);
  if (p) {
    initialValues.value = {
      titulo: p.titulo || '',
      descricao: p.descricao || '',
      status: p.status || 'rascunho',
      coorientadores_ids: (p.proposta_coorientadores || []).map((x) => String(x.id_docente)),
      alunos_ids: (p.proposta_alunos || []).map((x) => String(x.id_aluno)),
      palavras_chave: (p.proposta_palavras_chave || []).map((x) => x.palavra)
    };
  }
});

function goBack() {
  router.push('/propostas');
}

async function handleSubmit(payload) {
  toast.value = null;

  try {
    if (isEdit.value) {
      await store.updateMine(props.id, payload);
      toast.value = { kind: 'ok', message: 'Proposta atualizada.' };
    } else {
      await store.createMine(payload);
      toast.value = { kind: 'ok', message: 'Proposta criada.' };
    }

    await store.fetchPublic();
    router.push('/propostas');
  } catch (err) {
    toast.value = { kind: 'err', message: err?.message || 'Falha ao salvar.' };
  }
}
</script>
