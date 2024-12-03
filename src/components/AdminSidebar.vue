<!-- src/components/AdminSidebar.vue -->
<template>
  <aside class="sidebar">
    <h3>관리자 메뉴</h3>
    
    <!-- 대시보드 카테고리 -->
    <div class="category">
      <h4>대시보드</h4>
      <ul class="submenu">
        <li :class="{ active: isActive('/admin') }">
          <router-link to="/admin">메인 대시보드</router-link>
        </li>
      </ul>
    </div>
    
    <!-- 관리 카테고리 -->
    <div class="category">
      <h4>관리메뉴</h4>
      <ul class="submenu">
        <li :class="{ active: isActive('/admin/projects') }">
          <router-link to="/admin/projects">프로젝트 관리</router-link>
        </li>
        <li :class="{ active: isActive('/admin/users') }">
          <router-link to="/admin/users">사용자 관리</router-link>
        </li>
        <li :class="{ active: isActive('/admin/reports') }">
          <router-link to="/admin/reports">신고 현황</router-link>
        </li>
      </ul>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'AdminSidebar',
  methods: {
    isActive(path) {
      return this.$route.path.startsWith(path);
    },
  },
};
</script>

<style scoped>
.sidebar {
  background-color: #ffffff;
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

@media (max-width: 768px) {
  .sidebar {
    min-height: auto;
    padding: 1rem;
  }
}
</style>