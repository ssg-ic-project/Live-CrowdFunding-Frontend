<template>
  <div class="dashboard">
    <main class="content">
      <!-- 헤더 -->
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
  background-color: #f4f6f9;
}

.content {
  flex: 1;
  padding: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header h2 {
  margin: 0;
  color: #333;
}

.search-box {
  display: flex;
  gap: 1rem;
}

.search-box input {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 200px;
  font-size: 1rem;
}

.search-box button {
  padding: 0.5rem 1rem;
  background-color: #ff5151;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.search-box button:hover {
  background-color: #ffd74e;
  color: #333333;
}

.funding-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.project-card {
  width: 100%;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  cursor: pointer;
  transition: box-shadow 0.3s ease, transform 0.2s ease;
  padding: 1rem;
}

.project-card:hover {
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
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
  background-color: #f3f4f6;
  color: #666;
}

.status-badge.status-funding {
  background-color: rgba(25, 118, 210, 0.1);
  color: #1976D2;
  border: 1px solid rgba(25, 118, 210, 0.3);
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
  background-color: #ff5151;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  min-width: 80px;
  transition: all 0.3s ease;
}

.pagination-btn:disabled {
  background-color: #ffe3e3;
  cursor: not-allowed;
  color: #666;
}

.pagination-btn:not(:disabled):hover {
  background-color: #ffd74e;
  color: #333333;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
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

.content {
  scrollbar-width: thin;
  scrollbar-color: #ff5151 #f4f6f9;
}

.content::-webkit-scrollbar {
  width: 8px;
}

.content::-webkit-scrollbar-track {
  background: #f4f6f9;
}

.content::-webkit-scrollbar-thumb {
  background-color: #ff5151;
  border-radius: 4px;
}

.content::-webkit-scrollbar-thumb:hover {
  background-color: #ffd74e;
}
</style>