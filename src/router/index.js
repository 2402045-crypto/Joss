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
  { path: '/citas', name: 'citas', component: Citas },
  { path: '/perfiltaller', name: 'perfil', component: PerfilTaller },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
