<template>
  <div class="app-shell">
    <AppNavbar />

    <main class="app-main" role="main">
      <div class="container py-4">
        <RouterView />
      </div>
    </main>

    <AppFooter />
    <ToastHost />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router';
import AppNavbar from '../components/layout/AppNavbar.vue';
import AppFooter from '../components/layout/AppFooter.vue';
import ToastHost from '../components/ui/ToastHost.vue';
</script>
