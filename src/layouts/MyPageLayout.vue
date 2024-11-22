<!-- src/layouts/MyPageLayout.vue -->
<template>
  <div class="mypage-layout">
    <Header />
    <div class="mypage-main">
      <div class="content-wrapper">
        <div class="mypage-container">
          <MypageSidebar />
          <div class="mypage-content">
            <router-view />
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
}

.mypage-main {
  flex: 1;
  width: 100%;
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  width: 100%;
  box-sizing: border-box;
}

.mypage-container {
  display: flex;
  flex: 1;
  background-color: #ffffff;
  margin-top: 2rem;
}

.mypage-content {
  flex: 1;
  padding: 2rem;
  background-color: #ffffff;
}

@media (max-width: 768px) {
  .mypage-container {
    flex-direction: column;
  }
}
</style>