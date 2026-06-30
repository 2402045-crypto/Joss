<template>
  <div class="login-page">
    
    <div v-if="showSuccessMessage" class="modal-overlay">
      <div class="modal-content">
        <div class="success-icon">👋</div>
        <h2>¡Bienvenido a MecanicWeb!</h2>
        <p>Iniciando sesión, por favor espera...</p>
      </div>
    </div>

    <div class="login-card">
      <div class="card-header">
        <div>
          <h1>Iniciar Sesión</h1>
          <p>Ingresa tus credenciales para acceder a tu cuenta</p>
        </div>
        <button class="close-btn" type="button" aria-label="Cerrar">×</button>
      </div>
      
      <form class="login-form" @submit.prevent="handleLogin">
        <label>
          <span>Correo Electrónico</span>
          <input type="email" v-model="formData.email" placeholder="tu@email.com" required />
        </label>

        <label>
          <span>Contraseña</span>
          <input type="password" v-model="formData.password" placeholder="********" required />
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const emit = defineEmits(['login'])

// Variables reactivas
const showSuccessMessage = ref(false)
const formData = ref({
  email: '',
  password: ''
})

const goToRegister = () => router.push('/register')

const handleLogin = async () => {
  try {
    // Lógica dinámica para la URL
    const esLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    const API_URL = esLocal 
      ? 'http://localhost/Joss/api/login_usuario.php' 
      : 'https://mecanicweb.free.nf/api/login_usuario.php'

    // Mandamos las credenciales al PHP usando la URL detectada
    const respuesta = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData.value)
    })

    const resultado = await respuesta.json()

    // Revisamos la respuesta
    if (resultado.status === 'success') {
      showSuccessMessage.value = true
      
      setTimeout(() => {
        showSuccessMessage.value = false
        router.push('/home')
        emit('login')
      }, 1500)

    } else {
      alert("Error: " + resultado.message)
    }

  } catch (error) {
    console.error('Error de conexión:', error)
    alert('Hubo un problema al conectar con el servidor')
  }
}
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
  color: #4e6833;
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
  color: #102a43;
  font-family: inherit;
}

.login-form input:focus {
  outline: none;
  border-color: #0288d1;
  background: #ffffff;
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
  transition: all 0.3s ease;
}

.login-form button:hover {
  background: #0277bd;
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(2, 136, 209, 0.3);
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

/* Estilos para el modal de éxito */
.modal-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(2, 8, 23, 0.45);
  z-index: 60;
}

.modal-content {
  background: white;
  padding: 28px;
  border-radius: 16px;
  max-width: 400px;
  width: 92%;
  text-align: center;
  box-shadow: 0 24px 48px rgba(15, 23, 42, 0.12);
  border: 1px solid rgba(2, 136, 209, 0.08);
}

.success-icon {
  font-size: 2.8rem;
  margin-bottom: 8px;
}

.modal-content h2 {
  color: #102a43;
  margin-bottom: 8px;
}

.modal-content p {
  color: #627d98;
}
</style>