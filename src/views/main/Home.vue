<!-- src/views/main/Home.vue -->
<template>
  <div class="full-width-banner">
    <BannerSlider />
  </div>
  <div class="home">
    <CategoryList />

    <div class="main-content-grid">
      <section class="live-section" v-if="!isLoading && !error">
        <h2>라이브 상품</h2>
        <div class="product-grid">
          <ProductItem
            v-for="product in liveProducts.slice(0, 12)"
            :key="product.id"
            :product="product"
            @click="handleProductClick"
          />
        </div>
      </section>

      <section class="ranking-section" v-if="!isLoading && !error">
        <h2>실시간 인기 상품</h2>
        <div class="ranking-list">
          <RankingCard
            v-for="(product, index) in rankingProducts.slice(0, 10)"
            :key="product.id"
            :product="product"
            :rank="index + 1"
            @click="handleProductClick"
          />
        </div>
      </section>
    </div>

    <div v-if="isLoading" class="loading">로딩 중...</div>
    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from 'vue-router';
import { useStreaming } from '@/composables/useStreaming';
import BannerSlider from "@/components/BannerSlider.vue";
import CategoryList from "@/components/CategoryList.vue";
import ProductItem from "@/components/ProductItem.vue";
import RankingCard from "@/components/RankingCard.vue";
import axios from 'axios';
import { Client } from '@stomp/stompjs';
export default {
  name: "Home",
  components: {
    BannerSlider,
    CategoryList,
    ProductItem,
    RankingCard,
  },
  setup() {
    const router = useRouter();
    const rankingProducts = ref([]);
    const liveProducts = ref([]);
    const isLoading = ref(true);
    const error = ref(null);
    const stompClient = ref(null);
    const { joinRoom, userName, userRole, roomId, socket, initializeSocket } = useStreaming();

    const connectWebSocket = () => {
      console.log('웹소켓 연결 시도 URL:', 'wss://127.0.0.1:5173/ws');  // URL 확인용
      stompClient.value = new Client({
        brokerURL: 'ws://localhost:8080/ws',
        debug: function (str) {
          console.log('STOMP: ' + str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onStompError: (frame) => {
          console.error('STOMP 에러:', frame);
          error.value = '실시간 연결에 실패했습니다.';
        },
        onWebSocketError: (event) => {
          console.error('WebSocket 에러:', event);
        },
        onWebSocketClose: (event) => {
          console.log('WebSocket 연결 종료:', event);
        },
      });

      stompClient.value.onConnect = () => {
        console.log('WebSocket 연결 성공');
        // 라이브 상품 업데이트를 구독
        stompClient.value.subscribe('/sub/live-products', (message) => {
          const liveFundingData = JSON.parse(message.body);
          handleLiveProductUpdate(liveFundingData);
        });
      };

      stompClient.value.onStompError = (frame) => {
        console.error('STOMP 에러:', frame);
        error.value = '실시간 연결에 실패했습니다.';
      };

      stompClient.value.activate();
    };

    // 라이브 상품 업데이트 처리
    const handleLiveProductUpdate = (liveFundingData) => {
      const { id, scheduleId, url, productName, percentage, classification, remainingTime, isStreaming } = liveFundingData;
      
      if (isStreaming === 1) { // 방송 시작
        // 새로운 라이브 상품 추가
        const newProduct = {
          id: scheduleId, // 스트리밍 접속을 위해 scheduleId를 id로 사용
          productId: id,  // 상품 상세를 위한 실제 상품 ID 저장
          image: url,
          name: productName,
          achievement: percentage,
          category: classification,
          remainingTime: remainingTime,
          isLive: true
        };
        liveProducts.value = [newProduct, ...liveProducts.value];
      } else if (isStreaming === 2) { // 방송 종료
        // 종료된 라이브 상품 제거
        liveProducts.value = liveProducts.value.filter(
          product => product.id !== scheduleId
        );
      }
    };

    const handleProductClick = async (product) => {
        console.log("Clicked product:", product);  
        if (product.isLive) {
          try {
            userName.value = localStorage.getItem('userName') || '손님';  
            userRole.value = localStorage.getItem('userRole') || 'user'; 
            roomId.value = product.id.toString();
            
            router.push({
              path: '/streaming',
              state: {
                userName: userName.value,
                userRole: userRole.value,
                productId: product.id,
                // roomId: roomId.value,
                // socket: socket.value,
              },
            });
          } catch (err) {
            console.error('스트리밍 참여 실패:', err);
            error.value = '스트리밍 참여 중 오류가 발생했습니다.';
          }
        } else {
          router.push({
            name: "ProductDetail",
            params: { productId: product.id },
          });
        }
    };
    const fetchMainPageData = async () => {
      try {
        const response = await axios.get('/api/project/main');
        console.log('API Response:', response.data);
        
        if (response.data.liveFundingProjects) {
          liveProducts.value = response.data.liveFundingProjects.map(project => ({
            id: project.scheduleId, // 스트리밍 접속을 위해 scheduleId 사용
            productId: project.id,  // 상품 상세를 위한 실제 상품 ID
            image: project.url,
            name: project.productName,
            achievement: project.percentage,
            category: project.classification,
            remainingTime: project.remainingTime,
            isLive: true
          }));
        }
        if (response.data.topFundingProjects) {
          rankingProducts.value = response.data.topFundingProjects.map(project => ({
            id: project.id,
            image: project.url,
            name: project.productName,
            achievement: project.percentage,
            category: project.classification,
            remainingTime: project.remainingTime,
            ranking: project.ranking,
            isLive: false
          }));
        }
      } catch (err) {
        console.error('메인 페이지 데이터 로딩 실패:', err);
        error.value = err.response?.data?.message || "데이터를 불러오는 중 오류가 발생했습니다.";
      }
    };
    const fetchData = async () => {
      try {
        isLoading.value = true;
        await fetchMainPageData();
      } catch (err) {
        error.value = "데이터를 불러오는 중 오류가 발생했습니다.";
        console.error(err);
      } finally {
        isLoading.value = false;
      }
    };
    onMounted(() => {
      fetchData();
      connectWebSocket();
    });

    onUnmounted(() => {
      if (stompClient.value) {
        stompClient.value.deactivate();
      }
    });

    return {
      rankingProducts,
      liveProducts,
      isLoading,
      error,
      handleProductClick
    };
  },
};
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #ffffff;
}

.main-content-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 20px;
  margin-bottom: 40px;
}

