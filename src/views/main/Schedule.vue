<!-- src/views/main/Schedule.vue -->
<template>
  <div class="schedule-page">
    <h1>편성표</h1>
    
    <!-- 날짜 네비게이션 -->
    <div class="date-navigation">
      <div 
        v-for="date in dateRange" 
        :key="date"
        :class="['date-tab', { active: selectedDate === formatDateForCompare(date) }]"
        @click="selectedDate = formatDateForCompare(date)"
      >
        <div class="day-name">{{ formatDayName(date) }}</div>
        <div class="date-number">{{ formatDateForDisplay(date) }}</div>
      </div>
    </div>
    
    <!-- 선택된 날짜의 편성표 -->
    <div v-if="selectedDateSchedules.length > 0" class="schedule-list">
      <div v-for="schedule in selectedDateSchedules" :key="schedule.projectId" class="schedule-card">
        <div class="thumbnail">
          <img :src="schedule.thumbnailUrl" :alt="schedule.productName" />
          <span class="broadcast-time">{{ schedule.time }}</span>
        </div>
        
        <div class="schedule-info">
          <h3 class="product-name">{{ schedule.productName }}</h3>
          <p class="company-name">{{ schedule.makerName }}</p>
          <div class="price-info">
            <p class="original-price">{{ formatPrice(schedule.originalPrice) }}원</p>
            <p class="discounted-price">{{ formatPrice(schedule.discountedPrice) }}원</p>
            <span class="discount-percentage">{{ schedule.percentage }}%</span>
          </div>
          <button @click="goToProduct(schedule.projectId)" class="product-button">
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
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

export default {
  name: 'Schedule',
  setup() {
    const router = useRouter();
    const schedules = ref([]);
    const loading = ref(false);
    const error = ref(null);
    
    // 오늘 날짜 기준으로 7일간의 날짜 배열 생성
    const dateRange = computed(() => {
      const dates = [];
      const today = new Date();
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        dates.push(date);
      }
      
      return dates;
    });

    // 선택된 날짜 상태 (기본값: 오늘)
    const selectedDate = ref(formatDateForCompare(new Date()));

    // API로부터 스케줄 데이터 불러오기
    const fetchSchedules = async () => {
      try {
        loading.value = true;
        const response = await axios.get('/api/schedule/chart');
        schedules.value = response.data;
        console.log('Fetched schedules:', schedules.value); // 데이터 확인용
      } catch (err) {
        error.value = '스케줄을 불러오는데 실패했습니다.';
        console.error('Schedule fetch error:', err);
      } finally {
        loading.value = false;
      }
    };

    // 날짜 포맷 함수들
    function formatDateForCompare(date) {
      // Date 객체를 MM.DD 형식으로 변환
      if (typeof date === 'string') {
        date = new Date(date);
      }
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${month}.${day}`;
    }

    function formatDateForDisplay(date) {
      // Date 객체를 M.D 형식으로 변환 (앞의 0 제거)
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${month}.${day}`;
    }

    // 선택된 날짜의 스케줄만 필터링
    const selectedDateSchedules = computed(() => {
      console.log('Selected date:', selectedDate.value); // 선택된 날짜 확인
      console.log('Available schedules:', schedules.value); // 현재 스케줄 확인
      return schedules.value.filter(schedule => schedule.date === selectedDate.value);
    });

    const formatDayName = (date) => {
      const days = ['일', '월', '화', '수', '목', '금', '토'];
      return days[date.getDay()];
    };

    const formatPrice = (price) => {
      return new Intl.NumberFormat('ko-KR').format(price);
    };

    const goToProduct = (projectId) => {
      router.push(`/product/${projectId}`);
    };

    // 컴포넌트 마운트 시 데이터 로드
    onMounted(() => {
      fetchSchedules();
    });

    return {
      dateRange,
      selectedDate,
      selectedDateSchedules,
      formatDayName,
      formatDateForDisplay,
      formatDateForCompare,
      formatPrice,
      goToProduct,
      loading,
      error
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