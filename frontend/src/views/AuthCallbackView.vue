<template>
  <section style="max-width: 720px; margin: 2rem auto; padding: 1rem;">
    <h1>Autenticando...</h1>

    <p v-if="error" style="color:#b00020; margin-top: 0.75rem;">
      {{ error }}
    </p>

    <p v-else style="margin-top: 0.75rem;">
      Concluindo login, aguarde.
    </p>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const error = ref('');

onMounted(async () => {
  try {
    const token = route.query.token;

    if (!token || typeof token !== 'string') {
      error.value = 'Token não encontrado no retorno do login.';
      setTimeout(() => router.replace({ name: 'login' }), 1200);
      return;
    }

    // ✅ padronizado com apiClient e router guard
    auth.setToken(token);

    // redirect opcional (se veio do guard)
    const redirect = route.query.redirect;
    if (redirect && typeof redirect === 'string') {
      router.replace(redirect);
      return;
    }

    router.replace({ name: 'propostas' });
  } catch (e) {
    error.value = 'Falha ao concluir autenticação.';
    setTimeout(() => router.replace({ name: 'login' }), 1200);
  }
});
</script>