.live-section,
.ranking-section {
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  height: 100%;
  border: 1px solid rgba(109, 99, 255, 0.1);
}

.live-section h2,
.ranking-section h2 {
  color: #6D63FF;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 20px;
  border-bottom: 2px solid #9E94F8;
  padding-bottom: 8px;
}

.live-section .product-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.product-grid > div {
  border-radius: 8px;
  border: 1px solid rgba(109, 99, 255, 0.2);
  transition: all 0.3s ease;
}

.product-grid > div:hover {
  transform: translateY(-2px);
  border-color: #9E94F8;
  background-color: rgba(109, 99, 255, 0.05);
}

.ranking-section .ranking-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  background-color: rgb(255, 255, 255);
}

.ranking-list > div {
  padding: 12px;
  border-radius: 8px;
  border: 1px solid rgba(109, 99, 255, 0.2);
  transition: all 0.3s ease;
}

.ranking-list > div:hover {
  transform: translateX(4px);
  border-color: #9E94F8;
  background-color: rgba(109, 99, 255, 0.05);
}

.full-width-banner {
  width: 100vw;
  margin-left: 50%;
  transform: translateX(-50%);
  position: relative;
  background: #ffffff;
  padding: 20px 0;
}

.loading {
  color: #6D63FF;
  text-align: center;
  font-size: 1.2rem;
  padding: 20px;
}

.error {
  color: #DC2626;
  text-align: center;
  padding: 20px;
  background: #FEE2E2;
  border-radius: 8px;
  border: 1px solid #DC2626;
}

@media (max-width: 1024px) {
  .main-content-grid {
    grid-template-columns: 1.5fr 1fr;
  }
  
  .live-section .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .main-content-grid {
    grid-template-columns: 1fr;
  }
  .home {
    padding: 12px;
  }
}

@media (max-width: 480px) {
  .live-section .product-grid {
    grid-template-columns: 1fr;
  }
  .live-section,
  .ranking-section {
    padding: 16px;
  }
}
</style>