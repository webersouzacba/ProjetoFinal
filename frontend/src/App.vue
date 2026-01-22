<template>
  <div class="app-shell">
    <AppNavbar />
    <main class="container page">
      <RouterView />
    </main>
    <ToastHost />
  </div>
</template>

<script setup>
import AppNavbar from './components/layout/AppNavbar.vue';
import ToastHost from './components/ui/ToastHost.vue';
</script>
