<!-- src/views/mypage/FundingParticipation.vue -->
<template>
  <div class="funding-participation-page">
    <div class="header">
      <h2>펀딩 참여 내역</h2>
      <div class="search-box">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="펀딩 내역 검색"
          @input="handleSearch"
        />
      </div>
    </div>
 
    <!-- 펀딩 목록 -->
    <div class="funding-list">
      <div 
        v-for="funding in filteredFundings" 
        :key="funding.id" 
        class="funding-card"
      >
        <div class="funding-date">{{ funding.date }}</div>
        <div class="funding-content">
          <div class="funding-image">
            <img :src="funding.image" :alt="funding.productName" />
          </div>
          <div class="funding-details">
            <h3 class="product-name">{{ funding.productName }}</h3>
            <div class="option-info">
              <span class="option-name">{{ funding.optionName }}</span>
              <span class="option-quantity">{{ funding.quantity }}개</span>
            </div>
            <div class="price">{{ formatPrice(funding.price) }}원</div>
          
          </div>
        </div>
      </div>
    </div>
  </div>
 </template>
 
 <script>
 import { ref, computed } from 'vue';
 import odungImage from '@/assets/image/오둥이하트.png';
 
 export default {
  name: 'FundingParticipation',
  setup() {
    const searchQuery = ref('');
    const fundings = ref([
      {
        id: 1,
        productName: '스마트 홈 IoT 디바이스',
        optionName: '프리미엄 패키지',
        quantity: 2,
        price: 299000,
        date: '2024-03-15',
        status: '진행중',
        image: odungImage
      },
      {
        id: 2,
        productName: '무선 청소기 Pro',
        optionName: '블랙 에디션',
        quantity: 1,
        price: 450000,
        date: '2024-03-10',
        status: '배송완료',
        image: odungImage
      },
      {
        id: 3,
        productName: '스마트 커피메이커',
        optionName: '기본 패키지',
        quantity: 1,
        price: 189000,
        date: '2024-03-05',
        status: '진행중',
        image: odungImage
      },
      {
        id: 4,
        productName: '공기청정기 신제품',
        optionName: '하이엔드 모델',
        quantity: 1,
        price: 699000,
        date: '2024-02-28',
        status: '펀딩실패',
        image: odungImage
      },
      {
        id: 5,
        productName: '스마트 워치 X1',
        optionName: '실버 스페셜',
        quantity: 3,
        price: 159000,
        date: '2024-02-20',
        status: '배송완료',
        image: odungImage
      },
      {
        id: 6,
        productName: '로봇 청소기 AI',
        optionName: '플래티넘 에디션',
        quantity: 1,
        price: 890000,
        date: '2024-02-15',
        status: '진행중',
        image: odungImage
      }
    ]);
 
    const filteredFundings = computed(() => {
      return fundings.value.filter(funding =>
        funding.productName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        funding.optionName.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    });
 
    const formatPrice = (price) => {
      return new Intl.NumberFormat('ko-KR').format(price);
    };
 
    const handleSearch = () => {
    };
 
    return {
      searchQuery,
      filteredFundings,
      formatPrice,
      handleSearch
    };
  }
 };
 </script>
 
 <style scoped>
 .funding-participation-page {
  padding: 2rem;
 }
 
 .header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
 }
 
 .search-box input {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 150px;
  font-size: 1rem;
 }
 
 .funding-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
 }
 
 .funding-card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
 }
 
 .funding-date {
  color: #666;
  margin-bottom: 1rem;
  font-size: 0.9rem;
 }
 
 .funding-content {
  display: flex;
  gap: 2rem;
 }
 
 .funding-image {
  width: 120px;
  height: 120px;
  flex-shrink: 0;
 }
 
 .funding-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
 }
 
 .funding-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
 }
 
 .product-name {
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0;
 }
 
 .option-info {
  color: #666;
  display: flex;
  gap: 1rem;
 }
 
 .price {
  font-weight: bold;
  color: #000;
  font-size: 1.1rem;
 }
 
 .status {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: bold;
 }
 
 .status.진행중 {
  background-color: #e3f2fd;
  color: #1976d2;
 }
 
 .status.배송완료 {
  background-color: #e8f5e9;
  color: #2e7d32;
 }
 
 .status.펀딩실패 {
  background-color: #ffebee;
  color: #c62828;
 }
 
 @media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
 
  .search-box input {
    width: 100%;
  }
 
  .funding-content {
    flex-direction: column;
  }
 
  .funding-image {
    width: 100%;
    height: 200px;
  }
 }
 </style>