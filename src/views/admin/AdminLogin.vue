<!-- src/views/admin/AdminLogin.vue -->
<template>
    <div class="admin-login-container">
      <div class="admin-login-box">
        <img src="../../assets/image/logo.png" alt="Logo" class="logo" />
        <h1>관리자 로그인</h1>
        <div class="input-group">
          <label for="employeeNumber">사번</label>
          <input
            type="text"
            id="identificationNumber"
            v-model="loginData.identificationNumber"
            placeholder="사번을 입력하세요"
          />
        </div>
  
        <div class="input-group">
          <label for="password">비밀번호</label>
          <input
            type="password"
            id="password"
            v-model="loginData.password"
            placeholder="비밀번호를 입력하세요"
            @keydown.enter="handleLogin"
          />
        </div>
        <button  @click="handleLogin" class="login-button">로그인</button>
        
        <p v-if="loginError" class="error-message">사번 또는 비밀번호를 확인해주세요.</p>
      </div>
    </div>
  </template>
  
  <script>
  import {adminLoginApi} from '@/api/index.js';
  export default {
    name: 'AdminLogin',
    data() {
      return {
        loginData: {
          identificationNumber: '',
          password: ''
        },
        loginError: false,
        errorMessage: '사번 또는 비밀번호를 확인해주세요.'
      }
    },
    methods: {
      async handleLogin() {
        try {
          const response = await adminLoginApi.login(this.loginData)

          //로그인 성공 시 토큰 저장
          localStorage.setItem('accessToken', response.data.accessToken)
          localStorage.setItem('refreshToken', response.data.refreshToken)
          localStorage.setItem('adminId', this.loginData.identificationNumber)
          localStorage.setItem('isAdminLoggedIn', true)

          // this.$router.push('/admin/AdminDashboard')
          this.$router.push('/admin');
          console.log("need to login in");

          //관리자 페이지로 이동

        } catch (error) {
          
          this.loginError = true;
          if(error.response){
            this.errorMessage = error.response.data.message || '로그인에 실패했습니다.'
          }else {
            this.errorMessage = '서버와의 통신에 실패했습니다.'
          }
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .admin-login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f5f5f5;
  }
  
  .admin-login-box {
    width: 350px;
    padding: 2rem;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    text-align: center;
  }
  
  .logo {
    width: 50%;
    margin-bottom: 1rem;
  }
  
  .admin-login-box h1 {
    margin-bottom: 1.5rem;
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
    background-color: #343a40;
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
  </style>
  