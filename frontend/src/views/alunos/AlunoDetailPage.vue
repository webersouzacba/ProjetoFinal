<template>
  <div>
    <PageHeader
      title="Detalhe do Aluno"
      subtitle="Informações do aluno (CRUD autenticado)."
    >
      <template #actions>
        <RouterLink class="btn btn-outline-secondary" to="/alunos">
          <i class="bi bi-arrow-left me-1" />Voltar
        </RouterLink>

        <RouterLink
          class="btn btn-outline-primary"
          :to="`/alunos/${props.id}/editar`"
        >
          <i class="bi bi-pencil me-1" />Editar
        </RouterLink>

        <button
          class="btn btn-outline-danger"
          type="button"
          :disabled="deleting"
          @click="handleDelete"
        >
          <span v-if="deleting" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
          <i v-else class="bi bi-trash me-1" />Excluir
        </button>
      </template>
    </PageHeader>

    <div v-if="error" class="alert alert-danger" role="alert">
      {{ error }}
    </div>

    <div v-else-if="loading" class="text-muted">Carregando…</div>

    <div v-else class="card shadow-sm">
      <div class="card-body">
        <div class="d-flex flex-wrap align-items-start justify-content-between gap-3">
          <div>
            <h2 class="h5 mb-1">{{ alunoNome }}</h2>
            <div class="text-muted"><i class="bi bi-envelope me-1" />{{ alunoEmail }}</div>
          </div>

          <div class="text-muted small">
            <span class="badge text-bg-light border">ID: {{ alunoId }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import PageHeader from '../../components/layout/PageHeader.vue'
import { deleteAluno, getAlunoById, normalizeApiError } from '../../services/api'
import { useUiStore } from '../../stores/ui'

const props = defineProps({
  id: { type: String, required: true }
})

const router = useRouter()
const ui = useUiStore()

const loading = ref(false)
const error = ref(null)
const aluno = ref(null)
const deleting = ref(false)

const alunoNome = computed(() => (aluno.value && aluno.value.nome) ? aluno.value.nome : '—')
const alunoEmail = computed(() => (aluno.value && aluno.value.email) ? aluno.value.email : 'E-mail não informado')
const alunoId = computed(() => (aluno.value && aluno.value.id_aluno) ? aluno.value.id_aluno : '—')

async function fetchAluno () {
  loading.value = true
  error.value = null
  try {
    const data = await getAlunoById(props.id)
    aluno.value = data || null
  } catch (e) {
    error.value = normalizeApiError(e).message || 'Falha ao carregar aluno.'
  } finally {
    loading.value = false
  }
}

async function handleDelete () {
  if (!aluno.value?.id_aluno) return
  const ok = window.confirm('Confirma a exclusão deste aluno?')
  if (!ok) return

  deleting.value = true
  try {
    await deleteAluno(String(aluno.value.id_aluno))
    ui.toast({ kind: 'success', message: 'Aluno excluído com sucesso.' })
    router.push('/alunos')
  } catch (e) {
    const msg = normalizeApiError(e).message || 'Falha ao excluir aluno.'
    ui.toast({ kind: 'danger', message: msg, timeout: 5500 })
  } finally {
    deleting.value = false
  }
}

onMounted(fetchAluno)
</script>
