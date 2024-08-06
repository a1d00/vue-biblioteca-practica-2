import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import GeneroView from '../views/genero/GeneroView'
import LibroView from '../views/libro/LibroView'

import store from '../store/index'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },

  {
    path: '/libro',
    name: 'libro',
    component: LibroView,
    
  },
  {
    path: '/genero',
    name: 'genero',
    component: GeneroView,
    
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {

  if (to.matched.some(record => record.meta.requiresAuth)) {
    const userRole = store.getters.rol;
    console.log('guard', userRole);
    if (to.meta.role.includes(userRole)) {
      next();
    } else {
      next('/login'); // Redirigir a la página de inicio si no tiene permisos
    }
  } else {
    next(); // Asegúrate de llamar a next()
  }
});

export default router
