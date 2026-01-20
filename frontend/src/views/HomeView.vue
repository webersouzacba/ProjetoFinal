<template>
  <div class="container py-4">
    <div class="p-4 bg-light rounded-3 border">
      <h1 class="h4 mb-2">Projeto Final — PWA (MEIW)</h1>
      <p class="mb-3 text-muted">
        Prova de conceito (Atividade 5.1). SPA focado na entidade <strong>Proposta</strong>.
      </p>

      <div class="d-flex gap-2 flex-wrap">
        <RouterLink class="btn btn-primary" to="/propostas">Ir para Propostas</RouterLink>
        <RouterLink class="btn btn-outline-secondary" to="/login">Login (OAuth)</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router';
</script>
