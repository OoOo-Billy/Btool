<template>
  <div class="confirm-order">
    <van-dialog
        v-model="show"
        :show-cancel-button="false"
        :show-confirm-button="false"
    >
      <div class="title">{{ title }}</div>
      <div class="btn success" @click="handleSuccess">已完成支付</div>
      <div class="btn fail" @click="handleFail">支付遇到问题，重新支付</div>
    </van-dialog>
  </div>
</template>

<script>
export default {
  name: 'ConfirmOrder',
  props: {
    title: {
      type: String,
      default: '请确认微信支付是否已完成'
    },
    show: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    getOrderInfo() {

    },
    handleSuccess() {
      this.$emit('confirm')
    },
    handleFail() {
      this.$emit('fail')
    }
  }
}
</script>

<style scoped lang="scss">
.confirm-order{
  text-align: center;
  .title{
    padding: 50px;
    font-weight: bolder;
  }
  .btn{
    padding: 30px 0;
    border-top: 1px solid #ddd;
    &.success{
      color: #81bcf7;
    }
    &.fail{
      color: #828282;
    }
  }
}
</style>