<template>
  <div class="toast-host">
    <div
      v-for="t in ui.toasts"
      :key="t.id"
      class="alert shadow-sm mb-2 d-flex align-items-start gap-2"
      :class="alertClass(t.kind)"
      role="alert"
    >
      <i :class="iconClass(t.kind)" />
      <div class="flex-grow-1">
        {{ t.message }}
      </div>
      <button type="button" class="btn-close" aria-label="Fechar" @click="ui.dismissToast(t.id)" />
    </div>
  </div>
</template>

<script setup>
import { useUiStore } from '../../stores/ui';

const ui = useUiStore();

function alertClass(kind) {
  switch (kind) {
    case 'success':
      return 'alert-success';
    case 'warning':
      return 'alert-warning';
    case 'danger':
      return 'alert-danger';
    default:
      return 'alert-info';
  }
}

function iconClass(kind) {
  switch (kind) {
    case 'success':
      return 'bi bi-check-circle';
    case 'warning':
      return 'bi bi-exclamation-triangle';
    case 'danger':
      return 'bi bi-x-circle';
    default:
      return 'bi bi-info-circle';
  }
}
</script>

<style scoped>
.toast-host {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 1080;
  width: min(420px, calc(100vw - 2rem));
}

.alert {
  border: 1px solid rgba(17, 24, 39, .12);
}
</style>
