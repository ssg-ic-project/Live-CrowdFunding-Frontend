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

    <!-- AI 추천 상품 섹션 -->
    <section class="ai-recommendation-section" v-if="!isLoading && !error">
      <h2>AI 추천 상품</h2>
      <div class="product-grid full-width">
        <ProductItem
          v-for="product in aiRecommendedProducts"
          :key="product.id"
          :product="product"
        />
      </div>
    </section>

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

    const dummyRankingProducts = [
      {
        id: 31,
        image: odungImage,
        achievement: 92,
        endDate: "2024-12-05",
        name: "인기 랭킹 1위 상품",
        company: "회사EE",
        price: 110000,
        totalUsers: 2854,
        isLive: true,
      },
      {
        id: 32,
        image: odungImage,
        achievement: 88,
        endDate: "2024-11-10",
        name: "인기 랭킹 2위 상품",
        company: "회사FF",
        price: 1800000,
        totalUsers: 2245,
        isLive: false,
      },
      {
        id: 33,
        image: odungImage,
        achievement: 85,
        endDate: "2024-12-01",
        name: "인기 랭킹 3위 상품",
        company: "회사GG",
        price: 2300000,
        totalUsers: 1987,
        isLive: true,
      },
      {
        id: 34,
        image: odungImage,
        achievement: 82,
        endDate: "2024-10-25",
        name: "인기 랭킹 4위 상품",
        company: "회사HH",
        price: 160000,
        totalUsers: 1654,
        isLive: false,
      },
      {
        id: 35,
        image: odungImage,
        achievement: 90,
        endDate: "2024-11-15",
        name: "인기 랭킹 5위 상품",
        company: "회사II",
        price: 300000000,
        totalUsers: 1432,
        isLive: true,
      },
      
    ];

    const dummyLiveProducts = [
      {
        id: 1,
        image: odungImage,
        achievement: 75,
        endDate: "2024-12-31",
        name: "라이브 상품1",
        company: "회사A",
        price: 100000,
        isLive: true,
      },
      {
        id: 2,
        image: odungImage,
        achievement: 60,
        endDate: "2024-11-30",
        name: "라이브 상품2",
        company: "회사B",
        price: 200000,
        isLive: true,
      },
      {
        id: 3,
        image: odungImage,
        achievement: 80,
        endDate: "2024-10-20",
        name: "라이브 상품3",
        company: "회사C",
        price: 250000,
        isLive: true,
      },
      {
        id: 4,
        image: odungImage,
        achievement: 55,
        endDate: "2024-09-10",
        name: "라이브 상품4",
        company: "회사D",
        price: 270000,
        isLive: true,
      },
      {
        id: 5,
        image: odungImage,
        achievement: 90,
        endDate: "2024-12-15",
        name: "라이브 상품5",
        company: "회사E",
        price: 350000,
        isLive: true,
      },
      {
        id: 6,
        image: odungImage,
        achievement: 70,
        endDate: "2024-11-25",
        name: "라이브 상품6",
        company: "회사F",
        price: 150000,
        isLive: true,
      },
     
    ];

    const dummyAIRecommendedProducts = [
      {
        id: 21,
        image: odungImage,
        achievement: 85,
        endDate: "2024-11-10",
        name: "AI 추천 상품1",
        company: "회사U",
        price: 320000,
      },
      {
        id: 22,
        image: odungImage,
        achievement: 75,
        endDate: "2024-10-18",
        name: "AI 추천 상품2",
        company: "회사V",
        price: 270000,
      },
      {
        id: 23,
        image: odungImage,
        achievement: 65,
        endDate: "2024-11-12",
        name: "AI 추천 상품3",
        company: "회사W",
        price: 230000,
      },
      {
        id: 24,
        image: odungImage,
        achievement: 80,
        endDate: "2024-12-01",
        name: "AI 추천 상품4",
        company: "회사X",
        price: 250000,
      },
      {
        id: 25,
        image: odungImage,
        achievement: 70,
        endDate: "2024-10-22",
        name: "AI 추천 상품5",
        company: "회사Y",
        price: 210000,
      },
      {
        id: 26,
        image: odungImage,
        achievement: 90,
        endDate: "2024-11-30",
        name: "AI 추천 상품6",
        company: "회사Z",
        price: 350000,
      },
      {
        id: 27,
        image: odungImage,
        achievement: 68,
        endDate: "2024-09-28",
        name: "AI 추천 상품7",
        company: "회사AA",
        price: 190000,
      },
      {
        id: 28,
        image: odungImage,
        achievement: 82,
        endDate: "2024-12-12",
        name: "AI 추천 상품8",
        company: "회사BB",
        price: 280000,
      },
      {
        id: 29,
        image: odungImage,
        achievement: 77,
        endDate: "2024-10-10",
        name: "AI 추천 상품9",
        company: "회사CC",
        price: 240000,
      },
      {
        id: 30,
        image: odungImage,
        achievement: 73,
        endDate: "2024-11-25",
        name: "AI 추천 상품10",
        company: "회사DD",
        price: 220000,
      },
    ];

    const fetchData = async () => {
      try {
        rankingProducts.value = dummyRankingProducts;
        liveProducts.value = dummyLiveProducts;
        aiRecommendedProducts.value = dummyAIRecommendedProducts;
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
