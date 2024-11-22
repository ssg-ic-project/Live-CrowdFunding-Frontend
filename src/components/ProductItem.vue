<template>
  <router-link :to="{ name: 'ProductDetail', params: { productId: 1 } }" class="product-link">
    <div class="product-item">
      <div v-if="product.isLive" class="live-badge">LIVE</div>
      <div class="image-container">
        <img :src="product.image" :alt="product.name" />
      </div>
      <div class="product-info">
        <div class="achievement">{{ product.achievement }}%</div>
        <h3 class="title">{{ product.name }}</h3>
        <div class="footer">
          <span class="stats-box price">{{ formatLargePrice(product.price) }}</span>
          <span class="stats-box days">{{ daysLeft }}일 남음</span>
        </div>
      </div>
    </div>
  </router-link>
</template>

<script>
export default {
  name: "ProductItem",
  props: {
    product: {
      type: Object,
      required: true,
    },
    rank: {
      type: Number,
      default: null,
    },
  },
  methods: {
    formatLargePrice(price) {
      if (price >= 100000000) {
        return `${(price / 100000000).toFixed(1)}억원+`;
      } else {
        return `${Math.floor(price / 10000)}만원+`;
      }
    }
  },
  computed: {
    daysLeft() {
      const endDate = new Date(this.product.endDate);
      const today = new Date();
      const diffTime = endDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    },
  },
};
</script>

<style scoped>
.product-item {
  position: relative;
  width: 100%;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.image-container {
  position: relative;
  padding-top: 56.25%;
  border-radius: 8px;
  overflow: hidden;
}

.image-container img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.product-info {
  padding: 12px;
}

.achievement {
  color: #2b6cb0;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
}

.title {
  font-size: 16px;
  margin: 8px 0;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.footer {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.stats-box {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  background: #f3f4f6;
  color: #666;
}

.live-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  background: rgba(255,0,0,0.8);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  z-index: 1;
  font-weight: bold;
  font-size: 11px;
}

.product-link {
  text-decoration: none;
  color: inherit;
  display: block;
}
</style>