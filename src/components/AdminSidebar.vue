<template>
    <aside class="sidebar">
      <h3>관리자 메뉴</h3>
      <ul class="menu">
        <li :class="{ active: isActive('/admin') }">
          <router-link to="/admin">대시보드</router-link>
        </li>
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
    width: 250px;
    background-color: #2f3a4f;
    color: white;
    padding: 1.5rem;
  }
  h3 {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
  }
  .menu {
    list-style: none;
    padding: 0;
  }
  .menu li {
    margin-bottom: 1rem;
  }
  .menu a {
    color: #a9b7c6;
    text-decoration: none;
  }
  .menu a:hover,
  .menu li.active > a {
    color: white;
    text-decoration: underline;
  }
  </style>
  