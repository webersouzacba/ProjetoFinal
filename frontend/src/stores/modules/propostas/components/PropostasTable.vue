<template>
  <div class="card">
    <div class="card-body">
      <div v-if="loading" class="alert alert-info mb-0">Carregando...</div>

      <div v-else-if="error" class="alert alert-danger mb-0">
        <strong>Erro:</strong> {{ error.message }}
      </div>

      <div v-else-if="!items.length" class="alert alert-secondary mb-0">
        Nenhuma proposta encontrada.
      </div>

      <div v-else class="table-responsive">
        <table class="table table-sm align-middle">
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Status</th>
              <th>Orientador</th>
              <th>Alunos</th>
              <th>Co-orientadores</th>
              <th>Palavras-chave</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="p in items" :key="String(p.id_proposta)">
              <td>{{ p.id_proposta }}</td>
              <td class="text-truncate" style="max-width: 360px">{{ p.titulo }}</td>
              <td><span class="badge text-bg-secondary">{{ p.status }}</span></td>

              <td>
                <div v-if="p.docentes">
                  {{ p.docentes.nome }}
                  <div class="text-muted small">{{ p.docentes.email }}</div>
                </div>
                <span v-else class="text-muted">—</span>
              </td>

              <td>{{ (p.proposta_alunos || []).length }}</td>
              <td>{{ (p.proposta_coorientadores || []).length }}</td>
              <td>{{ (p.proposta_palavras_chave || []).length }}</td>

              <td class="text-end">
                <RouterLink class="btn btn-sm btn-outline-primary" :to="`/propostas/${p.id_proposta}`">
                  Ver
                </RouterLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <small class="text-muted d-block mt-2">
        IDs podem vir como string (BigInt). Isso é esperado na POC.
      </small>
    </div>
  </div>
</template>

<script setup>
defineProps({
  items: { type: Array, required: true },
  loading: { type: Boolean, default: false },
  error: { type: Object, default: null }
});
</script>
