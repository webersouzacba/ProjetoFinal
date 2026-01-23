<template>
  <div class="app-shell">
    <AppNavbar />

    <div class="app-body">
      <!-- Sidebar (desktop) -->
      <aside class="app-sidebar d-none d-lg-flex border-end">
        <AppSidebar />
      </aside>

      <!-- Main content -->
      <main class="app-main" role="main">
        <div class="container py-4">
          <RouterView />
        </div>
      </main>
    </div>

    <AppFooter />
    <ToastHost />

    <!-- Sidebar (mobile offcanvas) -->
    <div
      id="appSidebar"
      class="offcanvas offcanvas-start d-lg-none"
      tabindex="-1"
      aria-labelledby="appSidebarLabel"
    >
      <div class="offcanvas-header">
        <h5 id="appSidebarLabel" class="offcanvas-title">
          <i class="bi bi-kanban me-2" />Menu
        </h5>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Fechar"></button>
      </div>
      <div class="offcanvas-body p-0">
        <AppSidebar />
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router';
import AppNavbar from '../components/layout/AppNavbar.vue';
import AppFooter from '../components/layout/AppFooter.vue';
import AppSidebar from '../components/layout/AppSidebar.vue';
import ToastHost from '../components/ui/ToastHost.vue';
</script>
