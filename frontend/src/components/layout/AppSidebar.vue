<template>
  <div class="sidebar-root d-flex flex-column">
    <div class="sidebar-brand px-3 py-3 border-bottom">
      <div class="d-flex align-items-center gap-2">
        <span class="brand-mark">PF</span>
        <div class="brand-text">
          <div class="fw-semibold">Projeto Final</div>
          <div class="text-muted small">Propostas</div>
        </div>
      </div>
    </div>

    <nav class="sidebar-nav flex-grow-1 px-2 py-3">
      <ul class="nav nav-pills flex-column gap-1">
        <li class="nav-item">
          <RouterLink class="nav-link" to="/">
            <i class="bi bi-house me-2" />Início
          </RouterLink>
        </li>

        <!-- Propostas -->
        <li v-if="canAccessProtected" class="nav-item">
          <RouterLink class="nav-link" to="/propostas">
            <i class="bi bi-journal-text me-2" />Minhas Propostas
          </RouterLink>
        </li>

        <li v-if="canDoDocenteActions" class="nav-item">
          <RouterLink class="nav-link" to="/propostas/nova">
            <i class="bi bi-plus-circle me-2" />Nova Proposta
          </RouterLink>
        </li>

        <hr class="my-2" />

        <!-- Docentes (público) -->
        <li class="nav-item">
          <RouterLink class="nav-link" to="/docentes">
            <i class="bi bi-people me-2" />Docentes
          </RouterLink>
        </li>

        <li v-if="canDoDocenteActions" class="nav-item">
          <RouterLink class="nav-link" to="/docentes/novo">
            <i class="bi bi-person-plus me-2" />Novo Docente
          </RouterLink>
        </li>

        <!-- Alunos -->
        <li v-if="canAccessProtected" class="nav-item">
          <RouterLink class="nav-link" to="/alunos">
            <i class="bi bi-mortarboard me-2" />Alunos
          </RouterLink>
        </li>

        <li v-if="canDoDocenteActions" class="nav-item">
          <RouterLink class="nav-link" to="/alunos/novo">
            <i class="bi bi-person-plus-fill me-2" />Novo Aluno
          </RouterLink>
        </li>
      </ul>
    </nav>

    <!-- ✅ Toggle + Login/Logout -->
    <div class="sidebar-auth border-top px-2 py-2">
      <!-- Toggle sempre visível -->
      <button
        type="button"
        class="btn btn-link nav-link d-flex align-items-center px-2"
        :class="toggleLinkClass"
        @click="toggleAuth"
        :disabled="config.loading || !config.isReady"
      >
        <i class="bi me-2" :class="toggleIcon" />
        {{ toggleLabel }}
      </button>

      <!-- AUTH ligado: login/logout -->
      <RouterLink v-if="isAuthEnabled && !isLogged" class="nav-link d-flex align-items-center px-2" to="/login">
        <i class="bi bi-box-arrow-in-right me-2" />Login
      </RouterLink>

      <button
        v-else-if="isAuthEnabled && isLogged"
        type="button"
        class="btn btn-link nav-link d-flex align-items-center px-2 text-danger"
        @click="handleLogout"
      >
        <i class="bi bi-box-arrow-right me-2" />Logout
      </button>

      <!-- AUTH desligado: não mostra login/logout -->
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { useConfigStore } from '../../stores/config'

const router = useRouter()
const auth = useAuthStore()
const config = useConfigStore()

const isLogged = computed(() => auth.isAuthenticated)
const isDocente = computed(() => auth.isDocente)
const isAuthEnabled = computed(() => config.isReady && config.authEnabled === true)

// ✅ Se auth desligado, libera áreas protegidas
const canAccessProtected = computed(() => (config.isReady && config.authEnabled === false) || isLogged.value)
const canDoDocenteActions = computed(() => (config.isReady && config.authEnabled === false) || isDocente.value)

const toggleLabel = computed(() => {
  if (!config.isReady) return 'Carregando...'
  return config.authEnabled ? 'Desativar autenticação' : 'Ativar autenticação'
})
const toggleIcon = computed(() => {
  if (!config.isReady) return 'bi-hourglass-split'
  return config.authEnabled ? 'bi-shield-x' : 'bi-shield-lock'
})
const toggleLinkClass = computed(() => {
  if (!config.isReady) return 'text-muted'
  return config.authEnabled ? 'text-secondary' : 'text-warning'
})

function handleLogout() {
  auth.logout()
  router.push({ name: 'login' }).catch(() => {})
}

async function toggleAuth() {
  try {
    const enabled = await config.toggleAuthMode()

    // Sempre limpa sessão local ao alternar
    auth.logout()

    if (enabled) {
      router.push({ name: 'login' }).catch(() => {})
    } else {
      router.push({ name: 'home' }).catch(() => {})
    }
  } catch {
    // mantém estado atual
  }
}

onMounted(async () => {
  if (!config.isReady && !config.loading) {
    await config.fetchConfig().catch(() => {})
  }
})
</script>

<style scoped>
.sidebar-root {
  height: 100%;
  overflow: hidden;
}

.sidebar-nav {
  min-height: 0;
  overflow-y: auto;
}

.brand-mark {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  background: rgba(0, 0, 0, 0.06);
}

.sidebar-auth .nav-link {
  border-radius: 10px;
}

.nav-link.router-link-active {
  font-weight: 600;
}
</style>
