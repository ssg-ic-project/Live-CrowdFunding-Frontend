<template>
  <div class="dashboard">
    <main class="content">
      <div class="header">
        <h2>찜 목록</h2>
        <span class="count" v-if="pageInfo">(총 {{ pageInfo.totalElements }}개)</span>
      </div>
      <div class="product-grid">
        <div v-for="project in projects" :key="project.id" class="product-card">
          <div class="image-container">
            <img :src="project.thumbnailUrl" :alt="project.productName" />
            
            <!-- 하트 아이콘 -->
            <button @click.stop="toggleWishlist(project)" class="wishlist-btn">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="#ff5151"
                stroke="#ff5151"
                stroke-width="2"
                class="heart-icon"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </button>
          </div>
          <div class="product-info">
            <div class="achievement">{{ project.percentage }}% 달성</div>
            <h3 class="product-name">{{ project.productName }}</h3>
            <p class="description">{{ project.description }}</p>
            <div class="price">{{ formatPrice(project.price) }}원</div>
          </div>
        </div>
      </div>

      <!-- 페이지네이션 -->
      <div class="pagination" v-if="pageInfo && pageInfo.totalPages > 1">
        <button 
          class="pagination-btn"
          :disabled="pageInfo.page <= 1"
          @click="changePage(pageInfo.page - 1)"
        >
          이전
        </button>
        <span class="page-info">{{ pageInfo.page }} / {{ pageInfo.totalPages }}</span>
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

export default {
  name: 'Wishlist',
  props: {
    userId: {
      type: Number,
      required: true
    }
  },
  setup() {
    const projects = ref([]);
    const pageInfo = ref(null);
    const pageSize = ref(12);

    const fetchWishlist = async (page = 1) => {
      try {
        const userId = localStorage.getItem('userId');
        const response = await axios.get(`/api/liked/${userId}`, {
          params: {
            page: page,
            size: pageSize.value
          }
        });
        
        projects.value = response.data.dataList;
        pageInfo.value = response.data.pageInfoDTO;
      } catch (error) {
        console.error('찜 목록을 불러오는데 실패했습니다:', error);
      }
    };

    const formatPrice = (price) => {
      return new Intl.NumberFormat('ko-KR').format(price);
    };

    const toggleWishlist = async (project) => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId || !project.id) {
          console.error('사용자 ID 또는 제품 ID가 없습니다');
          return;
        }

        await axios.post(`/api/liked`, {
          userId: Number(userId),
          projectId: Number(project.id)
        });
        
        await fetchWishlist(pageInfo.value.page);

      } catch (err) {
        console.error('찜하기 해제 실패:', err.response?.data || err.message);
        alert('찜하기 해제 처리 중 오류가 발생했습니다.');
      }
    };

    const changePage = (newPage) => {
      fetchWishlist(newPage);
    };

    onMounted(() => {
      fetchWishlist();
    });

    return {
      projects,
      pageInfo,
      toggleWishlist,
      formatPrice,
      changePage
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



.header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

h2 {
  margin: 0;
  color: #6D63FF;
  font-size: 1.5rem;
  font-weight: 600;
}

.count {
  color: #666;
  font-size: 1.1rem;
}

.content {
  flex: 1;
  padding: 2rem;
  max-width: 1200px; /* 5개 카드가 들어갈 수 있도록 너비 조정 */
  margin: 0 auto;
  width: 100%;
}

.product-grid {
  display: grid;
  /* 5개 컬럼으로 고정 */
  grid-template-columns: repeat(5, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.product-card {
  border: 1px solid #9E94F8;
  border-radius: 8px;
  overflow: hidden;
  background: white;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(109, 99, 255, 0.1);
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(109, 99, 255, 0.2);
  border-color: #6D63FF;
}

.image-container {
  position: relative;
  width: 100%;
  padding-bottom: 75%;
  overflow: hidden;
}

.image-container img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .image-container img {
  transform: scale(1.05);
}

.wishlist-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background: white;
  border: none;
  cursor: pointer;
  z-index: 1;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  box-shadow: 0 2px 4px rgba(109, 99, 255, 0.1);
  transition: transform 0.2s ease;
}

.wishlist-btn:hover {
  transform: scale(1.1);
}

.heart-icon {
  width: 16px;
  height: 16px;
}

.product-info {
  padding: 1rem;
}

.achievement {
  color: #6D63FF;
  font-size: 0.85rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.product-name {
  font-size: 1.1rem;
  margin: 0 0 0.5rem 0;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.description {
  color: #666;
  font-size: 0.9rem;
  margin: 0.5rem 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  height: 2.7em;
  line-height: 1.35;
}

.price {
  font-weight: bold;
  font-size: 1.1rem;
  color: #6D63FF;
  margin-top: 0.5rem;
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

.page-info {
  font-size: 0.9rem;
  color: #666;
}

@media (max-width: 768px) {
  .content {
    padding: 1rem;
  }

  .product-grid {
    /* 모바일에서는 2개씩 배치 */
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 1rem;
  }

  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 1rem;
  }

  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .product-name {
    font-size: 1rem;
  }

  .description {
    font-size: 0.8rem;
  }

  .price {
    font-size: 1rem;
  }
}
</style>