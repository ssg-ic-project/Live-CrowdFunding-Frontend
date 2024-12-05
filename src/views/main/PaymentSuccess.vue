<!-- PaymentSuccess.vue -->
<template>
  <div class="payment-success-page">
    <div class="result-container">
      <div v-if="isLoading" class="loading-state">
        <h2>결제 처리 중...</h2>
        <div class="spinner"></div>
      </div>
      <div v-else-if="error" class="error-state">
        <h2>결제 처리 중 오류가 발생했습니다</h2>
        <p class="error-message">{{ error }}</p>
        <button @click="goToHome" class="primary-button">홈으로 돌아가기</button>
      </div>
      <div v-else-if="success" class="success-state">
        <div class="success-header">
          <h2>결제가 완료되었습니다</h2>
          <p class="success-message">주문해주셔서 감사합니다</p>
        </div>
        <div class="order-details">
          <h3>주문 상세 정보</h3>
          <div class="detail-item">
            <span>주문번호:</span>
            <span>{{ orderId }}</span>
          </div>
          <div class="detail-item">
            <span>결제 금액:</span>
            <span>₩{{ Number(amount).toLocaleString() }}</span>
          </div>
          <div class="detail-item">
            <span>결제 수단:</span>
            <span>{{ getPaymentMethodName(method) }}</span>
          </div>
          <div class="detail-item">
            <span>배송 주소:</span>
            <span>{{ deliveryAddress }}</span>
          </div>
          <div class="detail-item">
            <span>결제 일시:</span>
            <span>{{ formatDate(approvedAt) }}</span>
          </div>
        </div>
        <div class="action-buttons">
          <button @click="goToHome" class="primary-button">홈으로 돌아가기</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { paymentApi } from "@/api/index.js";
export default {
  name: 'PaymentSuccess',
  data() {
    return {
      paymentKey: '',
      orderId: '',
      amount: '',
      method: '',
      deliveryAddress: '',
      approvedAt: '',
      isLoading: false,
      error: null,
      success: false
    }
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }).format(date);
    },
    getPaymentMethodName(method) {
      const methodMap = {
        'CARD': '신용/체크카드',
        'VIRTUAL_ACCOUNT': '가상계좌',
        'MOBILE_PHONE': '휴대폰',
        'TRANSFER': '계좌이체',
        'CULTURAL_GIFT_CERTIFICATE': '문화상품권',
        'BOOK_GIFT_CERTIFICATE': '도서문화상품권',
        'GAME_GIFT_CERTIFICATE': '게임문화상품권'
      };
      return methodMap[method] || method;
    },
    goToHome() {
      this.$router.push('/');
    },
    async confirmPayment() {
      this.isLoading = true;
      const requestData = {
        paymentKey: this.paymentKey,
        orderId: this.orderId,
        amount: this.amount,
        method: this.method,
        deliveryAddress: this.deliveryAddress,
        approvedAt: this.approvedAt,
      };
      try {
        const response = await paymentApi.confirm(requestData);
        console.log('결제 확인 성공:', response.data);
        this.success = true;
      } catch (err) {
        console.error('결제 확인 실패:', err);
        this.error = err.message || '결제 확인 중 오류가 발생했습니다.';
        setTimeout(() => {
          this.$router.push(`/fail?message=${encodeURIComponent(this.error)}`);
        }, 3000);
      } finally {
        this.isLoading = false;
      }
    }
  },
  mounted() {
    const query = this.$route.query;
    this.paymentKey = query.paymentKey;
    this.orderId = query.orderId;
    this.amount = query.amount;
    this.method = query.method;
    this.deliveryAddress = query.deliveryAddress;
    this.approvedAt = query.approvedAt;
    console.log("결제 정보:", {
      method: this.method,
      approvedAt: this.approvedAt
    });
    if (!this.paymentKey || !this.orderId || !this.amount) {
      this.error = '필수 결제 정보가 누락되었습니다.';
      return;
    }
    this.confirmPayment();
  }
}
</script>
<style scoped>
.payment-success-page {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
}
.result-container {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.loading-state {
  text-align: center;
}
.spinner {
  border: 4px solid #F3F3F3;
  border-top: 4px solid #3498DB;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 2rem auto;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.success-header {
  text-align: center;
  margin-bottom: 2rem;
}
.success-message {
  color: #28A745;
  font-size: 1.1rem;
  margin-top: 0.5rem;
}
.order-details {
  background: #F8F9FA;
  padding: 1.5rem;
  border-radius: 8px;
  margin: 1.5rem 0;
}
.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #DEE2E6;
}
.detail-item:last-child {
  border-bottom: none;
}
.action-buttons {
  text-align: center;
  margin-top: 2rem;
}
.primary-button {
  background: #007BFF;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;
}
.primary-button:hover {
  background: #0056B3;
}
.error-state {
  text-align: center;
  color: #DC3545;
}
.error-message {
  margin: 1rem 0;
  padding: 1rem;
  background: #F8D7DA;
  border: 1px solid #F5C6CB;
  border-radius: 4px;
  color: #721C24;
}
</style>
새 항목
3:43
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
.payment-fail-page {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
}
.fail-container {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.fail-header {
  text-align: center;
  margin-bottom: 2rem;
  color: #DC3545;
}
.fail-message {
  color: #6C757D;
  margin-top: 0.5rem;
  font-size: 1.1rem;
}
.fail-details {
  background: #F8F9FA;
  padding: 1.5rem;
  border-radius: 8px;
  margin: 1.5rem 0;
}
.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #DEE2E6;
}
.detail-item:last-child {
  border-bottom: none;
}
.action-buttons {
  text-align: center;
  margin-top: 2rem;
}
.primary-button {
  background: #007BFF;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;
}
.primary-button:hover {
  background: #0056B3;
}
</style>