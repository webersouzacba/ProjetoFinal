<template>
  <span class="badge" :class="klass">{{ label }}</span>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  value: { type: String, default: '' }
});

const label = computed(() => props.value || '—');

const klass = computed(() => {
  switch ((props.value || '').toLowerCase()) {
    case 'rascunho':
      return 'text-bg-secondary';
    case 'publicada':
      return 'text-bg-primary';
    case 'atribuida':
      return 'text-bg-success';
    case 'encerrada':
      return 'text-bg-dark';
    default:
      return 'text-bg-light text-dark border';
  }
});
</script>