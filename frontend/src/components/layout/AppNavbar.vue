<template>
  <nav class="navbar navbar-expand-lg navbar-dark app-navbar">
    <div class="container-fluid">
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
        <!-- ✅ Toggle acadêmico de autenticação (sempre visível) -->
        <button
          class="btn btn-sm"
          :class="toggleBtnClass"
          type="button"
          @click="toggleAuth"
          :disabled="config.loading || !config.isReady"
          :title="toggleTitle"
        >
          <i class="bi me-1" :class="toggleIcon" />
          {{ toggleLabel }}
        </button>

        <!-- AUTH ligado: login/logout normal -->
        <template v-if="config.isReady && config.authEnabled === true">
          <RouterLink v-if="!isLogged" class="btn btn-outline-light btn-sm" to="/login">
            <i class="bi bi-box-arrow-in-right me-1" />Login
          </RouterLink>

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
        </template>

        <!-- AUTH desligado (DEV): simula docente id=1 e mostra indicação visual -->
        <template v-else-if="config.isReady && config.authEnabled === false">
          <div class="dropdown">
            <button
              class="btn btn-outline-warning btn-sm dropdown-toggle d-flex align-items-center"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              title="Simulação acadêmica (DEV): Docente ID=1"
            >
              <i class="bi bi-person-badge me-2" />
              <span class="d-none d-sm-inline">DEV: {{ displayName }}</span>
            </button>

            <ul class="dropdown-menu dropdown-menu-end">
              <li class="px-3 py-2">
                <div class="fw-semibold">{{ displayName }}</div>
                <div class="text-muted small">{{ displayEmail }}</div>
                <div class="text-muted small">Perfil: {{ displayRole }}</div>
                <div class="text-muted small">Simulação acadêmica (DEV)</div>
              </li>
            </ul>
          </div>
        </template>
      </div>
    </div>
  </nav>
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

const displayName = computed(() => {
  const u = auth.user
  if (!u) return 'Utilizador'
  return u.nome || u.name || u.email || 'Utilizador'
})
const displayEmail = computed(() => auth.user?.email || '—')
const displayRole = computed(() => auth.user?.role || '—')

const toggleLabel = computed(() => {
  if (!config.isReady) return 'Carregando...'
  return config.authEnabled ? 'Desativar autenticação' : 'Ativar autenticação'
})
const toggleIcon = computed(() => {
  if (!config.isReady) return 'bi-hourglass-split'
  return config.authEnabled ? 'bi-shield-x' : 'bi-shield-lock'
})
const toggleBtnClass = computed(() => {
  if (!config.isReady) return 'btn-outline-light'
  return config.authEnabled ? 'btn-outline-secondary' : 'btn-outline-warning'
})
const toggleTitle = computed(() => {
  if (!config.isReady) return 'Carregando configuração...'
  return config.authEnabled
    ? 'Modo OAuth/JWT ligado: clique para voltar ao modo DEV (acadêmico)'
    : 'Modo DEV ligado: clique para ativar OAuth/JWT'
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
      // Foi para AUTH: direciona para login (fluxo Google)
      router.push({ name: 'login' }).catch(() => {})
    } else {
      // Foi para DEV: simula docente id=1 e volta para home
      await auth.bootstrapDevDocente({ idDocente: 1 }).catch(() => {})
      router.push({ name: 'home' }).catch(() => {})
    }
  } catch {
    // Sem barulho: mantém estado atual
  }
}

onMounted(async () => {
  if (!config.isReady && !config.loading) {
    await config.fetchConfig().catch(() => {})
  }

  // Se auth ligado, mantém seu comportamento normal de restaurar sessão
  if (config.authEnabled === true) {
    const v = auth.validateLocalToken()
    if (!v.ok) return

    if (auth.token && !auth.user) {
      try {
        await auth.fetchMe()
      } catch {
        auth.logout()
        router.push({ name: 'login', query: { reason: 'session_expired' } }).catch(() => {})
      }
    }
  }

  // Se auth desligado (DEV), garante sessão simulada para UI consistente
  if (config.authEnabled === false) {
    await auth.bootstrapDevDocente({ idDocente: 1 }).catch(() => {})
  }
})
</script>

<style scoped>
.app-navbar {
  background: #1f2a33;
}
</style>
