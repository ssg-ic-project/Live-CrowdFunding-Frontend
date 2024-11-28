<!-- OAuthCallback.vue -->
<template>
  <div class="oauth-callback">
    <div class="loading-message">로그인 처리중...</div>
  </div>
</template>

<script>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../store/auth";
import { authApi } from "@/api";

export default {
  name: "OAuthCallback",
  setup() {
    const router = useRouter();
    const authStore = useAuthStore(); // pinia store 사용

    onMounted(async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      const state = params.get("state");

      if (code && state) {
        try {
          const response = await authApi.naverCallback(code, state);
          authStore.setTokens({
            // pinia store mutation 사용
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken,
            userEmail: response.data.userEmail,
          });
          router.push("/");
        } catch (error) {
          router.push({
            path: "/auth/login",
            query: { error: "로그인에 실패했습니다." },
          });
        }
      }
    });
  },
};
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
