<!-- src/layouts/AdminLayout.vue -->
<template>
  <div class="admin-layout">
    
    <AdminSidebar v-if="!isLoginPage" />
  
    <div class="admin-content" :class="{ 'full-width': isLoginPage }">
      <router-view />
    </div>
  </div>
</template>

<script>
import AdminSidebar from '../components/AdminSidebar.vue';

export default {
  name: 'AdminLayout',
  components: {
    AdminSidebar,
  },
  computed: {
    isLoginPage() {
      // 현재 라우트가 로그인 페이지인지 확인
      return this.$route.name === 'AdminLogin' || this.$route.path === '/admin/login';
    }
  }
};
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
}

.admin-content {
  flex: 1;
  padding: 2rem;
}

/* 로그인 페이지일 때는 전체 너비 사용 */
.full-width {
  width: 100%;
  padding: 0;
}
</style> 