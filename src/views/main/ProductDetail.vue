<template>
  <div>
    <!-- 로딩 상태 -->
    <div v-if="isLoading" class="loading-spinner">
      <svg class="spinner" viewBox="0 0 50 50">
        <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
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
            <button 
              @click.stop="prevImage" 
              class="slider-button prev-button" 
              aria-label="이전 이미지"
            >
              &#10094;
            </button>
            
            <img 
              :src="currentImage.imageUrl" 
              :alt="`${product.productName} 이미지 ${currentImageIndex + 1}`" 
              class="product-main-image" 
            />
            
            <button 
              @click.stop="nextImage" 
              class="slider-button next-button" 
              aria-label="다음 이미지"
            >
              &#10095;
            </button>
          </div>
          
          <!-- 단일 이미지 표시 -->
          <div v-else class="single-image">
            <img 
              :src="product.images[0].imageUrl" 
              :alt="product.productName" 
              class="product-main-image" 
            />
          </div>
        </div>

        <!-- 우측: 제품 정보 섹션 -->
        <div class="product-info-section">
          <!-- 상단: 펀딩 %, 카테고리, 알림, 공유 아이콘 -->
          <div class="top-info">
            <!-- 펀딩 달성률 -->
            <div class="funding-percentage">
              <span>{{ product.percentage }}% 펀딩 달성</span>
            </div>

            <!-- 카테고리 -->
            <div class="category">
              <span>카테고리: {{ product.category }}</span>
            </div>

            <!-- 알림 및 공유 아이콘 -->
            <div class="icons">
              <button @click="handleNotification" aria-label="알림" class="icon-button">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 24c1.104 0 2-.896 2-2h-4c0 1.104.896 2 2 2zm6.364-6v-5c0-3.07-1.639-5.64-4.5-6.32V6c0-.828-.672-1.5-1.5-1.5S10.364 5.172 10.364 6v.68C7.504 7.36 5.865 9.93 5.865 13v5l-1.364 1.364V20h16v-.636L18.364 18z" />
                </svg>
              </button>

              <button @click="handleShare" aria-label="공유" class="icon-button">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 16.08c-.76 0-1.44.3-1.96.77l-7.12-4.06a3.003 3.003 0 000-1.46l7.12-4.06c.52.47 1.2.77 1.96.77 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .56.19 1.09.52 1.5L8.81 9.58a1.99 1.99 0 01-2.52 0 2.005 2.005 0 010-2.82l7.12-4.06a4.005 4.005 0 00-5.08-3.06 4.005 4.005 0 00-1.16 5.94l7.12 4.06c-.33.41-.52.94-.52 1.5 0 2.76 2.24 5 5 5s5-2.24 5-5-2.24-5-5-5z" />
                </svg>
              </button>
            </div>
          </div>

          <!-- 상품명 -->
          <h1 class="product-name">{{ product.productName }}</h1>

          <!-- 상품 간단 설명 -->
          <p class="product-description">{{ product.summary }}</p>

          <!-- 펀딩 정보 -->
          <div class="funding-info">
            <div class="price-info">
              <span class="funding-price">{{ calculateDiscountedPrice }}원</span>
              <span v-if="product.discountPercentage" class="original-price">
                {{ product.price.toLocaleString() }}원
              </span>
              <span v-if="product.discountPercentage" class="discount-percentage">
                {{ product.discountPercentage }}% 할인
              </span>
            </div>
            <div class="funding-stats">
              <span class="funding-amount">목표 금액: {{ product.goalAmount.toLocaleString() }}원</span>
              <span class="funding-likes">관심: {{ product.likeCount }}명</span>
              <span class="funding-days-left">{{ daysLeft }}일 남음</span>
            </div>
          </div>

          <hr class="divider" />

          <!-- 액션 버튼-->
          <div class="action-buttons">
            <button 
              @click="toggleWishlist" 
              class="btn wishlist-btn" 
              :class="{ active: isWishlisted }" 
              aria-label="찜하기"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                :fill="isWishlisted ? '#ff4b4b' : 'none'"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </button>

            <button @click="goToPayment" class="btn fund-btn fund-btn-full">
              펀딩하기
            </button>
          </div>
        </div>
      </div>

      <!-- 상세 설명 이미지 -->
      <div v-if="product.contentImage" class="detailed-image-section">
        <img 
          :src="product.contentImage" 
          :alt="`${product.productName} 상세 이미지`" 
          class="product-detail-image" 
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import ProductItem from '@/components/ProductItem.vue';
import axios from 'axios';

