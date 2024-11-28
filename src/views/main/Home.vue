<!-- src/views/main/Home.vue -->
<template>
  <div class="full-width-banner">
    <BannerSlider />
  </div>

  <div class="home">
    <CategoryList />

    <div class="main-content-grid">
      <!-- 라이브 상품 섹션 -->
      <section class="live-section" v-if="!isLoading && !error">
        <h2>라이브 상품</h2>
        <div class="product-grid">
          <ProductItem
            v-for="product in liveProducts.slice(0, 12)"
            :key="product.id"
            :product="product"
          />
        </div>
      </section>

      <!-- 랭킹 상품 섹션 -->
      <section class="ranking-section" v-if="!isLoading && !error">
        <h2>실시간 인기 상품</h2>
        <div class="ranking-list">
          <RankingCard
            v-for="(product, index) in rankingProducts.slice(0, 10)"
            :key="product.id"
            :product="product"
            :rank="index + 1"
          />
        </div>
      </section>
    </div>

    <!-- AI 추천 상품 섹션 // 구현 가능??! -->
    <!-- <section class="ai-recommendation-section" v-if="!isLoading && !error">
      <h2>AI 추천 상품</h2>
      <div class="product-grid full-width">
        <ProductItem
          v-for="product in aiRecommendedProducts"
          :key="product.id"
          :product="product"
        />
      </div>
    </section> -->

    <div v-if="isLoading" class="loading">로딩 중...</div>
    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>
<script>
import { ref, onMounted } from "vue";
import BannerSlider from "@/components/BannerSlider.vue";
import CategoryList from "@/components/CategoryList.vue";
import ProductItem from "@/components/ProductItem.vue";
import RankingCard from "@/components/RankingCard.vue";
import odungImage from "@/assets/image/오둥이하트.png";
import axios from 'axios';

export default {
  name: "Home",
  components: {
    BannerSlider,
    CategoryList,
    ProductItem,
    RankingCard,
  },
  setup() {
    const rankingProducts = ref([]);
    const liveProducts = ref([]);
    const aiRecommendedProducts = ref([]);

    const isLoading = ref(true);
    const error = ref(null);

    //여기부터 용빈
    
    const fetchMainPageData = async () => {
      try {
        const response = await axios.get('/api/project/main');
        console.log('API Response:', response.data); // 응답 데이터 확인
        
        // 라이브 펀딩 프로젝트 데이터 매핑
        if (response.data.liveFundingProjects) {
          liveProducts.value = response.data.liveFundingProjects.map(project => ({
            id: project.id,
            image: project.url,
            name: project.productName,
            achievement: project.percentage,
            category: project.classification,
            remainingTime: project.remainingTime,
            isLive: true
          }));
        }

        // 탑 펀딩 프로젝트 데이터 매핑
        if (response.data.topFundingProjects) {
          rankingProducts.value = response.data.topFundingProjects.map(project => ({
            id: project.id,
            image: project.url,
            name: project.productName,
            achievement: project.percentage,
            category: project.classification,
            remainingTime: project.remainingTime,
            ranking: project.ranking,
            isLive: true
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
    });

    return {
      rankingProducts,
      liveProducts,
      aiRecommendedProducts,
      isLoading,
      error,
    };
  },
};
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.main-content-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr; /* 기존 2fr 1fr에서 수정 */
  gap: 20px;
  margin-bottom: 40px;
}

.live-section,
.ranking-section {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  height: 100%;
}

.live-section .product-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.ranking-section .ranking-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ai-recommendation-section .product-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
}

.full-width-banner {
  width: 100vw;
  margin-left: 50%;
  transform: translateX(-50%);
  position: relative;
}

@media (max-width: 1024px) {
  .main-content-grid {
    grid-template-columns: 1.5fr 1fr;
  }

  .live-section .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .ai-recommendation-section .product-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 768px) {
  .main-content-grid {
    grid-template-columns: 1fr;
  }

  .ai-recommendation-section .product-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 480px) {
  .live-section .product-grid {
    grid-template-columns: repeat(1, 1fr);
  }

  .ai-recommendation-section .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
