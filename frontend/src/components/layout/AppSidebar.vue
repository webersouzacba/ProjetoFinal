<template>
  <div class="sidebar-root d-flex flex-column">
    <!-- Brand -->
    <div class="sidebar-brand px-3 py-3 border-bottom">
      <div class="d-flex align-items-center gap-2">
        <span class="brand-mark">PF</span>
        <div class="brand-text">
          <div class="fw-semibold">Projeto Final</div>
          <div class="text-muted small">Propostas</div>
        </div>
      </div>
    </div>

    <!-- Nav -->
    <nav class="sidebar-nav flex-grow-1 px-2 py-3">
      <ul class="nav nav-pills flex-column gap-1">
        <li class="nav-item">
          <RouterLink class="nav-link" to="/">
            <i class="bi bi-house me-2" />Início
          </RouterLink>
        </li>

        <li class="nav-item">
          <RouterLink class="nav-link" to="/propostas">
            <i class="bi bi-journal-text me-2" />Propostas
          </RouterLink>
        </li>

        <li v-if="canManage" class="nav-item">
          <RouterLink class="nav-link" to="/propostas/nova">
            <i class="bi bi-plus-circle me-2" />Nova Proposta
          </RouterLink>
        </li>

        <hr class="my-2" />

        <li class="nav-item">
          <RouterLink class="nav-link" to="/docentes">
            <i class="bi bi-people me-2" />Docentes
          </RouterLink>
        </li>

        <li v-if="canManage" class="nav-item">
          <RouterLink class="nav-link" to="/docentes/novo">
            <i class="bi bi-person-plus me-2" />Novo Docente
          </RouterLink>
        </li>

        <li class="nav-item">
          <RouterLink class="nav-link" to="/alunos">
            <i class="bi bi-mortarboard me-2" />Alunos
          </RouterLink>
        </li>

        <li v-if="canManage" class="nav-item">
          <RouterLink class="nav-link" to="/alunos/novo">
            <i class="bi bi-person-plus-fill me-2" />Novo Aluno
          </RouterLink>
        </li>
      </ul>
    </nav>

    <!-- Auth action -->
    <div class="sidebar-auth border-top px-2 py-2">
      <!-- Não autenticado -->
      <RouterLink v-if="!isLogged" class="nav-link d-flex align-items-center px-2" to="/login">
        <i class="bi bi-box-arrow-in-right me-2" />Login
      </RouterLink>

      <!-- Autenticado -->
      <button
        v-else
        type="button"
        class="btn btn-link nav-link d-flex align-items-center px-2 text-danger"
        @click="handleLogout"
      >
        <i class="bi bi-box-arrow-right me-2" />Logout
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const auth = useAuthStore()

const isLogged = computed(() => !!auth?.token)
const canManage = computed(() => !!auth?.token && auth?.user?.role === 'DOCENTE')

function handleLogout () {
  if (auth?.logout) auth.logout()
  router.push({ name: 'login' }).catch(() => {})
}
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
