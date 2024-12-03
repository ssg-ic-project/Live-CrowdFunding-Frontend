<!-- src\views\auth\Login.vue -->
<template>
  <div class="login-container">
    <!-- 뒤로가기 버튼 -->
    <button @click="$router.go(-1)" class="back-button">
      <span class="material-icons">arrow_back</span>
    </button>
    <div class="login-content">
      <!-- 로고 -->
      <div class="logo">
        <router-link to="/">
          <img
            src="../../assets/image/logo.png"s
            alt="logo"
            class="logo-image"
          />
        </router-link>
      </div>
      <div class="login-box">
        <!-- 이메일 입력 -->
        <div class="input-group">
          <label for="email">이메일</label>
          <input
            type="text"
            id="email"
            v-model="email"
            @input="validateEmail"
            placeholder="이메일을 입력하세요"
            @keyup.enter="focusPassword"
          />
          <p v-if="emailError" class="error-message">
            유효한 이메일을 입력해주세요.
          </p>
        </div>
        <!-- 비밀번호 입력 -->
        <div class="input-group">
          <label for="password">비밀번호</label>
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="비밀번호를 입력하세요"
            @keyup.enter="handleLogin"
            ref="passwordInput"
          />
        </div>
        <!-- 로그인 버튼 -->
        <button @click="handleLogin" class="login-button">
          이메일로 로그인
        </button>
        <p v-if="loginError" class="error-message">{{ errorMessage }}</p>
        <!-- 소셜 로그인 버튼들 -->
        <button class="social-login naver-login" @click="handleNaverLogin">
          네이버 간편 로그인
        </button>
        <!-- 아이디/비밀번호 찾기 및 회원가입 -->
        <div class="links">
          <router-link
            :to="{
              name: 'IdPasswordRecovery',
              query: { redirect: previousRoute },
            }"
          >
            아이디/비밀번호 찾기
          </router-link>
          |
          <router-link to="/auth/signup">회원가입</router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { authApi } from "@/api";
export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
      emailError: false,
      loginError: false,
      errorMessage: "",
      previousRoute: null,
    };
  },
  methods: {
    focusPassword() {
      this.$refs.passwordInput.focus();
    },
    validateEmail() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      this.emailError = this.email.length > 0 && !emailRegex.test(this.email);
    },
    async handleLogin() {
      try {
        if (!this.validateForm()) return;

        const response = await authApi.login({
          email: this.email,
          password: this.password,
        });

        localStorage.setItem("userId", response.data.accountId);
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        localStorage.setItem("userEmail", this.email);
        localStorage.setItem("userType", response.data.role.toLowerCase());
        localStorage.setItem("isLoggedIn", "true");

        this.$router.push(this.previousRoute || "/");
      } catch (error) {
        this.loginError = true;
        this.errorMessage =
          error.response?.data?.message || "로그인에 실패했습니다.";
      }
    },

    validateForm() {
      this.validateEmail();
      if (this.emailError || !this.email || !this.password) {
        this.loginError = true;
        this.errorMessage = "이메일과 비밀번호를 확인해주세요.";
        return false;
      }
      return true;
    },async handleNaverLogin() {
  try {
    // 네이버 로그인 URL 받아오기
    const response = await authApi.getNaverLoginUrl();
    
    console.log("Naver Login URL:", response.data); // 디버깅용
    
    // 받아온 URL로 리다이렉트
    if (response.data) {
      window.location.href = response.data;
    } else {
      throw new Error('Invalid login URL');
    }
  } catch (error) {
    console.error("네이버 로그인 에러:", error);
    this.loginError = true;
    this.errorMessage = "네이버 로그인을 시도하는 중 오류가 발생했습니다.";
  }
},
    resetForm() {
      this.email = "";
      this.password = "";
      this.emailError = false;
      this.loginError = false;
      this.errorMessage = "";
    },
  },
  mounted() {
    // 이전 페이지 경로 저장
    this.previousRoute = this.$route.query.redirect || "/";
    // URL 파라미터에서 에러 메시지 확인
    const error = this.$route.query.error;
    if (error) {
      this.loginError = true;
      this.errorMessage = error;
    }
    // 토큰이 있으면 자동 로그인 처리
    const token = localStorage.getItem("accessToken");
    if (token) {
      console.log("기존 토큰 발견, 자동 로그인 처리");
      this.$router.push("/");
    }
  },
  beforeUnmount() {
    this.resetForm();
  },
};
</script>


<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #ffffff;
  position: relative;
}

.back-button {
  position: absolute;
  top: 20px;
  left: 20px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
}

.material-icons {
  font-size: 24px;
  color: #6D63FF;
}

.login-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 480px;
  padding: 0 20px;
}

.logo {
  margin-bottom: 1rem;
  width: 200px;
}

