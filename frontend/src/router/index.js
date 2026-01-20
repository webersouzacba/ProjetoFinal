import { createRouter, createWebHistory } from 'vue-router';

import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';

import PropostasListPage from '../views/propostas/PropostasListPage.vue';
import PropostaDetailPage from '../views/propostas/PropostaDetailPage.vue';
import PropostaFormPage from '../views/propostas/PropostaFormPage.vue';

// Rotas focadas na entidade Proposta (POC - Atividade 5.1)
const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/login', name: 'login', component: LoginView },

  // Público (listagem + detalhe)
  { path: '/propostas', name: 'propostas', component: PropostasListPage },
  { path: '/propostas/:id', name: 'proposta-detail', component: PropostaDetailPage, props: true },

  // Área "minhas propostas" (criar/editar) — exige OAuth/JWT quando ativado
  { path: '/propostas/nova', name: 'proposta-new', component: PropostaFormPage, props: { mode: 'create' } },
  { path: '/propostas/:id/editar', name: 'proposta-edit', component: PropostaFormPage, props: (r) => ({ mode: 'edit', id: r.params.id }) }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
