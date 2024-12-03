<!-- src/views/auth/IdPasswordRecovery.vue -->
<template>
  <div class="recovery-container">
    <img src="../../assets/image/logo.png" alt="Logo" class="logo" />

    <div class="recovery-box">
  


      <!-- 아이디 찾기, 비밀번호 찾기 탭 -->
      <div class="tabs">
        <span :class="{ active: isIdRecovery }" @click="selectTab('id')">아이디 찾기</span>
        <span :class="{ active: !isIdRecovery }" @click="selectTab('password')">비밀번호 찾기</span>
      </div>


      <!-- 아이디 찾기 폼 -->
      <div v-if="isIdRecovery">
        <div class="input-group">
          <label>이름</label>
          <input type="text" v-model="name" placeholder="이름을 입력하세요" />
        </div>
        <div class="input-group">
          <label>전화번호</label>
          <input type="text" v-model="phone" placeholder="전화번호를 입력하세요" />
        </div>
        <button @click="findId" class="action-button">아이디 찾기</button>
      </div>


      <!-- 비밀번호 찾기 폼 -->
      <div v-else>
        <div class="input-group">
          <label>이메일</label>
          <input type="email" v-model="email" placeholder="이메일을 입력하세요" />
        </div>
        <div class="input-group">
          <label>이름</label>
          <input type="text" v-model="name" placeholder="이름을 입력하세요" />
        </div>
        <div class="input-group">
          <label>전화번호</label>
          <input type="text" v-model="phone" placeholder="전화번호를 입력하세요" />
        </div>
        <button @click="findPassword" class="action-button">비밀번호 재설정</button>
        <p v-if="passwordError" class="error-message">일치하는 회원 정보가 없습니다.</p>
      </div>
    </div>


    <!-- 로그인 및 회원가입 링크 -->
    <div class="links">
      <router-link to="/auth/login">로그인</router-link> | 
      <router-link to="/auth/signup">회원가입</router-link>
    </div>


    <!-- 모달 창 -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <p>{{ modalMessage }}</p>
        <button @click="closeModal" class="modal-button">{{ modalButtonText }}</button>
      </div>
    </div>
  </div>
</template>

<script>

import { authApi } from '@/api';

export default {
  name: 'IdPasswordRecovery',
  data() {
    return {
      isIdRecovery: true,
      name: '',
      phone: '',
      email: '',
      showModal: false,
      modalMessage: '',
      modalButtonText: '',
      passwordError: false,
    };
  },
  methods: {
    selectTab(tab) {
      this.isIdRecovery = tab === 'id';
      this.clearFields();
    },
     // 아이디 찾기
     async findId() {
      try {
        if (!this.name || !this.phone) {
          alert('이름과 전화번호를 입력해주세요.');
          return;
        }

        const response = await authApi.findEmail({
          name: this.name,
          phone: this.phone
        });

        if (response.data && response.data.email) {
          this.modalMessage = `회원님의 아이디는 '${response.data.email}' 입니다.`;
          this.modalButtonText = '확인';
          this.showModal = true;
        } else {
          this.modalMessage = '일치하는 회원 정보가 없습니다.';
          this.modalButtonText = '확인';
          this.showModal = true;
        }
      } catch (error) {
        console.error('아이디 찾기 에러:', error);
        this.modalMessage = '일치하는 회원 정보가 없습니다.';
        this.modalButtonText = '확인';
        this.showModal = true;
      }
    },

    // 비밀번호 재설정
    async findPassword() {
      try {
        if (!this.email || !this.name || !this.phone) {
          this.passwordError = true;
          return;
        }

        await authApi.sendResetPasswordEmail({
          email: this.email,
          name: this.name,
          phone: this.phone
        });

        this.modalMessage = '비밀번호 재설정 메일을 발송했습니다.';
        this.modalButtonText = '로그인 화면으로';
        this.showModal = true;
      } catch (error) {
        console.error('비밀번호 재설정 에러:', error);
        this.passwordError = true;
        this.modalMessage = '일치하는 회원 정보가 없습니다.';
        this.modalButtonText = '확인';
        this.showModal = true;
      }
    },

    closeModal() {
      this.showModal = false;
      if (!this.isIdRecovery && this.modalButtonText === '로그인 화면으로') {
        this.$router.push('/auth/login');
      }
    },

    clearFields() {
      this.name = '';
      this.phone = '';
      this.email = '';
      this.passwordError = false;
    },
  },
};
</script>


<style scoped>
.recovery-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 2rem;
  min-height: 100vh;
  background-color: #ffffff;
}

.recovery-box {
  width: 320px;
  padding: 2rem;
  background-color: white;
  border-radius: 8px;
  border: 1px solid #9E94F8;
  box-shadow: 0 2px 10px rgba(109, 99, 255, 0.1);
}

.logo {
  width: 10rem;
  margin: 7rem auto 2rem auto;
  display: block;
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