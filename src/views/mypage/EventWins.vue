<!-- src/views/mypage/EventWins.vue -->
<template>
  <div class="event-wins-page">
    <div class="header">
      <h2>이벤트 당첨 내역</h2>
      <span class="count">총 {{ events.length }}건</span>
    </div>
 
    <div class="events-list">
      <div v-for="event in events" :key="event.id" class="event-item">
        <div class="event-date">{{ event.date }}</div>
        <div class="event-content">
          <div class="broadcast-name">{{ event.broadcastName }}</div>
          <div class="prize-info">
            <span class="prize-label">당첨항목</span>
            <span class="prize">{{ event.prize }}</span>
          </div>
        </div>
      </div>
 
      
      <!-- 당첨 내역이 없을 경우 -->
      <div v-if="events.length === 0" class="no-events">
        당첨 내역이 없습니다.
      </div>
    </div>
  </div>
 </template>
 
 <script>
 export default {
  name: 'EventWins',
  data() {
    return {
      events: [
        {
          id: 1,
          date: '2024.03.15',
          broadcastName: '스마트 홈 IoT 디바이스 런칭 방송',
          prize: '신세계 상품권 5만원'
        },
        {
          id: 2,
          date: '2024.03.10',
          broadcastName: '봄맞이 주방용품 특가전',
          prize: '에어프라이어 5L'
        },
        {
          id: 3,
          date: '2024.03.05',
          broadcastName: '프리미엄 가전제품 론칭쇼',
          prize: '커피머신 미니'
        },
        {
          id: 4,
          date: '2024.02.28',
          broadcastName: '로봇청소기 신제품 론칭방송',
          prize: '모바일 쿠폰 3만원'
        },
        {
          id: 5,
          date: '2024.02.20',
          broadcastName: '스마트워치 특별전',
          prize: '무선이어버드'
        }
      ]
    };
  }
 };
 </script>
 
 <style scoped>
 .event-wins-page {
  padding: 2rem;
  max-width: 800px;
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
  font-size: 1.5rem;
 }
 
 .count {
  color: #666;
  font-size: 1rem;
 }
 
 .events-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
 }
 
 .event-item {
  display: flex;
  gap: 2rem;
  padding: 1.5rem;
  background-color: white;
  border-radius: 8px;
  border: 1px solid #eee;
 }
 
 .event-date {
  color: #666;
  font-size: 0.9rem;
  min-width: 90px;
 }
 
 .event-content {
  flex: 1;
 }
 
 .broadcast-name {
  font-size: 1rem;
  color: #000;
  margin-bottom: 0.5rem;
 }
 
 .prize-info {
  display: flex;
  align-items: center;
  gap: 1rem;
 }
 
 .prize-label {
  color: #666;
  font-size: 0.9rem;
 }
 
 .prize {
  color: #ff4b4b;
  font-weight: 500;
 }
 
 .no-events {
  text-align: center;
  color: #666;
  padding: 3rem 0;
 }
 
 @media (max-width: 768px) {
  .event-item {
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem;
  }
 
  .event-date {
    color: #666;
  }
 
  .prize-info {
    margin-top: 0.5rem;
  }
 }
 </style>