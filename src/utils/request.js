import axios from 'axios'
import {Loading, Notification} from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  baseURL: 'https://mock.apifox.cn/m1/3405279-0-default',//云端
  // baseURL: 'http://127.0.0.1:4523/m1/3202416-0-default/',//本地
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use( config => {
    if (store.getters.token) {
      config.headers['Authorization'] = 'Bearer ' + getToken()
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use( response => {
    const res = response.data
    if (res.code !== 0) {
      Notification({ title: '请求异常', message:res.message || 'Error', type: 'error', position: 'bottom-left',duration: 5 * 1000, showClose: true })
      // 重新登录
      // if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
      //   MessageBox.confirm('您的登录超时了,请重新登录', '提示', {
      //     confirmButtonText: '重新登录',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      //     store.dispatch('user/resetToken').then(() => {
      //       location.reload()
      //     })
      //   })
      // }
      return Promise.reject(new Error(res.message || 'Error'))
    }
    return res
  }, error => {
    let loadingInstance = Loading.service({ fullscreen: true });
    loadingInstance.close();
    Notification({ title: '网络异常', message:error.message || 'Error', type: 'error', position: 'bottom-left',duration: 5 * 1000, showClose: true })
    return Promise.reject(error)
  }
)

export default service
