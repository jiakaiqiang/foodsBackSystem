import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/login'
import Home from '@/components/home'
import Welcome from '@/components/HelloWorld'
import User from '@/components/user/user'
import order from '@/components/order/index'
import roles from '@/components/roles/index'
import report from '@/components/report/index'
import project from '@/components/project/index'
import role from '@/components/roles/roles'
import categories from '@/components/project/categories'
import params from '@/components/project/params'
import add from '@/components/project/add'
Vue.use(Router)

const routers = new Router({
  routes: [
    { path: '/', redirect: '/login' },
    {
      path: '/login',
      component: Login
    },
<<<<<<< HEAD
    {
      path: '/home',
     
      component: Home,
      children: [
        // { path: '/home', redirect: '/welcome' },
        { path: '/welcome', component: Welcome },
        { path: '/users', component: User },
        { path: '/goods', component: project },
=======
    {      path: '/home',

      component: Home,
      children: [
        { path: '/home', redirect: '/welcome' },

       
>>>>>>> 770ef4ee6cb3440edf0bb54063985e3c2b0b8099
        { path: '/roles', component: roles },
        { path: '/reports', component: report },

        { path: '/rights', component: role },
        { path: '/categories', component: categories },
        {path:'/params',component:params},
        {path:'/add',component:add}
      ]
    }
  ]
})

routers.beforeEach((to, from, next) => {
  if (to.path === '/login') next()
  const setoken = window.sessionStorage.getItem('token')
  if (!setoken) {
    next('/login')
  } else {
    next()
  }
})
export default routers
