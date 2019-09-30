/** 工具方法 */

// 格式化秒数
const formatSeconds = seconds => {
  return [
    parseInt(seconds / 60 / 60),
    parseInt(seconds / 60 % 60),
    parseInt(seconds % 60)
  ].join(':').replace(/\b(\d)\b/g, '0$1')
}
// 格式化日期时间
const formatDate = (date, separator, ifHaveTime) => {
  date = new Date(date)
  separator = separator || '/'
  ifHaveTime = ifHaveTime || false
  let str = ''
  str = date.getFullYear() + separator + formatNumber(date.getMonth() + 1) + separator + formatNumber(date.getDate())
  if (ifHaveTime) {
    str += ' ' + formatNumber(date.getHours()) + ':' + formatNumber(date.getMinutes()) + ':' + formatNumber(date.getSeconds())
  }
  return str
}
// 兩位數格式化
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
// 金额格式化，每三位数字用逗号隔开，并取两位小数
const money = value => {
  const val = (value / 1).toFixed(2)
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
// 数量格式化，每三位数字用逗号隔开
const num = value => {
  const val = value / 1
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
// 数组去重
const deleteRepeat = array => {
  return [...new Set(array)]
}
// 数组排序
const rangeArray = array => {
  let allNumber = true
  array.forEach((item) => {
    if (typeof +item !== 'number') {
      allNumber = false
    }
  })
  if (!allNumber) {
    return false
  }
  return array.sort((a, b) => {
    return a - b
  })
}
/**
 * 创建随机字符串
 * @param num
 * @returns {string}
 */
const randomString = num => {
  let chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
  let res = ''
  for (let i = 0; i < num; i++) {
    var id = Math.ceil(Math.random() * 35)
    res += chars[id]
  }
  return res
}
/**
 * 检查是否微信浏览器
 * @returns {boolean}
 */
const checkWechat = () => {
  const ua = window.navigator.userAgent
  return /MicroMessenger/.test(ua)
}
/**
 * 隐藏手机号中四位
 * @param phone
 * @returns {string}
 */
const hidePhone = phone => {
  const tempPhone = phone + ''
  return tempPhone.replace(tempPhone.substring(3, 7), '****')
}
/**
 * 提取富文本编辑的文章内容中的图片链接
 */
const pickImg = content => {
  const pattern = /https?:\/\/([\w./?=]*)\.(jpg|png)/g
  const arr = content ? content.match(pattern) : []
  return arr || []
}
/**
 * 格式化用户输入的http网址
 */
const formatUrl = url => {
  if (url && !url.startsWith('http')) {
    url = 'http://' + url
  }
  return url
}
/**
 * 找出最大值和最小值
 * @param {Array} arr
 * @returns {Object} {max: max, min: min}
 */
const findMaxAndMin = arr => {
  if (!isArray(arr)) return
  const result = Object.create ? Object.create(null) : {}
  result.max = Math.max ? Math.max.apply(null, arr) : findMax(arr)
  result.min = Math.min ? Math.min.apply(null, arr) : findMin(arr)
  function findMin(arr) {
    let min = arr[0]
    const len = arr.length
    for (let i = 1; i < len; i++) {
      if (arr[i] < min) {
        min = arr[i]
      }
    }
    return min
  }
  function findMax(arr) {
    let max = arr[0]
    const len = arr.length
    for (let i = 1; i < len; i++) {
      if (arr[i] > max) {
        max = arr[i]
      }
    }
    return max
  }
  function isArray(obj) {
    return toString.call(obj) === '[object Array]'
  }
  return result
}
/*
 * 洗牌算法
 * random sort
 * 从0~i（i的变化为 数组长度len到0递减）中随机取得一个下标，和最后一个元素（i）交换。
 */
const shuffle = arr => {
  if (toString.call(arr) !== '[object Array]') return
  let i = arr.length
  let j, temp
  let result = new Array(...arr)
  while (i) {
    j = Math.floor(Math.random() * i--)
    temp = result[i]
    result[i] = result[j]
    result[j] = temp
  }
  return result
}

/**
 * 合并兩個時間為一個文本："xxxx-xx-xx xx:xx:xx - xxxx-xx-xx xx:xx:xx"
 * 合并兩個時間為一個文本："xxxx-xx-xx - xxxx-xx-xx"
 * 合并兩個時間為一個文本："xxxx-xx-xx xx:xx:xx - xx:xx:xx"
 * @param {String} start 開始時間
 * @param {String} end 結束時間
 * @param {String} mode 拼接模式[dateTime/date]
 * @param {String} separator 分隔符
 */
const mergeTimeText = (start, end, mode = 'dateTime', separator = '-') => {
  let result
  const datePatter = /\d{4}(?:[\-\/]\d{2}){2}/
  const timePatter = /\d{2}(?:\:\d{2}){2}/
  const dateStartResult = datePatter.exec(start)[0]
  const timeStartResult = timePatter.exec(start)[0]
  const dateEndResult = datePatter.exec(end)[0]
  const timeEndResult = timePatter.exec(end)[0]
  if (mode === 'dateTime') {
    result = merge([dateStartResult, dateEndResult], [timeStartResult, timeEndResult])
  } else if (mode === 'date') {
    result = merge([dateStartResult, dateEndResult])
  }

  function merge([startDate, endDate], time = ['', '']) {
    let str = ''
    if (startDate === endDate) {
      str = `${startDate} ${time[0]} ${time[0] ? separator : ''} ${time[1]}`
    } else {
      str = `${startDate} ${time[0]} ${separator} ${endDate} ${time[1]}`
    }
    return str
  }
  return result
}

export default{
  formatSeconds,
  formatDate,
  formatNumber,
  money,
  num,
  deleteRepeat,
  rangeArray,
  randomString,
  checkWechat,
  hidePhone,
  pickImg,
  formatUrl,
  findMaxAndMin,
  shuffle,
  mergeTimeText
}