<template>
  <div>
    <!-- 로딩 상태 -->
    <div v-if="isLoading" class="loading-spinner">
      <svg class="spinner" viewBox="0 0 50 50">
        <circle
          class="path"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke-width="5"
        ></circle>
      </svg>
      <span>로딩 중...</span>
    </div>

    <!-- 에러 메시지 -->
    <div v-else-if="error" class="error-message">
      <span>상품을 찾을 수 없습니다.</span>
    </div>

    <!-- 제품 상세 내용 -->
    <div v-else-if="product" class="product-detail-page">
      <div class="product-detail-container">
        <!-- 좌측: 제품 이미지 섹션 -->
        <div class="product-image-section">
          <!-- 이미지 슬라이더 -->
          <div class="image-slider" v-if="hasMultipleImages">
            <button @click.stop="prevImage" class="slider-button prev-button" aria-label="이전 이미지">
              &#10094;
            </button>
            <img :src="currentImage.url" :alt="`${product.productName} 이미지 ${currentImage.imageNumber}`" class="product-main-image" />
            <button @click.stop="nextImage" class="slider-button next-button" aria-label="다음 이미지">
              &#10095;
            </button>
          </div>

          <!-- 단일 이미지 표시 -->
          <div v-else class="single-image">
            <img :src="product.images[0].url" :alt="product.productName" class="product-main-image" />
          </div>
        </div>

        <!-- 우측: 제품 정보 섹션 -->
        <div class="product-info-section">
          <!-- 상단: 펀딩 %, 카테고리, 알림, 공유 아이콘 -->
          <div class="top-info">
            <div class="funding-percentage">
              <span>{{ product.percentage }}% 펀딩 달성</span>
            </div>
            <div class="category">
              <span> {{ product.maker }} | {{ product.category }}</span>
            </div>
            <div class="icons">
              <button @click="handleNotification" aria-label="알림" class="icon-button">
                <!-- 알림 아이콘 SVG -->
              </button>
              <button @click="handleShare" aria-label="공유" class="icon-button">
                <!-- 공유 아이콘 SVG -->
              </button>
            </div>
          </div>

          <h1 class="product-name">{{ product.productName }}</h1>
          <p class="product-description">{{ product.summary }}</p>

          <div class="funding-info">
            <div class="price-info">
              <template v-if="product.isStreaming === 1">
                <div class="price-wrapper">
                  <span class="original-price">{{ product.price.toLocaleString() }}원</span>
                  <span class="discount-percentage">{{ product.discountPercentage }}% 할인</span>
                </div>
                <span class="funding-price">{{ calculateDiscountedPrice }}원</span>
              </template>
              <!-- 라이브 방송 중이 아닐 때 -->
              <template v-else>
                <span class="funding-price">{{ product.price.toLocaleString() }}원</span>
              </template>
            </div>
            <div class="funding-stats">
              <span class="funding-amount">목표 금액: {{ product.goalAmount.toLocaleString() }}원 | </span>
              <span class="funding-likes">관심: {{ product.likeCount }}명 | </span>
              <span class="funding-days-left">{{ daysLeft }}일 남음</span>
            </div>
          </div>

          <hr class="divider" />

          <div class="action-buttons">
            <div class="button-row">
              <!-- 첫번째 줄: 찜하기, LIVE/VOD, 펀딩하기 -->
              <button @click="toggleWishlist" class="wishlist-btn" :class="{ active: isWishlisted }" aria-label="찜하기">
                <div class="wishlist-content">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    :fill="isWishlisted ? '#ff4b4b' : 'none'" 
                    stroke="#ff4b4b" 
                    stroke-width="2"
                    class="heart-icon"
                  >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  <span class="wishlist-count">{{ product.likeCount }}</span>
                </div>
              </button>

              <!-- Live/VOD 버튼 -->
              <template v-if="product.isStreaming === 0">
                <button disabled class="btn stream-btn disabled-btn" aria-label="라이브 방송 준비중">
                  LIVE
                </button>
              </template>
              <template v-else-if="product.isStreaming === 1">
                <button class="btn stream-btn live-btn" aria-label="라이브 방송 시청">
                  LIVE
                </button>
              </template>
              <template v-else-if="product.isStreaming === 2">
                <button class="btn stream-btn vod-btn" aria-label="VOD 시청">
                  VOD
                </button>
              </template>

              <button @click="handleFunding" class="btn fund-btn">
                펀딩하기
              </button>
            </div>

            <div class="button-row">
              <!-- 두번째 줄: 수량 선택, 총 가격 -->
              <div class="quantity-selector">
                <button @click="decrementQuantity" :disabled="isDecrementDisabled" class="quantity-btn" aria-label="수량 감소">-</button>
                <input type="number" v-model="selectedQuantity" @input="handleQuantityInput" min="1" max="100" class="quantity-input" />
                <button @click="incrementQuantity" :disabled="isIncrementDisabled" class="quantity-btn" aria-label="수량 증가">+</button>
              </div>
              <div class="total-price">
                총 {{ (actualPrice * selectedQuantity).toLocaleString() }}원
              </div>
            </div>
          </div>
        </div>    
      </div>    
    </div>
  </div>
