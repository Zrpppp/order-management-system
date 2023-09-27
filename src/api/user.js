import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login/byUserName',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/userInfo',
    method: 'get',
    // params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/login/logout',
    method: 'get'
  })
}
