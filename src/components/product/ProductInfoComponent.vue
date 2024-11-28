<!-- ProductInfoComponent.vue -->
<template>
  <div class="product-info">
    <div class="product-header">
      <h1 class="product-title">{{ product.productName }}</h1>
      <p class="product-price">{{ product.price }}원</p>
    </div>
    <div class="product-summary">
      {{ product.summary }}
    </div>
    <div class="product-image" v-if="product.images.length > 0">
      <img :src="product.images[0].url" :alt="product.productName" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
const { VITE_API_SERVER_URI } = import.meta.env

const product = ref({
  productName: '',
  price: 0,
  summary: '',
  images: [],
})

const props = defineProps({
  roomId: {
    type: String,
    required: true
  }
})

// ProductInfoComponent.vue
const getProduct = async () => {
  try {
    // API URL과 roomId를 콘솔에 출력해서 확인
    console.log('API URL:', `${VITE_API_SERVER_URI}/api/project/${props.roomId}`)
    console.log('RoomId:', props.roomId)

    const response = await fetch(`${VITE_API_SERVER_URI}/api/project/${props.roomId}`)
    if (response.ok) {
      const project_info = await response.json()
      console.log('상품 정보 로드 성공:', project_info)
      product.value = project_info
    } else {
      console.error('상품 정보 로드 실패:', response.status, response.statusText)
      // response 내용도 확인
      const errorText = await response.text()
      console.error('Error response:', errorText)
    }
  } catch (error) {
    console.error('상품 정보 로드 실패:', error)
  }
}

// onMounted에서 roomId 확인
onMounted(() => {
  console.log('ProductInfoComponent mounted, roomId:', props.roomId)
  if (props.roomId) {
    getProduct()
  }
})
</script>

<style scoped>
.product-info {
  padding: 1rem;
}

.product-header {
  margin-bottom: 1rem;
}

.product-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.product-price {
  font-size: 1.2rem;
  color: #2b6cb0;
}

.product-summary {
  margin-bottom: 1rem;
  line-height: 1.5;
}

.product-image img {
  width: 100%;
  max-height: 300px;
  object-fit: cover;
  border-radius: 8px;
}
</style>