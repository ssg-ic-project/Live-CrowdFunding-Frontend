<!-- src/views/main/Schedule.vue -->
<template>
  <div class="schedule-page">
    <h1>편성표</h1>
    
    <!-- 날짜 네비게이션 -->
    <div class="date-navigation">
      <div 
        v-for="date in dateRange" 
        :key="date"
        :class="['date-tab', { active: selectedDate === date }]"
        @click="selectedDate = date"
      >
        <div class="day-name">{{ formatDayName(date) }}</div>
        <div class="date-number">{{ formatDateNumber(date) }}</div>
      </div>
    </div>
    
    <!-- 선택된 날짜의 편성표 -->
    <div v-if="selectedDateSchedules.length > 0" class="schedule-list">
      <div v-for="schedule in selectedDateSchedules" :key="schedule.id" class="schedule-card">
        <div class="thumbnail">
          <img :src="schedule.thumbnail" :alt="schedule.productName" />
          <span class="broadcast-time">{{ schedule.time }}</span>
        </div>
        
        <div class="schedule-info">
          <h3 class="product-name">{{ schedule.productName }}</h3>
          <p class="company-name">{{ schedule.company }}</p>
          <p class="price">{{ formatPrice(schedule.price) }}원</p>
          <p class="description">{{ schedule.description }}</p>
          <button @click="goToProduct(schedule.productId)" class="product-button">
            상품 보러가기
          </button>
        </div>
      </div>
    </div>

    <div v-else class="no-schedules">
      <p>해당 날짜에 예정된 라이브 방송이 없습니다.</p>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import odungImage from '@/assets/image/오둥이하트.png';

export default {
  name: 'Schedule',
  setup() {
    const router = useRouter();
    
    const schedules = ref([
  // 11월 21일 방송
  {
    id: 1,
    date: '2024-11-21',
    time: '10:00',
    productId: 101,
    productName: '스마트 공기청정기 2024',
    company: '클린에어테크',
    price: 299000,
    description: '신개념 AI 탑재 공기청정기 런칭 방송',
    thumbnail: odungImage
  },
  {
    id: 2,
    date: '2024-11-21',
    time: '14:00',
    productId: 102,
    productName: '무선 로봇청소기 MAX',
    company: '스마트클린',
    price: 459000,
    description: '신제품 첫 공개 특별 할인 방송',
    thumbnail: odungImage
  },
  {
    id: 3,
    date: '2024-11-21',
    time: '19:00',
    productId: 103,
    productName: '프리미엄 식기세척기',
    company: '키친플러스',
    price: 899000,
    description: '신제품 출시 기념 특가',
    thumbnail: odungImage
  },

  // 11월 22일 방송
  {
    id: 4,
    date: '2024-11-22',
    time: '11:00',
    productId: 104,
    productName: '스마트 와인셀러',
    company: '와인테크',
    price: 890000,
    description: '프리미엄 와인셀러 론칭 특가',
    thumbnail: odungImage
  },
  {
    id: 5,
    date: '2024-11-22',
    time: '15:30',
    productId: 105,
    productName: '접이식 전기자전거',
    company: '모빌리티플러스',
    price: 1290000,
    description: '차세대 전기자전거 사전예약',
    thumbnail: odungImage
  },
  {
    id: 6,
    date: '2024-11-22',
    time: '20:00',
    productId: 106,
    productName: '게이밍 노트북 Pro',
    company: '테크스타',
    price: 2199000,
    description: '최신 게이밍 노트북 특별 할인',
    thumbnail: odungImage
  },

  // 11월 23일 방송
  {
    id: 7,
    date: '2024-11-23',
    time: '12:00',
    productId: 107,
    productName: '스마트 도어락 PRO',
    company: '세이프홈',
    price: 259000,
    description: '새로운 보안시스템 첫 공개',
    thumbnail: odungImage
  },
  {
    id: 8,
    date: '2024-11-23',
    time: '16:00',
    productId: 108,
    productName: '올인원 PC 모니터',
    company: '테크비전',
    price: 549000,
    description: '신제품 출시 기념 특별 방송',
    thumbnail: odungImage
  },
  {
    id: 9,
    date: '2024-11-23',
    time: '19:30',
    productId: 109,
    productName: '프리미엄 블렌더',
    company: '키친마스터',
    price: 399000,
    description: '신제품 론칭 특별 할인',
    thumbnail: odungImage
  },

  // 11월 24일 방송
  {
    id: 10,
    date: '2024-11-24',
    time: '11:30',
    productId: 110,
    productName: '무선 게이밍 헤드셋',
    company: '사운드프로',
    price: 189000,
    description: '프로게이머 추천 신제품',
    thumbnail: odungImage
  },
  {
    id: 11,
    date: '2024-11-24',
    time: '14:00',
    productId: 111,
    productName: '스마트 커피머신',
    company: '홈카페',
    price: 399000,
    description: '신제품 론칭 특별 할인',
    thumbnail: odungImage
  },
  {
    id: 12,
    date: '2024-11-24',
    time: '18:00',
    productId: 112,
    productName: '공기압 마사지기',
    company: '헬스케어플러스',
    price: 299000,
    description: '홈케어 마사지기 특가',
    thumbnail: odungImage
  },

  // 11월 25일 방송
  {
    id: 13,
    date: '2024-11-25',
    time: '10:30',
    productId: 113,
    productName: '프리미엄 안마의자',
    company: '헬스케어텍',
    price: 2290000,
    description: '2024년형 신제품 공개',
    thumbnail: odungImage
  },
  {
    id: 14,
    date: '2024-11-25',
    time: '15:00',
    productId: 114,
    productName: '스마트 인덕션',
    company: '키친플러스',
    price: 729000,
    description: '신기술 탑재 신제품 특가',
    thumbnail: odungImage
  },
  {
    id: 15,
    date: '2024-11-25',
    time: '19:00',
    productId: 115,
    productName: '무선청소기 Max V2',
    company: '클린테크',
    price: 599000,
    description: '2024년형 신제품 특가',
    thumbnail: odungImage
  },

  // 11월 26일 방송
  {
    id: 16,
    date: '2024-11-26',
    time: '11:00',
    productId: 116,
    productName: '스마트 워치 Pro',
    company: '테크웨어',
    price: 399000,
    description: '신제품 런칭 특별 방송',
    thumbnail: odungImage
  },
  {
    id: 17,
    date: '2024-11-26',
    time: '14:30',
    productId: 117,
    productName: '공기청정 제습기',
    company: '클린라이프',
    price: 549000,
    description: '올인원 공기케어 가전',
    thumbnail: odungImage
  },
  {
    id: 18,
    date: '2024-11-26',
    time: '20:00',
    productId: 118,
    productName: '게이밍 데스크탑',
    company: '게이밍프로',
    price: 1899000,
    description: '고성능 게이밍 PC 특가',
    thumbnail: odungImage
  },

  // 11월 27일 방송
  {
    id: 19,
    date: '2024-11-27',
    time: '12:00',
    productId: 119,
    productName: '스마트 TV 65인치',
    company: '비전테크',
    price: 1490000,
    description: '2024년형 프리미엄 TV',
    thumbnail: odungImage
  },
  {
    id: 20,
    date: '2024-11-27',
    time: '16:00',
    productId: 120,
    productName: '무선 이어버드 Pro',
    company: '사운드테크',
    price: 249000,
    description: '프리미엄 사운드 신제품',
    thumbnail: odungImage
  },
  {
    id: 21,
    date: '2024-11-27',
    time: '19:30',
    productId: 121,
    productName: '스마트 냉장고',
    company: '홈아트테크',
    price: 1799000,
    description: 'AI 기능 탑재 신제품',
    thumbnail: odungImage
  }
]);

    // 오늘 날짜 기준으로 7일간의 날짜 배열 생성
    const dateRange = computed(() => {
      const dates = [];
      const today = new Date();
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        dates.push(date.toISOString().split('T')[0]);
      }
      
      return dates;
    });

    // 선택된 날짜 상태 (기본값: 오늘)
    const selectedDate = ref(new Date().toISOString().split('T')[0]);

    // 선택된 날짜의 스케줄만 필터링
    const selectedDateSchedules = computed(() => {
      return schedules.value.filter(schedule => schedule.date === selectedDate.value);
    });

    const formatDayName = (dateStr) => {
      const date = new Date(dateStr);
      const days = ['일', '월', '화', '수', '목', '금', '토'];
      return days[date.getDay()];
    };

    const formatDateNumber = (dateStr) => {
      const date = new Date(dateStr);
      return `${date.getMonth() + 1}.${date.getDate()}`;
    };

    const formatPrice = (price) => {
      return new Intl.NumberFormat('ko-KR').format(price);
    };

    const goToProduct = (productId) => {
      router.push(`/product/${productId}`);
    };

    return {
      dateRange,
      selectedDate,
      selectedDateSchedules,
      formatDayName,
      formatDateNumber,
      formatPrice,
      goToProduct
    };
  }
};
</script>

