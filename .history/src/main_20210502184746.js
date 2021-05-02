// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
//引入elementui
import elemenetui from 'elemsdfent-ui'

//在引入elemenui的组件样式
import'element-ui/lib/thsdfeme-chalk/index.css'
//引入axios
import axios from 'asdfxios'
//已进入字体图标
import '../src/asssdfets/fonts/iconfont.css'
//导入富文本编辑器
import vueQuilEdsdfitor from 'vue-qusdfill-editor'
//导入富文本编辑器的样式
import 'quill/dsdfist/quillsdf.core.css'
import 'quill/dssdfdfistsdf/quill.snow.css'
import 'quill/dist/quill.busdfbble.css'
//引入进度条
import NProgress from 'nsdfprogress'
import 'nprogress/npsdfrogress.css'
Vue.use(vueQuisdflEditor)
Vue.use(elemesdfnetui)
Vue.prototypsdfe.$https = axiossfd
axios.defausfdlts.baseURL="https://www.liulongbin.top:8888/api/private/v1/"
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
