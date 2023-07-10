import axios from 'axios'
import store from '@/store'

// 创建一个自定的axios方法(比原axios多了个基地址)
// axios函数请求的url地址前面会被拼接基地址, 然后axios请求baseURL+url后台完整地址
const myAxios = axios.create({
  baseURL: 'http://big-event-vue-api-t.itheima.net'
})
myAxios.interceptors.request.use(function (config) {
  // 请求前触发一次
  // 它返回给axios内源码，config配置对象（要请求后台的参数都在这个对象上）

  // 在发起时,同意添加请求头AutrAuthorization
  // 判断，登陆页面和注册页面，vuex里无token，而且登录接口和注册接口也不需要携带token（其他页面需要）
  if (store.state.token) {
    config.headers.Authorization = store.state.token
  }
  return config
}, function (error) {
  // 请求发起前的代码，如果有异常报错，会直接进入这里
  // 返回一个拒绝状态的Promise对象（axios留在原地的Promsie对象状态就为失败，结果就为error变量值）
  // 此函数类似catch函数（）里return
  // 口诀：return非promise对象值，会作为成功的结果，返回给下一个Promise对象（axios留在原地）
  // 口诀：return Promise对象，这个Promise对象状态，返回给下一个Promise对象
  // Promise.reject（） 原地留下一个新的Promise对象（状态失败）
  return Promise.reject(error)
})
// 导出自定义的axios方法, 供外面调用传参发请求
export default myAxios
