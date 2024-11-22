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
            src="../../assets/image/logo.png"
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
import { authApi } from '@/api'

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
     this.$refs.passwordInput.focus()
   },
   
   validateEmail() {
     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     this.emailError = this.email.length > 0 && !emailRegex.test(this.email);
   },

   async handleLogin() {
     try {
       // 입력값 검증
       this.validateEmail();
       if (this.emailError) {
         this.errorMessage = "유효한 이메일을 입력해주세요.";
         return;
       }

       if (!this.email || !this.password) {
         this.loginError = true;
         this.errorMessage = "이메일과 비밀번호를 모두 입력해주세요.";
         return;
       }

       const loginData = {
         email: this.email,
         password: this.password
       };
       
       console.log('로그인 요청:', loginData);
       
       // API 호출
       const response = await authApi.login(loginData);
       console.log('로그인 응답:', response.data);

       // 로그인 성공 처리
       const { accessToken, refreshToken, userEmail, role } = response.data;
       
       // 로컬 스토리지에 저장
       localStorage.setItem("accessToken", accessToken);
       localStorage.setItem("refreshToken", refreshToken);
       localStorage.setItem("userEmail", userEmail);
       localStorage.setItem("userType", role);
       localStorage.setItem("isLoggedIn", "true");
       
       // 사용자 이름 저장
       const userName = userEmail.split('@')[0];
       localStorage.setItem("userName", userName);

       // 로그인 상태 변경 이벤트 발생
       window.dispatchEvent(new Event('login-state-changed'));

       // 페이지 이동
       if (this.previousRoute && this.previousRoute !== '/auth/login') {
         this.$router.push(this.previousRoute);
       } else {
         this.$router.push("/");
       }

     } catch (error) {
       console.error('로그인 에러:', error);
       
       this.loginError = true;
       if (error.response) {
         switch (error.response.status) {
           case 400:
             this.errorMessage = "이메일 또는 비밀번호가 올바르지 않습니다.";
             break;
           case 401:
             this.errorMessage = "인증에 실패했습니다.";
             break;
           case 404:
             this.errorMessage = "존재하지 않는 사용자입니다.";
             break;
           case 500:
             this.errorMessage = "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
             break;
           default:
             this.errorMessage = "로그인 중 오류가 발생했습니다.";
         }
       } else {
         this.errorMessage = "서버와 통신 중 오류가 발생했습니다.";
       }
     }
   },

   async handleNaverLogin() {
     try {
       const response = await authApi.getNaverLoginUrl();
       window.location.href = response.data;
     } catch (error) {
       console.error('네이버 로그인 에러:', error);
       alert('네이버 로그인을 시도하는 중 오류가 발생했습니다.');
     }
   },

   resetForm() {
     this.email = "";
     this.password = "";
     this.emailError = false;
     this.loginError = false;
     this.errorMessage = "";
   }
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
   const token = localStorage.getItem('accessToken');
   if (token) {
     console.log('기존 토큰 발견, 자동 로그인 처리');
     this.$router.push('/');
   }
 },
 beforeUnmount() {
   this.resetForm();
 }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #ffffff; /* 배경색 흰색으로 변경 */
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
  color: #333;
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
  border: 1px solid #ddd;
  border-radius: 8px;
}

.input-group {
  margin-bottom: 1rem;
  text-align: left;
}

.input-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.input-group input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.login-button {
  width: 100%;
  padding: 0.5rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
}

.error-message {
  color: red;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.social-login {
  width: 100%;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 0.5rem;
  color: white;
  font-weight: bold;
  border: none;
}

.naver-login {
  background-color: #03c75a;
}

.links {
  margin-top: 1rem;
  font-size: 0.875rem;
  text-align: center;
}

.links a {
  color: var(--primary-color);
  text-decoration: none;
}

.links a:hover {
  text-decoration: underline;
}
</style>
