<template>
  <div class="category-list">
    <ul class="categories">
      <li
        v-for="category in categories"
        :key="category.name"
        class="category-item"
        @click="selectCategory(category.name)"
      >
        <div class="category-logo">
          <img :src="category.icon" :alt="`${category.name} 로고`" />
        </div>
        <span class="category-name">{{ category.name }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import DIYIcon from '@/assets/image/icon/DIY 아이콘.png';
import LifeIcon from '@/assets/image/icon/생활가전 아이콘.png';
import SmartIcon from '@/assets/image/icon/스마트가전 아이콘.png';
import EntertainmentIcon from '@/assets/image/icon/엔터테이먼트 아이콘.png';
import WearableIcon from '@/assets/image/icon/웨어러블 아이콘.png';
import KitchenIcon from '@/assets/image/icon/주방가전 아이콘.png';
import PeripheralIcon from '@/assets/image/icon/주변기기 아이콘.png';

export default {
  name: 'CategoryList',
  data() {
    return {
      categories: [
        { name: '생활 가전', icon: LifeIcon },
        { name: '주방 가전', icon: KitchenIcon },
        { name: '스마트 가전', icon: SmartIcon },
        { name: 'DIY', icon: DIYIcon },
        { name: '엔터테이먼트', icon: EntertainmentIcon },
        { name: '웨어러블', icon: WearableIcon },
        { name: '주변 기기', icon: PeripheralIcon },
      ],
    };
  },
  methods: {
    selectCategory(categoryName) {
      this.$router.push({ name: 'SearchResults', query: { q: categoryName, type: 'category' } });
    },
  },
};
</script>

<style scoped>
.category-list {
  text-align: center;
  margin: 0rem auto;
  max-width: 1200px;
  padding: 0 20px;
}

.categories {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  list-style: none;
  padding: 0;
  gap: 1rem;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 120px;
  padding: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.category-item:hover {
  transform: translateY(-3px);
}

.category-logo {
  width: 100px;
  height: 100px;
  padding: 10px;
  border-radius: 50%;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(231, 0, 0, 0.1);
}

.category-logo img {
  width: 80%;
  height: 80%;
  object-fit: contain;
  filter: grayscale(100%);
  transition: filter 0.3s ease;
}

.category-item:hover .category-logo img {
  filter: grayscale(0%);
}

.category-name {
  font-size: 0.9rem;
  font-weight: bold;
  position: relative;
  display: inline-block;
}

.category-name::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 2px;
  bottom: -4px;
  left: 0;
  background-color: #000;
  transform: scaleX(0);
  transform-origin: center;
  transition: transform 0.3s ease-out;
}

.category-item:hover .category-name::after {
  transform: scaleX(1);
}
</style>