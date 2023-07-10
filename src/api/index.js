import request from '@/utils/request'

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

// 发送登录请求
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

// 获取用户详细信息
export const getUserInfoAPI = () => {
  return request({
    url: '/my/userinfo',
    methods: 'GET'
  })
}

// 获取侧边栏列表信息
export const getMenusListApi = () => {
  return request({
    url: '/my/menus',
    method: 'GET'
  })
}

export const updateUserInfoAPI = ({ id, username, nickname, email, user_pic }) => {
  return request({
    url: '/my/userinfo',
    method: 'PUT',
    data: {
      id,
      username,
      nickname,
      email,
      user_pic
    }
  })
}
export const updateUserAvatarAPI = (avatar) => {
  return request({
    url: '/my/update/avatar',
    method: 'PATCH',
    data: {
      avatar
    }
  })
}
