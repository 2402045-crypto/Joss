import { createRouter, createWebHistory } from 'vue-router'

import LandingPage from '../components/LandingPage.vue'
import Login from '../components/Login.vue'
import Register from '../components/Register.vue'
import HomeView from '../components/HomeView.vue'
import SearchMechanics from '../components/SearchMechanics.vue'
import MapSearchPage from '../components/map/MapSearchPage.vue'
import HelpView from '../components/HelpView.vue'
import TallerRegister from '../components/TallerRegister.vue' 
import SearchTaller from '../components/SearchTaller.vue'
import PerfilTaller from '../components/PerfilTaller.vue'
import Citas from '../components/Citas.vue'
import MisCitas from '../components/MisCitas.vue'
import Perfil from '../components/Perfil.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/landing', name: 'landing', component: LandingPage },
  { path: '/login', name: 'login', component: Login },
  { path: '/register', name: 'register', component: Register },
  { path: '/home', name: 'home', component: HomeView },
  { path: '/search', name: 'search', component: SearchMechanics },
  { path: '/buscarTaller', name: 'buscarTaller', component: SearchTaller },
  { path: '/help', name: 'help', component: HelpView },
  { path: '/maps', name: 'maps', component: MapSearchPage },
  { path: '/citas', name: 'citas', component: Citas },
  { path: '/perfiltaller', name: 'perfilTaller', component: PerfilTaller },
  { path: '/miscitas', name: 'miscitas', component: MisCitas },
  { path: '/perfil', name: 'perfil', component: Perfil },
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
  { path: '/:pathMatch(.*)*', redirect: '/login' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const rolDelUsuario = localStorage.getItem('usuario_rol')
  const estaLogueado = rolDelUsuario !== null && rolDelUsuario !== undefined

  const rutasPublicas = ['/login', '/register']
  const vaAUnaRutaPublica = rutasPublicas.includes(to.path)

  if (!estaLogueado && !vaAUnaRutaPublica) {
    next('/login')
  } else if (estaLogueado && vaAUnaRutaPublica) {
    next('/home')
  } else if (to.meta.requiereMecanico && rolDelUsuario !== '2') {
    next('/home')
  } else {
    next()
  }
})
export default router