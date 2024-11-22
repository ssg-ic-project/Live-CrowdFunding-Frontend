<!-- src/components/Header.vue -->
<template>
  <header class="header">
    <div class="container">
      <div class="logo">
        <router-link to="/">
          <img src="../assets/image/logo.png" alt="logo" class="logo-image" />
        </router-link>
      </div>

      <nav class="navigation">
        <ul class="nav-center">
          <li><router-link to="/live" class="nav-item">라이브</router-link></li>
          <li>
            <router-link to="/schedule" class="nav-item">편성표</router-link>
          </li>
          <li
            class="category-container"
            @mouseenter="showCategoryDropdown"
            @mouseleave="hideCategoryDropdown"
          >
            <a href="#" class="nav-item">카테고리</a>
            <div v-if="categoryDropdownVisible" class="category-dropdown">
              <router-link
                v-for="category in categories"
                :key="category.name"
                :to="{
                  name: 'SearchResults',
                  query: { q: category.name, type: 'category' },
                }"
                class="category-item"
              >
                {{ category.name }}
              </router-link>
            </div>
          </li>
          <li v-if="isLoggedIn && userType !== 'seller'">
            <router-link to="/mypage/wishlist" class="nav-item">찜</router-link>
          </li>
        </ul>
        <div class="search-bar">
          <input
            type="text"
            placeholder="검색어를 입력해주세요"
            class="search-input"
            v-model="searchQuery"
            @keyup.enter="handleSearch"
          />
          <button @click="handleSearch" class="search-button">검색</button>
        </div>
      </nav>

      <div class="user-info">
        <div
          v-if="isLoggedIn"
          class="profile-container"
          @mouseenter="showDropdown"
          @mouseleave="startHideDropdown"
        >
          <img
            src="../assets/image/icon/프로필.png"
            alt="User Profile"
            class="profile-img"
          />
          <div
            v-show="dropdownVisible"
            class="dropdown-menu"
            @mouseenter="cancelHideDropdown"
            @mouseleave="startHideDropdown"
          >
            <div class="profile-info">
              <img
                src="../assets/image/icon/프로필.png"
                alt="User Profile"
                class="profile-thumbnail"
              />
              <span class="username">{{ userName }}</span>
            </div>
            <router-link to="/mypage" class="dropdown-item"
              >마이페이지</router-link
            >
            <router-link
              v-if="userType !== 'seller'"
              to="/mypage/wishlist"
              class="dropdown-item"
              >찜목록</router-link
            >
            <router-link to="/" class="dropdown-item" @click.native="logout"
              >로그아웃</router-link
            >
          </div>
        </div>
        <router-link v-else to="/auth/login" class="login-button"
          >로그인</router-link
        >
      </div>
    </div>
  </header>
</template>

<script>
import { authApi } from "@/api";
import DIYIcon from "@/assets/image/icon/DIY 아이콘.png";
import LifeIcon from "@/assets/image/icon/생활가전 아이콘.png";
import SmartIcon from "@/assets/image/icon/스마트가전 아이콘.png";
import EntertainmentIcon from "@/assets/image/icon/엔터테이먼트 아이콘.png";
import WearableIcon from "@/assets/image/icon/웨어러블 아이콘.png";
import KitchenIcon from "@/assets/image/icon/주방가전 아이콘.png";
import PeripheralIcon from "@/assets/image/icon/주변기기 아이콘.png";

