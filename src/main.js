import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/global.less'
import '@/elementUI/index'

import VueQuillEditor from 'vue-quill-editor'

// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import dayjs from 'dayjs'
Vue.prototype.$formatDate = (dataObj) => {
  // 借助dayjs内置的方法把日期对象格式化成指定的格式，并把格式化好的字符串返回到调用处
  return dayjs(dataObj).format('YYYY-MM-DD HH:mm:ss')
}

Vue.use(VueQuillEditor)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
