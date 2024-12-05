<!-- PaymentFail.vue -->
<template>
  <div class="payment-fail-page">
    <div class="fail-container">
      <div class="fail-header">
        <h2>결제에 실패했습니다</h2>
        <p class="fail-message">다시 시도해 주시기 바랍니다</p>
      </div>
      <div class="fail-details">
        <div class="detail-item" v-if="code">
          <span>에러 코드:</span>
          <span>{{ code }}</span>
        </div>
        <div class="detail-item">
          <span>실패 사유:</span>
          <span>{{ message || '알 수 없는 오류가 발생했습니다' }}</span>
        </div>
      </div>
      <div class="action-buttons">
        <button @click="goToHome" class="primary-button">홈으로 돌아가기</button>
      </div>
    </div>
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
  methods: {
    goToHome() {
      this.$router.push('/');
    }
  },
  mounted() {
    this.code = this.$route.query.code || '';
    this.message = decodeURIComponent(this.$route.query.message || '');
  }
}
</script>

<style scoped>
/* 필요한 스타일 추가 */
</style>