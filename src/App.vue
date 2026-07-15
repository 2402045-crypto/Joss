<template>
  <div class="app-shell">
    <NavBar />

    <main class="content-shell">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import NavBar from './components/NavBar.vue'
</script>

<style>
:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
}

body {
  margin: 0;
  min-height: 100vh;
  background: #eff7fb;
}

.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #eff7fb;
}

.content-shell {
  width: 100%;
  max-width: 1320px;
  display: flex;
  justify-content: center;
  align-items: stretch;
  min-width: 0;
  padding: 32px 24px 60px;
}

@media (max-width: 768px) {
  .content-shell {
    padding: 20px 14px 40px;
  }
}
</style>