</template>
<script>
import { ref } from "vue";
import ProductItem from "@/components/ProductItem.vue";
import axios from "axios";

export default {
  name: "ProductDetail",
  components: {
    ProductItem,
  },
  
  data() {
    return {
      product: null,
      isLoading: true,
      error: false,
      currentImageIndex: 0,
      isWishlisted: false,
      selectedQuantity: 1, 
      showQuantitySelect: false,
    };
  },

  setup() {
    const showQuantitySelect = ref(false);
    const selectedQuantity = ref(1);

    return {
      showQuantitySelect,
      selectedQuantity,
    };
  },

  computed: {
    hasMultipleImages() {
      return this.product?.images?.length > 1;
    },
    
    currentImage() {
      if (this.hasMultipleImages) {
        return this.product.images[this.currentImageIndex];
      }
      return this.product.images[0];
    },

    calculateDiscountedPrice() {
      if (!this.product || this.product.isStreaming !== 1) return this.product.price.toLocaleString();
      const discountedPrice = this.product.price * (1 - this.product.discountPercentage / 100);
      return Math.floor(discountedPrice).toLocaleString();
    },

    actualPrice() {
      if (!this.product) return 0;
      if (this.product.isStreaming === 1) {
        return Math.floor(this.product.price * (1 - this.product.discountPercentage / 100));
      }
      return this.product.price;
    },
    
    daysLeft() {
      if (!this.product) return 0;
      const endDate = new Date(this.product.endAt);
      const today = new Date();
      const diffTime = endDate - today;
      return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    },
    
    // calculateDiscountedPrice() { // 나중 라이브 시 적용 예정
    //   if (!this.product) return 0;
    //   if (!this.product.discountPercentage)
    //     return this.product.price.toLocaleString();
    //   const discountedPrice =
    //     this.product.price * (1 - this.product.discountPercentage / 100);
    //   return Math.floor(discountedPrice).toLocaleString();
    // },
      // 수량 증가 버튼 비활성화 여부
      isIncrementDisabled() {
      return this.selectedQuantity >= 100;
    },

    // 수량 감소 버튼 비활성화 여부
    isDecrementDisabled() {
      return this.selectedQuantity <= 1;
    },
  },
  
  async created() {
    await this.fetchProductDetail();
  },
  
  methods: {
    showQuantitySelector() {
      this.showQuantitySelect = true;
    },

    selectQuantity(quantity) {
      this.selectedQuantity = quantity;
    },

// 수량 증가
incrementQuantity() {
      if (this.selectedQuantity < 100) {
        this.selectedQuantity++;
      }
    },

    // 수량 감소
    decrementQuantity() {
      if (this.selectedQuantity > 1) {
        this.selectedQuantity--;
      }
    },

    // 수량 직접 입력 처리
    handleQuantityInput(event) {
      let value = parseInt(event.target.value);
      
      // 빈 값이면 1로 설정
      if (isNaN(value) || value < 1) {
        this.selectedQuantity = 1;
      } 
      // 최대값 초과시 100으로 설정
      else if (value > 100) {
        this.selectedQuantity = 100;
      } 
      else {
        this.selectedQuantity = value;
      }
    },

    // 펀딩하기 버튼 클릭 처리
    confirmFunding() {
      this.$router.push({
        name: "Payment",
        query: {
          productId: this.product.id,
          quantity: this.selectedQuantity,
        },
      });
    },


    async fetchProductDetail() {
      try {
        const productId = this.$route.params.productId;
        const response = await axios.get(`/api/project/${productId}`, {
          params: {
            userId: localStorage.getItem("userId"),
          },
        });
        this.product = response.data;
        console.log("상품 정보:", this.product);
        this.isWishlisted = this.product.isLiked;
      } catch (error) {
        console.error("상품 정보 로딩 실패:", error);
        this.error = true;
      } finally {
        this.isLoading = false;
      }
    },

    async toggleWishlist() {
      try {
        const userId = localStorage.getItem("userId");
        const productId = this.$route.params.productId;
        if (!userId || !productId) {
          console.error("사용자 ID 또는 제품 ID가 없습니다");
          return;
        }

        const response = await axios.post(`/api/liked`, {
          userId: Number(userId),
          projectId: Number(this.product.id),
        });

        if (response.status === 200) {
          this.isWishlisted = !this.isWishlisted;
          this.product.isLiked = this.isWishlisted;
          if (this.isWishlisted) {
            this.product.likeCount += 1;
          } else {
            this.product.likeCount = Math.max(0, this.product.likeCount - 1);
          }
          localStorage.setItem(`wishlist_${this.product.id}`, this.isWishlisted);
        }
      } catch (err) {
        console.error("찜하기 실패:", err.response?.data || err.message);
        alert("찜하기 처리 중 오류가 발생했습니다.");
      }
    },

    handleNotification() {
      alert("알림 설정 기능은 아직 구현되지 않았습니다.");
    },

    handleShare() {
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => {
          alert("상품 URL이 클립보드에 복사되었습니다.");
        })
        .catch((err) => {
          console.error("클립보드 복사 실패:", err);
        });
    },

    nextImage() {
      if (this.hasMultipleImages) {
        this.currentImageIndex =
          (this.currentImageIndex + 1) % this.product.images.length;
      }
    },

    prevImage() {
      if (this.hasMultipleImages) {
        this.currentImageIndex =
          (this.currentImageIndex - 1 + this.product.images.length) %
          this.product.images.length;
      }
    },

    // calculateTotalPrice() {
    //   const discountedPrice = this.product.price * (1 - (this.product.discountPercentage || 0) / 100);
    //   return Math.floor(discountedPrice * this.selectedQuantity);
    // },

    async handleFunding() {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          alert("로그인이 필요한 서비스입니다.");
          return;
        }

        const orderRequestDTO = {
          userId: Number(userId),
          projectId: this.product.id,
          amount: this.selectedQuantity,
          totalPrice: this.actualPrice * this.selectedQuantity,
        };

        console.log("주문 생성 요청:", orderRequestDTO); // 요청 데이터 구조 확인용

        const response = await axios.post('/api/order', orderRequestDTO);
        console.log("주문 생성 성공 id:", response.data.id); // 응답 데이터 구조 확인용

        if (response.data) {
          this.$router.push({
            name: 'Payment',
            params: { orderId: response.data.id }
          });
        } else {
          throw new Error('Invalid order response');
        }
      } catch (error) {
        console.error("주문 생성 실패:", error);
        alert("주문 생성 중 오류가 발생했습니다.");
      }
    },
  },
};
</script>

