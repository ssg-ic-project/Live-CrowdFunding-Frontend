<!-- ProductItem.vue -->
<template>
  <!-- isLive가 true일 경우 스트리밍으로, 아닐 경우 상품 상세로 이동 -->
  <div class="product-item" @click="handleClick">
    <div v-if="product.isLive" class="live-badge">LIVE</div>
    <div class="image-container">
      <img :src="product.image" :alt="product.productName" />
    </div>
    <div class="product-info">
      <div class="achievement">{{ product.achievement }}%</div>
      <h3 class="title">{{ product.name }}</h3>
      <div class="footer">
        <span class="stats-box category">{{ product.category }}</span>
        <span class="stats-box days">{{ product.remainingTime }}일 남음</span>
      </div>
    </div>
  </div>
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
    handleClick() {
      if (this.product.isLive) {
        // /streaming URL 유지하고 productId는 쿼리로 전달
        this.$router.push({
          path: "/streaming",
          query: {
            productId: this.product.id,
          },
        });
      } else {
        this.$router.push({
          name: "ProductDetail",
          params: { productId: this.product.id },
        });
      }
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
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer; /* 클릭 가능함을 표시 */
  transition: transform 0.2s ease;
}

.product-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}
.clickable {
  cursor: pointer;
}

.live-badge:hover {
  background: rgba(255, 0, 0, 1);
}
.product-item {
  position: relative;
  width: 100%;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
  background: rgba(255, 0, 0, 0.8);
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
