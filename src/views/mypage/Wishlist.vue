<!-- src/views/mypage/Wishlist.vue -->
<template>
  <div class="wishlist-page">
    <div class="header">
      <h2>찜 목록</h2>
      <span class="count">(총 {{ wishlist.length }}개)</span>
    </div>
    <div class="product-grid">
      <div v-for="product in wishlist" :key="product.id" class="product-card">
        <div class="image-container">
          <img :src="product.image" :alt="product.name" />

          
          <!-- 하트 아이콘 -->
          <button @click.stop="toggleWishlist(product)" class="wishlist-btn">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              :fill="product.isWished ? '#ff4b4b' : 'none'"
              stroke="#ff4b4b"
              stroke-width="2"
              class="heart-icon"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </button>


          <!-- LIVE 뱃지 -->
          <div v-if="product.isLive" class="live-badge">
            <svg class="live-icon" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="8" stroke="white" stroke-width="2" fill="none"/>
              <circle cx="12" cy="12" r="3" fill="white"/>
            </svg>
            LIVE
          </div>
        </div>
        <div class="product-info">
          <div class="achievement">{{ product.achievement }}% 달성</div>
          <h3 class="product-name">{{ product.name }}</h3>
          <p class="company">{{ product.company }}</p>
          <div class="price">{{ formatPrice(product.price) }}원</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import odungImage from '@/assets/image/오둥이하트.png';

export default {
  name: 'Wishlist',
  setup() {
    const wishlist = ref([
      {
        id: 1,
        image: odungImage,
        name: '스마트 LED 모션센서',
        company: '테크라이트',
        price: 89000,
        achievement: 75,
        isWished: true,
        isLive: true
      },
      {
        id: 2,
        image: odungImage,
        name: '무선 공기청정기 미니',
        company: '퓨어에어',
        price: 159000,
        achievement: 82,
        isWished: true,
        isLive: false
      },
      {
        id: 3,
        image: odungImage,
        name: '접이식 전동킥보드',
        company: '모빌리티플러스',
        price: 429000,
        achievement: 91,
        isWished: true,
        isLive: true
      },
      {
        id: 4,
        image: odungImage,
        name: '스마트 온도조절 텀블러',
        company: '테크컵',
        price: 49000,
        achievement: 65,
        isWished: true,
        isLive: false
      },
      {
        id: 5,
        image: odungImage,
        name: '무선 게이밍 마우스',
        company: '게이밍기어',
        price: 89000,
        achievement: 88,
        isWished: true,
        isLive: true
      },
      {
        id: 6,
        image: odungImage,
        name: '스마트 도어락',
        company: '세이프홈',
        price: 239000,
        achievement: 73,
        isWished: true,
        isLive: false
      },
      {
        id: 7,
        image: odungImage,
        name: '휴대용 UV 살균기',
        company: '클린테크',
        price: 69000,
        achievement: 95,
        isWished: true,
        isLive: true
      },
      {
        id: 8,
        image: odungImage,
        name: '스마트 플랜트 팟',
        company: '그린라이프',
        price: 79000,
        achievement: 68,
        isWished: true,
        isLive: false
      },
      {
        id: 9,
        image: odungImage,
        name: '무선 블루투스 스피커',
        company: '사운드웨이브',
        price: 129000,
        achievement: 87,
        isWished: true,
        isLive: true
      },
      {
        id: 10,
        image: odungImage,
        name: '접이식 전동자전거',
        company: '에코모빌리티',
        price: 890000,
        achievement: 79,
        isWished: true,
        isLive: false
      }
    ]);

    const formatPrice = (price) => {
      return new Intl.NumberFormat('ko-KR').format(price);
    };

    const toggleWishlist = (product) => {
      const index = wishlist.value.findIndex(p => p.id === product.id);
      if (index !== -1) {
        wishlist.value = wishlist.value.filter(p => p.id !== product.id);
      }
    };

    return {
      wishlist,
      toggleWishlist,
      formatPrice
    };
  }
};
</script>

<style scoped>
.wishlist-page {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

h2 {
  margin: 0;
  color: #000;
}

.count {
  color: #666;
  font-size: 1.1rem;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.product-card {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  background: white;
  transition: transform 0.2s ease;
}

.product-card:hover {
  transform: translateY(-5px);
}

.image-container {
  position: relative;
  width: 100%;
  padding-bottom: 75%;
}

.image-container img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.wishlist-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background: white;
  border: none;
  cursor: pointer;
  z-index: 1; /* z-index 값을 1로 변경 */
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.heart-icon {
  width: 16px;
  height: 16px;
}

.live-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  background-color: #ff4b4b;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 4px;
}

.live-icon {
  width: 12px;
  height: 12px;
}

.product-info {
  padding: 0.75rem;
}

.achievement {
  color: #28a745;
  font-size: 0.85rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
}

.product-name {
  font-size: 1rem;
  margin: 0.25rem 0;
  color: #000;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.company {
  color: #666;
  font-size: 0.85rem;
  margin: 0.25rem 0;
}

.price {
  font-weight: bold;
  font-size: 1rem;
  color: #000;
}

@media (max-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  }
}
</style>