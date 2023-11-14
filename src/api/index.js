import request from '@/utils/request'
import { Notification, Loading } from 'element-ui'
import { getOptions as _getOptions, removeOptions as _removeOptions,getRemoteOptions as _getRemoteOptions, } from '@/utils/init'

/**
 * 快捷post请求
 * @param url 请求地址
 * @param data 请求参数
 * @param isDefault 是否默认提示
 * @returns {*}
 */
export function fastPost(url, data, isDefault = true) {
  return request({ url: url, method: 'post', data }).then((res) => {
    if (isDefault) {
      const messages = res.message
      Notification({ title: '请求结果', message: messages ? messages : 'success', type: 'success', position: 'bottom-left', duration: 3 * 1000, showClose: true})
    }
    return res
  })
}

/**
 * 快捷get请求
 * @param url 请求地址
 * @param params  请求参数
 * @param isDefault   是否默认提示
 * @returns {*}
 */
export function fastGet(url, params, isDefault = true) {
  return request({url: url, method: 'get', params}).then((res) => {
    if (isDefault) { //可以传入false取消提示
      //如果获取不超过,默认返回错误信息
      const messages = res.message
      Notification({ title: '处理结果', message:messages ? messages : 'success', type: 'success', position: 'bottom-left',duration: 3 * 1000, showClose: true})
    }
    return res //返回原来请求结果,可以继续针对结果进行处理
  })
}
/**---------------获取options------------------ */
export function mainInit() {
  return new Promise((resolve, reject) => {
    _getRemoteOptions().then((res)=>{
      resolve(res)
    }).catch((err)=>{
      reject(err)
    })
  })
}

export function removeCache() {
  _removeOptions()
}

export function getOptions() {
  return _getOptions()
}
