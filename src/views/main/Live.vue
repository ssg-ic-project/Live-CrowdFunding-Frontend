<!-- src/views/main/Live.vue -->
<template>
  <div class="live-page">
    <h2>라이브 방송</h2>
 

    <!-- LIVE 섹션 -->
    <div class="live-section">
      <h3>현재 방송중인 라이브</h3>
      <div class="live-list">
        <ProductItem
          v-for="live in currentLiveStreams"
          :key="live.projectId"
          :product="{
            id: live.projectId,
            image: live.imageUrl,
            name: live.productName,
            achievement: live.percentage,
            isLive: true,
            remainingTime: live.remainingTime,
            category: live.classification
          }"
          :linkTo="{ name: 'Streaming', params: { streamId: live.projectId } }"
        />
      </div>
    </div>

 
    <!-- VOD 섹션 -->
    <div class="vod-section">
      <h3>지난 라이브 방송 (VOD)</h3>
      <div class="vod-list">
        <ProductItem
          v-for="vod in pastLiveStreams"
          :key="vod.projectId"
          :product="{
            id: vod.projectId,
            image: vod.imageUrl,
            name: vod.productName,
            achievement: vod.percentage,
            isVod: true,
            remainingTime: vod.remainingTime,
            category: live.classification
          }"
          :linkTo="{ name: 'Streaming', params: { streamId: vod.projectId } }"
        />
      </div>
    </div>
  </div>
 </template>
 
 <script>
 import ProductItem from '@/components/ProductItem.vue';
 import odungImage from '@/assets/image/오둥이하트.png';
 import axios from 'axios';
 
 export const getLiveStreams = () => {
    return axios.get('/api/project/live-vod');
  };

 
 export default {
  name: 'Live',
  components: {
    ProductItem,
  },
  data() {
    return {
      streams: [],
    };
  },
  computed: {
    // 현재 방송중인 라이브 스트림 필터링
    currentLiveStreams() {
      return this.streams.filter(stream => stream.isStreaming);
    },
    // 지난 방송 (VOD) 필터링
    pastLiveStreams() {
      return this.streams.filter(stream => !stream.isStreaming);
    }
  },
  async created() {
    try {
      const response = await getLiveStreams();
      console.log('라이브 스트림 데이터:', response.data);
      this.streams = response.data;
    } catch (error) {
      console.error('라이브 스트림 데이터를 불러오는데 실패했습니다:', error);
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