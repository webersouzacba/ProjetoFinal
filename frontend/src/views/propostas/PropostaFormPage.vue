<template>
  <PageHeader
    :title="isEdit ? 'Editar proposta' : 'Nova proposta'"
    subtitle="Preencha os campos principais e associe coorientadores, alunos e palavras-chave."
  >
    <template #actions>
      <RouterLink class="btn btn-outline-secondary" to="/propostas">
        <i class="bi bi-arrow-left me-1" />Voltar
      </RouterLink>
    </template>
  </PageHeader>

  <PropostaForm
    :mode="isEdit ? 'edit' : 'create'"
    :initial-values="initialValues"
    :disabled="saving"
    @submit="handleSubmit"
    @cancel="goBack"
  />
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { usePropostasStore } from '../../stores/propostasStore';
import { useUiStore } from '../../stores/ui';

import PageHeader from '../../components/layout/PageHeader.vue';
import PropostaForm from './components/PropostaForm.vue';

const props = defineProps({ id: { type: String, default: null } });

const router = useRouter();
const store = usePropostasStore();
const ui = useUiStore();

const saving = ref(false);
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
  if (!p) {
    ui.toast({ kind: 'warning', message: 'Proposta não encontrada.' });
    router.push('/propostas');
    return;
  }

  initialValues.value = {
    titulo: p.titulo || '',
    descricao: p.descricao || '',
    status: p.status || 'rascunho',
    coorientadores_ids: (p.proposta_coorientadores || []).map((x) => String(x.id_docente)),
    alunos_ids: (p.proposta_alunos || []).map((x) => String(x.id_aluno)),
    palavras_chave: (p.proposta_palavras_chave || []).map((x) => x.palavra)
  };
});

function goBack() {
  router.push('/propostas');
}

async function handleSubmit(payload) {
  saving.value = true;
  try {
    if (isEdit.value) {
      await store.updateMine(props.id, payload);
      ui.toast({ kind: 'success', message: 'Proposta atualizada com sucesso.' });
    } else {
      await store.createMine(payload);
      ui.toast({ kind: 'success', message: 'Proposta criada com sucesso.' });
    }

    await store.fetchPublic();
    router.push('/propostas');
  } catch (e) {
    const msg = e?.response?.data?.error || e?.message || 'Falha ao salvar a proposta.';
    ui.toast({ kind: 'danger', message: msg, timeout: 5500 });
  } finally {
    saving.value = false;
  }
}
</script>