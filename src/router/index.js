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

const routes = [
  { path: '/', name: 'landing', component: LandingPage },
  { path: '/login', name: 'login', component: Login },
  { path: '/register', name: 'register', component: Register },
  { path: '/home', name: 'home', component: HomeView },
  { path: '/search', name: 'search', component: SearchMechanics },
  { path: '/buscarTaller', name: 'buscarTaller', component: SearchTaller },
  { path: '/help', name: 'help', component: HelpView},
   { path: '/taller-register', name: 'taller-register', component: TallerRegister },
  { path: '/maps', name: 'maps', component: MapSearch },
  { path: '/perfiltaller', name: 'perfil', component: PerfilTaller },
  
  // RUTAS PROTEGIDAS (Solo para Mecánicos - Rol 2)
  { 
    path: '/taller-register', 
    name: 'taller-register', 
    component: TallerRegister,
    meta: { requiereMecanico: true } // <-- Esta es la etiqueta de seguridad
  },
  
  { 
    path: '/mis-citas', 
    name: 'mis-citas', 
    component: Citas,
    meta: { requiereMecanico: true } 
  },

  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// EL CADENERO: Revisa quién eres antes de dejarte pasar a una página
router.beforeEach((to, from, next) => {
  const rolDelUsuario = localStorage.getItem('usuario_rol')

  // Si la página a la que vas tiene la etiqueta de "requiereMecanico"
  if (to.meta.requiereMecanico) {
    // Si tu rol no es 2 (Mecánico), te pateamos al inicio
    if (rolDelUsuario !== '2') {
      next('/home') 
    } else {
      next() // Si sí eres mecánico, pasas
    }
  } else {
    next() // Si es una página normal (como ayuda o inicio), pasas directo
  }
})

export default router