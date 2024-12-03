<!-- src\components\Header.vue -->
<template>
  <header class="header">
    <div class="container">
      <!-- Icons Container -->
      <div class="icons-container">
        <!-- Search Section -->
        <div
          class="search-section"
          :class="{ 'search-visible': searchVisible }"
        >
          <div class="search-input-container">
            <input
              type="text"
              placeholder="검색어를 입력해주세요"
              class="search-input"
              v-model="searchQuery"
              @keyup.enter="handleSearch"
              @input="validateSearch"
              ref="searchInput"
            />
            <div class="error-message" v-if="searchError">
              {{ searchError }}
            </div>
          </div>
          <div class="search-icon" @click="toggleSearch">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="search-icon-svg"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
        </div>

        <!-- User Profile/Login Section -->
        <div
          v-if="isLoggedIn"
          class="profile-container"
          @mouseenter="showDropdown"
          @mouseleave="startHideDropdown"
        >
          <div class="user-icon-link">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="user-icon"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <div
            v-show="dropdownVisible"
            class="dropdown-menu"
            @mouseenter="cancelHideDropdown"
            @mouseleave="startHideDropdown"
          >
            <div class="profile-info">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="60"
                height="60"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="profile-thumbnail"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
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
        <router-link v-else to="/auth/login" class="user-icon-link">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="user-icon"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </router-link>
      </div>

      <!-- Logo Section -->
      <div class="logo-section">
        <router-link to="/" class="logo">
          <img src="../assets/image/logo.png" alt="logo" class="logo-image" />
        </router-link>
      </div>

      <!-- Navigation Section -->
      <div class="nav-section">
        <nav class="navigation">
          <ul class="nav-list">
            <li><router-link to="/" class="nav-item">Home</router-link></li>

            <li>
              <router-link to="/live" class="nav-item live">
                <img
                  src="../assets/image/live.gif"
                  alt="Live"
                  class="live-icon"
                />
              </router-link>
            </li>
            <li
              class="category-container"
              @mouseenter="showCategoryDropdown"
              @mouseleave="hideCategoryDropdown"
            >
              <a href="#" class="nav-item">Category</a>
              <div v-if="categoryDropdownVisible" class="category-dropdown">
                <router-link
                  v-for="category in categories"
                  :key="category.name"
                  :to="{
                    name: 'CategoryResults',
                    query: { categoryId: category.id },
                  }"
                  class="category-item"
                >
                  {{ category.name }}
                </router-link>
              </div>
            </li>
          </ul>
        </nav>
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
        { id: 1, name: "생활 가전", icon: LifeIcon },
        { id: 2, name: "주방 가전", icon: KitchenIcon },
        { id: 3, name: "스마트 가전", icon: SmartIcon },
        { id: 4, name: "DIY", icon: DIYIcon },
        { id: 5, name: "엔터테이먼트", icon: EntertainmentIcon },
        { id: 6, name: "웨어러블", icon: WearableIcon },
        { id: 7, name: "주변 기기", icon: PeripheralIcon },
      ],
      isLoggedIn: false,
      searchQuery: "",
      searchVisible: false,
      searchError: "",
      dropdownVisible: false,
      categoryDropdownVisible: false,
      userName: "",
      userType: "",
      dropdownTimer: null,
    };
  },
  methods: {
    toggleSearch() {
      this.searchVisible = !this.searchVisible;
      if (this.searchVisible) {
        this.$nextTick(() => {
          this.$refs.searchInput.focus();
        });
      }
      // searchVisible가 false가 될 때만 searchQuery를 초기화
      if (!this.searchVisible) {
        this.searchQuery = "";
        this.searchError = "";
      }
    },
    validateSearch() {
      if (this.searchQuery.length === 1) {
        this.searchError = "검색은 2글자 이상 입력해주세요.";
      } else {
        this.searchError = "";
      }
    },
    async logout() {
      try {
        await authApi.logout();
        localStorage.clear();
        this.isLoggedIn = false;
        this.dropdownVisible = false;
        this.userName = "";
        this.userType = "";
        window.dispatchEvent(new Event("login-state-changed"));
        await this.$router.push("/");
      } catch (error) {
        console.error("로그아웃 에러:", error);
        localStorage.clear();
        this.isLoggedIn = false;
        this.$router.push("/");
      }
    },
    handleSearch() {
      if (this.searchQuery.length < 2) {
        this.searchError = "검색은 2글자 이상 입력해주세요.";
        return;
      }

      if (this.searchQuery.trim()) {
        this.$router.push({
          name: "SearchResults",
          query: { q: this.searchQuery, type: "search" },
        });
        // 검색 후에도 검색창을 열린 상태로 유지하고 검색어도 유지
        this.searchVisible = true;
      }
    },
    created() {
      const searchQuery = this.$route.query.q;
      if (searchQuery) {
        this.searchQuery = searchQuery;
        this.searchVisible = true;
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
    window.addEventListener("login-state-changed", this.loadUserInfo);
    window.addEventListener("storage", this.loadUserInfo);
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap");

.header {
  font-family: "Noto Sans KR", sans-serif;
  background-color: #ffffff;
  position: relative;
  z-index: 2;
  width: 100%;
  padding: 1rem;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  padding: 0 2rem;
}

.icons-container {
  position: absolute;
  top: 50%;
  right: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  z-index: 1000;
  transform: translateY(150%);
}

.search-section {
  position: relative;
  display: flex;
  align-items: center;
  background-color: transparent;
  border-radius: 24px;
  padding: 0.5rem;
  width: 40px;
  height: 40px;
  transition: all 0.3s ease-in-out;
  overflow: visible;
}

.search-input-container {
  position: relative;
  flex-grow: 1;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}

.search-visible {
  width: 250px;
  height: 40px;
  background-color: rgba(158, 148, 248, 0.1);
}

.search-visible .search-input-container {
  opacity: 1;
}

.search-input {
  width: 0;
  height: 28px;
  padding: 0;
  border: none;
  background: transparent;
  outline: none;
  transition: all 0.3s ease-in-out;
  font-size: 0.9rem;
  margin-right: 0.5rem;
}

.search-visible .search-input {
  width: 200px;
  padding: 0 1rem;
}

.error-message {
  position: absolute;
  top: 100%;
  left: 0;
  color: #6d63ff;
  font-size: 0.8rem;
  margin-top: 4px;
  white-space: nowrap;
}

.search-icon,
.user-icon-link {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 50%;
  background-color: rgba(158, 148, 248, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  min-width: 40px;
  height: 40px;
}

.search-icon {
  margin-left: -9px;
}

.search-icon:hover,
.user-icon-link:hover {
  background-color: rgba(109, 99, 255, 0.1);
}

.search-icon-svg,
.user-icon {
  color: #6d63ff;
  transition: color 0.3s ease;
}

.logo-section {
  text-align: center;
  padding: 2rem 0 0.5rem;
}

.logo-image {
  width: 330px;
  height: auto;
  align-items: center;
}

.nav-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  margin-bottom: -3rem;
}

.navigation {
  width: 100%;
}

.nav-list {
  display: flex;
  justify-content: center;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 2rem;
}

.nav-item {
  color: #6d63ff;
  text-decoration: none;
  font-weight: 500;
  position: relative;
  padding: 0.5rem 0;
  font-size: 120%;
}

.nav-item::after {
  content: "";
  position: absolute;
  width: 0;
  height: 2px;
  bottom: 0;
  left: 50%;
  background-color: #9e94f8;
  transition: all 0.3s ease-in-out;
  transform: translateX(-50%);
}

.nav-item:hover::after {
  width: 100%;
}

.profile-container {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 120%;
  right: 0;
  background-color: white;
  border: 1px solid #9e94f8;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(109, 99, 255, 0.1);
  width: 180px;
  text-align: center;
  z-index: 1000;
  padding-top: 8px;
}

.profile-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid rgba(158, 148, 248, 0.2);
}

.profile-thumbnail {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-bottom: 0.5rem;
  object-fit: cover;
  border: 2px solid #6d63ff;
}

.username {
  font-weight: 500;
  color: #6d63ff;
}

.dropdown-item {
  display: block;
  padding: 0.75rem 1rem;
  color: #333333;
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: rgba(109, 99, 255, 0.1);
  color: #6d63ff;
}

.category-container {
  position: relative;
}

.category-dropdown {
  position: absolute;
  top: 100%;
  left: 50%;
  transform-origin: top;
  transform: translateX(-50%) scaleY(0);
  background-color: white;
  border: 1px solid #9e94f8;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(109, 99, 255, 0.1);
  padding: 0.5rem 0;
  min-width: 160px;
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  opacity: 0;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.category-dropdown:not([style*="display: none"]) {
  opacity: 1;
  transform: translateX(-50%) scaleY(1);
}

.category-item {
  display: block;
  padding: 0.75rem 1.5rem;
  color: #333333;
  text-decoration: none;
  transition: all 0.2s ease;
  text-align: center;
  white-space: nowrap;
  transform: translateY(-10px);
  opacity: 0;
  animation: slideDown 0.3s ease forwards;
}

.category-item:hover {
  background-color: rgba(109, 99, 255, 0.1);
  color: #6d63ff;
}

.live {
  display: flex;
  align-items: center;
  padding: 0.5rem;
}

.live-icon {
  width: 60px;
  height: auto;
  margin-top: 5px;
}
.live::after {
  display: none;
}

.live:hover {
  transform: scale(1.1);
  transition: transform 0.3s ease;
}

@keyframes slideDown {
  from {
    transform: translateY(-10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Category Item Animation Delays */
.category-dropdown:not([style*="display: none"]) .category-item:nth-child(1) {
  animation-delay: 0.1s;
}
.category-dropdown:not([style*="display: none"]) .category-item:nth-child(2) {
  animation-delay: 0.15s;
}
.category-dropdown:not([style*="display: none"]) .category-item:nth-child(3) {
  animation-delay: 0.2s;
}
.category-dropdown:not([style*="display: none"]) .category-item:nth-child(4) {
  animation-delay: 0.25s;
}
.category-dropdown:not([style*="display: none"]) .category-item:nth-child(5) {
  animation-delay: 0.3s;
}
.category-dropdown:not([style*="display: none"]) .category-item:nth-child(6) {
  animation-delay: 0.35s;
}
.category-dropdown:not([style*="display: none"]) .category-item:nth-child(7) {
  animation-delay: 0.4s;
}

@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }

  .nav-list {
    gap: 1rem;
  }

  .search-visible {
    width: 200px;
  }

  .search-visible .search-input {
    width: 150px;
  }

  .logo-image {
    width: 120px;
  }

  .icons-container {
    right: 1rem;
  }
}

@media (max-width: 576px) {
  .icons-container {
    transform: translateY(0);
    top: 2rem;
  }

  .search-visible {
    width: 170px;
  }

  .search-visible .search-input {
    width: 120px;
  }

  .icons-container {
    transform: translateY(0);
    top: 2rem;
  }
}
</style>