export default {
  name: 'ProductDetail',
  components: {
    ProductItem,
  },
  data() {
    return {
      product: null,
      isLoading: true,
      error: false,
      currentImageIndex: 0,
      isWishlisted: false
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
    daysLeft() {
      if (!this.product) return 0;
      const endDate = new Date(this.product.endAt);
      const today = new Date();
      const diffTime = endDate - today;
      return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    },
    calculateDiscountedPrice() {
      if (!this.product) return 0;
      if (!this.product.discountPercentage) return this.product.price.toLocaleString();
      const discountedPrice = this.product.price * (1 - this.product.discountPercentage / 100);
      return Math.floor(discountedPrice).toLocaleString();
    }
  },
  async created() {
    await this.fetchProductDetail();
  },
  methods: {
    async fetchProductDetail() {
      try {
        const productId = this.$route.params.productId;
        const response = await axios.get(`/api/project/${productId}`, {
          params: {
            userId: localStorage.getItem('userId'),
          },
        });
        this.product = response.data;
        this.isWishlisted = this.product.isLiked;
      } catch (error) {
        console.error('상품 정보 로딩 실패:', error);
        this.error = true;
      } finally {
        this.isLoading = false;
      }
    },
    async toggleWishlist() {
      try {
        const userId = localStorage.getItem('userId');
        const productId = this.$route.params.productId;
        if (!userId || !productId) {
          console.log('유저id' + userId);
          console.log('프로덕트id' + productId);
          console.error('사용자 ID 또는 제품 ID가 없습니다');
          return;
        }

        const response = await axios.post(`/api/liked`, {
          userId: Number(userId),
          projectId: Number(this.product.id)
        });
        
        if (response.status === 200) {
          this.isWishlisted = !this.isWishlisted;
          this.product.isLiked = this.isWishlisted;
          localStorage.setItem(`wishlist_${this.product.id}`, this.isWishlisted);
        }
        
      } catch (err) {
        console.error('찜하기 실패:', err.response?.data || err.message);
        alert('찜하기 처리 중 오류가 발생했습니다.');
      }
    },
    handleNotification() {
      alert('알림 설정 기능은 아직 구현되지 않았습니다.');
    },
    handleShare() {
      navigator.clipboard.writeText(window.location.href)
        .then(() => {
          alert('상품 URL이 클립보드에 복사되었습니다.');
        })
        .catch(err => {
          console.error('클립보드 복사 실패:', err);
        });
    },
    goToPayment() {
      this.$router.push({ name: 'Payment', query: { productId: this.product.id } });
    },
    nextImage() {
      if (this.hasMultipleImages) {
        this.currentImageIndex = (this.currentImageIndex + 1) % this.product.images.length;
      }
    },
    prevImage() {
      if (this.hasMultipleImages) {
        this.currentImageIndex = (this.currentImageIndex - 1 + this.product.images.length) % this.product.images.length;
      }
    },
  },
};
</script>

<style scoped>
.product-detail-page {
 max-width: 1200px;
 margin: 0 auto;
 padding: 2rem;
 padding-bottom: 60px;
 font-family: 'Noto Sans KR', sans-serif;
}
.product-detail-container {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  align-items: flex-start; /* stretch에서 flex-start로 변경 */
}

.product-image-section {
  flex: 1;
  min-width: 300px;
  position: relative;
  font-size: 0; /* 이미지 아래 여백 제거 */
  line-height: 0; /* 이미지 아래 여백 제거 */
}

.image-slider {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 62.5%; /* 16:10 비율 */
  overflow: hidden;
  background-color: #f8f9fa;
  border-radius: 8px;
  margin: 0; /* 마진 제거 */
}

.product-main-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  background-color: #f8f9fa;
}