export default {
  name: "Header",
  data() {
    return {
      categories: [
        { name: "생활 가전", icon: LifeIcon },
        { name: "주방 가전", icon: KitchenIcon },
        { name: "스마트 가전", icon: SmartIcon },
        { name: "DIY", icon: DIYIcon },
        { name: "엔터테이먼트", icon: EntertainmentIcon },
        { name: "웨어러블", icon: WearableIcon },
        { name: "주변 기기", icon: PeripheralIcon },
      ],
      isLoggedIn: false,
      searchQuery: "",
      dropdownVisible: false,
      categoryDropdownVisible: false,
      userName: "",
      userType: "",
      dropdownTimer: null,
    };
  },
  methods: {
    async logout() {
    try {
        console.log('로그아웃 시작');
        
        // 로그아웃 API 호출
        await authApi.logout();
        console.log('로그아웃 API 호출 성공');

        // 로컬 스토리지 초기화
        localStorage.clear();  // 모든 데이터 삭제
        
        // 상태 초기화
        this.isLoggedIn = false;
        this.dropdownVisible = false;
        this.userName = "";
        this.userType = "";

        console.log('로컬 스토리지 및 상태 초기화 완료');

        // 로그인 상태 변경 이벤트 발생
        window.dispatchEvent(new Event('login-state-changed'));
        
        // 홈으로 이동
        await this.$router.push("/");
        console.log('홈으로 이동 완료');
        
    } catch (error) {
        console.error('로그아웃 에러:', error);
        // 에러가 발생해도 로컬 데이터는 삭제
        localStorage.clear();
        this.isLoggedIn = false;
        this.$router.push("/");
    }
},
    handleSearch() {
      if (this.searchQuery.trim()) {
        this.$router.push({
          name: "SearchResults",
          query: { q: this.searchQuery, type: "search" },
        });
      }
    },
    showDropdown() {
      if (this.dropdownTimer) {
        clearTimeout(this.dropdownTimer);
        this.dropdownTimer = null;
      }
      this.dropdownVisible = true;
    },
    startHideDropdown() {
      this.dropdownTimer = setTimeout(() => {
        this.dropdownVisible = false;
      }, 300);
    },
    cancelHideDropdown() {
      if (this.dropdownTimer) {
        clearTimeout(this.dropdownTimer);
        this.dropdownTimer = null;
      }
      this.dropdownVisible = true;
    },
    showCategoryDropdown() {
      this.categoryDropdownVisible = true;
    },
    hideCategoryDropdown() {
      this.categoryDropdownVisible = false;
    },
    loadUserInfo() {
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
      const userName = localStorage.getItem("userName") || "";
      const userType = localStorage.getItem("userType") || "";
      this.isLoggedIn = isLoggedIn;
      this.userName = userName;
      this.userType = userType;
    },
  },
  mounted() {
    this.loadUserInfo();

    // 로그인 상태 변경 감지
    window.addEventListener("login-state-changed", this.loadUserInfo);

    // storage 이벤트는 다른 탭에서의 변경만 감지하므로 custom 이벤트 사용
    window.addEventListener("storage", this.loadUserInfo);
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap");

:root {
  --primary-color: #ff4e50;
  --secondary-color: #fc913a;
  --text-color: #333333;
  --background-color: #ffffff;
  --hover-color: #ff6b6d;
}

.header {
  font-family: "Noto Sans KR", sans-serif;
  display: flex;
  align-items: center;
  padding: 1rem;
  background-color: var(--background-color);
  position: relative;
  z-index: 2;
  width: 100%;
  /* box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); */
}

.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  white-space: nowrap;
}

/* 로고 스타일 */
.logo {
  flex: 1;
  display: flex;
  align-items: center;
  min-width: 100px;
}

.logo-image {
  width: 100px;
}

/* 네비게이션 스타일 */
.navigation {
  flex: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 600px;
}

.nav-center {
  display: flex;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
}

/* 네비게이션 아이템 호버 효과 */
.nav-item {
  margin: 0 1.5rem;
  color: var(--text-color);
  text-decoration: none;
  font-weight: 500;
  position: relative;
  padding: 0.5rem 0;
}

.nav-item::after {
  content: "";
  position: absolute;
  width: 0;
  height: 2px;
  bottom: 0;
  left: 50%;
  background-color: var(--primary-color);
  transition: all 0.3s ease-in-out;
  transform: translateX(-50%);
}

.nav-item:hover::after {
  width: 100%;
}

.category-container {
  position: relative;
  z-index: 1000;
}

.category-dropdown {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 0.5rem 0;
  min-width: 160px;
  margin-top: 0.5rem;
  z-index: 1000;
}

.category-item {
  display: block;
  padding: 0.75rem 1.5rem;
  color: var(--text-color);
  text-decoration: none;
  transition: all 0.2s ease;
  text-align: center;
}

.category-item:hover {
  background-color: rgba(255, 78, 80, 0.1);
  color: var(--primary-color);
}

/* 검색바 스타일 */
.search-bar {
  display: flex;
  align-items: center;
  margin-left: 2rem;
}

.search-input {
  padding: 0.75rem 1rem;
  border: 2px solid #eee;
  border-radius: 8px;
  margin-right: 0.5rem;
  width: 300px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  border-color: var(--primary-color);
  outline: none;
}

.search-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s ease;
}

.search-button:hover {
  background-color: var(--hover-color);
}

/* 유저 정보 스타일 */
.user-info {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  min-width: 100px;
}

.login-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.3s ease;
}

.login-button:hover {
  background-color: var(--hover-color);
}

/* 프로필 스타일 */
.profile-container {
  position: relative;
  z-index: 1000; /* 이 부분 추가 */
}
.profile-img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid var(--primary-color);
  cursor: pointer;
  object-fit: cover;
  transition: border-color 0.3s ease;
}

.profile-img:hover {
  border-color: var(--hover-color);
}

.dropdown-menu {
  position: absolute;
  top: 120%;
  right: 0;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 180px;
  text-align: center;
  z-index: 1000; /* z-index 값 증가 */
  padding-top: 8px;
  margin-top: -8px;
}

.profile-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #eee;
}

.profile-thumbnail {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-bottom: 0.5rem;
  object-fit: cover;
}

.username {
  font-weight: 500;
  color: var(--text-color);
}

.dropdown-item {
  display: block;
  padding: 0.75rem 1rem;
  color: var(--text-color);
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.dropdown-item:hover {
  background-color: rgba(255, 78, 80, 0.1);
  color: var(--primary-color);
}
</style>
