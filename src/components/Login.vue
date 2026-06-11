<template>
  <div class="login-page">
    <div class="login-card">
      <div class="card-header">
        <div>
          <h1>Iniciar Sesión</h1>
          <p>Ingresa tus credenciales para acceder a tu cuenta</p>
        </div>
        <button class="close-btn" type="button" aria-label="Cerrar">×</button>
      </div>

      <form class="login-form" @submit.prevent="onSubmit">
        <label>
          <span>Correo Electrónico</span>
          <input type="email" placeholder="tu@email.com" />
        </label>

        <label>
          <span>Contraseña</span>
          <input type="password" placeholder="********" />
        </label>

        <button type="submit">Iniciar Sesión</button>
      </form>

      <footer>
        <button type="button" class="text-link" @click="goToRegister">¿No tienes cuenta? Regístrate aquí</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['switch-view', 'login'])
const goToRegister = () => emit('switch-view', 'register')
const onSubmit = () => emit('login')
</script>

<style scoped>
.login-page {
  width: 100%;
  max-width: 540px;
  padding: 24px;
}

.login-card {
  background: white;
  border-radius: 22px;
  box-shadow: 0 24px 48px rgba(15, 23, 42, 0.14);
  padding: 32px;
  border-top: 6px solid #0288d1;
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 28px;
}

.card-header h1 {
  margin: 0;
  font-size: 1.9rem;
  color: #102a43;
}

.card-header p {
  margin: 8px 0 0;
  color: #486581;
  line-height: 1.5;
}

.close-btn {
  border: none;
  background: #f4f7fb;
  color: #334e68;
  width: 36px;
  height: 36px;
  border-radius: 12px;
  font-size: 1.4rem;
  font-weight: 700;
  cursor: pointer;
}

.login-form {
  display: grid;
  gap: 18px;
}

.login-form label {
  display: grid;
  gap: 10px;
  color: #334e68;
  font-size: 0.96rem;
}

.login-form input {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #d9e2ec;
  border-radius: 14px;
  background: #f4f7fb;
}

.login-form input:focus {
  outline: 2px solid rgba(2, 136, 209, 0.25);
  outline-offset: 1px;
}

.login-form button {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 14px;
  background: #0288d1;
  color: white;
  font-weight: 700;
  cursor: pointer;
}

footer {
  margin-top: 22px;
  text-align: center;
}

footer button,
footer a {
  color: #0288d1;
  text-decoration: none;
  font-weight: 600;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
}
</style>