<style scoped>
.schedule-page {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

/* 날짜 네비게이션 스타일 */
.date-navigation {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.date-tab {
  flex: 1;
  text-align: center;
  padding: 0.75rem;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.date-tab:hover {
  background-color: #f5f5f5;
}

.date-tab.active {
  background-color: #007bff;
  color: white;
}

.day-name {
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.date-number {
  font-size: 1.1rem;
  font-weight: bold;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
}

.schedule-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.schedule-card {
  display: flex;
  gap: 1.5rem;
  background: white;
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s ease;
}

.schedule-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.thumbnail {
  position: relative;
  width: 200px;
  height: 150px;
  flex-shrink: 0;
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.broadcast-time {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(0,0,0,0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9rem;
}

.schedule-info {
  flex: 1;
  padding: 1rem;
  display: flex;
  flex-direction: column;
}

.product-name {
  font-size: 1.2rem;
  margin: 0 0 0.5rem 0;
  color: #333;
}

.company-name {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.price {
  font-weight: bold;
  color: #ff4b4b;
  margin-bottom: 0.5rem;
}

.description {
  color: #666;
  font-size: 0.95rem;
  margin-bottom: 1rem;
}

.product-button {
  align-self: flex-start;
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.product-button:hover {
  background-color: #0056b3;
}

.no-schedules {
  text-align: center;
  padding: 3rem;
  color: #666;
}

@media (max-width: 768px) {
  .date-navigation {
    overflow-x: auto;
    justify-content: flex-start;
    padding: 0.5rem;
  }

  .date-tab {
    flex: 0 0 auto;
    min-width: 70px;
  }

  .schedule-card {
    flex-direction: column;
  }

  .thumbnail {
    width: 100%;
    height: 200px;
  }

  .schedule-info {
    padding: 1rem;
  }

  .product-button {
    width: 100%;
    text-align: center;
  }
}
</style>