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
        v-for="order in orders" 
        :key="order.id" 
        class="funding-card"
      >
        <div class="funding-date">{{ formatDate(order.paymentAt) }}</div>
        <div class="funding-content">
          <div class="funding-image">
            <img :src="order.projectImage" :alt="order.productName" />
          </div>
          <div class="funding-details">
            <h3 class="product-name">{{ order.productName }}</h3>
            <div class="option-info">
              <span class="option-quantity">{{ order.amount }}개</span>
            </div>
            <div class="price">{{ formatPrice(order.paymentPrice) }}원</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 페이지네이션 갓클로드가 만들어줬는데 그냥 써도 되고 새로 만들어서 공통 적용해도 되고 -->
    <div class="pagination" v-if="pageInfo">
      <button 
        :disabled="pageInfo.page <= 1"
        @click="changePage(pageInfo.page - 1)"
      >
        이전
      </button>
      <span>{{ pageInfo.page }} / {{ pageInfo.totalPages }}</span>
      <button 
        :disabled="pageInfo.page >= pageInfo.totalPages"
        @click="changePage(pageInfo.page + 1)"
      >
        다음
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
  name: 'FundingParticipation',
  props: {
    userId: {
      type: Number,
      required: true
    }
  },
  setup(props) {
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
      currentPage.value = 1; // 검색 시 첫 페이지로 이동
      fetchOrders(1);
    };

    const changePage = (newPage) => {
      currentPage.value = newPage;
      fetchOrders(newPage);
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
      changePage
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

.pagination {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

.pagination button {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
}

.pagination button:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
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