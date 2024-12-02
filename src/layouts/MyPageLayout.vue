<!-- src/layouts/MyPageLayout.vue -->
<template>
  <div class="mypage-layout">
    <Header />
    <div class="mypage-main">
      <div class="content-wrapper">
        <div class="mypage-container" :class="{ 'show-sidebar': !isMenuView }">
          <Transition name="sidebar">
            <div v-show="!isMenuView" class="sidebar-container">
              <MypageSidebar />
            </div>
          </Transition>
          <div class="mypage-content" :class="{ 'with-sidebar': !isMenuView }">
            <template v-if="isMenuView">
              <div class="menu-grid">
                <template v-if="userType === 'maker'">
                  <div 
                    v-for="(item, index) in makerMenuItems" 
                    :key="index"
                    class="menu-item"
                    @click="selectMenuItem(item)"
                  >
                    <h3>{{ item.title }}</h3>
                    <p>{{ item.description }}</p>
                  </div>
                </template>
                <template v-else>
                  <div 
                    v-for="(item, index) in userMenuItems" 
                    :key="index"
                    class="menu-item"
                    @click="selectMenuItem(item)"
                  >
                    <h3>{{ item.title }}</h3>
                    <p>{{ item.description }}</p>
                  </div>
                </template>
              </div>
            </template>
            <router-view v-else />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import MypageSidebar from '../components/MypageSidebar.vue';
import Header from '@/components/Header.vue';
import { useRouter } from 'vue-router';

export default {
  name: 'MyPageLayout',
  components: {
    MypageSidebar,
    Header,
  },
  setup() {
    const router = useRouter();
    const isMenuView = ref(true);
    const userType = ref('');

    const makerMenuItems = [
      {
        title: 'MY정보',
        description: '회원정보 조회 및 수정',
        path: '/mypage/profile'
      },
      {
        title: '펀딩 진행 목록',
        description: '진행중인 펀딩 프로젝트 관리',
        path: '/mypage/funding-status'
      },
      {
        title: '펀딩하기',
        description: '새로운 펀딩 프로젝트 등록',
        path: '/mypage/project-registration'
      }
    ];

    const userMenuItems = [
      {
        title: 'MY정보',
        description: '회원정보 조회 및 수정',
        path: '/mypage/profile'
      },
      {
        title: '펀딩 참여 목록',
        description: '참여중인 펀딩 현황',
        path: '/mypage/funding-participation'
      },
      {
        title: '찜 목록',
        description: '관심있는 펀딩 프로젝트',
        path: '/mypage/wishlist'
      },
  
    ];

    const selectMenuItem = (item) => {
      isMenuView.value = false;
      setTimeout(() => {
        router.push(item.path);
      }, 300);
    };

    onMounted(() => {
      userType.value = localStorage.getItem('userType') || 'user';
    });

    return {
      isMenuView,
      userType,
      makerMenuItems,
      userMenuItems,
      selectMenuItem
    };
  }
};
</script>

<style scoped>
.mypage-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f8f9fa;
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
  margin-top: 2rem;
  position: relative;
}

.sidebar-container {
  width: 250px;
  background-color: #f8f9fa;
}

.mypage-content {
  flex: 1;
  padding: 2rem;
  background-color: #f8f9fa;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}


.mypage-content.with-sidebar {
  margin-left: 250px;
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  padding: 1rem;
}

.menu-item {
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.menu-item:hover {
  background-color: #FFD74E;
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.menu-item h3 {
  color: #333333;
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.menu-item p {
  color: #666666;
  font-size: 0.95rem;
}

/* 사이드바 애니메이션 */
.sidebar-enter-active,
.sidebar-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  max-width: 250px;
}

.sidebar-enter-from,
.sidebar-leave-to {
  max-width: 0;
  opacity: 0;
  overflow: hidden;
}

.sidebar-enter-to,
.sidebar-leave-from {
  max-width: 250px;
  opacity: 1;
}

@media (max-width: 768px) {
  .mypage-container {
    flex-direction: column;
  }
  
  .sidebar-container {
    width: 100%;
  }
  
  .mypage-content.with-sidebar {
    margin-left: 0;
    margin-top: 1rem;
  }
  
  .menu-grid {
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  }
}
</style>