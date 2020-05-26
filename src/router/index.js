import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/login'
import Home from '@/components/home'
Vue.use(Router)

const routers = new Router({
  routes: [
    { path: '/', redirect: '/login' },
    {
      path: '/login',
      component: Login
    },
    { path: '/home', component: Home }
  ]
})

routers.beforeEach((to, from, next) => {
  if (to.path === '/login') next()
  const setoken = window.sessionStorage.getItem('token')

  if (!setoken) {
    next('/login');
  } else {
    next()
  }
})
export default routers
