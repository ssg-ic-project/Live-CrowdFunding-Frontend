<!-- src/views/main/Live.vue -->
<template>
  <div class="live-page">
    <h2>라이브 방송</h2>
 

    <!-- LIVE 섹션 -->
    <div class="live-section">
      <h3>현재 방송중인 라이브</h3>
      <div class="live-list">
        <ProductItem
          v-for="live in liveNowList"
          :key="live.id"
          :product="live"
          :linkTo="{ name: 'Streaming', params: { streamId: live.id } }"
        />
      </div>
    </div>

 
    <!-- VOD 섹션 -->
    <div class="vod-section">
      <h3>지난 라이브 방송 (VOD)</h3>
      <div class="vod-list">
        <ProductItem
          v-for="vod in vodList"
          :key="vod.id"
          :product="vod"
          :linkTo="{ name: 'Streaming', params: { streamId: vod.id } }"
        />
      </div>
    </div>
  </div>
 </template>
 
 <script>
 import ProductItem from '@/components/ProductItem.vue';
 import odungImage from '@/assets/image/오둥이하트.png';
 
 export default {
  name: 'Live',
  components: {
    ProductItem,
  },
  data() {
    return {
      liveNowList: [
        {
          id: 1,
          image: odungImage,
          name: '스마트 공기청정기 특가전',
          company: '클린테크',
          price: 299000,
          achievement: 75,
          endDate: '2024-12-31',
          isLive: true
        },
        {
          id: 2,
          image: odungImage,
          name: '프리미엄 로봇청소기 런칭',
          company: '스마트홈',
          price: 459000,
          achievement: 82,
          endDate: '2024-12-31',
          isLive: true
        },
        {
          id: 3,
          image: odungImage,
          name: '무선 이어버드 프로',
          company: '사운드메이커',
          price: 189000,
          achievement: 68,
          endDate: '2024-12-31',
          isLive: true
        },
        {
          id: 4,
          image: odungImage,
          name: '스마트 도어락 신제품',
          company: '세이프홈',
          price: 259000,
          achievement: 91,
          endDate: '2024-12-31',
          isLive: true
        },
        {
          id: 5,
          image: odungImage,
          name: '홈카페 커피머신',
          company: '모닝브루',
          price: 399000,
          achievement: 85,
          endDate: '2024-12-31',
          isLive: true
        }
      ],
      vodList: [
        {
          id: 101,
          image: odungImage,
          name: '스마트워치 신제품 론칭',
          company: '테크웨어',
          price: 259000,
          achievement: 95,
          endDate: '2024-12-31',
          isVod: true
        },
        {
          id: 102,
          image: odungImage,
          name: '무선 청소기 특가전',
          company: '클린메이커',
          price: 329000,
          achievement: 88,
          endDate: '2024-12-31',
          isVod: true
        },
        {
          id: 103,
          image: odungImage,
          name: '스마트 조명 시스템',
          company: '라이트테크',
          price: 159000,
          achievement: 92,
          endDate: '2024-12-31',
          isVod: true
        },
        {
          id: 104,
          image: odungImage,
          name: '전기자전거 런칭쇼',
          company: '모빌리티',
          price: 890000,
          achievement: 87,
          endDate: '2024-12-31',
          isVod: true
        },
        {
          id: 105,
          image: odungImage,
          name: '게이밍 모니터 특가',
          company: '테크디스플레이',
          price: 449000,
          achievement: 93,
          endDate: '2024-12-31',
          isVod: true
        }
      ]
    };
  },
  methods: {
    watchLive(id) {
      this.$router.push({ name: 'Streaming', params: { streamId: id } });
    },
    watchVOD(id) {
      this.$router.push({ name: 'Streaming', params: { streamId: id } });
    }
  }
 };
 </script>
 
 <style scoped>
 .live-page {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
 }
 
 h2 {
  margin-bottom: 2rem;
  color: #333;
 }
 
 .live-section,
 .vod-section {
  margin-bottom: 3rem;
 }
 
 h3 {
  margin-bottom: 1.5rem;
  color: #333;
 }
 
 .live-list,
 .vod-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
 }
 
 @media (max-width: 768px) {
  .live-list,
  .vod-list {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 1rem;
  }
 }
 </style>