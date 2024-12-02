<!-- src/layouts/AdminLayout.vue -->
<template>
  <div class="admin-layout">
    <div class="admin-main">
      <div class="content-wrapper">
        <div class="admin-container">
          <div v-if="!isLoginPage" class="sidebar-container">
            <AdminSidebar />
          </div>
          <div class="admin-content" :class="{ 'with-sidebar': !isLoginPage }">
            <router-view />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AdminSidebar from '../components/AdminSidebar.vue';

export default {
  name: 'AdminLayout',
  components: {
    AdminSidebar
  },
  computed: {
    isLoginPage() {
      return this.$route.name === 'AdminLogin' || this.$route.path === '/admin/login';
    }
  }
};
</script>

<style scoped>
.admin-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f8f9fa;
}

.admin-main {
  flex: 1;
  width: 100%;
}

.content-wrapper {
  max-width: 1800px;
  margin: 0 auto;
  padding: 0 20px;
  width: 100%;
  box-sizing: border-box;
}

.admin-container {
  display: flex;
  flex: 1;
  margin-top: 2rem;
  position: relative;
}

.sidebar-container {
  width: 250px;
  background-color: #f8f9fa;
  flex-shrink: 0;
  border-right: 1px solid #dee2e6;
  margin-right: -1rem; /* 사이드바와 콘텐츠 사이 간격 축소 */
}

.admin-content {
  flex: 1;
  padding: 1rem; /* padding 축소 */
  background-color: #f8f9fa;
  min-width: 0;
}

.admin-content.with-sidebar {
  margin-left: 0;
}

@media (max-width: 768px) {
  .admin-container {
    flex-direction: column;
  }
  
  .sidebar-container {
    width: 100%;
  }
  
  .admin-content.with-sidebar {
    margin-top: 1rem;
  }
  
  .content-wrapper {
    padding: 0 10px;
  }
}
</style>