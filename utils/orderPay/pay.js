// import { orderApi } from '~/api/order'
// import { Toast } from 'vant'
import orderPlugin from '@/plugins/order'
const placeOrder = async (type) => {
  const params = {
    type: type
  }
  const { code, data } = await orderApi.order(params)
  if (code === 200) {
    return data
  } else if (code === 506) {
    Toast.clear()
    Toast(data)
    return false
  }
}

const getPayLink = async (orderId, tradeType) => {
  const params = {
    id: orderId,
    tradeType: tradeType
  }
  const { code, data } = await orderApi.pay(params)
  if (code === 200) {
    if (tradeType === 'MWEB') {
      return data.mwebUrl
    } else {
      return data
    }
  }
}

/**
 * WeixinJSBridge内置对象在其他浏览器中无效。
 */
const onBridgeReady = (params, orderId, callback) => {
  WeixinJSBridge.invoke(
    'getBrandWCPayRequest',
    {
      "appId": params.appId, // 公众号名称，由商户传入
      "timeStamp": params.timeStamp, // 时间戳，自1970年以来的秒数
      "nonceStr": params.nonceStr, // 随机串
      "package": params.packageValue, // package 是关键字，后端无法返回，需要在这里特殊处理
      "signType": params.signType, // 微信签名方式：
      "paySign": params.paySign // 微信签名
    },
    (res) => {
      if (res.err_msg == 'get_brand_wcpay_request:ok') {
        // 使用以上方式判断前端返回,微信团队郑重提示：
        // res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
        callback && callback(orderId)
      } else {
        Toast.clear()
        Toast.fail('支付失败，请重新支付')
      }
    })
}

const checkBrowser = () => {
  return /MicroMessenger/.test(window.navigator.userAgent) ? 'JSAPI' : 'MWEB'
}

/**
 * 下单、支付
 * @param params{type || orderId}
 * @param callback{onSuccess}
 * @returns {Promise<void>}
 */
const handlePay = async (params, callback) => {
  let orderId = ''
  // 是否为新订单支付
  if (!params.orderId) {
    orderId = await placeOrder(params.type)
  } else {
    orderId = params.orderId
  }
  if (orderId) {
    // 判断浏览器
    const tradeType = await checkBrowser()
    // 等待后台返回微信支付链接
    const info = await getPayLink(orderId, tradeType)
    console.log('got info:', info, 'tradeType:', tradeType)
    if (info) {
      if (tradeType === 'MWEB') {
        // H5支付
        const targetUrl = encodeURIComponent(`${orderPlugin.target}${orderPlugin.targetPage}?orderId=${orderId}`)
        window.location.href = `${info}&redirect_url=${targetUrl}`
        // window.location.href = `${info}&redirect_url=${targetUrl}?orderId=${orderId}`
      } else if (tradeType === 'JSAPI') {
        // 微信浏览器支付
        if (typeof WeixinJSBridge == 'undefined') {
          if (document.addEventListener) {
            document.addEventListener('WeixinJSBridgeReady', onBridgeReady(info, orderId, callback), false)
          } else if (document.attachEvent) {
            document.attachEvent('WeixinJSBridgeReady', onBridgeReady(info, orderId, callback))
            document.attachEvent('onWeixinJSBridgeReady', onBridgeReady(info, orderId, callback))
          }
        } else {
          onBridgeReady(info, orderId, callback)
        }
        return orderId
      }
    }
  }
}

export default {
  handlePay,
  placeOrder,
  getPayLink
}