<style scoped>
/* Product Detail Page Layout */
.product-detail-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  padding-bottom: 60px;
  font-family: "Noto Sans KR", sans-serif;
}

.product-detail-container {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  align-items: flex-start;
}

/* Image Section */
.product-image-section {
  flex: 1;
  min-width: 300px;
  position: relative;
  font-size: 0;
  line-height: 0;
}

.image-slider {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 62.5%;
  overflow: hidden;
  background-color: #ffffff;
  border-radius: 8px;
  margin: 0;
}

.product-main-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  background-color: #ffffff;
}

.single-image {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 62.5%;
  overflow: hidden;
  background-color: #ffffff;
  border-radius: 8px;
  margin: 0;
}

/* Slider Controls */
.slider-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  height: 60px;
  width: 30px;
  background-color: rgba(0, 0, 0, 0.3);
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  z-index: 2;
}

.prev-button {
  left: 0;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
}

.next-button {
  right: 0;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}

.slider-button:hover {
  background-color: rgba(0, 0, 0, 0.5);
}

/* Product Info Section */
.product-info-section {
  flex: 1;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.top-info {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  position: relative;
  overflow: hidden;
  padding: 4px 0;
}

.funding-percentage span {
  background-color: #28a745;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 500;
}

.category {
  position: absolute;
  right: 0;
  top: 0;
  margin-top: -5px;
}

.category span {
  font-size: 0.9rem;
  color: #ff0000;
  font-weight: 500;
}

/* Icons */
.icons {
  display: flex;
  gap: 0.5rem;
}

.icon-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.icon-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.icon {
  width: 20px;
  height: 20px;
}

/* Product Title and Description */
.product-name {
  font-size: 2rem;
  margin: 0.5rem 0;
  color: #333;
  font-weight: 700;
}

.product-description {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 1rem;
  font-weight: 400;
  line-height: 1.6;
}

/* Funding Info */
.funding-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex: 1;
}

