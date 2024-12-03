<!-- src/views/mypage/MyPage.vue -->
<template>
  <div class="mypage-container">
    <!-- 초기 메뉴 선택 화면 -->
    <div v-if="!selectedMenu" class="menu-grid">
      <h2>마이페이지</h2>
      <p class="welcome-message">안녕하세요, {{ userName }}님!</p>
      
      <!-- MY정보 섹션 -->
      <div class="menu-section">
        <h3>MY정보</h3>
        <div class="menu-items">
          <div class="menu-item" @click="selectMenu('회원관리 조회 & 수정', '/mypage/profile')">
            <span>회원관리 조회 & 수정</span>
          </div>
        </div>
      </div>

      <!-- MY활동 섹션 -->
      <div class="menu-section">
        <h3>MY활동</h3>
        <div class="menu-items">
          <template v-if="userType === 'maker'">
            <div class="menu-item" @click="selectMenu('펀딩 진행 목록', '/mypage/funding-status')">
              <span>펀딩 진행 목록</span>
            </div>
            <div class="menu-item" @click="selectMenu('펀딩하기', '/mypage/project-registration')">
              <span>펀딩하기</span>
            </div>
          </template>
          
          <template v-else-if="userType === 'user'">
            <div class="menu-item" @click="selectMenu('펀딩 참여 목록', '/mypage/funding-participation')">
              <span>펀딩 참여 목록</span>
            </div>
            <div class="menu-item" @click="selectMenu('찜 목록', '/mypage/wishlist')">
              <span>찜 목록</span>
            </div>
     
          </template>
        </div>
      </div>
    </div>

    <!-- 선택된 메뉴의 콘텐츠 영역 -->
    <div v-else class="content-container" :class="{ 'show-sidebar': showSidebar }">
      <!-- 사이드바 -->
      <transition name="slide">
        <aside v-show="showSidebar" class="sidebar">
          <h3>마이페이지</h3>
          
          <div class="category">
            <h4>MY정보</h4>
            <ul class="submenu">
              <li :class="{ active: isActive('/mypage/profile') }">
                <router-link to="/mypage/profile">회원관리 조회 & 수정</router-link>
              </li>
            </ul>
          </div>
          
          <div class="category">
            <h4>MY활동</h4>
            <ul class="submenu">
              <template v-if="userType === 'maker'">
                <li :class="{ active: isActive('/mypage/funding-status') }">
                  <router-link to="/mypage/funding-status">펀딩 진행 목록</router-link>
                </li>
                <li :class="{ active: isActive('/mypage/project-registration') }">
                  <router-link to="/mypage/project-registration">펀딩하기</router-link>
                </li>
              </template>
              
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
      </transition>

      <!-- 메인 콘텐츠 -->
      <main class="main-content">
        <h1>{{ selectedMenu }}</h1>
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MyPage',
  data() {
    return {
      userName: '',
      userType: '',
      selectedMenu: '',
      showSidebar: false
    };
  },
  methods: {
    loadUserInfo() {
      this.userName = localStorage.getItem('userName') || '';
      this.userType = localStorage.getItem('userType') || '';
    },
    selectMenu(menuTitle, route) {
      this.selectedMenu = menuTitle;
      this.$router.push(route);
      
      // 사이드바 애니메이션 시작
      setTimeout(() => {
        this.showSidebar = true;
      }, 300);
    },
    isActive(path) {
      return this.$route.path === path;
    }
  },
  mounted() {
    this.loadUserInfo();
    window.addEventListener('storage', this.loadUserInfo);
  },
  beforeUnmount() {
    window.removeEventListener('storage', this.loadUserInfo);
  },
  watch: {
    $route(to, from) {
      // URL이 변경되면 해당하는 메뉴 제목을 설정
      const menuTitles = {
        '/mypage/profile': '회원관리 조회 & 수정',
        '/mypage/funding-status': '펀딩 진행 목록',
        '/mypage/project-registration': '펀딩하기',
        '/mypage/funding-participation': '펀딩 참여 목록',
        '/mypage/wishlist': '찜 목록',
      };
      this.selectedMenu = menuTitles[to.path] || '';
    }
  }
};
</script>
<!-- MyPage.vue styles -->
<style scoped>
.mypage-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.menu-grid {
  text-align: center;
}

.welcome-message {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: #666;
}

.menu-section {
  margin-bottom: 2rem;
}

.menu-section h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #6D63FF;
}

.menu-items {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  padding: 0 1rem;
}

.menu-item {
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #9E94F8;
}

.menu-item:hover {
  background-color: rgba(109, 99, 255, 0.05);
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(109, 99, 255, 0.1);
  border-color: #6D63FF;
}

.content-container {
  display: flex;
  gap: 2rem;
  position: relative;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}

.sidebar {
  width: 250px;
  background-color: #ffffff;
  padding: 1.5rem;
  border-right: 1px solid #9E94F8;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
}

.main-content {
  flex: 1;
  margin-left: 250px;
  transition: margin-left 0.3s ease;
}

.main-content h1 {
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #6D63FF;
}

.category h4 {
  font-size: 1.4rem;
  margin-bottom: 0.75rem;
  border-bottom: 1px solid #9E94F8;
  padding-bottom: 0.5rem;
  color: #6D63FF;
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
  background-color: #6D63FF;
  color: #ffffff;
}

.submenu a:hover {
  background-color: #9E94F8;
  color: #ffffff;
}
</style>

<!-- MypageSidebar.vue styles -->
<style scoped>
.sidebar {
  background-color: #ffffff;
  padding: 1.5rem;
  height: 100%;
  min-height: calc(100vh - 4rem);
  border-right: 1px solid #9E94F8;
}

h3 {
  font-size: 1.8rem;
  margin-bottom: 2rem;
  text-align: center;
  color: #6D63FF;
}

.category {
  margin-bottom: 1.5rem;
}

.category h4 {
  font-size: 1.4rem;
  margin-bottom: 0.75rem;
  border-bottom: 1px solid #9E94F8;
  padding-bottom: 0.5rem;
  color: #6D63FF;
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
  background-color: #6D63FF;
  color: #ffffff;
  font-weight: 500;
}

.submenu a:hover:not(.active) {
  background-color: #9E94F8;
  color: #ffffff;
}

.menu-item {
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(109, 99, 255, 0.1);
}

.menu-item:hover {
  background-color: #9E94F8;
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(109, 99, 255, 0.15);
}

@media (max-width: 768px) {
  .sidebar {
    min-height: auto;
    padding: 1rem;
  }
}
</style>