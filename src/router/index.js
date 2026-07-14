import { createRouter, createWebHistory } from 'vue-router'

import LandingPage from '../components/LandingPage.vue'
import Login from '../components/Login.vue'
import Register from '../components/Register.vue'
import HomeView from '../components/HomeView.vue'
import SearchMechanics from '../components/SearchMechanics.vue'
import MapSearch from '../components/MapSearch.vue'
import HelpView from '../components/HelpView.vue'
import TallerRegister from '../components/TallerRegister.vue' 
import SearchTaller from '../components/SearchTaller.vue'
import PerfilTaller from '../components/PerfilTaller.vue'
import Citas from '../components/Citas.vue'
import MisCitas from '../components/MisCitas.vue'
import Perfil from '../components/Perfil.vue'

const routes = [
  // 1. Cuando entren a la raíz de la página, los mandamos al login directo
  { path: '/', redirect: '/login' }, 
  
  // (Dejamos LandingPage por si después quieres usarla, pero ya no será la principal)
  { path: '/landing', name: 'landing', component: LandingPage },
  
  { path: '/login', name: 'login', component: Login },
  { path: '/register', name: 'register', component: Register },
  { path: '/home', name: 'home', component: HomeView },
  { path: '/search', name: 'search', component: SearchMechanics },
  { path: '/buscarTaller', name: 'buscarTaller', component: SearchTaller },
  { path: '/help', name: 'help', component: HelpView},
  { path: '/maps', name: 'maps', component: MapSearch },
  { path: '/perfiltaller', name: 'perfilTaller', component: PerfilTaller },
  { path: '/miscitas', name: 'miscitas', component: MisCitas },
  { path: '/perfil', name: 'perfil', component: Perfil },
  
  // RUTAS PROTEGIDAS EXCLUSIVAS (Solo para Mecánicos - Rol 2)
  { 
    path: '/taller-register', 
    name: 'taller-register', 
    component: TallerRegister,
    meta: { requiereMecanico: true } 
  },
  { 
    path: '/mis-citas', 
    name: 'mis-citas', 
    component: Citas,
    meta: { requiereMecanico: true } 
  },

  // Si escriben una URL que no existe, los mandamos al login para asegurar
  { path: '/:pathMatch(.*)*', redirect: '/login' } 
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// EL CADENERO VIP: Ahora revisa a absolutamente todos los que intentan navegar
router.beforeEach((to, from, next) => {
  // Sacamos el rol de la mochila (localStorage) para saber si ya iniciaron sesión
  const rolDelUsuario = localStorage.getItem('usuario_rol')
  const estaLogueado = rolDelUsuario !== null && rolDelUsuario !== undefined

  // Definimos cuáles son las ÚNICAS rutas a las que puedes entrar sin cuenta
  const rutasPublicas = ['/login', '/register']
  const vaAUnaRutaPublica = rutasPublicas.includes(to.path)

  // REGLA 1: Si NO estás logueado y tratas de entrar a la plataforma -> Patada al Login
  if (!estaLogueado && !vaAUnaRutaPublica) {
    next('/login')
  } 
  // REGLA 2: Si YA iniciaste sesión e intentas ir al Login o Registro -> Te metemos al Home
  else if (estaLogueado && vaAUnaRutaPublica) {
    next('/home')
  }
  // REGLA 3: Si eres cliente e intentas entrar a cosas de mecánico -> Al Home
  else if (to.meta.requiereMecanico && rolDelUsuario !== '2') {
    next('/home')
  } 
  // REGLA 4: Si todo está en orden -> Pásale
  else {
    next() 
  }
})

export default router