import { createRouter, createWebHistory } from 'vue-router';

import DefaultLayout from '../layouts/DefaultLayout.vue';

import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import AuthCallbackView from '../views/AuthCallbackView.vue';

import PropostasListPage from '../views/propostas/PropostasListPage.vue';
import PropostaDetailPage from '../views/propostas/PropostaDetailPage.vue';
import PropostaFormPage from '../views/propostas/PropostaFormPage.vue';

import { useAuthStore } from '../stores/auth';

// Rotas focadas na entidade Proposta (POC - Atividade 5.1)
const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      { path: '', name: 'home', component: HomeView },
      { path: 'login', name: 'login', component: LoginView },

      // Callback do OAuth (backend redireciona para cá com ?token=...)
      { path: 'auth/callback', name: 'auth-callback', component: AuthCallbackView },

      // Público (listagem + detalhe)
      { path: 'propostas', name: 'propostas', component: PropostasListPage },
      { path: 'propostas/:id', name: 'proposta-detail', component: PropostaDetailPage, props: true },

      // Área "minhas propostas" (criar/editar) — exige OAuth/JWT quando ativado
      {
        path: 'propostas/nova',
        name: 'proposta-new',
        component: PropostaFormPage,
        props: { mode: 'create' },
        meta: { requiresAuth: true }
      },
      {
        path: 'propostas/:id/editar',
        name: 'proposta-edit',
        component: PropostaFormPage,
        props: (r) => ({ mode: 'edit', id: r.params.id }),
        meta: { requiresAuth: true }
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to) => {
  if (!to.meta?.requiresAuth) return true;

  // ✅ DEV sem autenticação
  const authEnabled = String(import.meta.env.VITE_AUTH_ENABLED ?? 'true').toLowerCase() !== 'false';
  if (!authEnabled) return true;

  // ✅ Entrega com autenticação
  const auth = useAuthStore();
  if (auth?.token) return true;

  return { name: 'login', query: { redirect: to.fullPath } };
});

export default router;
