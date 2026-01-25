<template>
  <div class="container-fluid py-4">
    <!-- Hero (mais limpo) -->
    <div class="card shadow-sm border-0 mb-4">
      <div class="card-body p-4 p-lg-5">
        <div class="row align-items-center g-4">
          <div class="col-12 col-lg-8">
            <div class="d-flex align-items-center gap-2 mb-2 text-muted">
              <i class="bi bi-mortarboard"></i>
              <small>Ambiente acadêmico • Propostas de TCC</small>
            </div>

            <h1 class="h3 mb-2">
              Gestão de Propostas — Temas de Trabalho de Conclusão de Cursos
            </h1>

            <p class="mb-4 text-muted">
              Centralize e publique propostas de temas. Docentes gerenciam propostas; estudantes consultam o catálogo público.
            </p>

            <div class="d-flex flex-wrap gap-2">
              <RouterLink to="/propostas" class="btn btn-primary">
                <i class="bi bi-search me-2"></i>
                Ver propostas públicas
              </RouterLink>

              <RouterLink
                v-if="isAuthenticated"
                to="/propostas/nova"
                class="btn btn-outline-primary"
              >
                <i class="bi bi-plus-circle me-2"></i>
                Criar nova proposta
              </RouterLink>

              <RouterLink
                v-else
                to="/login"
                class="btn btn-outline-secondary"
              >
                <i class="bi bi-box-arrow-in-right me-2"></i>
                Entrar para criar propostas
              </RouterLink>
            </div>

            <div class="mt-4 d-flex flex-wrap gap-2">
              <span class="badge text-bg-light border">
                <i class="bi bi-lightning-charge me-1"></i>
                SPA
              </span>
              <span class="badge text-bg-light border">
                <i class="bi bi-bootstrap me-1"></i>
                Bootstrap 5
              </span>
              <span class="badge text-bg-light border">
                <i class="bi bi-diagram-3 me-1"></i>
                CRUD de Propostas
              </span>
            </div>
          </div>

          <!-- Imagem menor e mais discreta -->
          <div class="col-12 col-lg-4">
            <div class="d-flex justify-content-lg-end">
              <div class="rounded-4 bg-body-tertiary border overflow-hidden hero-illustration">
                <img
                  :src="heroIllustrationUrl"
                  alt="Ilustração conceitual de gestão de propostas acadêmicas"
                  class="w-100 h-100"
                  style="object-fit: cover;"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Indicadores (cards) -->
    <div class="row g-3 mb-4">
      <div class="col-12 col-md-6 col-xl-3">
        <div class="card shadow-sm border-0 h-100">
          <div class="card-body">
            <div class="d-flex align-items-center justify-content-between mb-2">
              <span class="text-muted small">Total de propostas</span>
              <i class="bi bi-collection text-muted"></i>
            </div>
            <div class="display-6 mb-1">{{ fmt(stats.total) }}</div>
            <div class="text-muted small">Visão geral do catálogo</div>
          </div>
        </div>
      </div>

      <div class="col-12 col-md-6 col-xl-3">
        <div class="card shadow-sm border-0 h-100">
          <div class="card-body">
            <div class="d-flex align-items-center justify-content-between mb-2">
              <span class="text-muted small">Publicadas</span>
              <i class="bi bi-check2-circle text-muted"></i>
            </div>
            <div class="display-6 mb-1">{{ fmt(stats.publicadas) }}</div>
            <div class="text-muted small">Disponíveis para consulta</div>
          </div>
        </div>
      </div>

      <div class="col-12 col-md-6 col-xl-3">
        <div class="card shadow-sm border-0 h-100">
          <div class="card-body">
            <div class="d-flex align-items-center justify-content-between mb-2">
              <span class="text-muted small">Rascunho</span>
              <i class="bi bi-pencil-square text-muted"></i>
            </div>
            <div class="display-6 mb-1">{{ fmt(stats.rascunho) }}</div>
            <div class="text-muted small">Em elaboração por docentes</div>
          </div>
        </div>
      </div>

      <div class="col-12 col-md-6 col-xl-3">
        <div class="card shadow-sm border-0 h-100">
          <div class="card-body">
            <div class="d-flex align-items-center justify-content-between mb-2">
              <span class="text-muted small">Orientadores</span>
              <i class="bi bi-person-badge text-muted"></i>
            </div>
            <div class="display-6 mb-1">{{ fmt(stats.orientadores) }}</div>
            <div class="text-muted small">Docentes com propostas</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Como funciona (mantido, porém sem "Dica" e lembrar que removemos recomendações) -->
    <div class="row g-3">
      <div class="col-12">
        <div class="card shadow-sm border-0">
          <div class="card-body">
            <h2 class="h5 mb-3">
              <i class="bi bi-info-circle me-2 text-muted"></i>
              Como funciona
            </h2>

            <div class="row g-3">
              <div class="col-12 col-md-6">
                <div class="p-3 border rounded-4 bg-body-tertiary h-100">
                  <div class="d-flex align-items-center gap-2 mb-2">
                    <i class="bi bi-person-workspace"></i>
                    <strong>Docentes</strong>
                  </div>
                  <ul class="mb-0 text-muted small">
                    <li>Criam propostas com descrição, status e palavras-chave.</li>
                    <li>Podem manter rascunhos e publicar quando pronto.</li>
                    <li>Associam coorientadores e alunos (quando aplicável).</li>
                  </ul>
                </div>
              </div>

              <div class="col-12 col-md-6">
                <div class="p-3 border rounded-4 bg-body-tertiary h-100">
                  <div class="d-flex align-items-center gap-2 mb-2">
                    <i class="bi bi-people"></i>
                    <strong>Estudantes</strong>
                  </div>
                  <ul class="mb-0 text-muted small">
                    <li>Consultam o catálogo público de propostas.</li>
                    <li>Aplicam filtros por status e orientador (quando disponíveis).</li>
                    <li>Identificam temas alinhados aos seus interesses.</li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'

// IMPORT RELATIVO (para não depender do alias @)
import { useAuthStore } from '../stores/auth'

// Ilustração (SVG no assets) - IMPORT RELATIVO
import heroIllustrationUrl from '../assets/illustrations/propostas-hero.svg'

const auth = useAuthStore()
const isAuthenticated = computed(() => !!auth?.isAuthenticated)

const stats = ref({
  total: null,
  publicadas: null,
  rascunho: null,
  orientadores: null,
})

const statsError = ref(false)

function fmt(v) {
  return v === null || v === undefined ? '—' : String(v)
}

onMounted(async () => {
  const base = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:9002').replace(/\/$/, '')
  const url = `${base}/api/propostas/indicadores`

  statsError.value = false

  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()

    stats.value = {
      total: data.total ?? null,
      publicadas: data.publicadas ?? null,
      rascunho: data.rascunho ?? null,
      orientadores: data.orientadores ?? null,
    }
  } catch (e) {
    statsError.value = true
    stats.value = {
      total: null,
      publicadas: null,
      rascunho: null,
      orientadores: null,
    }
  }
})

</script>

<style scoped>
/* Imagem menor e alinhada (desktop) */
.hero-illustration {
  width: 100%;
  max-width: 360px;
  height: 200px;
}

@media (min-width: 992px) {
  .hero-illustration {
    height: 220px;
  }
}
</style>
