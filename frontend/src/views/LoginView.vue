<template>
  <PageHeader
    title="Acesso de Docentes"
    subtitle="Autenticação via Google OAuth 2.0. Acesso restrito a docentes previamente cadastrados."
  />

  <div class="row justify-content-center">
    <div class="col-12 col-md-9 col-lg-6">
      <div class="card shadow-sm">
        <div class="card-body p-4">
          <div v-if="unauthorized" class="alert alert-danger" role="alert">
            <div class="fw-semibold mb-1">Acesso não autorizado</div>
            <div>
              O e-mail utilizado não está registado como docente nesta aplicação.
              Caso acredite que isto seja um erro, solicite o cadastro ao administrador.
            </div>
          </div>

          <div v-else-if="oauthUnavailable" class="alert alert-warning" role="alert">
            <div class="fw-semibold mb-1">Login indisponível</div>
            <div>
              O serviço de autenticação ainda não está configurado no servidor.
              Tente novamente mais tarde.
            </div>
          </div>

          <div class="alert alert-info" role="alert">
            <div class="fw-semibold mb-1">Como funciona</div>
            <div>
              Utilize sua conta Google cadastrada. Após o login, o sistema valida o e-mail contra a lista de docentes
              registados e aplica as permissões conforme a política de autorização.
            </div>
          </div>

          <div class="d-grid gap-2">
            <button class="btn btn-danger" type="button" @click="login">
              <i class="bi bi-google me-2" />Entrar com Google
            </button>

            <RouterLink class="btn btn-outline-secondary" to="/propostas">
              <i class="bi bi-card-list me-2" />Ver propostas públicas
            </RouterLink>
          </div>

          <div class="mt-3 text-muted small">
            Ao autenticar, você concorda em utilizar a aplicação apenas para fins académicos e de gestão de propostas.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { apiBaseUrl } from '../services/apiBase'
import PageHeader from '../components/layout/PageHeader.vue'

const route = useRoute()

const unauthorized = computed(() => String(route.query.error || '').toLowerCase() === 'unauthorized')
const oauthUnavailable = computed(() => String(route.query.error || '').toLowerCase() === 'oauth_unavailable')

function login() {
  // Preserva rota alvo (quando vindo de uma rota protegida)
  const redirect = route.query.redirect
  if (redirect && typeof redirect === 'string') {
    localStorage.setItem('postLoginRedirect', redirect)
  }
  // navegação para o endpoint do back-end (OAuth)
  window.location.href = `${apiBaseUrl()}/auth/google`
}
</script>
