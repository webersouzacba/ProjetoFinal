<template>
  <nav class="app-sidebar-nav">
    <div class="px-3 pt-3 pb-2 text-uppercase small text-muted fw-semibold">Navegação</div>

    <ul class="nav nav-pills flex-column gap-1 px-2 pb-3">
      <li class="nav-item">
        <RouterLink class="nav-link" to="/">
          <i class="bi bi-house-door me-2" />Início
        </RouterLink>
      </li>

      <li class="nav-item">
        <RouterLink class="nav-link" to="/propostas">
          <i class="bi bi-card-list me-2" />Propostas
        </RouterLink>
      </li>

      <li class="nav-item" v-if="auth.isAuthenticated">
        <RouterLink class="nav-link" to="/propostas/nova">
          <i class="bi bi-plus-circle me-2" />Nova proposta
        </RouterLink>
      </li>
    </ul>

    <div class="mt-auto px-3 pb-3">
      <div class="small text-muted">
        <div class="fw-semibold text-body">Projeto Final — PWA</div>
        <div class="d-flex align-items-center gap-2 mt-1">
          <span class="badge text-bg-light border">
            <i class="bi bi-lightning-charge me-1" />SPA
          </span>
          <span class="badge text-bg-light border">
            <i class="bi bi-bootstrap me-1" />Bootstrap 5
          </span>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '../../stores/auth';
const auth = useAuthStore();
</script>
