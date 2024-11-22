<!-- src/components/RankingCard.vue -->
<template>
    <router-link :to="{ name: 'ProductDetail', params: { productId: 1 } }" class="ranking-link">
      <div class="ranking-card">
        <div class="left-section">
          <div class="rank-badge">{{ rank }}</div>
        </div>
        <div class="image-container">
          <img :src="product.image" :alt="product.name" />
          <div v-if="product.isLive" class="live-badge">LIVE</div>
        </div>
        <div class="content">
          <h3 class="title">{{ product.name }}</h3>
          <div class="participants">
            {{ formatParticipants(product.totalUsers) }}명 참여
          </div>
        </div>
      </div>
    </router-link>
  </template>
  
  <script>
  export default {
    name: 'RankingCard',
    props: {
      product: {
        type: Object,
        required: true
      },
      rank: {
        type: Number,
        required: true
      }
    },
    methods: {
      formatParticipants(num) {
        return (num || 0).toLocaleString('ko-KR');
      }
    }
  }
  </script>
  
  <style scoped>
.ranking-card {
  display: flex;
  height: 90px; /* 높이 줄임 */
  max-width: 400px; /* 전체 가로 길이 제한 */
  width: 100%;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: relative;
}

.left-section {
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
}

.image-container {
  width: 160px; /* 16:9 비율 유지하며 크기 줄임 (90px * 16/9) */
  height: 90px;
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}


.rank-badge {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}


.content {
  flex: 1;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0; /* 텍스트 오버플로우 방지 */
}

.live-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  background: rgba(255,0,0,0.8);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  z-index: 1;
  font-weight: bold;
  font-size: 11px;
}

.image-container {
  position: relative; /* live-badge를 위한 포지셔닝 컨텍스트 */
  width: 160px;
  height: 90px;
}

.title {
  font-size: 16px;
  margin: 0 0 8px 0;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.participants {
  font-size: 14px;
  color: #666;
}

.ranking-link {
  text-decoration: none;
  display: block;
  margin-bottom: 8px;
}
  </style>