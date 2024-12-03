<template>
  <div class="product-item" @click="$emit('click', product)">
    <div v-if="product.isLive" class="live-badge">LIVE</div>
    <div class="image-container">
      <img :src="product.image" :alt="product.productName" />
    </div>
    <div class="product-info">
      <div class="achievement">{{ product.achievement }}%</div>
      <h3 class="title">{{ product.name }}</h3>
      <div class="footer">
        <span :class="['stats-box', 'category', getCategoryClass]">{{ product.category }}</span>
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
    }
  },
  computed: {
    getCategoryClass() {
      switch(this.product.category) {
        case '생활 가전': return 'life';
        case '주방 가전': return 'kitchen';
        case '스마트 가전': return 'smart';
        case 'DIY': return 'diy';
        case '엔터테이먼트': return 'entertainment';
        case '웨어러블': return 'wearable';
        case '주변 기기': return 'peripheral';
        default: return '';
      }
    }
  },
  emits: ['click']
};
</script>

<style scoped>
.product-item {
  position: relative;
  width: 100%;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(109, 99, 255, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.product-item:hover {
  transform: translateY(-2px);
  border-color: #9E94F8;
  background-color: rgba(109, 99, 255, 0.05);
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
  color: #6D63FF;
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
  color: #fff;
}

.days {
  background: #6D63FF;
  color: white;
}

.category.life { 
  background: #ff6b6bd2; 
}
.category.kitchen { 
  background: #4ecdc5c4; 
}
.category.smart { 
  background: #45B7D1; 
}
.category.diy { 
  background: #96CEB4; 
}
.category.entertainment { 
  background: #FFEEAD; 
  color: #666; 
}
.category.wearable { 
  background: #D4A5A5; 
}
.category.peripheral { 
  background: #9a348ead; 
}

.live-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  background: #fd0000ba;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  z-index: 1;
  font-weight: bold;
  font-size: 12px;
  transition: background-color 0.3s ease;
}

.live-badge:hover {
  background: #9E94F8;
}

.product-link {
  text-decoration: none;
  color: inherit;
  display: block;
}
</style>