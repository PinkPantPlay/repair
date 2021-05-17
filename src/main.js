import Vue from 'vue'
import App from './App'

//引入uview框架
import uView from "uview-ui"
Vue.use(uView)

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  ...App
})

//http请求
import httpInterceptor from '@/services/http.interceptor.js'
Vue.use(httpInterceptor, app)

//API接口
import proxy from '@/proxy'
Vue.use(proxy, app)

//引入自定义封装服务
import auth from '@/services/auth.js'
Vue.use(auth, app)



app.$mount()