.single-image {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 62.5%;
  overflow: hidden;
  background-color: #f8f9fa;
  border-radius: 8px;
  margin: 0; /* 마진 제거 */
}

.product-info-section {
  flex: 1;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: auto; /* height: 100%에서 auto로 변경 */
}

.slider-button {
 position: absolute;
 top: 50%;
 transform: translateY(-50%);
 height: 60px;
 width: 30px;
 background-color: rgba(0,0,0,0.3);
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
 background-color: rgba(0,0,0,0.5);
}


.detailed-image-section {
 margin-top: 2rem;
 display: flex;
 justify-content: center;
}

.product-detail-image {
 width: 80%;
 height: auto;
 border-radius: 8px;
 object-fit: cover;
 box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.product-info-section {
  flex: 1;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%; /* 이미지 섹션과 동일한 높이 유지 */
}

.top-info {
 display: flex;
 justify-content: space-between;
 align-items: flex-start;
 margin-bottom: 1rem;
 position: relative;
 overflow: hidden; /* 추가 */
 padding: 4px 0; /* 패딩 추가하여 상하 여백 확보 */
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
}

.funding-stats {
 display: flex;
 flex-wrap: wrap;
 gap: 1rem;
 color: #666;
}

.funding-amount,
.funding-participants,
.funding-days-left {
 font-size: 0.95rem;
 padding: 0.5rem 1rem;
 background-color: #f8f9fa;
 border-radius: 4px;
 display: inline-flex;
 align-items: center;
 font-weight: 500;
}

.divider {
 border: none;
 border-top: 1px solid #ddd;
 margin: 0.5rem 0;
}

.action-buttons {
 display: flex;
 gap: 1rem;
 min-height: 48px;
 width: 100%;
 margin-top: 0.5rem;
 margin-bottom: 0;
}

.btn {
 padding: 0.75rem 1.5rem;
 border: none;
 border-radius: 4px;
 cursor: pointer;
 font-size: 1rem;
 transition: all 0.3s ease;
 display: flex;
 align-items: center;
 justify-content: center;
 font-family: 'Noto Sans KR', sans-serif;
 font-weight: 500;
}

.wishlist-btn {
 width: 48px;
 height: 48px;
 padding: 0;
 background-color: white;
 border: 2px solid #ff4b4b;
 flex-shrink: 0;
}

.wishlist-btn svg {
 width: 24px;
 height: 24px;
 stroke: #333;
 fill: none;
 stroke-width: 2;
}

.wishlist-btn.active {
 background-color: #ff4b4b;
}

.wishlist-btn.active svg {
 stroke: white;
 fill: #ff4b4b;
}

.live-btn, .vod-btn, .fund-btn {
 flex: 1;
}

.live-btn {
 background-color: #dc3545;
 color: white;
}

.vod-btn {
 background-color: #6c757d;
 color: white;
}

.fund-btn {
 background-color: #007bff;
 color: white;
}

.fund-btn-full {
 flex: 1;
 width: calc(100% - 64px);
}

.most-viewed-section {
 margin-top: 3rem;
}

.most-viewed-section h2 {
 margin-bottom: 1rem;
 color: var(--primary-color);
 font-weight: 700;
 font-size: 1.5rem;
}

.product-list {
 display: flex;
 gap: 1rem;
 overflow-x: auto;
 padding-bottom: 1rem;
}

.product-list::-webkit-scrollbar {
 height: 8px;
}

.product-list::-webkit-scrollbar-thumb {
 background-color: rgba(0, 0, 0, 0.2);
 border-radius: 4px;
}

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
 font-family: 'Noto Sans KR', sans-serif;
}

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



 .product-list {
   flex-wrap: nowrap;
 }

 .category-icons {
   flex-direction: column;
   align-items: flex-start;
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

 .wishlist-btn svg {
   width: 20px;
   height: 20px;
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