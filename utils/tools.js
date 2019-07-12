import Vue from 'vue'
import ElementUI from 'element-ui'
Vue.use(ElementUI)
const vue = new Vue()

export default {
  // 格式化秒数
  formatSeconds(seconds) {
    return [
      parseInt(seconds / 60 / 60),
      parseInt(seconds / 60 % 60),
      parseInt(seconds % 60)
    ].join(':').replace(/\b(\d)\b/g, '0$1')
  },
  // 格式化日期时间
  formatDate(date, separator, ifHaveTime) {
    date = new Date(date)
    separator = separator || '/'
    // timeDelimiter = timeDelimiter || ':'
    ifHaveTime = ifHaveTime || false

    function addZero(val) {
      if (+val < 10) {
        return '0' + val
      }
      return val
    }
    let str = ''
    str = date.getFullYear() + separator + addZero(date.getMonth() + 1) + separator + addZero(date.getDate())
    if (ifHaveTime) {
      str += ' ' + addZero(date.getHours()) + ':' + addZero(date.getMinutes()) + ':' + addZero(date.getSeconds())
    }
    return str
  },
  // 验证，使用了Notify组件作为错误提示
  validate(val, type, msg) {
    try {
      if (!regexp[type].test(val)) {
        vue.$notify.error({ title: '提示', message: msg })
      }
      return regexp[type].test(val)
    } catch (err) {
      vue.$notify.error({ title: '警告', message: '验证程序出错' })
      return false
    }
  },
  // 金额格式化，每三位数字用逗号隔开，并取两位小数
  money(value) {
    const val = (value / 1).toFixed(2)
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  },
  // 数量格式化，每三位数字用逗号隔开
  num(value) {
    const val = value / 1
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  },
  // 数组去重
  deleteRepeat(array) {
    return [...new Set(array)]
  },
  // 数组排序
  rangeArray(array) {
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
  },

  /**
   * 创建随机字符串
   * @param num
   * @returns {string}
   */
  randomString(num) {
    let chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
    let res = ''
    for (let i = 0; i < num; i++) {
      var id = Math.ceil(Math.random() * 35)
      res += chars[id]
    }
    return res
  },

  /**
   * 检查是否微信浏览器
   * @returns {boolean}
   */
  checkWechat() {
    const ua = window.navigator.userAgent
    return /MicroMessenger/.test(ua)
  },

  /**
   * 隐藏手机号中四位
   * @param phone
   * @returns {string}
   */
  hidePhone(phone) {
    const tempPhone = phone + ''
    return tempPhone.replace(tempPhone.substring(3, 7), '****')
  },


  /**
   * 提取富文本编辑的文章内容中的图片链接
   */
  pickImg(content) {
    const pattern = /https?:\/\/([\w./?=]*)\.(jpg|png)/g
    const arr = content ? content.match(pattern) : []
    return arr || []
  },

  /**
   * 格式化用户输入的http网址
   */
  formatUrl(url) {
    if (url && !url.startsWith('http')) {
      url = 'http://' + url
    }
    return url
  },

  /**
 * 找出最大值和最小值
 * @param {Array} arr
 * @returns {Object} {max: max, min: min}
 */
  findMaxAndMin(arr) {
    console.log(arr)
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
}
