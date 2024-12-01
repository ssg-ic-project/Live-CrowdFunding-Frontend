<!-- src/views/main/Live.vue -->
<template>
  <div class="broadcast-container">
    <!-- 상단 메뉴바 -->
    <div class="menu-bar">
      <div 
        v-for="menu in menus" 
        :key="menu.id"
        :class="['menu-item', { active: selectedMenu === menu.id }]"
        @click="selectedMenu = menu.id"
      >
        {{ menu.name }}
      </div>
    </div>

    <!-- 컨텐츠 영역 -->
    <div class="content-area">
      <!-- LIVE 컨텐츠 -->
      <div v-if="selectedMenu === 'live'" class="content-section">
        <h3>현재 방송중인 라이브</h3>
        <div class="grid-list">
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
              category: live.classification,
            }"
            :linkTo="{ name: 'Streaming', params: { streamId: live.projectId } }"
          />
        </div>
      </div>

      <!-- VOD 컨텐츠 -->
      <div v-if="selectedMenu === 'vod'" class="content-section">
        <h3>지난 라이브 방송 (VOD)</h3>
        <div class="grid-list">
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
              category: vod.classification,
            }"
            :linkTo="{ name: 'VODRoom', params: { streamId: vod.projectId } }"
          />
        </div>
      </div>

      <!-- 편성표 컨텐츠 -->
      <div v-if="selectedMenu === 'schedule'" class="content-section">
        <h3>방송 편성표</h3>
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
        
        <div v-if="selectedDateSchedules.length > 0" class="schedule-list">
          <div v-for="schedule in selectedDateSchedules" :key="schedule.projectId" class="schedule-card">
            <div class="thumbnail">
              <img :src="schedule.thumbnailUrl" :alt="schedule.productName" />
              <span class="broadcast-time">{{ schedule.time }}</span>
            </div>
            
            <div class="schedule-info">
              <h4 class="product-name">{{ schedule.productName }}</h4>
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

        <div v-else class="no-content">
          <p>해당 날짜에 예정된 라이브 방송이 없습니다.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import ProductItem from "@/components/ProductItem1.vue";
import axios from "axios";
import { useRouter } from 'vue-router';

export const getLiveStreams = () => {
  return axios.get("/api/project/live-vod");
};

export default {
  name: 'Live',
  
  components: {
    ProductItem
  },
  
  setup() {
    const router = useRouter();
    const menus = [
      { id: 'live', name: 'LIVE' },
      { id: 'vod', name: 'VOD' },
      { id: 'schedule', name: '편성표' }
    ];
    
    const selectedMenu = ref('live');
    const streams = ref([]);
    const schedules = ref([]);
    const selectedDate = ref(formatDateForCompare(new Date()));

    // LIVE/VOD 관련 computed
    const currentLiveStreams = computed(() => {
      return streams.value.filter((stream) => stream.isStreaming);
    });

    const pastLiveStreams = computed(() => {
      return streams.value.filter((stream) => !stream.isStreaming);
    });

    // 편성표 관련 computed
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

    const selectedDateSchedules = computed(() => {
      return schedules.value.filter(schedule => schedule.date === selectedDate.value);
    });

    // 데이터 로드 함수들
    const loadStreamData = async () => {
      try {
        const response = await getLiveStreams();
        console.log("라이브 스트림 데이터:", response.data);
        streams.value = response.data;
      } catch (error) {
        console.error("라이브 스트림 데이터를 불러오는데 실패했습니다:", error);
      }
    };

    const loadScheduleData = async () => {
      try {
        const response = await axios.get('/api/schedule/chart');
        schedules.value = response.data;
      } catch (error) {
        console.error("스케줄 데이터를 불러오는데 실패했습니다:", error);
      }
    };

    // 유틸리티 함수들
    function formatDateForCompare(date) {
      if (typeof date === 'string') {
        date = new Date(date);
      }
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${month}.${day}`;
    }

    function formatDateForDisplay(date) {
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${month}.${day}`;
    }

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

    // 초기 데이터 로드
    loadStreamData();
    loadScheduleData();
    
    return {
      menus,
      selectedMenu,
      streams,
      currentLiveStreams,
      pastLiveStreams,
      dateRange,
      selectedDate,
      selectedDateSchedules,
      formatDateForCompare,
      formatDateForDisplay,
      formatDayName,
      formatPrice,
      goToProduct
    };
  }
};
</script>

<style scoped>
.broadcast-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

/* 메뉴바 스타일 */
.menu-bar {
  display: flex;
  gap: 2rem;
  padding: 1rem 0;
  margin-bottom: 2rem;
  border-bottom: 1px solid rgba(255, 81, 81, 0.2);
}

.menu-item {
  font-size: 1.1rem;
  color: #666666;
  cursor: pointer;
  padding: 0.5rem 0;
  transition: all 0.3s ease;
}

.menu-item:hover {
  color: #FF5151;
}

.menu-item.active {
  color: #FF5151;
  font-weight: 500;
}

/* 공통 섹션 스타일 */
.content-section {
  margin-bottom: 3rem;
}

h3 {
  margin-bottom: 1.5rem;
  color: #FF5151;
  font-weight: bold;
}

.grid-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
}

/* 편성표 특화 스타일 */
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
  color: #666666;
}

.date-tab:hover {
  background-color: rgba(255, 81, 81, 0.1);
}

.date-tab.active {
  background-color: #FF5151;
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
  background: #FF5151;
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
  color: #333333;
}

.company-name {
  color: #666666;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.price-info {
  margin-bottom: 1rem;
}

.original-price {
  color: #666666;
  text-decoration: line-through;
  margin: 0;
}

.discounted-price {
  color: #FF5151;
  font-size: 1.1rem;
  font-weight: bold;
  margin: 0.25rem 0;
}

.discount-percentage {
  color: #FF5151;
  font-weight: bold;
  margin-left: 0.5rem;
}

.product-button {
  align-self: flex-start;
  background-color: #FF5151;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.product-button:hover {
  background-color: #FFD74E;
}

.no-content {
  text-align: center;
  padding: 3rem;
  color: #666666;
}

@media (max-width: 768px) {
  .broadcast-container {
    padding: 0.5rem;
  }
  
  .menu-bar {
    gap: 1rem;
    padding: 0.5rem 0;
  }
  
  .menu-item {
    font-size: 1rem;
  }
  
  .grid-list {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 1rem;
  }

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