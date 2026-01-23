<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm">
    <div class="container">
      <RouterLink class="navbar-brand fw-semibold" to="/propostas">
        <i class="bi bi-kanban me-2" />Projeto Final
      </RouterLink>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#app-navbar"
        aria-controls="app-navbar"
        aria-expanded="false"
        aria-label="Alternar navegação"
      >
        <span class="navbar-toggler-icon" />
      </button>

      <div id="app-navbar" class="collapse navbar-collapse">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <RouterLink class="nav-link" to="/propostas">
              <i class="bi bi-card-list me-1" />Propostas
            </RouterLink>
          </li>
        </ul>

        <div class="d-flex align-items-center gap-2">
          <RouterLink v-if="!auth.isAuthenticated" class="btn btn-sm btn-outline-light" to="/login">
            <i class="bi bi-box-arrow-in-right me-1" />Entrar
          </RouterLink>

          <div v-else class="d-flex align-items-center gap-2">
            <span class="text-white-50 small d-none d-md-inline">
              <i class="bi bi-person-circle me-1" />{{ displayName }}
            </span>
            <button class="btn btn-sm btn-outline-light" type="button" @click="logout">
              <i class="bi bi-box-arrow-right me-1" />Sair
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import { useUiStore } from '../../stores/ui';

const router = useRouter();
const auth = useAuthStore();
const ui = useUiStore();

const displayName = computed(() => {
  const u = auth.user;
  return u?.name || u?.nome || u?.email || 'Usuário autenticado';
});

function logout() {
  auth.clearSession();
  ui.toast({ kind: 'success', message: 'Sessão encerrada.' });
  router.push('/');
}
</script>

<style scoped>
.navbar-brand {
  letter-spacing: .2px;
}
</style>
