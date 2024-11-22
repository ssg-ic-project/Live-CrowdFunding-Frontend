<!-- OAuthCallback.vue -->
<template>
    <div class="oauth-callback">
      <div class="loading-message">로그인 처리중...</div>
    </div>
  </template>
  
  <script>
  import { onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useStore } from 'vuex';
  
  export default {
    name: 'OAuthCallback',
    setup() {
      const router = useRouter();
      const store = useStore();
  
      onMounted(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        const refreshToken = params.get('refreshToken');
        const email = params.get('email');
  
        if (token && refreshToken) {
          // 토큰 저장 (Vuex store 사용)
          store.commit('auth/setTokens', {
            accessToken: token,
            refreshToken: refreshToken,
            userEmail: email
          });
  
          // 메인 페이지로 이동
          router.push('/');
        } else {
          // 에러 처리
          router.push({
            path: '/login',
            query: { error: '로그인에 실패했습니다. 다시 시도해주세요.' }
          });
        }
      });
    }
  }
  </script>
  
  <style scoped>
  .oauth-callback {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
  
  .loading-message {
    font-size: 1.2rem;
    color: #666;
  }
  </style>