<template>
  <div class="app-shell">
    <AppNavbar />

    <div class="app-body">
      <aside class="app-sidebar d-none d-lg-flex border-end">
        <AppSidebar />
      </aside>

      <main class="app-main" role="main">
        <div class="container py-4">
          <RouterView />
        </div>
      </main>
    </div>

    <AppFooter />
    <ToastHost />

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
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import AppNavbar from '../components/layout/AppNavbar.vue'
import AppFooter from '../components/layout/AppFooter.vue'
import AppSidebar from '../components/layout/AppSidebar.vue'
import ToastHost from '../components/ui/ToastHost.vue'
import { useConfigStore } from '../stores/config'

const config = useConfigStore()

onMounted(async () => {
  if (!config.isReady && !config.loading) {
    await config.fetchConfig().catch(() => {})
  }
})
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.app-body {
  flex: 1 1 auto;
  display: flex;
  min-height: 0;
}

.app-sidebar {
  width: 260px;
  flex: 0 0 260px;
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

.app-main {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
}
</style>
