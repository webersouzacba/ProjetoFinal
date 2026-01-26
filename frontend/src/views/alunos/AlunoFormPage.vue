<template>
  <div class="container py-4">
    <div class="d-flex align-items-center justify-content-between mb-3">
      <div>
        <h1 class="h3 mb-1">{{ isEdit ? 'Editar Aluno' : 'Novo Aluno' }}</h1>
        <p class="text-muted mb-0">
          {{ isEdit ? 'Atualize os dados do aluno.' : 'Cadastre um novo aluno.' }}
        </p>
      </div>

      <div class="d-flex gap-2">
        <RouterLink class="btn btn-outline-secondary" :to="{ name: 'alunos' }">
          <i class="bi bi-arrow-left me-1"></i> Voltar
        </RouterLink>
      </div>
    </div>

    <div v-if="error" class="alert alert-danger">
      {{ error }}
    </div>

    <div class="card shadow-sm">
      <div class="card-body">
        <form @submit.prevent="submit">
          <div class="row g-3">
            <div class="col-12 col-md-6">
              <label class="form-label">Nome</label>
              <input
                v-model.trim="form.nome"
                type="text"
                class="form-control"
                placeholder="Nome do aluno"
                required
                :disabled="loading"
              />
            </div>

            <div class="col-12 col-md-6">
              <label class="form-label">E-mail</label>
              <input
                v-model.trim="form.email"
                type="email"
                class="form-control"
                placeholder="email@exemplo.com"
                required
                :disabled="loading"
              />
            </div>
          </div>

          <hr class="my-4" />

          <div class="d-flex justify-content-end gap-2">
            <RouterLink class="btn btn-outline-secondary" :to="{ name: 'alunos' }" :disabled="loading">
              Cancelar
            </RouterLink>

            <button type="submit" class="btn btn-primary" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              {{ isEdit ? 'Salvar alterações' : 'Criar aluno' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import api from '../../services/apiClient';

const props = defineProps({
  mode: { type: String, default: 'create' }, // 'create' | 'edit'
  id: { type: [String, Number], default: null }
});

const route = useRoute();
const router = useRouter();

const loading = ref(false);
const error = ref(null);

const form = ref({
  nome: '',
  email: ''
});

// aceita id tanto via props quanto via route (robusto)
const alunoId = computed(() => props.id ?? route.params.id ?? null);

const isEdit = computed(() => props.mode === 'edit' && !!alunoId.value && alunoId.value !== 'novo');

async function loadAluno() {
  error.value = null;
  loading.value = true;
  try {
    const { data } = await api.get(`/api/alunos/${alunoId.value}`);
    form.value = {
      nome: data?.nome ?? '',
      email: data?.email ?? ''
    };
  } catch (e) {
    error.value = e?.response?.data?.error || 'Erro ao carregar aluno.';
  } finally {
    loading.value = false;
  }
}

async function submit() {
  error.value = null;
  loading.value = true;

  try {
    const payload = {
      nome: form.value.nome,
      email: form.value.email
    };

    if (isEdit.value) {
      await api.put(`/api/alunos/${alunoId.value}`, payload);
    } else {
      await api.post('/api/alunos', payload);
    }

    router.push({ name: 'alunos' });
  } catch (e) {
    error.value = e?.response?.data?.error || 'Erro ao salvar aluno.';
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  // só carrega se for edição
  if (isEdit.value) {
    await loadAluno();
  }
});
</script>
