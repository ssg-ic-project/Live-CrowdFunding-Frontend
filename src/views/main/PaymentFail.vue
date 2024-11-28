<!-- PaymentFailBF.vue -->
<template>
  <div class="payment-fail">
    <h2>결제 실패</h2>
    <p>에러코드: {{ code }}</p>
    <p>실패 사유: {{ message }}</p>
  </div>
</template>

<script>
export default {
  name: 'PaymentFail',

  data() {
    return {
      code: '',
      message: ''
    }
  },

  mounted() {
    // URL 쿼리 파라미터에서 code와 message 가져오기
    this.code = this.$route.query.code || ''
    this.message = this.$route.query.message || ''
  }
}
</script>

<style scoped>
/* 필요한 스타일 추가 */
</style>