.price-info {
  margin-bottom: 0.25rem;
}

.funding-price {
  font-size: 2.2rem;
  font-weight: 700;
  color: #333;
  display: block;
}

.price-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.original-price {
  font-size: 1.2rem;
  color: #666;
  text-decoration: line-through;
}

.discount-percentage {
  font-size: 1.2rem;
  color: #ff4b4b;
  font-weight: 500;
}

.funding-stats {
  flex-direction: column;
  gap: 0.5rem;
}

.funding-amount,
.funding-likes,
.funding-days-left {
  width: 100%;
  justify-content: center;
}

.funding-amount {
  color: rgb(0, 0, 0);  /* 목표 금액은 녹색 계열 */
}

.funding-likes {
  color: rgb(0, 0, 0)  /* 관심도는 빨간색 계열 */
}

.funding-days-left {
  color: #dc3545;  /* 남은 일자는 파란색 계열 */
}

/* Divider */
.divider {
  border: none;
  border-top: 1px solid #ddd;
  margin: 0.5rem 0;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  margin-top: 0.5rem;
}

.button-row {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.button-row:first-child {
  margin-bottom: 0.5rem;
}

.btn {
  height: 48px;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Noto Sans KR", sans-serif;
  font-weight: 500;
}

/* Wishlist Button */
.wishlist-btn {
  height: 48px;
  width: 48px;
  padding: 0;
  background-color: white;
  border: 2px solid #ff4b4b;
  border-radius: 8px;
  flex-shrink: 0;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wishlist-content {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.heart-icon {
  width: 32px;
  height: 32px;
  stroke: #ff4b4b;
  stroke-width: 1.5;
  transition: all 0.3s ease;
}

.wishlist-count {
  position: absolute;
  font-size: 0.85rem;
  color: #ff4b4b;
  font-weight: 700;
  z-index: 1;
  line-height: 1;
}

.wishlist-btn.active .heart-icon {
  fill: #ff4b4b;
}

.wishlist-btn.active .wishlist-count {
  color: white;
}

.wishlist-btn:hover {
  transform: scale(1.05);
  background-color: #fff1f1;
}

/* Stream Button */
.stream-btn {
  padding: 0 24px;
  min-width: 100px;
  font-weight: 600;
}

.disabled-btn {
  background-color: #6c757d;
  color: white;
  cursor: not-allowed;
  opacity: 0.7;
}

.live-btn {
  background-color: #dc3545;
  color: white;
}

.vod-btn {
  background-color: #28a745;
  color: white;
}

/* Fund Button */
.fund-btn {
  flex: 1;
  background-color: #007bff;
  color: white;
  padding: 0 24px;
}

/* Quantity Selector */
.quantity-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: white;
  border: 2px solid #e5e7eb;  /* 테두리 두께 증가 */
  border-radius: 8px;  /* 라운드 값 증가 */
  padding: 0.75rem;  /* 패딩 증가 */
  min-width: 200px;  /* 최소 너비 설정 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);  /* 그림자 추가 */
}

.quantity-btn {
  width: 36px;  /* 크기 증가 */
  height: 36px;  /* 크기 증가 */
  border: 1px solid #e5e7eb;
  background-color: #f8f9fa;  /* 배경색 추가 */
  border-radius: 8px;  /* 라운드 값 증가 */
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.4rem;  /* 폰트 크기 증가 */
  font-weight: 600;  /* 폰트 두께 증가 */
  color: #333;
  transition: all 0.2s;
}

.quantity-btn:hover:not(:disabled) {
  background-color: #e9ecef;
  border-color: #dee2e6;
}

.quantity-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
  background-color: #f1f3f5;
}

.quantity-input {
  width: 70px;  /* 너비 증가 */
  height: 36px;  /* 높이 증가 */
  border: 2px solid #e5e7eb;  /* 테두리 두께 증가 */
  border-radius: 8px;  /* 라운드 값 증가 */
  text-align: center;
  font-size: 1.1rem;  /* 폰트 크기 증가 */
  font-weight: 600;  /* 폰트 두께 증가 */
  color: #333;
  -moz-appearance: textfield;
}

.quantity-input::-webkit-inner-spin-button,
.quantity-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.quantity-input:focus {
  outline: none;
  border-color: #007bff;  /* 포커스 시 테두리 색상 변경 */
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);  /* 포커스 효과 추가 */
}

