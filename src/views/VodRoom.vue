<template>
  <div class="vod-layout">
    <div class="content-container">
      <!-- VOD 재생 영역 -->
      <div class="video-section">
        <video
          ref="videoPlayer"
          class="main-video"
          controls
          @timeupdate="handleTimeUpdate"
        >
          <source :src="videoUrl" type="video/mp4">
          브라우저가 비디오 재생을 지원하지 않습니다.
        </video>
      </div>

      <!-- 상품 정보 영역 -->
      <div class="info-section">
        <!-- <div class="vod-info">
          <h1 class="title">{{ vodData.title }}</h1>
          <div class="metadata">
            <span class="date">{{ formatDate(vodData.streamDate) }}</span>
            <span class="views">조회수 {{ vodData.viewCount }}회</span>
          </div>
          <p class="description">{{ vodData.description }}</p>
        </div> -->

        <div class="product-info">
          <h2 class="section-title">상품 정보</h2>
          <div class="product-details">
            <img :src="vodData.productImage" :alt="vodData.productName" class="product-image">
            <div class="product-text">
              <h3 class="product-name">{{ vodData.productName }}</h3>
              <p class="product-price">{{ formatPrice(vodData.price) }}원</p>
              <p class="product-description">{{ vodData.productDescription }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'


const route = useRoute()
const videoPlayer = ref(null)
const videoUrl = ref('')
const vodData = ref({
  title: '',
  streamDate: '',
  viewCount: 0,
  description: '',
  productName: '',
  productImage: '',
  price: 0,
  productDescription: ''
})

// 날짜 포맷팅
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 가격 포맷팅
const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const handleTimeUpdate = (event) => {
  const currentTime = event.target.currentTime
  // 필요한 경우 시청 진행도 저장
}

onMounted(async () => {
  try {
    // VOD 데이터 로딩
    // const response = await fetch(`/api/recordings/media/${scheduleId.value}`)
    const response = await fetch(`/api/recordings/media/${route.query.scheduleId}`)
    const data = await response.text()

    if (data) {
      videoPlayer.value.src= data
      videoPlayer.value.autoplay = true
    } else {
      console.error('VOD 데이터 로딩 실패:', response)
      return
    }

    // 상품 정보 로딩
    await loadProductData()
    
    // 조회수 증가 API 호출
    // await fetch(`/api/vod/${vodId.value}/view`, { method: 'POST' })
  } catch (error) {
    console.error('VOD 데이터 로딩 실패:', error)
  }
})

const loadProductData = async () => {
  try {
    const projectId = route.params.streamId
    const response = await fetch(`/api/project/${projectId}/live`)
    const data = await response.json()

    console.log(data)
    
    // vodData 업데이트
    vodData.value = {
      title: data.title || '',
      streamDate: data.streamDate || '',
      viewCount: data.viewCount || 0,
      description: data.description || '',
      productName: data.productName || '',
      productImage: data.images[0].url || '',
      price: data.price || 0,
      productDescription: data.description || ''
    }
  } catch (error) {
    console.error('상품 데이터 로딩 실패:', error)
  }
}

onBeforeUnmount(() => {
  // 필요한 경우 시청 기록 저장
  if (videoPlayer.value) {
    const currentTime = videoPlayer.value.currentTime
    const duration = videoPlayer.value.duration
    // 시청 기록 저장 API 호출
  }
})
</script>

<style scoped>
.vod-layout {
  width: 100%;
  min-height: 100vh;
  background-color: #ffffff;
  padding: 2rem;
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
}

.video-section {
  width: 100%;
  background-color: #000;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 2rem;
}

.main-video {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: contain;
}

.info-section {
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.vod-info {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #eee;
}

.title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.metadata {
  display: flex;
  gap: 1rem;
  color: #666;
  margin-bottom: 1rem;
}

.description {
  color: #444;
  line-height: 1.6;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.product-details {
  display: flex;
  gap: 2rem;
}

.product-image {
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
}

.product-text {
  flex: 1;
}

.product-name {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.product-price {
  font-size: 1.125rem;
  color: #e94c89;
  font-weight: 600;
  margin-bottom: 1rem;
}

.product-description {
  color: #444;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .vod-layout {
    padding: 1rem;
  }

  .info-section {
    padding: 1rem;
  }

  .product-details {
    flex-direction: column;
  }

  .product-image {
    width: 100%;
    height: auto;
  }
}
</style>