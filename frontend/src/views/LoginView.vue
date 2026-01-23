<template>
  <PageHeader title="Login" subtitle="Autenticação via Google OAuth 2.0 (delegada ao back-end)." />

  <div class="card">
    <div class="card-body">

    <div v-if="errorMsg" class="alert alert-warning" role="alert">
      {{ errorMsg }}
    </div>

    <div class="alert alert-info" role="alert">
      <div class="mb-2">
        Este projeto usa o fluxo OAuth2 do Google no <strong>back-end</strong>. Se as variáveis
        <code>GOOGLE_CLIENT_ID</code>/<code>GOOGLE_CLIENT_SECRET</code> não estiverem configuradas,
        o endpoint <code>/auth/google</code> retorna <strong>503</strong>.
      </div>
      <div class="mb-0">
        Quando estiver configurado, clique no botão abaixo para iniciar o login.
      </div>
    </div>

    <button class="btn btn-danger" type="button" @click="login">
      <i class="bi bi-google me-1" />Entrar com Google
    </button>

    <hr class="my-4" />

    <p class="text-muted mb-1">
      Estado do token (apenas para POC):
    </p>
    <pre class="bg-light p-3 rounded border small mb-0">{{ tokenPreview }}</pre>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { apiBaseUrl } from '../services/apiBase';
import PageHeader from '../components/layout/PageHeader.vue';

const route = useRoute();

function login() {
  // abre o endpoint do back-end (não é XHR; é navegação)
  window.location.href = `${apiBaseUrl()}/auth/google`;
}



const errorMsg = computed(() => {
  const e = String(route.query.error || '');
  if (e === 'unauthorized') return 'A sua conta Google não está autorizada como docente neste sistema.';
  if (e === 'auth_failed') return 'Falha ao autenticar com Google. Tente novamente.';
  return '';
});
const tokenPreview = computed(() => {
  const t = localStorage.getItem('token');
  return t ? `${t.slice(0, 18)}...` : '(sem token)';
});
</script>