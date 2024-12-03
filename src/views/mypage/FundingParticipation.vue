<template>
  <div class="dashboard">
    <main class="content">
  <div class="header-container">
    <div class="header">
      <h2>펀딩 참여 내역</h2>
      <div class="search-box">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="펀딩 내역 검색"
          @input="handleSearch"
        />
        <button @click="handleSearch">검색</button>
      </div>
    </div>
  </div>

      <!-- 펀딩 목록 -->
      <section class="funding-list">
        <div 
          v-for="order in orders" 
          :key="order.id" 
          class="project-card"
          @click="goToProductDetail(order.projectId)"
        >
          <div class="funding-date">
            {{ formatDate(order.paymentAt) }}
          </div>
          <div class="project-content">
            <div class="image-container">
              <img :src="order.projectImage" :alt="order.productName" class="project-image" />
            </div>
            <div class="project-info">
              <h3>{{ order.productName }}</h3>
              <div class="status-container">
                <span class="category-badge">
                  수량: {{ order.amount }}개
                </span>
                <span class="status-badge status-funding">
                  {{ formatPrice(order.paymentPrice) }}원
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 페이지네이션 -->
      <div class="pagination" v-if="pageInfo">
        <button 
          class="pagination-btn"
          :disabled="pageInfo.page <= 1"
          @click="changePage(pageInfo.page - 1)"
        >
          이전
        </button>
        <span>{{ pageInfo.page }} / {{ pageInfo.totalPages }}</span>
        <button 
          class="pagination-btn"
          :disabled="pageInfo.page >= pageInfo.totalPages"
          @click="changePage(pageInfo.page + 1)"
        >
          다음
        </button>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

export default {
  name: 'FundingParticipation',
  props: {
    userId: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    const router = useRouter();
    const orders = ref([]);
    const pageInfo = ref(null);
    const searchQuery = ref('');
    const currentPage = ref(1);
    const pageSize = ref(10);

    const fetchOrders = async (page = 1) => {
      try {
        const userId = localStorage.getItem('userId')
        const response = await axios.get(`/api/order/user/${userId}`, {
          params: {
            page: page,
            size: pageSize.value,
            searchQuery: searchQuery.value || undefined
          }
        });
        
        orders.value = response.data.dataList;
        pageInfo.value = response.data.pageInfoDTO;
      } catch (error) {
        console.error('주문 내역을 불러오는데 실패했습니다:', error);
      }
    };

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    const formatPrice = (price) => {
      return new Intl.NumberFormat('ko-KR').format(price);
    };

    const handleSearch = () => {
      currentPage.value = 1;
      fetchOrders(1);
    };

    const changePage = (newPage) => {
      currentPage.value = newPage;
      fetchOrders(newPage);
    };

    const goToProductDetail = (projectId) => {
      router.push({
        name: 'ProductDetail',
        params: { productId: projectId }
      });
    };

    onMounted(() => {
      fetchOrders();
    });

    return {
      orders,
      pageInfo,
      searchQuery,
      formatDate,
      formatPrice,
      handleSearch,
      changePage,
      goToProductDetail
    };
  }
};
</script>

<style scoped>
.dashboard {
  display: flex;
  min-height: 100vh;
  background-color: #ffffff;
  width: 100%;
}

.content {
  flex: 1;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.header-container {
  width: 60%;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  width: 100%;
}

.header h2 {
  margin: 0;
  color: #6D63FF;
  font-size: 1.5rem;
  font-weight: 600;
}

.search-box {
  display: flex;
  gap: 1rem;
}

.search-box input {
  padding: 0.75rem 1rem;
  border: 1px solid #9E94F8;
  border-radius: 4px;
  width: 300px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-box input:focus {
  outline: none;
  border-color: #6D63FF;
  box-shadow: 0 0 0 2px rgba(109, 99, 255, 0.1);
}

.search-box button {
  padding: 0.75rem 1.5rem;
  background-color: #6D63FF;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.search-box button:hover {
  background-color: #9E94F8;
}

.funding-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
  align-items: center; /* 카드들을 가운데 정렬 */
}

.project-card {
  width: 60%;
  background-color: #ffffff;
  border-radius: 12px;
  border: 1px solid #9E94F8;
  overflow: hidden;
  cursor: pointer;
  transition: box-shadow 0.3s ease, transform 0.2s ease;
  padding: 1rem;
}

.project-card:hover {
  box-shadow: 0px 4px 12px rgba(109, 99, 255, 0.15);
  transform: translateY(-2px);
  border-color: #6D63FF;
}

.funding-date {
  color: #666;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.project-content {
  display: flex;
  gap: 1.5rem;
}

.image-container {
  width: 200px;
  height: 150px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.project-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.project-card:hover .project-image {
  transform: scale(1.05);
}

.project-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  padding: 0.5rem 0;
}

.project-info h3 {
  font-size: 1.3rem;
  margin: 0;
  color: #333;
  line-height: 1.4;
}

.status-container {
  display: flex;
  gap: 0.8rem;
  align-items: center;
}

.category-badge,
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.category-badge {
  background-color: rgba(109, 99, 255, 0.1);
  color: #6D63FF;
}

.status-badge.status-funding {
  background-color: #6D63FF;
  color: white;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.pagination-btn {
  padding: 0.5rem 1rem;
  background-color: #6D63FF;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  min-width: 80px;
  transition: all 0.3s ease;
}

.pagination-btn:disabled {
  background-color: rgba(109, 99, 255, 0.3);
  cursor: not-allowed;
  color: #666;
}

.pagination-btn:not(:disabled):hover {
  background-color: #9E94F8;
}

.content {
  scrollbar-width: thin;
  scrollbar-color: #6D63FF #f8f9fa;
}

.content::-webkit-scrollbar {
  width: 8px;
}

.content::-webkit-scrollbar-track {
  background: #f8f9fa;
}

.content::-webkit-scrollbar-thumb {
  background-color: #6D63FF;
  border-radius: 4px;
}

.content::-webkit-scrollbar-thumb:hover {
  background-color: #9E94F8;
}

@media (max-width: 768px) {
  .header-container {
    width: 100%;
  }
  .header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  .project-card {
    width: 100%; /* 모바일에서는 전체 너비 사용 */
  }

  .search-box {
    flex-direction: column;
  }

  .search-box input {
    width: 100%;
  }

  .project-content {
    flex-direction: column;
  }

  .image-container {
    width: 100%;
    height: 200px;
  }
}
</style>