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
        <div v-for="(slide, index) in displaySlides" 
             :key="index"
             :class="['slide-group', {
               'active': isActiveSlide(index),
               'dim': isDimmedSlide(index)
             }]">
          <div class="slide wide">
            <img :src="slide.image" :alt="slide.title" class="slide-image"/>
          </div>
        </div>
      </div>

      <div class="controls">
        <div class="arrows">
          <button @click="prevSlide" class="arrow">&lt;</button>
          <span class="slide-count">{{ currentSlideIndex + 1 }} / {{ slides.length }}</span>
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

const SLIDE_WIDTH = 1200;
const SLIDE_HEIGHT = 350;
const SLIDE_DURATION = 3000;

// 모든 배너를 긴 이미지로 설정
const slides = [
  { id: 1, image: banner1, title: '배너1' },
  { id: 2, image: banner2, title: '배너2' },
  { id: 3, image: banner3, title: '배너3' },
  { id: 4, image: banner4, title: '배너4' }
];

// 앞에 2개, 뒤에 2개의 복제 슬라이드 추가
const displaySlides = computed(() => {
  // 순환을 위해 더 많은 슬라이드 복제
  return [...slides.slice(-2), ...slides, ...slides.slice(0, 2)];
});

const sliderRef = ref(null);
const currentIndex = ref(2);
const progressWidth = ref(0);
const translateX = ref(0);
const isTransitioning = ref(false);

const currentSlideIndex = computed(() => {
  const realIndex = currentIndex.value - 2;
  if (realIndex < 0) return slides.length + realIndex;
  if (realIndex >= slides.length) return realIndex - slides.length;
  return realIndex;
});

const updateTranslateX = (withTransition = true) => {
  if (!sliderRef.value) return;
  
  const containerWidth = sliderRef.value.offsetWidth;
  const centerOffset = (containerWidth - SLIDE_WIDTH) / 2;
  
  if (!withTransition) {
    // 트랜지션 없이 즉시 이동
    document.querySelector('.slides-container').style.transition = 'none';
  }
  
  translateX.value = -(currentIndex.value * SLIDE_WIDTH - centerOffset);
  
  if (!withTransition) {
    // 트랜지션 스타일 복구
    setTimeout(() => {
      document.querySelector('.slides-container').style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    }, 50);
  }
};

const handleTransitionEnd = () => {
  isTransitioning.value = false;
  // 마지막 슬라이드에 도달했을 때
  if (currentIndex.value >= slides.length + 2) {
    currentIndex.value = 2; // 처음으로 순간 이동
    updateTranslateX(false); // 트랜지션 없이 이동
  }
};

const isActiveSlide = (index) => index === currentIndex.value;
const isDimmedSlide = (index) => !isActiveSlide(index);

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
  height: 350px;
  overflow: hidden;
}

.slides-container {
  position: absolute;
  height: 100%;
  display: flex;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
}

.slide-group {
  display: flex;
  flex: 0 0 1200px;
  transition: opacity 0.3s ease;
  opacity: 0.3;
}

.slide {
  flex: 0 0 1200px;
  width: 1200px;
  height: 350px;
  position: relative;
  border-radius: 10px;
  overflow: hidden;
}

.slide-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
}

.slide-group.active {
  opacity: 1;
}

.slide-group.dim {
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