.logo-image {
  width: 100%;
}

.login-box {
  width: 100%;
  padding: 2rem;
  background-color: white;
  border: 1px solid #9E94F8;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(109, 99, 255, 0.1);
}

.input-group {
  margin-bottom: 1rem;
  text-align: left;
}

.input-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #333333;
}

.input-group input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #9E94F8;
  border-radius: 4px;
  transition: border-color 0.3s ease;
}

.input-group input:focus {
  outline: none;
  border-color: #6D63FF;
}

.login-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #6D63FF;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
  transition: background-color 0.3s ease;
}

.login-button:hover {
  background-color: #9E94F8;
}

.error-message {
  color: #ff4b4b;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.social-login {
  width: 100%;
  padding: 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 0.5rem;
  color: white;
  font-weight: bold;
  border: none;
  transition: opacity 0.3s ease;
}

.naver-login {
  background-color: #03c75a;
}

.naver-login:hover {
  opacity: 0.9;
}

.links {
  margin-top: 1.5rem;
  font-size: 0.875rem;
  text-align: center;
}

.links a {
  color: #6D63FF;
  text-decoration: none;
  transition: color 0.3s ease;
}

.links a:hover {
  color: #9E94F8;
}
</style>

<!-- IdPasswordRecovery.vue 스타일 -->
<style scoped>
.recovery-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 2rem;
  min-height: 100vh;
  background-color: #ffffff;
}

.logo {
  width: 10rem;
  margin: 7rem auto 2rem auto;
  display: block;
}

.recovery-box {
  width: 320px;
  padding: 2rem;
  background-color: white;
  border-radius: 8px;
  border: 1px solid #9E94F8;
  box-shadow: 0 2px 10px rgba(109, 99, 255, 0.1);
}

.tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  border-bottom: 1px solid rgba(109, 99, 255, 0.3);
  gap: 2rem;
}

.tabs span {
  cursor: pointer;
  font-weight: bold;
  padding: 0.5rem 1rem;
  color: #666;
  position: relative;
  transition: color 0.3s ease;
}

.tabs .active {
  color: #6D63FF;
  border-bottom: 2px solid #6D63FF;
}

.tabs span:hover {
  color: #9E94F8;
}

.input-group {
  margin-bottom: 1rem;
}

.input-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #333333;
}

.input-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #9E94F8;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.input-group input:focus {
  outline: none;
  border-color: #6D63FF;
  box-shadow: 0 0 0 2px rgba(109, 99, 255, 0.1);
}

.action-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #6D63FF;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.action-button:hover {
  background-color: #9E94F8;
}

.error-message {
  color: #ff4b4b;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.links {
  margin-top: 1.5rem;
  font-size: 0.875rem;
  text-align: center;
}

.links a {
  color: #6D63FF;
  text-decoration: none;
  transition: color 0.3s ease;
  margin: 0 0.5rem;
}

.links a:hover {
  color: #9E94F8;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(3px);
}

.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  width: 80%;
  max-width: 300px;
  box-shadow: 0 4px 20px rgba(109, 99, 255, 0.15);
  border: 1px solid #9E94F8;
}

.modal-button {
  margin-top: 1.5rem;
  padding: 0.75rem 1.5rem;
  background-color: #6D63FF;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.modal-button:hover {
  background-color: #9E94F8;
}
</style>

<!-- ResetPassword.vue 스타일 -->
<style scoped>
.recovery-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 2rem;
}

.recovery-box {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  border: 1px solid #9E94F8;
  box-shadow: 0 2px 10px rgba(109, 99, 255, 0.1);
  width: 100%;
  max-width: 400px;
}

.input-group {
  margin-bottom: 1rem;
}

.input-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.input-group input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #9E94F8;
  border-radius: 4px;
  transition: border-color 0.3s ease;
}

.input-group input:focus {
  outline: none;
  border-color: #6D63FF;
  box-shadow: 0 0 0 2px rgba(109, 99, 255, 0.1);
}

.submit-button {
  width: 100%;
  padding: 0.5rem;
  background-color: #6D63FF;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
  text-align: center;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #9E94F8;
}

.submit-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.error-message {
  color: #ff4b4b;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.status-message {
  padding: 0.75rem;
  border-radius: 4px;
  margin-top: 1rem;
}

.status-message.error {
  background-color: #fee2e2;
  color: #ff4b4b;
}

.status-message.success {
  background-color: rgba(109, 99, 255, 0.1);
  color: #6D63FF;
}

.password-rules {
  margin: 1rem 0;
  padding: 1rem;
  background-color: rgba(109, 99, 255, 0.05);
  border-radius: 4px;
}

.success-message {
  text-align: center;
  color: #6D63FF;
}
</style>