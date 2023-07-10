import request from '@/utils/request'
import store from '@/store'

export const registerAPI = ({ username, password, repassword }) => {
  // 这里先用这个接口测试下, 如果url以http开头会忽略baseURL, axios直接请求此地址
  return request({
    url: '/api/reg',
    method: 'POST',
    data: {
      username,
      password,
      repassword
    }
  })
}
export const loginAPI = ({ username, password }) => {
  return request({
    url: '/api/login',
    method: 'POST',
    data: {
      username,
      password
    }
  })
}

export const getUserInfoAPI = () => {
  return request({
    url: '/my/userinfo',
    methods: 'GET',
    headers: {
      Authorization: store.state.token
    }
  })
}

export const getMenusListApi = () => {
  return request({
    url: '/my/menus',
    method: 'GET',
    headers: {
      Authorization: store.state.token
    }
  })
}
