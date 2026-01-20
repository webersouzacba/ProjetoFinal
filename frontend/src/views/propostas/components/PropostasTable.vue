<template>
  <div class="card">
    <div class="card-body">
      <div v-if="loading" class="text-muted">Carregando...</div>

      <div v-else-if="error" class="alert alert-danger" role="alert">
        {{ error }}
      </div>

      <div v-else>
        <div v-if="!items?.length" class="text-muted">Nenhuma proposta encontrada.</div>

        <div v-else class="table-responsive">
          <table class="table table-sm align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>Título</th>
                <th>Status</th>
                <th>Orientador</th>
                <th style="width: 1%"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in items" :key="p.id_proposta">
                <td>{{ p.id_proposta }}</td>
                <td>{{ p.titulo }}</td>
                <td><span class="badge text-bg-secondary">{{ p.status }}</span></td>
                <td>{{ p.docentes?.nome || '-' }}</td>
                <td class="text-end">
                  <RouterLink class="btn btn-sm btn-outline-primary" :to="`/propostas/${p.id_proposta}`">
                    Detalhes
                  </RouterLink>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  items: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  error: { type: String, default: '' }
});
</script>
