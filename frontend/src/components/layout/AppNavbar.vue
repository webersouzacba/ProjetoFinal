<template>
  <nav class="navbar navbar-expand-lg navbar-dark app-navbar">
    <div class="container-fluid">
      <!-- Botão menu (mobile offcanvas) -->
      <button
        class="btn btn-outline-light d-lg-none me-2"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#appSidebar"
        aria-controls="appSidebar"
      >
        <i class="bi bi-list" />
      </button>

      <span class="navbar-brand d-flex align-items-center gap-2">
        <span class="fw-semibold">Gestão de Propostas</span>
        <span class="opacity-75 d-none d-md-inline">- Temas de Trabalho de Conclusão de Cursos</span>
      </span>

      <div class="ms-auto d-flex align-items-center gap-2">
        <!-- Não autenticado -->
        <RouterLink v-if="!isLogged" class="btn btn-outline-light btn-sm" to="/login">
          <i class="bi bi-box-arrow-in-right me-1" />Login
        </RouterLink>

        <!-- Autenticado -->
        <div v-else class="dropdown">
          <button
            class="btn btn-outline-light btn-sm dropdown-toggle d-flex align-items-center"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i class="bi bi-person-circle me-2" />
            <span class="d-none d-sm-inline">{{ displayName }}</span>
          </button>

          <ul class="dropdown-menu dropdown-menu-end">
            <li class="px-3 py-2">
              <div class="fw-semibold">{{ displayName }}</div>
              <div class="text-muted small">{{ displayEmail }}</div>
              <div class="text-muted small">Perfil: {{ displayRole }}</div>
            </li>

            <li><hr class="dropdown-divider" /></li>

            <li>
              <button class="dropdown-item text-danger" type="button" @click="handleLogout">
                <i class="bi bi-box-arrow-right me-2" />Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const auth = useAuthStore()

const isLogged = computed(() => !!auth?.token)

const displayName = computed(() => {
  const u = auth?.user
  if (!u) return 'Utilizador'
  return u.nome || u.name || u.email || 'Utilizador'
})

const displayEmail = computed(() => auth?.user?.email || '—')
const displayRole = computed(() => auth?.user?.role || '—')

function handleLogout () {
  if (auth?.logout) auth.logout()
  router.push({ name: 'login' }).catch(() => {})
}

// Opcional: tenta carregar /me se houver token mas user ainda não está preenchido
onMounted(async () => {
  if (auth?.token && !auth?.user && auth?.fetchMe) {
    try {
      await auth.fetchMe()
    } catch {
      // token ruim: limpa e força login
      if (auth?.logout) auth.logout()
      router.push({ name: 'login' }).catch(() => {})
    }
  }
})
</script>

<style scoped>
.app-navbar {
  background: #1f2a33;
}
</style>
