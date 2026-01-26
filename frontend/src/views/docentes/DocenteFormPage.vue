<template>
  <div class="container py-4">
    <div class="d-flex align-items-center justify-content-between mb-3">
      <div>
        <h1 class="h3 mb-1">{{ isEdit ? 'Editar Docente' : 'Novo Docente' }}</h1>
        <p class="text-muted mb-0">
          {{ isEdit ? 'Atualize os dados do docente.' : 'Cadastre um novo docente.' }}
        </p>
      </div>

      <div class="d-flex gap-2">
        <RouterLink class="btn btn-outline-secondary" :to="{ name: 'docentes' }">
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
                placeholder="Nome do docente"
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
            <RouterLink class="btn btn-outline-secondary" :to="{ name: 'docentes' }" :disabled="loading">
              Cancelar
            </RouterLink>

            <button type="submit" class="btn btn-primary" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              {{ isEdit ? 'Salvar alterações' : 'Criar docente' }}
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
const docenteId = computed(() => props.id ?? route.params.id ?? null);

const isEdit = computed(() => props.mode === 'edit' && !!docenteId.value && docenteId.value !== 'novo');

async function loadDocente() {
  error.value = null;
  loading.value = true;
  try {
    const { data } = await api.get(`/api/docentes/${docenteId.value}`);
    form.value = {
      nome: data?.nome ?? '',
      email: data?.email ?? ''
    };
  } catch (e) {
    // mantém padrão simples (mensagem humana)
    error.value = e?.response?.data?.error || 'Erro ao carregar docente.';
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
      await api.put(`/api/docentes/${docenteId.value}`, payload);
    } else {
      await api.post('/api/docentes', payload);
    }

    router.push({ name: 'docentes' });
  } catch (e) {
    error.value = e?.response?.data?.error || 'Erro ao salvar docente.';
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  // só carrega se for edição
  if (isEdit.value) {
    await loadDocente();
  }
});
</script>
