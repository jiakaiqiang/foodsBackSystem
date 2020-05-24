// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
//引入elementui
import elemenetui from 'element-ui'
//在引入elemenui的组件样式
import'element-ui/lib/theme-chalk/index.css'
//引入axios
import axios from 'axios'
Vue.use(elemenetui)
Vue.use(axios)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
