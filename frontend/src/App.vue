<template>
  <div class="min-vh-100 bg-light">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container">
        <RouterLink class="navbar-brand" to="/propostas">Projeto Final</RouterLink>

        <div class="navbar-nav">
          <RouterLink class="nav-link" to="/propostas">Propostas</RouterLink>
        </div>
      </div>
    </nav>

    <main class="container py-4">
      <RouterView />
    </main>
  </div>
</template>
