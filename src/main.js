import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/common.css'
import './assets/fonts/iconfont.css'
// 导入axios包
import axios from 'axios'
// 配置请求拦截器
axios.interceptors.request.use(config => {
  // 把后端登录时发来的token令牌绑定在请求头上。用来做后端权限的识别
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// 把axios包挂在到vue原型上
Vue.prototype.$http = axios
// 设置axios请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
