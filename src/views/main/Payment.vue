<!-- src/views/main/Payment.vue -->
<template>
  <div class="payment-page">
    <h1>결제하기</h1>

    <div class="payment-container">
      <!-- 상품 정보 및 개수 선택 -->
      <section class="section">
        <h2>상품 정보</h2>
        <div class="product-info">
          <img :src="product.image" :alt="product.name" class="product-image" />
          <div class="details">
            <p class="product-name">{{ product.name }}</p>
            <p class="original-price">가격: ₩{{ product.price.toLocaleString() }}</p>
            <p class="discounted-price">할인가격: ₩{{ discountedPrice.toLocaleString() }}</p>
          </div>
        </div>
        <div class="quantity-selector">
          <button @click="decreaseQuantity" :disabled="quantity <= 1">-</button>
          <span>{{ quantity }}</span>
          <button @click="increaseQuantity">+</button>
        </div>
        <div class="total-payment">
          <p>결제금액: ₩{{ totalPayment.toLocaleString() }}</p>
        </div>
      </section>

      <hr />

      <!-- 배송 주소 -->
      <section class="section">
        <h2>배송 주소</h2>
        <div v-if="defaultAddress" class="address-info">
          <p>{{ defaultAddress }}</p>
          <button @click="useDefaultAddress">기본 주소 사용</button>
        </div>
        <div v-if="addingNewAddress" class="new-address-form">
          <input
              type="text"
              v-model="newAddressInput"
              placeholder="새 주소를 입력하세요"
          />
          <button @click="saveNewAddress">저장</button>
        </div>
        <button @click="toggleNewAddressForm">
          {{ addingNewAddress ? '주소 취소' : '새 주소 추가하기' }}
        </button>
      </section>

      <hr />

      <!-- 토스페이먼츠 결제 위젯 -->
      <section class="section">
        <h2>결제 수단</h2>
        <div id="payment-method"></div>
      </section>

      <!-- 토스페이먼츠 약관 동의 위젯 -->
      <section class="section">
        <div id="agreement"></div>
      </section>

      <hr />

      <!-- 결제 및 취소 버튼 -->
      <section class="section buttons">
        <button
            :disabled="!canProceed"
            @click="confirmPayment"
            class="btn confirm-btn">
          결제하기
        </button>
        <button @click="cancelPayment" class="btn cancel-btn">
          취소
        </button>
      </section>
    </div>
  </div>
</template>

<script>
import { loadPaymentWidget, ANONYMOUS } from '@tosspayments/payment-widget-sdk'

