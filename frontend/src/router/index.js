// frontend/src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

import DefaultLayout from '../layouts/DefaultLayout.vue'

import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import AuthCallbackView from '../views/AuthCallbackView.vue'
import DocumentosView from '../views/DocumentosView.vue'

import PropostasListPage from '../views/propostas/PropostasListPage.vue'
import PropostaDetailPage from '../views/propostas/PropostaDetailPage.vue'
import PropostaFormPage from '../views/propostas/PropostaFormPage.vue'

import DocentesListPage from '../views/docentes/DocentesListPage.vue'
import DocenteDetailPage from '../views/docentes/DocenteDetailPage.vue'
import DocenteFormPage from '../views/docentes/DocenteFormPage.vue'

import AlunosListPage from '../views/alunos/AlunosListPage.vue'
import AlunoDetailPage from '../views/alunos/AlunoDetailPage.vue'
import AlunoFormPage from '../views/alunos/AlunoFormPage.vue'

import { useAuthStore } from '../stores/auth'
import { useConfigStore } from '../stores/config'

const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      { path: '', name: 'home', component: HomeView },
      { path: 'login', name: 'login', component: LoginView },
      { path: 'auth/callback', name: 'auth-callback', component: AuthCallbackView },

      // Documentos (publico)
      { path: 'documentos', name: 'documentos', component: DocumentosView },

      // Docentes (consulta publica conforme enunciado)
      { path: 'docentes', name: 'docentes', component: DocentesListPage },
      { path: 'docentes/:id', name: 'docente-detail', component: DocenteDetailPage, props: true },

      // Docentes (CRUD)
      { path: 'docentes/novo', name: 'docente-new', component: DocenteFormPage, props: { mode: 'create' } },
      { path: 'docentes/:id/editar', name: 'docente-edit', component: DocenteFormPage, props: (r) => ({ mode: 'edit', id: r.params.id }) },

      // Alunos (CRUD autenticado)
      { path: 'alunos', name: 'alunos', component: AlunosListPage, meta: { requiresAuth: true } },
      { path: 'alunos/novo', name: 'aluno-new', component: AlunoFormPage, props: { mode: 'create' }, meta: { requiresAuth: true } },
      { path: 'alunos/:id/editar', name: 'aluno-edit', component: AlunoFormPage, props: (r) => ({ mode: 'edit', id: r.params.id }), meta: { requiresAuth: true } },
      { path: 'alunos/:id', name: 'aluno-detail', component: AlunoDetailPage, props: true, meta: { requiresAuth: true } },

      // Propostas (autenticado)
      { path: 'propostas', name: 'propostas', component: PropostasListPage, meta: { requiresAuth: true } },
      { path: 'propostas/:id', name: 'proposta-detail', component: PropostaDetailPage, props: true, meta: { requiresAuth: true } },
      { path: 'propostas/nova', name: 'proposta-new', component: PropostaFormPage, props: { mode: 'create' }, meta: { requiresAuth: true } },
      { path: 'propostas/:id/editar', name: 'proposta-edit', component: PropostaFormPage, props: (r) => ({ mode: 'edit', id: r.params.id }), meta: { requiresAuth: true } }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to) => {
  // Sempre tenta carregar config uma vez
  const config = useConfigStore()
  if (!config.isReady && !config.loading) {
    await config.fetchConfig().catch(() => {})
  }

  // ✅ Se auth está DESLIGADO, não bloqueia rotas protegidas
  if (config.isReady && config.authEnabled === false) {
    // Simulação acadêmica: garante um "docente logado" no front-end (id=1)
    // para validar controles de autorização (ex.: só orientador edita proposta).
    const auth = useAuthStore()
    if (!auth.user || auth.token !== 'SIM') {
      await auth.bootstrapSimulatedDocente({ idDocente: 1 }).catch(() => {})
    }
    return true
  }

  // Fluxo normal (auth ligado)
  if (!to.meta?.requiresAuth) return true

  const auth = useAuthStore()

  const v = auth.validateLocalToken()
  if (!v.ok) {
    return {
      name: 'login',
      query: {
        reason: v.reason === 'expired' ? 'session_expired' : 'auth_required',
        redirect: to.fullPath
      }
    }
  }

  if (!auth.user) {
    try {
      await auth.fetchMe()
    } catch {
      return {
        name: 'login',
        query: { reason: 'session_expired', redirect: to.fullPath }
      }
    }
  }

  return true
})

export default router
