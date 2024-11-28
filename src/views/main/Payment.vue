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
            <p class="original-price">
              가격: ₩{{ product.price.toLocaleString() }}
            </p>
            <p class="discounted-price">
              할인가격: ₩{{ discountedPrice.toLocaleString() }}
            </p>
          </div>
        </div>
        <div class="quantity-selector">
          <p>수량: {{ quantity }}</p>
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
          {{ addingNewAddress ? "주소 취소" : "새 주소 추가하기" }}
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
          class="btn confirm-btn"
        >
          결제하기
        </button>
        <button @click="cancelPayment" class="btn cancel-btn">취소</button>
      </section>
    </div>
  </div>
</template>
// Payment.vue
<script>
import { loadPaymentWidget, ANONYMOUS } from "@tosspayments/payment-widget-sdk";

export default {
  name: "Payment",

  data() {
    return {
      clientKey: "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm",
      paymentWidget: null,
      product: {},
      quantity: 1,
      agreeTerms: true,
      defaultAddress: "",
      addingNewAddress: false,
      newAddressInput: "",
      orderId: "",
    };
  },

  computed: {
    discountedPrice() {
      return this.product.price * 0.9;
    },

    totalPayment() {
      return this.discountedPrice * this.quantity;
    },

    canProceed() {
      return (
        this.quantity > 0 &&
        this.agreeTerms &&
        (this.defaultAddress || this.newAddressInput)
      );
    },
  },

  watch: {
    async totalPayment(newAmount) {
      if (this.paymentWidget) {
        await this.paymentWidget.renderPaymentMethods("#payment-method", {
          value: newAmount,
          currency: "KRW",
          country: "KR",
        });
      }
    },
  },

  async mounted() {
    await this.initTossPayments();
  },

  created() {
    this.loadProduct();
    this.loadDefaultAddress();

    // URL 쿼리에서 수량 가져오기
    const urlQuantity = parseInt(this.$route.query.quantity);
    if (!isNaN(urlQuantity) && urlQuantity > 0) {
      this.quantity = urlQuantity;
    }
  },

  methods: {
    // 수량 조절 기능 비활성화
    decreaseQuantity() {
      return;
    },

    increaseQuantity() {
      return;
    },

    async initTossPayments() {
      try {
        const paymentWidget = await loadPaymentWidget(
          this.clientKey,
          ANONYMOUS
        );

        await paymentWidget.renderPaymentMethods("#payment-method", {
          value: this.totalPayment,
          currency: "KRW",
          country: "KR",
        });

        await paymentWidget.renderAgreement("#agreement");

        this.paymentWidget = paymentWidget;
      } catch (error) {
        console.error("토스페이먼츠 초기화 실패:", error);
      }
    },

    async loadProduct() {
      try {
        const productId = this.$route.query.productId || 1;
        const allProducts = [
          {
            id: 1,
            image: "https://via.placeholder.com/600x400?text=Product+1",
            name: "라이브 상품1",
            price: 100000,
            company: "회사A",
            shortDescription: "이것은 라이브 상품1의 간단한 설명입니다.",
            category: "생활 가전",
          },
        ];

        const foundProduct = allProducts.find(
          (p) => p.id === parseInt(productId)
        );
        if (foundProduct) {
          this.product = foundProduct;
        } else {
          alert("상품 정보를 불러올 수 없습니다.");
          this.$router.back();
        }
      } catch (error) {
        console.error("상품 정보 로딩 실패:", error);
        this.$router.back();
      }
    },

    loadDefaultAddress() {
      const address = localStorage.getItem("defaultAddress");
      if (address) {
        this.defaultAddress = address;
      }
    },

    toggleNewAddressForm() {
      this.addingNewAddress = !this.addingNewAddress;
      if (!this.addingNewAddress) {
        this.newAddressInput = "";
      }
    },

    saveNewAddress() {
      if (this.newAddressInput.trim() !== "") {
        localStorage.setItem("defaultAddress", this.newAddressInput.trim());
        this.defaultAddress = this.newAddressInput.trim();
        this.addingNewAddress = false;
        this.newAddressInput = "";
      } else {
        alert("새 주소를 입력해주세요.");
      }
    },

    async confirmPayment() {
      console.log("결제 진행💸");
      if (this.canProceed && this.paymentWidget) {
        try {
          const currentAddress = this.addingNewAddress
            ? this.newAddressInput
            : this.defaultAddress;

          const paymentConfig = {
            orderId: this.generateOrderId(),
            deliveryAddress: currentAddress,
            orderName: this.product.name,
            customerEmail: "customer123@gmail.com",
            customerName: "김토스",
            amount: this.totalPayment,
            successUrl: `${window.location.origin}${
              this.$router.resolve({
                name: "PaymentSuccess",
              }).href
            }?deliveryAddress=${encodeURIComponent(currentAddress)}`,
            failUrl: `${window.location.origin}${
              this.$router.resolve({
                name: "PaymentFail",
              }).href
            }`,
          };

          await this.paymentWidget.requestPayment(paymentConfig);
        } catch (error) {
          if (error.code === "USER_CANCEL") {
            console.log("사용자가 결제를 취소했습니다.");
          } else {
            console.error("결제 요청 실패:", error);
            alert("결제 처리 중 오류가 발생했습니다.");
          }
        }
      } else {
        alert("필수 항목을 모두 완료해주세요.");
      }
    },

    cancelPayment() {
      if (confirm("결제를 취소하시겠습니까?")) {
        this.$router.back();
      }
    },

    generateOrderId() {
      return window.btoa(Math.random()).slice(0, 20);
    },
  },
};
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
