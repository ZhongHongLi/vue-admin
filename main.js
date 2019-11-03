import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import './assets/css/global.css'
import './plugins/element.js'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
//引入字体图表库
import './assets/fonts/iconfont.css'
Vue.use(ElementUI)



import axios from 'axios'
//挂载后直接可以this.$http请求
Vue.prototype.$http=axios
//配置请求的根路径
axios.defaults.baseURL="http://127.0.0.1:8888/api/private/v1/"
//设置拦截器
axios.interceptors.request.use(config=>{
  //为请求对象，添加token验证的Authorization字段
  config.headers.Authorization=window.sessionStorage.getItem('token')
  return config 
})




Vue.config.productionTip = false
    
new Vue({
  router,
  render: h => h(App)
  
}).$mount('#app')