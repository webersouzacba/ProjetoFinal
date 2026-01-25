<template>
  <aside class="app-sidebar d-flex flex-column">
    <div class="app-sidebar__brand px-3 py-3 border-bottom">
      <div class="d-flex align-items-center gap-2">
        <span class="brand-mark">PF</span>
        <div class="brand-text">
          <div class="fw-semibold">Projeto Final</div>
          <div class="text-muted small">Propostas</div>
        </div>
      </div>
    </div>

    <nav class="app-sidebar__nav flex-grow-1 px-2 py-3">
      <ul class="nav nav-pills flex-column gap-1">
        <li class="nav-item">
          <RouterLink class="nav-link" to="/">
            <i class="bi bi-house me-2" />
            Início
          </RouterLink>
        </li>

        <li class="nav-item">
          <RouterLink class="nav-link" to="/docentes">
            <i class="bi bi-people me-2" />
            Docentes
          </RouterLink>
        </li>

        <li class="nav-item">
          <RouterLink class="nav-link" to="/propostas">
            <i class="bi bi-journal-text me-2" />
            Propostas
          </RouterLink>
        </li>

        <li class="nav-item">
          <RouterLink class="nav-link" to="/propostas/nova">
            <i class="bi bi-plus-circle me-2" />
            Nova Proposta
          </RouterLink>
        </li>

        <li class="nav-item mt-2">
          <RouterLink class="nav-link" to="/login">
            <i class="bi bi-box-arrow-in-right me-2" />
            Login
          </RouterLink>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped>
/* Evita scrollbar “desnecessária” no container do sidebar */
.app-sidebar {
  height: 100vh;
  overflow: hidden;
}

/* Importante em layouts flex: permite que o nav calcule altura corretamente */
.app-sidebar__nav {
  min-height: 0;
  overflow-y: auto;
}

/* Mantém header fixo sem encolher */
.app-sidebar__brand {
  flex: 0 0 auto;
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

.app-sidebar__nav .nav-link {
  border-radius: 10px;
}

.app-sidebar__nav .nav-link.router-link-active {
  font-weight: 600;
}
</style>
