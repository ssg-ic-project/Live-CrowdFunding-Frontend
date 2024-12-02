<!-- src/components/MypageSidebar.vue -->
<template>
  <aside class="sidebar">
    <h3>마이페이지</h3>
    
    <!-- MY정보 카테고리 -->
    <div class="category">
      <h4>MY정보</h4>
      <ul class="submenu">
        <li :class="{ active: isActive('/mypage/profile') }">
          <router-link to="/mypage/profile">회원관리 조회 & 수정</router-link>
        </li>
      </ul>
    </div>
    
    <!-- MY활동 카테고리 -->
    <div class="category">
      <h4>MY활동</h4>
      <ul class="submenu">


        <!-- 판매자용 하위 기능 -->

   
        <template v-if="userType === 'maker'">
          <li :class="{ active: isActive('/mypage/funding-status') }">
            <router-link to="/mypage/funding-status">펀딩 진행 목록</router-link>
          </li>
          <li :class="{ active: isActive('/mypage/project-registration') }">
            <router-link to="/mypage/project-registration">펀딩하기</router-link>
          </li>
        </template>
        
        
        <!-- 구매자용 하위 기능 -->
        <template v-else-if="userType === 'user'">
          
          
          <li :class="{ active: isActive('/mypage/funding-participation') }">
            <router-link to="/mypage/funding-participation">펀딩 참여 목록</router-link>
          </li>
          <li :class="{ active: isActive('/mypage/wishlist') }">
            <router-link to="/mypage/wishlist">찜 목록</router-link>
          </li>
 
        </template>
      </ul>
    </div>
  </aside>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';

const message = ref("");

export default {
  name: 'MypageSidebar',
  data() {
    return {
      userType: '', 
    };
  },
  methods: {
    isActive(path) {
      return this.$route.path === path;
    },
    loadUserType() {
      this.userType = localStorage.getItem('userType') || '';
    },
  },
  mounted() {//
    this.loadUserType();

    window.addEventListener('storage', this.loadUserType); 
  },

  beforeUnmount() {
    window.removeEventListener('storage', this.loadUserType);
  },
};

// axios.get(import.meta.VITE_API_URL).then((response) => {
//   message.value = response.data.category;
// });
</script>

<style scoped>
.sidebar {
  background-color: #f8f9fa;
  padding: 1.5rem;
  height: 100%;
  min-height: calc(100vh - 4rem);
  border-right: 1px solid #dee2e6;
}

h3 {
  font-size: 1.8rem;
  margin-bottom: 2rem;
  text-align: center;
  color: #000;
}

.category {
  margin-bottom: 1.5rem;
}

.category h4 {
  font-size: 1.4rem;
  margin-bottom: 0.75rem;
  border-bottom: 1px solid #dee2e6;
  padding-bottom: 0.5rem;
  color: #000;
}

.submenu {
  list-style: none;
  padding-left: 0;
}

.submenu li {
  margin-bottom: 0.75rem;
}

.submenu a {
  color: #495057;
  text-decoration: none;
  font-size: 1rem;
  display: block;
  padding: 0.5rem 1rem;
  transition: all 0.3s;
  border-radius: 4px;
}

.submenu li.active > a {
  background-color: #FF5151;
  color: #ffffff;
  font-weight: 500;
}

.submenu a:hover:not(.active) {
  background-color: #FFD74E;
  color: #333333;
}

/* 메뉴 아이템 스타일 */
.menu-item {
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.menu-item:hover {
  background-color: #FFD74E;
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

@media (max-width: 768px) {
  .sidebar {
    min-height: auto;
    padding: 1rem;
  }
}
</style>