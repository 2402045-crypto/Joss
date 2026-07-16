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
  background:
    radial-gradient(circle at top left, rgba(255, 255, 255, 0.7), transparent 28%),
    linear-gradient(180deg, #e8f5fc 0%, #d9ecf8 45%, #c9dff0 100%);
}

.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background:
    radial-gradient(circle at top left, rgba(255, 255, 255, 0.55), transparent 28%),
    linear-gradient(180deg, #e8f5fc 0%, #d9ecf8 45%, #c9dff0 100%);
}

.content-shell {
  width: 100%;
  max-width: 1320px;
  display: flex;
  justify-content: center;
  align-items: stretch;
  min-width: 0;
  padding: 32px 24px 60px;
  background: transparent;
}

@media (max-width: 768px) {
  .content-shell {
    padding: 20px 14px 40px;
  }
}
</style>
