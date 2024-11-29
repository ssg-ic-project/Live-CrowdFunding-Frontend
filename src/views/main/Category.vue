<!-- src/views/main/Category.vue -->
 <template>
  <div class="category-page">
    <h2>{{ categoryName }}</h2>


    <!-- 라이브 상품 섹션 -->
    <section v-if="liveProducts.length > 0" class="live-products-section">
      <h3>라이브 상품</h3>
      <div class="product-grid">
        <ProductItem
          v-for="product in liveProducts"
          :key="product.id"
          :product="product"
        />
      </div>
    </section>


    <!-- 일반 상품 섹션 -->
    <section v-if="normalProducts.length > 0" class="normal-products-section">
      <h3>일반 상품</h3>
      <div class="product-grid">
        <ProductItem
          v-for="product in normalProducts"
          :key="product.id"
          :product="product"
        />
      </div>
    </section>


    <!-- 무한 스크롤을 위한 로딩 표시 -->
    <div ref="loader" class="loader" v-if="isLoading">
      <span>로딩 중...</span>
    </div>


    <!-- 더 이상 상품이 없을 때 표시 -->
    <div v-if="!hasMore && !isLoading" class="end-message">
      <span>더 이상 상품이 없습니다.</span>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import ProductItem from '@/components/ProductItem1.vue';
import odungImage from '@/assets/image/오둥이하트.png';

export default {
  name: 'Category',
  components: {
    ProductItem,
  },
  setup() {
    const categoryName = ref('');
    const liveProducts = ref([]);
    const normalProducts = ref([]);
    const isLoading = ref(false);
    const hasMore = ref(true);
    const page = ref(1);
    const perPage = ref(12);

    const loadProducts = () => {
      if (isLoading.value || !hasMore.value) return;
      isLoading.value = true;
      
      setTimeout(() => {
        const newProducts = Array.from({ length: perPage.value }, (_, i) => ({
          id: page.value * perPage.value + i,
          image: odungImage,
          name: `상품 ${page.value * perPage.value + i}`,
          company: `회사 ${String.fromCharCode(65 + i % 26)}`,
          price: 100000 + (i * 10000),
          achievement: 60 + (i % 40),
          endDate: "2024-12-31",
          isLive: i % 3 === 0
        }));

        const newLiveProducts = newProducts.filter(p => p.isLive);
        const newNormalProducts = newProducts.filter(p => !p.isLive);

        liveProducts.value = [...liveProducts.value, ...newLiveProducts];
        normalProducts.value = [...normalProducts.value, ...newNormalProducts];

        page.value += 1;
        hasMore.value = page.value < 5; 
        isLoading.value = false;
      }, 1000);
    };

    const initIntersectionObserver = () => {
      const options = {
        root: null,
        rootMargin: '20px',
        threshold: 0.1
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            loadProducts();
          }
        });
      }, options);

      const loaderEl = document.querySelector('.loader');
      if (loaderEl) {
        observer.observe(loaderEl);
      }
    };

    onMounted(() => {
      categoryName.value = window?.location?.params?.categoryName || '전체 카테고리';
      loadProducts();
      initIntersectionObserver();
    });

    return {
      categoryName,
      liveProducts,
      normalProducts,
      isLoading,
      hasMore,
    };
  }
};
</script>

<style scoped>
.category-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h2 {
  font-size: 1.5rem;
  color: var(--primary-color);
  margin-bottom: 30px;
  text-align: center;
}

h3 {
  font-size: 1.2rem;
  color: var(--primary-color);
  margin: 20px 0;
  padding-bottom: 10px;
  border-bottom: 2px solid var(--primary-color);
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
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

section {
  margin-bottom: 40px;
}

@media (max-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
}
</style>