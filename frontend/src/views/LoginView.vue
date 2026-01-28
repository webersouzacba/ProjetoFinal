<template>
  <div class="row justify-content-center">
    <div class="col-12 col-md-10 col-lg-7 col-xl-6">
      <div class="text-center mb-4">
        <h2 class="fw-bold mb-1">Acesso de Docentes</h2>
        <p class="text-muted mb-0">
          Autenticação via Google OAuth 2.0. Acesso restrito a docentes previamente cadastrados.
        </p>
      </div>

      <!-- Mensagem de erro vinda do backend: /login?error=...&code=... -->
      <div v-if="oauthError" class="alert alert-danger border-0 mb-3" role="alert">
        <div class="d-flex gap-2 align-items-start">
          <i class="bi bi-exclamation-triangle-fill fs-5"></i>
          <div>
            <div class="fw-semibold mb-1">Não foi possível concluir o login</div>
            <div class="small">{{ oauthError }}</div>
            <div v-if="oauthCode" class="small text-muted mt-1">Código: {{ oauthCode }}</div>
          </div>
        </div>
      </div>

      <div class="card shadow-sm">
        <div class="card-body p-4">
          <div class="alert alert-info border-0 mb-4">
            <div class="d-flex gap-2">
              <i class="bi bi-info-circle-fill fs-5"></i>
              <div>
                <div class="fw-semibold mb-1">Como funciona</div>
                <div class="small">
                  Utilize uma conta Google cadastrada como docente. Se a conta não estiver registada, cadastre primeiro
                  em <span class="fw-semibold">Docentes</span> (bootstrap académico) e tente novamente.
                </div>
              </div>
            </div>
          </div>

          <div class="d-flex align-items-center justify-content-between mb-3">
            <div class="small text-muted">
              <span class="me-1">Modo:</span>
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

            <div v-if="!isAuthEnabled" class="alert alert-warning border-0 mb-0">
              <div class="d-flex gap-2">
                <i class="bi bi-shield-exclamation fs-5"></i>
                <div class="small">
                  A autenticação está <span class="fw-semibold">desativada</span>.
                  O sistema opera em <span class="fw-semibold">simulação académica</span> (Docente ID=1) para testes funcionais.
                </div>
              </div>
            </div>
          </div>

          <div class="mt-4">
            <div class="small text-muted">
              <i class="bi bi-mortarboard me-1"></i>
              Aplicação desenvolvida como projeto académico no âmbito da UC <span class="fst-italic">Programação Web Avançada</span>.
            </div>
          </div>
        </div>
      </div>

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
  return config.authEnabled ? 'Google OAuth2 (JWT)' : 'Simulação académica (Docente ID=1)'
})

const message = computed(() => {
  const reason = route.query?.reason
  if (reason === 'session_expired') return 'Sua sessão expirou. Faça login novamente.'
  if (reason === 'auth_required') return 'Acesso restrito. Faça login para continuar.'
  return ''
})

const oauthError = computed(() => {
  const err = route.query?.error
  return typeof err === 'string' && err.trim().length ? err : ''
})

const oauthCode = computed(() => {
  const code = route.query?.code
  return typeof code === 'string' && code.trim().length ? code : ''
})

function resolveBackendOrigin() {
  const raw = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:9002').trim()
  const base = raw.replace(/\/+$/, '')
  return base.replace(/\/api$/, '') || 'http://localhost:9002'
}

function loginWithGoogle() {
  const origin = resolveBackendOrigin()
  window.location.href = `${origin}/auth/google`
}

onMounted(async () => {
  if (!config.isReady && !config.loading) {
    await config.fetchConfig().catch(() => {})
  }
})
</script>
