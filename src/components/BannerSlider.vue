<!-- src/components/BannerSlider.vue -->
<template>
  <div class="banner-wrapper">
    <div class="banner-slider" 
         ref="sliderRef"
         @mouseenter="pauseSlide" 
         @mouseleave="resumeSlide">
      <div class="slides-container" 
           :style="{ transform: `translateX(${translateX}px)` }"
           @transitionend="handleTransitionEnd">
        <div v-for="(banner, index) in displayBanners" 
             :key="`${index}-${banner.id}`"
             :class="['slide', {
               'active': isActiveSlide(index),
               'dim': isDimmedSlide(index)
             }]">
          <img :src="banner.image" :alt="banner.title" class="slide-image"/>
        </div>
      </div>

      <div class="controls">
        <div class="arrows">
          <button @click="prevSlide" class="arrow">&lt;</button>
          <span class="slide-count">{{ currentDisplayIndex + 1 }} / {{ banners.length }}</span>
          <button @click="nextSlide" class="arrow">&gt;</button>
        </div>
      </div>

      <div class="progress-bar">
        <div class="progress" :style="{ width: `${progressWidth}%` }"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import banner1 from '@/assets/image/배너1.jpg';
import banner2 from '@/assets/image/배너2.jpg';
import banner3 from '@/assets/image/배너3.jpg';
import banner4 from '@/assets/image/배너4.jpg';
import banner5 from '@/assets/image/배너5.jpg';
import banner6 from '@/assets/image/배너6.jpg';
import banner7 from '@/assets/image/배너7.jpg';

const SLIDE_WIDTH = 600; // 수정된 슬라이드 너비
const SLIDE_HEIGHT = 350; // 수정된 슬라이드 높이
const SLIDE_DURATION = 3000;

// 원본 배너 데이터
const banners = [
  { id: 1, image: banner1, title: '배너1' },
  { id: 2, image: banner2, title: '배너2' },
  { id: 3, image: banner3, title: '배너3' },
  { id: 4, image: banner4, title: '배너4' },
  { id: 5, image: banner5, title: '배너5' },
  { id: 6, image: banner6, title: '배너6' },
  { id: 7, image: banner7, title: '배너7' },
];

const displayBanners = computed(() => {
  const clonedBefore = banners.slice(-2);
  const clonedAfter = banners.slice(0, 2);
  return [...clonedBefore, ...banners, ...clonedAfter];
});

const sliderRef = ref(null);
const currentIndex = ref(2);
const progressWidth = ref(0);
const translateX = ref(0);
const isTransitioning = ref(false);

const currentDisplayIndex = computed(() => {
  const realIndex = currentIndex.value - 2;
  if (realIndex < 0) return banners.length + realIndex;
  if (realIndex >= banners.length) return realIndex - banners.length;
  return realIndex;
});

// 수정된 중앙 정렬 로직
const updateTranslateX = () => {
  if (!sliderRef.value) return;
  
  const containerWidth = sliderRef.value.offsetWidth;
  // 두 슬라이드의 전체 너비를 고려한 중앙 정렬 오프셋 계산
  const centerOffset = (containerWidth - (SLIDE_WIDTH * 2)) / 2;
  translateX.value = -(currentIndex.value * SLIDE_WIDTH - centerOffset);
};

const handleTransitionEnd = () => {
  isTransitioning.value = false;
  if (currentIndex.value <= 1) {
    currentIndex.value = banners.length + 1;
    updateTranslateX();
  } else if (currentIndex.value >= banners.length + 2) {
    currentIndex.value = 2;
    updateTranslateX();
  }
};

const isActiveSlide = (index) => {
  const activeIndex = currentIndex.value;
  return index === activeIndex || index === activeIndex + 1;
};

const isDimmedSlide = (index) => {
  const activeIndex = currentIndex.value;
  return index === activeIndex - 1 || index === activeIndex + 2;
};

const nextSlide = () => {
  if (!isTransitioning.value) {
    isTransitioning.value = true;
    currentIndex.value++;
    updateTranslateX();
    resetProgress();
  }
};

const prevSlide = () => {
  if (!isTransitioning.value) {
    isTransitioning.value = true;
    currentIndex.value--;
    updateTranslateX();
    resetProgress();
  }
};

const resetProgress = () => {
  progressWidth.value = 0;
  setTimeout(() => {
    progressWidth.value = 100;
  }, 50);
};

let slideInterval;

const startSlideShow = () => {
  slideInterval = setInterval(() => {
    nextSlide();
  }, SLIDE_DURATION);
};

const pauseSlide = () => {
  clearInterval(slideInterval);
};

const resumeSlide = () => {
  startSlideShow();
};

onMounted(() => {
  updateTranslateX();
  window.addEventListener('resize', updateTranslateX);
  startSlideShow();
  resetProgress();
});

onUnmounted(() => {
  clearInterval(slideInterval);
  window.removeEventListener('resize', updateTranslateX);
});
</script>

<style scoped>
.banner-wrapper {
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  margin-right: calc(-50vw + 50%);
  overflow: hidden;
}

.banner-slider {
  position: relative;
  width: 100%;
  height: 350px; /* 수정된 높이 */
  overflow: hidden;
  

}

.slides-container {
  position: absolute;
  height: 100%;
  display: flex;
  transition: transform 0.5s ease;
  will-change: transform;
    border-radius: 50px;
}

.slide {
  flex: 0 0 600px;
  width: 600px;
  height: 350px;
  position: relative;
  transition: opacity 0.3s ease;
  opacity: 0.3;
  border-radius: 10px; 
  overflow: hidden; 
}

.slide-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px; 
}

.slide.active {
  opacity: 1;
}

.slide.dim {
  opacity: 0.3;
}



.controls {
  position: absolute;
  bottom: 20px;
  right: 20px;
  z-index: 10;
}

.arrows {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(0, 0, 0, 0.5);
  padding: 8px 12px;
  border-radius: 20px;
}

.arrow {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 18px;
  padding: 0 8px;
}

.arrow:hover {
  opacity: 0.8;
}

.slide-count {
  color: white;
  font-size: 14px;
}

.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: rgba(255, 255, 255, 0.3);
}

.progress {
  height: 100%;
  background: white;
  transition: width 3s linear;
}
</style>