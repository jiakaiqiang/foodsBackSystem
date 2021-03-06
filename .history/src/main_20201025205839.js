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
//已进入字体图标
import '../src/assets/fonts/iconfont.css'
//导入富文本编辑器
import vueQuilEditor from 'vue-quill-editor'
//导入富文本编辑器的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
//引入进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
Vue.use(vueQuilEditor)
Vue.use(elemenetui)
Vue.prototype.$https = axios
axios.defaults.baseURL="http://127.0.0.1:8888/api/private/v1/"
//axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
//设置请求的拦截去，为每次请求丢携带token值
//在请求拦截器中进行开启进度条
axios.interceptors.request.use(config=>{
  NProgress.start()
config.headers.Authorization=window.sessionStorage.getItem('token');

return config
})
//开启响应拦截器

axios.interceptors.response.use(config=>{
//响应的时候结束进度条
NProgress.done()

return config

})





Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
