<template>
  <div class="oauth-callback">
    <div class="loading-message">로그인 처리중...</div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../store/auth'; 

const router = useRouter();
const authStore = useAuthStore();

onMounted(() => {
  try {
    console.log('URL:', window.location.href);
    const params = new URLSearchParams(window.location.search);
    console.log('Search params:', params.toString());
    
    const token = params.get('token');
    const refreshToken = params.get('refreshToken');
    const email = params.get('email');
    
    console.log('Received params:', { token, refreshToken, email });

    if (!token || !refreshToken || !email) {
      throw new Error('필수 인증 정보가 누락되었습니다.');
    }

    authStore.setTokens({
      accessToken: token,
      refreshToken: refreshToken,
      userEmail: email,
    });

    router.push('/');
  } catch (error) {
    console.error('OAuth callback error:', error);
    router.push({
      path: '/auth/login',
      query: { error: '소셜 로그인 처리 중 오류가 발생했습니다.' }
    });
  }
});
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