export default {
  name: 'Payment',
  data() {
    return {
      clientKey: 'test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm',
      //clientKey: 'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq',
      paymentWidget: null,
      product: {},
      quantity: 1,
      agreeTerms: true,
      defaultAddress: '',
      addingNewAddress: false,
      newAddressInput: '',

      // 기존 data 유지
      selectedMethod: 'CARD',
      paymentMethods: [
        { value: 'CARD', label: '카드' },
        { value: 'TRANSFER', label: '계좌이체' },
        { value: 'VIRTUAL_ACCOUNT', label: '가상계좌' },
        { value: 'MOBILE_PHONE', label: '휴대폰' },
        { value: 'CULTURE_GIFT_CERTIFICATE', label: '문화상품권' },
        { value: 'FOREIGN_EASY_PAY', label: '해외간편결제' }
      ],
    }
  },

  computed: {
    discountedPrice() {
      return this.product.price * 0.9
    },
    totalPayment() {
      return this.discountedPrice * this.quantity
    },
    canProceed() {
      return (
          this.quantity > 0 &&
          this.agreeTerms &&
          (this.defaultAddress || this.newAddressInput)
      )
    },
  },

  watch: {
    async totalPayment(newAmount) {
      if (this.paymentWidget) {
        await this.paymentWidget.renderPaymentMethods('#payment-method', {
          value: newAmount,
          currency: 'KRW',
          country: 'KR'
        })
      }
    }
  },

  async mounted() {
    await this.initTossPayments()
  },

  created() {
    this.loadProduct()
    this.loadDefaultAddress()
  },

  methods: {
    selectPaymentMethod(method) {
      this.selectedMethod = method;
    },

    sout(){
      console.log("눌러라 콘솔😃😃😃")

    },

    async initTossPayments() {
      try {

        const paymentWidget = await loadPaymentWidget(this.clientKey, ANONYMOUS)


        await paymentWidget.renderPaymentMethods('#payment-method', {
          value: this.totalPayment,
          currency: 'KRW',
          country: 'KR'
        })

        await paymentWidget.renderAgreement('#agreement')

        this.paymentWidget = paymentWidget
      } catch (error) {
        console.error('토스페이먼츠 초기화 실패:', error)
      }
    },

    generateOrderId() {
      return window.btoa(Math.random()).slice(0, 20)
    },


    loadProduct() {
      const productId = this.$route.query.productId
      const allProducts = [
        {
          id: 1,
          image: "https://via.placeholder.com/600x400?text=Product+1",
          detailImage: "https://via.placeholder.com/1200x600?text=Product+1+Detail",
          images: [
            "https://via.placeholder.com/600x400?text=Product+1+Image+1",
            "https://via.placeholder.com/600x400?text=Product+1+Image+2",
            "https://via.placeholder.com/600x400?text=Product+1+Image+3",
          ],
          achievement: 75,
          endDate: "2024-12-31",
          name: "라이브 상품1",
          company: "회사A",
          price: 100000,
          shortDescription: "이것은 라이브 상품1의 간단한 설명입니다.",
          fundingAmount: 7500000,
          participants: 150,
          isLive: true,
          isVod: false,
          category: "생활 가전"
        },
      ]

      const foundProduct = allProducts.find(p => p.id === parseInt(productId))
      if (foundProduct) {
        this.product = foundProduct
      } else {
        alert('상품 정보를 불러올 수 없습니다.')
        this.$router.back()
      }
    },

    loadDefaultAddress() {
      const address = localStorage.getItem('defaultAddress')
      if (address) {
        this.defaultAddress = address
      }
    },

    toggleNewAddressForm() {
      this.addingNewAddress = !this.addingNewAddress
      if (!this.addingNewAddress) {
        this.newAddressInput = ''
      }
    },

    saveNewAddress() {
      if (this.newAddressInput.trim() !== '') {
        localStorage.setItem('defaultAddress', this.newAddressInput.trim())
        this.defaultAddress = this.newAddressInput.trim()
        this.addingNewAddress = false
        this.newAddressInput = ''
      } else {
        alert('새 주소를 입력해주세요.')
      }
    },

    increaseQuantity() {
      this.quantity += 1
    },

    decreaseQuantity() {
      if (this.quantity > 1) {
        this.quantity -= 1
      }
    },

    async confirmPayment() {
      console.log("눌러부러쓴")
      if (this.canProceed && this.paymentWidget) {
        try {
          const orderId = this.generateOrderId();

          // 결제 설정 객체
          const paymentConfig = {
            method: this.selectedMethod, // 선택된 결제 방식
            orderId: orderId,
            orderName: this.product.name,
            customerEmail: "customer123@gmail.com",
            customerName: "김토스",
            amount: this.totalPayment,
            successUrl: `${window.location.origin}${this.$router.resolve({ name: 'PaymentSuccess' }).href}`,
            failUrl: `${window.location.origin}${this.$router.resolve({ name: 'PaymentFail' }).href}`
          };

          // 결제 방식별 추가 설정
          switch (this.selectedMethod) {
            case 'CARD':
              paymentConfig.card = {
                useEscrow: false,
                flowMode: "DEFAULT",
                useCardPoint: false,
                useAppCardOnly: false
              };
              break;

            case 'TRANSFER':
              paymentConfig.transfer = {
                cashReceipt: { type: "소득공제" },
                useEscrow: false
              };
              break;

            case 'VIRTUAL_ACCOUNT':
              paymentConfig.virtualAccount = {
                cashReceipt: { type: "소득공제" },
                useEscrow: false,
                validHours: 24
              };
              break;

            case 'MOBILE_PHONE':
              // 휴대폰 결제는 추가 설정 없음
              break;

            case 'CULTURE_GIFT_CERTIFICATE':
              // 문화상품권은 추가 설정 없음
              break;

            case 'FOREIGN_EASY_PAY':
              paymentConfig.amount = {
                value: this.totalPayment,
                currency: "USD"
              };
              paymentConfig.foreignEasyPay = {
                provider: "PAYPAL",
                country: "KR"
              };
              break;
          }

          // 결제 요청
          await this.paymentWidget.requestPayment(paymentConfig);

        } catch (error) {
          if (error.code === 'USER_CANCEL') {
            console.log('사용자가 결제를 취소했습니다.');
          } else {
            console.error('결제 요청 실패:', error);
            alert('결제 처리 중 오류가 발생했습니다.');
          }
        }
      } else {
        alert('필수 항목을 모두 완료해주세요.');
      }
    },

    cancelPayment() {
      if (confirm('결제를 취소하시겠습니까?')) {
        this.$router.back()
      }
    },
  },
}
</script>

<style scoped>
.button2 {
  padding: 0.5rem 1rem;
  margin: 0 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.button2.selected {
  background-color: rgb(229 239 255);
}
/* 기존 스타일 유지 */
</style>