<template>
  <div class="page-layout">
    <Header class="header" />
    <div class="content-layout">
      <div class="content-wrapper">
        <div class="mypage-container">
          <MypageSidebar class="sidebar" />
          <div class="main-content">
            <div class="menu-grid">
              <router-view />
            </div>
          </div>
        </main>
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

<style scoped>.page-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #ffffff;
  position: relative;
}

.header {
  width: 100%;
  flex-shrink: 0;
  position: relative;
  z-index: 10;
}

.content-layout {
  flex: 1;
  width: 100%;
  padding-top: 1rem;
  position: relative;
}

.content-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 20px;
  box-sizing: border-box;
}

.main-content {
  width: 100%;
}

.content-with-sidebar {
  display: flex;
  gap: 2rem;
  position: relative;
  width: 1400px
}

.sidebar {
  width: 220px;
  flex-shrink: 0;
  background-color: #ffffff;
  border-right: 1px solid #9E94F8;
  position: relative;
}

.page-content {
  flex: 1;
  min-width: 0;
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
  .content-wrapper {
    padding: 1rem 20px;
  }
  
  .content-with-sidebar {
    flex-direction: column;
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
    padding: 1rem;
  }

  .menu-grid {
    grid-template-columns: 1fr;
  }
}
</style>