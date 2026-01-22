<template>
  <div class="card">
    <div class="card-body p-4">
      <h1 class="h4 mb-2">Projeto Final — PWA (MEIW)</h1>
      <p class="mb-3 text-muted">
        SPA focada na entidade <strong>Proposta</strong>, com integração full-stack.
      </p>

      <div class="d-flex gap-2 flex-wrap">
        <RouterLink class="btn btn-primary" to="/propostas">
          <i class="bi bi-arrow-right-circle me-1" />Ir para Propostas
        </RouterLink>
        <RouterLink class="btn btn-outline-secondary" to="/login">
          <i class="bi bi-box-arrow-in-right me-1" />Login (OAuth)
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router';
</script>
