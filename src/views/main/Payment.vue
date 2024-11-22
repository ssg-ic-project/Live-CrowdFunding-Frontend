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
  
        <!-- 결제 옵션 -->
        <section class="section">
          <h2>결제 옵션</h2>
          <div class="payment-options">
            <label>
              <input type="radio" value="credit_card" v-model="paymentOption" />
              신용카드
            </label>
            <label>
              <input type="radio" value="bank_transfer" v-model="paymentOption" />
              계좌이체
            </label>
            <label>
              <input type="radio" value="mobile_payment" v-model="paymentOption" />
              모바일 결제
            </label>
          </div>
        </section>
  
        <hr />
  
        <!-- 약관 동의 -->
        <section class="section">
          <label class="terms-agreement">
            <input type="checkbox" v-model="agreeTerms" />
            약관에 동의합니다.
          </label>
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
          <button @click="cancelPayment" class="btn cancel-btn">
            취소
          </button>
        </section>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Payment',
    data() {
      return {
        product: {},
        quantity: 1,
        paymentOption: '',
        agreeTerms: false,
        defaultAddress: '',
        addingNewAddress: false,
        newAddressInput: '',
      };
    },
    computed: {
      discountedPrice() {
        // 예시: 10% 할인 적용
        return this.product.price * 0.9;
      },
      totalPayment() {
        return this.discountedPrice * this.quantity;
      },
      canProceed() {
        return (
          this.quantity > 0 &&
          this.agreeTerms &&
          this.paymentOption !== '' &&
          (this.defaultAddress || this.newAddressInput)
        );
      },
    },
    created() {
      this.loadProduct();
      this.loadDefaultAddress();
    },
    methods: {
      loadProduct() {
        // 라우트의 쿼리 파라미터에서 productId 가져오기
        const productId = this.$route.query.productId;
  
        // 더미 데이터 배열 (id:1만 포함)
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
        ];
  
        // 해당 productId에 맞는 상품 찾기 (id:1만 존재)
        const foundProduct = allProducts.find(p => p.id === parseInt(productId));
  
        if (foundProduct) {
          this.product = foundProduct;
        } else {
          // 상품을 찾지 못했을 때 처리
          alert('상품 정보를 불러올 수 없습니다.');
          this.$router.back();
        }
      },
      loadDefaultAddress() {
        // 예시: 로컬 스토리지에서 기본 주소 가져오기
        const address = localStorage.getItem('defaultAddress');
        if (address) {
          this.defaultAddress = address;
        }
      },
      toggleNewAddressForm() {
        this.addingNewAddress = !this.addingNewAddress;
        if (!this.addingNewAddress) {
          this.newAddressInput = '';
        }
      },
      saveNewAddress() {
        if (this.newAddressInput.trim() !== '') {
          // 새 주소를 로컬 스토리지에 저장 (예시)
          localStorage.setItem('defaultAddress', this.newAddressInput.trim());
          this.defaultAddress = this.newAddressInput.trim();
          this.addingNewAddress = false;
          this.newAddressInput = '';
        } else {
          alert('새 주소를 입력해주세요.');
        }
      },
      increaseQuantity() {
        this.quantity += 1;
      },
      decreaseQuantity() {
        if (this.quantity > 1) {
          this.quantity -= 1;
        }
      },
      confirmPayment() {
        if (this.canProceed) {
          // 결제 API 호출 (백엔드 구현 필요)
          // 여기서는 성공적으로 결제된 것으로 가정하고 알림을 표시
          alert('결제가 완료되었습니다!');
          // 결제 완료 후 페이지 이동 (예: 홈으로)
          this.$router.push('/');
        } else {
          alert('필수 항목을 모두 완료해주세요.');
        }
      },
      cancelPayment() {
        // 결제를 취소하고 이전 페이지로 이동
        if (confirm('결제를 취소하시겠습니까?')) {
          this.$router.back();
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .payment-page {
    padding: 2rem;
    padding-bottom: 60px; /* 푸터 공간 확보 */
  }
  
  .payment-container {
    max-width: 800px;
    margin: 0 auto;
  }
  
  .section {
    margin-bottom: 1.5rem;
  }
  
  .section h2 {
    margin-bottom: 0.5rem;
    color: #333;
  }
  
  .product-info {
    display: flex;
    gap: 1rem;
    align-items: center;
  }
  
  .product-image {
    width: 100px;
    height: 100px;
    border-radius: 8px;
    object-fit: cover;
  }
  
  .details {
    flex: 1;
  }
  
  .product-name {
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }
  
  .original-price {
    color: #555;
  }
  
  .discounted-price {
    color: #e63946;
  }
  
  .quantity-selector {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-top: 0.5rem;
  }
  
  .quantity-selector button {
    padding: 0.5rem 1rem;
    font-size: 1rem;
    cursor: pointer;
  }
  
  .total-payment {
    margin-top: 0.5rem;
    font-weight: bold;
    color: #333;
  }
  
  .address-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .address-info p {
    margin: 0;
    color: #555;
  }
  
  .address-info button {
    padding: 0.5rem 1rem;
    cursor: pointer;
  }
  
  .new-address-form {
    margin-top: 0.5rem;
  }
  
  .new-address-form input {
    width: 100%;
    padding: 0.5rem;
    margin-bottom: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  .payment-options {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .payment-options label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
  }
  
  .terms-agreement {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
  }
  
  .buttons {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
  }
  
  .btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s ease, color 0.3s ease;
  }
  
  .confirm-btn {
    background-color: #28a745;
    color: white;
  }
  
  .cancel-btn {
    background-color: #dc3545;
    color: white;
  }
  
  .confirm-btn:disabled {
    background-color: #94d3a2;
    cursor: not-allowed;
  }
  
  .cancel-btn:hover {
    opacity: 0.9;
  }
  
  /* 반응형 디자인 */
  @media (max-width: 768px) {
    .product-info {
      flex-direction: column;
      align-items: flex-start;
    }
  
    .product-image {
      width: 80px;
      height: 80px;
    }
  }
  </style>
  