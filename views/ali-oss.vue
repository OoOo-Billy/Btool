<template>
  <div>
    <van-uploader
        name="uploader"
        accept="image/jpeg, image/png"
        :max-size="3145728"
        :before-read="beforeUpload"
        :after-read="beginUpload"
    >
      <input type="file">
    </van-uploader>
  </div>
</template>

<script>
  import oss from './../utils/ali-oss/ali-oss'
  import tools from './../utils/tools'

  export default {
    name: 'aliOss',
    data() {
      return {
        imgUrl: '',
        uploadToken: {},
        galleryName: 'myGallery'
      }
    },
    methods: {
      GetPublicToken() {
        return {
          code: 200,
          data: {}
        }
      },
      async beforeUpload(file, detail) {
        // 获取token
        const {code, data} = await this.GetPublicToken()
        if (code === 200) {
          this.uploadToken = data
        }
      },
      async beginUpload(file, detail) {
        // 处理文件名
        const fileName = `${this.galleryName}/${tools.randomString(5)}`
        const option = {
          token: this.uploadToken,
          fileName,
          file: file.file,
          onSuccess: this.onSuccess,
          onError: this.onError
        }
        await oss.ossUploadFile(option)
      },
      // 上传成功的回调
      onSuccess(res) {
        if (res) {
          this.imgUrl = `https://${res.bucket}.oss-cn-shenzhen.aliyuncs.com/${res.name}`
          console.log('success')
        }
      },
      // 上传失败的回调
      onError(val) {
        console.log(val)
      }
    }
  }
</script>

<style lang="scss" scoped></style>
