<template>
  <div class="text-center py-5">
    <div class="mb-3">
      <i :class="icon" class="text-muted" style="font-size: 2.25rem" />
    </div>
    <h2 class="h6 mb-1">{{ title }}</h2>
    <p v-if="subtitle" class="text-muted mb-3">{{ subtitle }}</p>
    <div v-if="$slots.actions" class="d-flex justify-content-center">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  icon: { type: String, default: 'bi bi-inbox' }
});
</script>
