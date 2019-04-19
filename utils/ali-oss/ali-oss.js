/*
* 阿里云OSS图片上传
* 应用场景：外部调用ossUploadFile函数，并传入option参数
* */
import OSS from 'utils/ali-oss/ali-oss'
export default {
  // 实例化OSS Client，具体的参数可参照文档配置项
  // let client = new OSS({
  //   region: '<oss region>',
  //   // 云账号AccessKey有所有API访问权限，建议遵循阿里云安全最佳实践，创建并使用STS方式来进行API访问
  //   accessKeyId: '<Your accessKeyId(STS)>',
  //   accessKeySecret: '<Your accessKeySecret(STS)>',
  //   stsToken: '<Your securityToken(STS)>',
  //   bucket: '<Your bucket name>'
  // })
  //
  // async put () {
  //   try {
  //     // object表示上传到OSS的名字，可自己定义
  //     // file浏览器中需要上传的文件，支持HTML5 file 和 Blob类型
  //     let r1 = await client.put('object', file);
  //     console.log('put success: %j', r1);
  //     let r2 = await client.get('object');
  //     console.log('get success: %j', r2);
  //   } catch (e) {
  //     console.error('error: %j', e);
  //   }
  // }
  // put()
  //
  //   return []

  /**
   * 创建oss客户端对象
   * @returns {*}
   */
  createOssClient(token) {
    return new Promise((resolve, reject) => {
      let client = new OSS({
        region: 'oss-cn-shenzhen',
        accessKeyId: token.credentials.accessKeyId,
        accessKeySecret: token.credentials.accessKeySecret,
        bucket: 'bingo-public',
        stsToken: token.credentials.securityToken
      })
      resolve(client)
    })
  },
  /**
   * 文件上传
   * @param option 参考csdn: https://blog.csdn.net/qq_27626333/article/details/81463139
   */
  ossUploadFile(option) {
    const token = option.token
    const fileName = option.fileName
    const file = option.file
    const self = this
    return new Promise((resolve, reject) => {
      const extensionName = file.name.substr(file.name.indexOf('.')) // 文件扩展名
      const fileName = `${fileName}${extensionName}` // 文件名字（相对于根目录的路径 + 文件名）
      // 执行上传
      self.createOssClient(token).then((client) => {
        // // 异步上传,返回数据
        // 分片上传文件
        client.multipartUpload(fileName, file, {
          // 上传进度条(如果需要的话传入progress属性)
          progress: (p) => {
            let e = {}
            e.percent = Math.floor(p * 100)
            option.onProgress(e)
          }
        }).then((val) => {
          if (val.res.statusCode === 200) {
            option.onSuccess(val)
            return val
          } else {
            option.onError('上传失败')
          }
        }, (err) => {
          option.onError('上传失败')
          reject(err)
        })
      })
    })
  }
}
