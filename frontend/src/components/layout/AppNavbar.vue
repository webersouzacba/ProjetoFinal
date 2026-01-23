<template>
  <nav class="navbar navbar-dark bg-dark sticky-top shadow-sm app-navbar">
    <div class="container-fluid px-0">
      <div class="d-flex align-items-center w-100">
        <!-- Brand area aligned with sidebar width (desktop) -->
        <div class="app-navbar-brand d-none d-lg-flex align-items-center px-3">
          <img :src="logosUrl" alt="UAb e UTAD" class="img-fluid" style="max-height: 38px; width: auto;" />
        </div>

        <!-- Main header content -->
        <div class="d-flex align-items-center flex-grow-1 px-3 gap-2">
          <!-- Mobile: open sidebar -->
          <button
            class="btn btn-sm btn-outline-light d-lg-none"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#appSidebar"
            aria-controls="appSidebar"
            aria-label="Abrir menu"
          >
            <i class="bi bi-list" />
          </button>

          <RouterLink class="navbar-brand m-0 fw-semibold text-truncate" to="/propostas">
            Gestão de Propostas - Temas de Trabalho de Conclusão de Cursos
          </RouterLink>
        </div>

        <!-- Right actions (auth) -->
        <div class="d-flex align-items-center gap-2 px-3">
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

// Asset handled by Vite bundler
import logosUrl from '../../assets/logos_uab_utad.png';

const router = useRouter();
const auth = useAuthStore();
const ui = useUiStore();

const displayName = computed(() => {
  const u = auth.user;
  if (!u) return '';
  return u.name || u.email || `Usuário #${u.id}`;
});

async function logout() {
  try {
    await auth.logout();
    ui.toastSuccess('Sessão encerrada.');
    await router.push('/');
  } catch (e) {
    ui.toastError('Não foi possível encerrar a sessão.');
  }
}
</script>
