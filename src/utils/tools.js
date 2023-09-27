/**
 * 去除对象中的空值
 * @param obj  需要处理的对象
 * @returns {Object}  返回处理后的对象
 */
export function removeNullInObj(obj){
  return Object.keys(obj).filter((key) => obj[key] !== null && obj[key] !== undefined && obj[key] !== "")
    .reduce((acc, key) => ({ ...acc, [key]: obj[key] }), {});
}

/**
 * 将时间戳格式转换成年月日时分秒
 * @param value  需要处理的时间戳
 * @returns {string}  返回处理后的时间
 */
export function stampToTime(value) {
  // 此处时间戳以毫秒为单位
  let date = new Date(parseInt(value) * 1000);
  let Year = date.getFullYear();
  let Moth = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
  let Day = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
  let Hour = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours());
  let Minute = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
  let Seconds = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
  return    Year + '-' + Moth + '-' + Day + '   '+ Hour +':'+ Minute  + ':' + Seconds;
}

/**
 * 数组去重
 * @param {Array} arr 需要处理的数组
 * @returns {Array}  返回处理后的数组
 */
export function uniqueArray(arr){
  // return Array.from(new Set(arr))
  let result=[];
  for(let i=0;i<arr.length;i++){
    let isFind=false;
    for(let j=0;j<result.length;j++){
      if(equals(arr[i],result[j])){
        isFind=true;
        break;
      }
    }
    if(!isFind){
      result.push(arr[i]);
    }
  }
  return result;
}
/**
 * 判断是否为基本类型
 * @param value
 * @returns {boolean}
 */
export function isPrimitive(value) {
  return value===null || !['object','function'].includes(typeof value);
}

/**
 * 判断两个值是否相等
 * @param value1
 * @param value2
 * @returns {boolean}
 */
export function equals(value1, value2) {
  if(isPrimitive(value1) || isPrimitive(value2)) {
    return Object.is(value1, value2);
  }
  const entries1 = Object.entries(value1);
  const entries2 = Object.entries(value2);
  if(entries1.length !== entries2.length) {
    return false;
  }
  for (const [key, value] of entries1) {
    if(!equals(value, value2[key])) {
      return false;
    }
  }
  return true;
}

/**
 * 防抖
 * @param {function} fn 执行函数
 * @param {number} wait 等待时间，毫秒
 * @param {boolean} immediate 是否立即执行
 * @returns {function(...[*]=)}
 */
export function myDebounce(fn, wait= 500, immediate= true) {
  let timeout;
  return function (...args) {
    let context = this;
    if (timeout) clearTimeout(timeout); // 清除计时器，但是timeout本身还在，只是不会在执行

    if (immediate) { // 总是执行第一次操作
      let callNow = !timeout; // 第一次为true
      // 多次操作，timeout初始化，多次触发只有当wait等待时间结束timeout才为空
      timeout = setTimeout(function () {
        timeout = null;
      }, wait);
      // 第一次为true, 执行
      if (callNow) fn.apply(context, args);
    } else { // 总是执行最后一次操作
      timeout = setTimeout(function () {
        fn.apply(context, args);
      }, wait);
    }
  };
}

/**
 * 节流
 * @param fn
 * @param interval
 * @returns {(function(): (boolean|undefined))|*}
 */
export function throttle (fn, interval= 500) {
  let _self = fn, // 保存需要被延迟执行的函数引用
    timer, // 定时器
    firstTime = true; // 是否是第一次调用
  return function () {
    let args = arguments;
    let _me = this;
    if (firstTime) { // 如果是第一次调用不需要延迟
      _self.apply(_me, args); // 执行fn函数并且修正此函数中this所运行的上下文指向
      return firstTime = false;
    }
    if (timer) { // 如果定时器还在，说明前一次延迟执行还没有完成
      return false;
    }
    timer = setTimeout(function () { // 延迟一段时间执行
      clearTimeout(timer);
      timer = null;
      _self.apply(_me, args); // 执行fn函数并且修正此函数中this所运行的上下文指向
    }, interval);
  }
}
/**
 * 时间戳转化
 * @param date
 * @param fmt yyyy/MM/dd 下午 hh:mm:ss
 * @returns {*}
 */
export function formatDate(date, fmt) {
  // 1.获取年份 y+ 一个或多个y，正则表达式：匹配字符串
  if(/(y+)/.test(fmt)) {
    // RegExp.$1 即匹配到的/(y+)/字符串，将其替换为逗号后的(date.getFullYear() + '')...
    // (date.getFullYear() + '')是将时间加上一个空串，将数值转化为字符串
    // substr截取字符串，截取的个数为 4-匹配的字符串的长度，如果匹配的字符串为2019，则不截取，显示2019
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  }
  return fmt;
}
// 不足两位则要补齐两位： 01：02
// 如果传入的str为 04，则执行 0004.substr(2) -> 04
// if str = 4  -> 004.sbustr(1)  ->  04
function padLeftZero (str) {
  return ('00' + str).substr(str.length);
}

/**
 * 对比数组中的值是否相等
 * @param array
 * @returns {boolean}
 */
export function isAllEqual(array){
  if(array.length > 0){
    return !array.some(function(value){
      return value !== array[0];
    });
  }else{
    return true;
  }
}


