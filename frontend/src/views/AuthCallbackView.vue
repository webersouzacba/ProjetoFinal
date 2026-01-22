<template>
  <PageHeader title="Autenticando" subtitle="Concluindo login via Google OAuth 2.0." />

  <div class="card">
    <div class="card-body">
      <div v-if="error" class="alert alert-danger mb-0">
        {{ error }}
      </div>
      <div v-else class="d-flex align-items-center gap-2 text-muted">
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
        Processando...
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useUiStore } from '../stores/ui';

import PageHeader from '../components/layout/PageHeader.vue';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const ui = useUiStore();

const error = ref('');

onMounted(async () => {
  try {
    const token = route.query.token;

    if (!token || typeof token !== 'string') {
      error.value = 'Token não encontrado no retorno do login.';
      return;
    }

    auth.setToken(token);
    ui.toast({ kind: 'success', message: 'Login realizado.' });

    const redirect = route.query.redirect;
    if (redirect && typeof redirect === 'string') {
      router.replace(redirect);
      return;
    }

    router.replace({ name: 'propostas' });
  } catch (e) {
    error.value = 'Falha ao concluir autenticação.';
    ui.toast({ kind: 'danger', message: error.value, timeout: 5500 });
  }
});
</script>