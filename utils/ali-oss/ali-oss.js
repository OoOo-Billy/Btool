/*
 * 阿里云OSS上传文件（图片）
 * 应用场景：外部调用ossUploadFile函数，并传入option参数
 * 需要安装依赖 npm install ali-oss --save
 * 使用案例可以参考csdn: https://blog.csdn.net/qq_27626333/article/details/81463139
 *
 * 需要传入的参数：option(*星号标注为必须)
 * [token]* {Object}:阿里云官方返回的token对象,或token对象里的credentials属性
 * [region] {String}:bucket 所在的区域，默认 oss-cn-hangzhou
 * [bucket]* {String}:bucket 名字
 * [fileName] {String}:文件命名
 * [file]* {File}:上传的文件对象
 * [onProgress] {Function}:使用分片上传时,上传进度的回调函数
 * [onSuccess] {Function}:上传成功后的回调函数
 * [onError] {Function}:上传失败的回调函数
 */
// version v0.0.2

import OSS from 'ali-oss'

/**
 * 实例化OSS Client, 具体的参数可参照文档配置项:https://help.aliyun.com/document_detail/64095.html
 * @param {Object} token
 * @returns {*} client
 */
function createOssClient(token) {
  const accessKeyId = token.accessKeyId || token.credentials.accessKeyId
  const accessKeySecret = token.accessKeySecret || token.credentials.accessKeySecret
  const stsToken = token.securityToken || token.credentials.securityToken
  const region = token.region
  const bucket = token.bucket
  return new Promise((resolve) => {
    const client = new OSS({
      accessKeyId,
      accessKeySecret,
      stsToken,
      region,
      bucket
    })
    resolve(client)
  })
}

function handleFileName(fileName, file) {
  const extensionName = file.name.substr(file.name.indexOf('.')) // 文件扩展名
  const newName = fileName === '' ? encodeURIComponent(file.name) : `${fileName}${extensionName}`
  return newName
}

export default {
  /**
   * 分片上传文件
   * @param {Object} option
   */
  ossUploadFile(option) {
    const token = option.token
    const region = option.region || 'oss-cn-hangzhou'
    const bucket = option.bucket
    const file = option.file
    const fileName = option.fileName + '' || ''
    const newFileName = handleFileName(fileName, file)

    return new Promise((resolve, reject) => {
      // 创建OSS实例
      createOssClient({
        region,
        bucket,
        ...token
      }).then((client) => {
        client.multipartUpload(newFileName, file, {
          progress: (p) => { // p为0-1小数
            let e
            e = Math.floor(p * 100)
            if (option.onProgress) {
              option.onProgress(e)
            }
          }
        }).then((res) => {
          if (res.res.statusCode === 200) {
            if (option.onSuccess) {
              option.onSuccess(res)
            }
            resolve(res)
          } else {
            if (option.onError) {
              option.onError('上传失败')
            }
          }
        }, (err) => {
          if (option.onError) {
            option.onError('上传失败')
          }
          reject(err)
        })
      })
    })
  }
}