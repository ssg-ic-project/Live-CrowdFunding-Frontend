<!-- src/views/main/SearchResults.vue -->
 <template>
  <div class="search-results-page">
    <h2>"{{ searchQuery }}" {{ resultType }}</h2>
    

    <!-- 라이브 상품 섹션 -->
    <div v-if="liveSearchResults.length" class="live-products-section">
      <h3>라이브 상품</h3>
      <div class="product-list">
        <ProductItem
          v-for="(product, index) in liveSearchResults"
          :key="product.id"
          :product="{ ...product, image: productImage }"
          :rank="index + 1"
        />
      </div>
    </div>
    

    <!-- 일반 상품 섹션 -->
    <div v-if="normalSearchResults.length" class="normal-products-section">
      <h3>일반 상품</h3>
      <div class="product-list">
        <ProductItem
          v-for="(product, index) in normalSearchResults"
          :key="product.id"
          :product="{ ...product, image: productImage }"
        />
      </div>
    </div>
    

    <!-- 로딩 스피너 -->
    <div ref="loader" class="loader" v-if="isLoading">
      <span>로딩 중...</span>
    </div>

    
    <!-- 더 이상 로드할 상품이 없는 경우 메시지 -->
    <div v-if="!hasMore && !isLoading" class="end-message">
      <span>더 이상 상품이 없습니다.</span>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import ProductItem from '@/components/ProductItem.vue';
import odungImage from '@/assets/image/오둥이하트.png';

export default {
  name: 'SearchResults',
  components: {
    ProductItem,
  },
  setup() {
    const route = useRoute();
    const searchQuery = ref(route.query.q || '');
    const resultType = ref('');
    const allSearchResults = ref([]);
    const liveSearchResults = ref([]);
    const normalSearchResults = ref([]);
    const perPage = ref(10);
    const currentPage = ref(1);
    const isLoading = ref(false);
    const hasMore = ref(true);
    const productImage = ref(odungImage);
    const displayedLiveProducts = ref([]);
    const displayedNormalProducts = ref([]);

    const resetResults = () => {
      allSearchResults.value = [];
      liveSearchResults.value = [];
      normalSearchResults.value = [];
      currentPage.value = 1;
      hasMore.value = true;
      displayedLiveProducts.value = [];
      displayedNormalProducts.value = [];
    };

    const loadMore = () => {
      if (!hasMore.value || isLoading.value) return;
      
      isLoading.value = true;
      
      setTimeout(() => {
        const start = (currentPage.value - 1) * perPage.value;
        const end = currentPage.value * perPage.value;
        
        const additionalLive = liveSearchResults.value.slice(start, end);
        const additionalNormal = normalSearchResults.value.slice(start, end);
        
        if (additionalLive.length || additionalNormal.length) {
          const maxPage = Math.ceil(
            Math.max(
              liveSearchResults.value.length,
              normalSearchResults.value.length
            ) / perPage.value
          );
          
          if (currentPage.value <= maxPage) {
            displayedLiveProducts.value = [...displayedLiveProducts.value, ...additionalLive];
            displayedNormalProducts.value = [...displayedNormalProducts.value, ...additionalNormal];
            currentPage.value += 1;
          }
          
          if (currentPage.value > maxPage) {
            hasMore.value = false;
          }
        } else {
          hasMore.value = false;
        }
        
        isLoading.value = false;
      }, 1000);
    };

    const initializeIntersectionObserver = () => {
      const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      };
      
      const observer = new IntersectionObserver((entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore.value && !isLoading.value) {
          loadMore();
        }
      }, options);
      
      setTimeout(() => {
        const loaderElement = document.querySelector('.loader');
        if (loaderElement) {
          observer.observe(loaderElement);
        }
      }, 0);
    };

    const updateResults = () => {
      const type = route.query.type || 'search';
      resultType.value = type === 'category' ? '카테고리' : '검색 결과';
      
    
      allSearchResults.value = [
        ...Array(20).fill().map((_, i) => ({
          id: i + 1,
          achievement: 60 + Math.floor(Math.random() * 40),
          endDate: "2024-12-31",
          name: `라이브 상품${i + 1}`,
          company: `회사${String.fromCharCode(65 + i)}`,
          price: 100000 + (i * 10000),
          isLive: true
        })),
        ...Array(20).fill().map((_, i) => ({
          id: i + 21,
          achievement: 60 + Math.floor(Math.random() * 40),
          endDate: "2024-12-31",
          name: `일반 상품${i + 1}`,
          company: `회사${String.fromCharCode(65 + i + 20)}`,
          price: 150000 + (i * 10000),
          isLive: false
        }))
      ];
      
      liveSearchResults.value = allSearchResults.value.filter(product => product.isLive);
      normalSearchResults.value = allSearchResults.value.filter(product => !product.isLive);
      
      loadMore();
    };

    watch(() => route.query.q, (newQuery) => {
      searchQuery.value = newQuery || '';
      resetResults();
      updateResults();
    });

    watch(() => route.query.type, (newType) => {
      resultType.value = newType === 'category' ? '카테고리' : '검색 결과';
    });

    onMounted(() => {
      updateResults();
      initializeIntersectionObserver();
    });

    return {
      searchQuery,
      resultType,
      liveSearchResults,
      normalSearchResults,
      isLoading,
      hasMore,
      productImage,
      displayedLiveProducts,
      displayedNormalProducts
    };
  }
};
</script>

<style scoped>
.search-results-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  padding-bottom: 60px;
}

h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: var(--primary-color);
}

h3 {
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: var(--primary-color);
  padding-bottom: 10px;
  border-bottom: 2px solid var(--primary-color);
}

.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 30px;
}

.loader, .end-message {
  text-align: center;
  padding: 20px;
  color: #666;
}

.loader {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
}

@media (max-width: 768px) {
  .product-list {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
}
</style>