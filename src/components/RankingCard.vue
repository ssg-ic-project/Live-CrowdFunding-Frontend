<!-- src/components/RankingCard.vue -->
<template>
    <router-link :to="{ name: 'ProductDetail', params: { productId: product.id } }" class="ranking-link">
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
            {{ product.achievement }}% 달성
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
    height: 90px;
    max-width: 400px;
    width: 100%;
    background: white;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid rgba(109, 99, 255, 0.1);
    position: relative;
    transition: all 0.3s ease;
  }
  
  .ranking-card:hover {
    border-color: #9E94F8;
    background-color: rgba(109, 99, 255, 0.05);
  }
  
  .left-section {
    width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(158, 148, 248, 0.1);
  }
  
  .image-container {
    position: relative;
    width: 160px;
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
    color: #6D63FF;
  }
  
  .content {
    flex: 1;
    padding: 12px 16px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-width: 0;
  }
  
  .live-badge {
    position: absolute;
    top: 8px;
    left: 8px;
    background: #6D63FF;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    z-index: 1;
    font-weight: bold;
    font-size: 12px;
    transition: background-color 0.3s ease;
  }
  
  .live-badge:hover {
    background: #9E94F8;
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
    color: #6D63FF;
    font-weight: 500;
  }
  
  .ranking-link {
    text-decoration: none;
    display: block;
    margin-bottom: 8px;
  }
  </style>