import { createRouter, createWebHistory } from 'vue-router'

import LandingPage from '../components/LandingPage.vue'
import Login from '../components/Login.vue'
import Register from '../components/Register.vue'
import HomeView from '../components/HomeView.vue'
import SearchMechanics from '../components/SearchMechanics.vue'
import MapSearch from '../components/MapSearch.vue'
import HelpView from '../components/HelpView.vue'

const routes = [
  { path: '/', name: 'landing', component: LandingPage },
  { path: '/login', name: 'login', component: Login },
  { path: '/register', name: 'register', component: Register },
  { path: '/home', name: 'home', component: HomeView },
  { path: '/search', name: 'search', component: SearchMechanics },
  { path: '/mapsearch', name: 'mapsearch', component: MapSearch },
  { path: '/help', name: 'help', component: HelpView},
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
