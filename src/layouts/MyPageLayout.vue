```vue
<template>
  <div class="mypage-layout">
    <Header />
    <div class="mypage-main">
      <div class="content-wrapper">
        <div class="mypage-container">
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
          <MypageSidebar v-else class="sidebar" />
          <div v-if="!isMenuView" class="main-content">
            <router-view />
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
      }
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

.menu-grid {
  width: 100%;
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
  border: 1px solid #9E94F8;
  box-shadow: 0 2px 4px rgba(109, 99, 255, 0.1);
}

.menu-item:hover {
  background-color: rgba(109, 99, 255, 0.05);
  transform: translateY(-5px);
  border-color: #6D63FF;
  box-shadow: 0 4px 8px rgba(109, 99, 255, 0.15);
}

.menu-item h3 {
  color: #6D63FF;
  margin-bottom: 1rem;
  font-size: 1.25rem;
  font-weight: 500;
}

.menu-item p {
  color: #666666;
  font-size: 0.95rem;
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

  .menu-item {
    padding: 1.5rem;
  }

  .menu-item h3 {
    font-size: 1.1rem;
  }

  .menu-item p {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .content-wrapper {
    padding: 0 1rem;
  }

  .menu-grid {
    grid-template-columns: 1fr;
  }

  .menu-item {
    padding: 1rem;
  }
}
</style>