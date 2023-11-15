import { storage, session } from '/src/utils/storage.js'
import {fastGet} from "@/api";
const init = 'init'
export function getRemoteOptions() {
  return new Promise((resolve, reject) => {
    console.log('远程读取Options')
    fastGet('/sys/init', {},false).then((res => {
      if (res.code !== 0) return reject(res.message)
      setOptions(res.data)
      resolve(res.data)
    }))
  })
}
export function getOptions() {
  const data = getCache(init)
  if (data !== null) return data //注释掉开启缓存
  getRemoteOptions().then((res)=>{
    return res
  }).catch((err)=> {
    return err
  })
}
export function setOptions(data) {
  return storage.set(init, data)
}

export function removeOptions() {
  return storage.remove(init)
}

export function getCache(name){
  return storage.get(name)
}

export function setCache(name,data){
  return storage.set(name,data)
}
