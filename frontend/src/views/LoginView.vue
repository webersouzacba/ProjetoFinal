<template>
  <div class="row justify-content-center">
    <div class="col-12 col-md-10 col-lg-7 col-xl-6">
      <div class="text-center mb-4">
        <h2 class="fw-bold mb-1">Acesso de Docentes</h2>
        <p class="text-muted mb-0">
          Autenticação via Google OAuth 2.0. Acesso restrito a docentes previamente cadastrados.
        </p>
      </div>

      <div class="card shadow-sm">
        <div class="card-body p-4">
          <div class="alert alert-info border-0 mb-4">
            <div class="d-flex gap-2">
              <i class="bi bi-info-circle-fill fs-5"></i>
              <div>
                <div class="fw-semibold mb-1">Como funciona</div>
                <div class="small">
                  Utilize sua conta Google cadastrada. Após o login, o sistema valida o e-mail contra a
                  lista de docentes registados e aplica as permissões conforme a política de autorização.
                </div>
              </div>
            </div>
          </div>

          <!-- Opção B: Modo de autenticação -->
          <div class="d-flex align-items-center justify-content-between mb-3">
            <div class="small text-muted">
              <span class="me-1">Modo de autenticação:</span>
              <span class="fw-semibold">{{ authModeLabel }}</span>
            </div>

            <span v-if="config.loading" class="badge text-bg-light">
              <i class="bi bi-arrow-repeat me-1"></i>Carregando
            </span>
          </div>

          <div class="d-grid gap-2">
            <button
              class="btn btn-danger btn-lg"
              type="button"
              @click="loginWithGoogle"
              :disabled="!isAuthEnabled || config.loading"
              title="Entrar com Google"
            >
              <i class="bi bi-google me-2"></i>
              Entrar com Google
            </button>

            <!-- Quando auth está desligado, orienta o avaliador/aluno -->
            <div v-if="!isAuthEnabled" class="alert alert-warning border-0 mb-0">
              <div class="d-flex gap-2">
                <i class="bi bi-shield-exclamation fs-5"></i>
                <div class="small">
                  A autenticação está <span class="fw-semibold">desativada (modo DEV)</span>.
                  Você pode ativá-la pelo botão de alternância no menu superior/lateral.
                </div>
              </div>
            </div>
          </div>

          <!-- Opção A: Nota académica discreta -->
          <div class="mt-4">
            <div class="small text-muted">
              <i class="bi bi-mortarboard me-1"></i>
              Nota: Esta aplicação foi desenvolvida como projeto académico no âmbito da unidade curricular
              <span class="fst-italic">Programação Web Avançada</span>. As funcionalidades destinam-se
              exclusivamente à demonstração de autenticação, autorização e gestão de propostas.
            </div>
          </div>
        </div>
      </div>

      <!-- Mensagem opcional de erro (se você já usa query params no router) -->
      <div v-if="message" class="alert alert-secondary border-0 mt-3">
        <i class="bi bi-exclamation-circle me-2"></i>{{ message }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useConfigStore } from '../stores/config'

const route = useRoute()
const config = useConfigStore()

const isAuthEnabled = computed(() => config.isReady && config.authEnabled === true)

const authModeLabel = computed(() => {
  if (!config.isReady) return 'Carregando...'
  return config.authEnabled ? 'OAuth Google (JWT)' : 'DEV (bypass académico)'
})

const message = computed(() => {
  const reason = route.query?.reason
  if (reason === 'session_expired') return 'Sua sessão expirou. Faça login novamente.'
  if (reason === 'auth_required') return 'Acesso restrito. Faça login para continuar.'
  return ''
})

function loginWithGoogle() {
  // Em modo AUTH, redireciona para o backend iniciar o fluxo OAuth
  // Ajuste a URL base se necessário (ou use variável de ambiente já existente no seu projeto)
  window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google`
}

onMounted(async () => {
  if (!config.isReady && !config.loading) {
    await config.fetchConfig().catch(() => {})
  }
})
</script>

<style scoped>
/* Mantém a tela limpa e “madura” */
.card {
  border-radius: 14px;
}
</style>
