<template>
  <div class="mypage-layout">
    <Header />
    <div class="mypage-main">
      <div class="content-wrapper">
        <div class="mypage-container">
          <MypageSidebar class="sidebar" />
          <div class="main-content">
            <div class="menu-grid">
              <router-view />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MypageSidebar from '../components/MypageSidebar.vue';
import Header from '@/components/Header.vue';

export default {
  name: 'MyPageLayout',
  components: {
    MypageSidebar,
    Header,
  },
};
</script>

<style scoped>
.mypage-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #ffffff;
}

.mypage-main {
  flex: 1;
  width: 100%;
}

.content-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  width: 100%;
  box-sizing: border-box;
}

.mypage-container {
  display: flex;
  gap: 2rem;
  margin-top: 2rem;
}

.sidebar {
  flex-shrink: 0;
  width: 220px;
  background-color: #ffffff;
  border-right: 1px solid #9E94F8;
}

.main-content {
  flex: 1;
  min-width: 0;
}

.menu-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  padding: 1rem;
}

@media (max-width: 768px) {
  .mypage-container {
    flex-direction: column;
    gap: 1rem;
  }
  
  .sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #9E94F8;
  }
  
  .menu-grid {
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    padding: 0.5rem;
  }
}

@media (max-width: 480px) {
  .content-wrapper {
    padding: 0 1rem;
  }

  .menu-grid {
    grid-template-columns: 1fr;
  }
}
</style>