/* Total Price */
.total-price {
  flex: 1;
  text-align: right;
  font-size: 1.3rem;  /* 폰트 크기 증가 */
  font-weight: 700;  /* 폰트 두께 증가 */
  color: #333;
  padding: 0.75rem;  /* 패딩 추가 */
}

/* Loading and Error States */
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 2rem 0;
}

.spinner {
  animation: rotate 2s linear infinite;
  width: 50px;
  height: 50px;
}

.path {
  stroke: #007bff;
  stroke-linecap: round;
  animation: dash 1.5s ease-in-out infinite;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}

.error-message {
  color: red;
  text-align: center;
  margin: 2rem 0;
  font-family: "Noto Sans KR", sans-serif;
}

/* Responsive Design */
@media (max-width: 768px) {
  .product-detail-container {
    height: auto;
    flex-direction: column;
    align-items: center;
  }

  .product-info-section {
    width: 100%;
    height: auto;
  }

  .product-image-section {
    height: auto;
  }

  .action-buttons {
    min-height: 40px;
    gap: 0.5rem;
  }

  .btn {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }

  .wishlist-btn {
    width: 40px;
    height: 40px;
  }

  .heart-icon {
    width: 24px;
    height: 24px;
  }

  .wishlist-count {
    font-size: 0.75rem;
  }

  .funding-stats {
    flex-direction: column;
  }

  .funding-amount,
  .funding-participants,
  .funding-days-left {
    width: 100%;
  }
}
</style>