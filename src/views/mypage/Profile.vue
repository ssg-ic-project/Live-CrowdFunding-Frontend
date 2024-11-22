<!-- src/views/mypage/Profile.vue -->
<template>
  <div class="profile-page">
    <h2>회원정보 관리</h2>
    <div class="profile-container">
      <!-- 기본 정보 표시 -->
      <div v-if="!isEditing" class="user-info">
        <div class="info-group">
          <label>이름</label>
          <p>{{ user.name }}</p>
        </div>
        <div class="info-group">
          <label>닉네임</label>
          <p>{{ user.nickname }}</p>
        </div>
        <div class="info-group">
          <label>전화번호</label>
          <p>{{ user.phone }}</p>
        </div>
        <div class="info-group">
          <label>이메일</label>
          <p>{{ user.email }}</p>
        </div>
        <div class="info-group">
          <label>주소</label>
          <p>{{ user.address }}</p>
        </div>
        <div class="info-group">
          <label>상세주소</label>
          <p>{{ user.addressDetail }}</p>
        </div>
        <div class="info-group">
          <label>로그인 방법</label>
          <p>{{ user.loginType }}</p>
        </div>
        <div class="info-group">
          <label>알림수신 동의</label>
          <div class="notification-preferences">
            <p>이메일 수신: {{ user.emailNotification ? '동의' : '미동의' }}</p>
            <p>SMS 수신: {{ user.smsNotification ? '동의' : '미동의' }}</p>
          </div>
        </div>
     
        <button @click="startEdit" class="edit-button">수정하기</button>
        <button @click="deleteAccount" class="delete-button">탈퇴하기</button>
      </div>

      <!-- 비밀번호 확인 모달 -->
      <div v-if="showPasswordModal" class="password-modal">
        <div class="modal-content">
          <h3>비밀번호 확인</h3>
          <p>회원정보 수정을 위해 비밀번호를 입력해주세요.</p>
          <input 
            type="password" 
            v-model="password"
            placeholder="비밀번호를 입력하세요"
            class="password-input"
            @keyup.enter="verifyPassword"
          />
          <div class="modal-buttons">
            <button @click="verifyPassword" class="confirm-button">확인</button>
            <button @click="cancelEdit" class="cancel-button">취소</button>
          </div>
        </div>
      </div>
      
      <!-- 수정 폼 -->
      <form v-if="isEditing" @submit.prevent="updateProfile" class="edit-form">
        <div class="input-group">
          <label>이름</label>
          <p>{{ user.name }}</p>
        </div>
        <div class="input-group">
          <label>닉네임</label>
          <input type="text" v-model="editUser.nickname" />
        </div>
        <div class="input-group">
          <label>전화번호</label>
          <input type="tel" v-model="editUser.phone" pattern="[0-9]{3}-[0-9]{4}-[0-9]{4}" />
        </div>
        <div class="input-group">
          <label>이메일</label>
          <p>{{ user.email }}</p>
        </div>
        <div class="input-group">
          <label>주소</label>
          <div class="address-group">
            <input type="text" v-model="editUser.address" readonly />
            <button type="button" @click="openAddressSearch" class="address-button">주소찾기</button>
          </div>
        </div>
        <div class="input-group">
          <label>상세주소</label>
          <input type="text" v-model="editUser.addressDetail" />
        </div>
        <div class="input-group">
          <label>로그인 방법</label>
          <p>{{ user.loginType }}</p>
        </div>
        <div class="input-group">
          <label>알림수신 동의</label>
          <div class="notification-checkboxes">
            <div class="checkbox-group">
              <input 
                type="checkbox" 
                id="emailNotification" 
                v-model="editUser.emailNotification"
              />
              <label for="emailNotification">이메일 수신 동의</label>
            </div>
            <div class="checkbox-group">
              <input 
                type="checkbox" 
                id="smsNotification" 
                v-model="editUser.smsNotification"
              />
              <label for="smsNotification">SMS 수신 동의</label>
            </div>
          </div>
        </div>
        <div class="form-buttons">
          <button type="submit" class="save-button">저장</button>
          <button type="button" @click="cancelEdit" class="cancel-button">취소</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Profile',
  data() {
    return {
      isEditing: false,
      showPasswordModal: false,
      password: '',
      user: {
        name: '홍길동',
        nickname: '곽용철',
        phone: '010-1234-5678',
        email: 'user@example.com',
        address: '서울특별시 강남구 테헤란로',
        addressDetail: '123-45',
        loginType: '일반 로그인',
        emailNotification: true,
        smsNotification: false
      },
      editUser: {
        phone: '',
        nickname: '',
        address: '',
        addressDetail: '',
        emailNotification: false,
        smsNotification: false
      }
    };
  },
  methods: {
    deleteAccount() {
      alert('탈퇴되었습니다.');
    },
    startEdit() {
      this.showPasswordModal = true;
    },
    cancelEdit() {
      this.isEditing = false;
      this.showPasswordModal = false;
      this.password = '';
      this.editUser = {
        nickname: this.user.nickname,
        phone: this.user.phone,
        address: this.user.address,
        addressDetail: this.user.addressDetail,
        emailNotification: this.user.emailNotification,
        smsNotification: this.user.smsNotification
      };
    },
    verifyPassword() {
      if (this.password) {
        this.showPasswordModal = false;
        this.isEditing = true;
        this.password = '';
        this.editUser = {
          nickname: this.user.nickname,
          phone: this.user.phone,
          address: this.user.address,
          addressDetail: this.user.addressDetail,
          emailNotification: this.user.emailNotification,
          smsNotification: this.user.smsNotification
        };
      }
    },
    openAddressSearch() {
      alert('주소 검색');
    },
    updateProfile() {
      Object.assign(this.user, {
        phone: this.editUser.phone,
        address: this.editUser.address,
        addressDetail: this.editUser.addressDetail,
        emailNotification: this.editUser.emailNotification,
        smsNotification: this.editUser.smsNotification
      });
      this.isEditing = false;
      alert('회원정보가 수정되었습니다.');
    }
  }
};
</script>

<style scoped>
.notification-preferences {
  margin-top: 4px;
}

.notification-checkboxes {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.checkbox-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.checkbox-group input[type="checkbox"] {
  width: 16px;
  height: 16px;
}

 .profile-page {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
 }
 
 h2 {
  color: #000;
  margin-bottom: 2rem;
 }
 
 .profile-container {
  background-color: #fff;
  border-radius: 8px;
  padding: 2rem;
 }
 
 .info-group, .input-group {
  margin-bottom: 1.5rem;
 }
 
 label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #333;
 }
 
 input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
 }
 
 input:disabled {
  background-color: #f8f9fa;
 }
 
 .address-group {
  display: flex;
  gap: 1rem;
 }
 
 .address-group input {
  flex: 1;
 }
 
 button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
 }
 
 .edit-button {
  background-color: #007bff;
  color: white;
  width: 40%;
  margin-top: 1rem;
  margin-right: 1rem;
 }

 .delete-button {
  background-color: #dd0303;
  color: white;
  width: 40%;
  margin-top: 1rem;
 }
 
 .address-button {
  background-color: #6c757d;
  color: white;
  white-space: nowrap;
 }
 
 .form-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
 }
 
 .save-button {
  background-color: #28a745;
  color: white;
  flex: 1;
 }
 
 .cancel-button {
  background-color: #6c757d;
  color: white;
  flex: 1;
 }
 
 button:hover {
  opacity: 0.9;
 }
 
 .password-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
 }
 
 .modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
 }
 
 .modal-content h3 {
  margin-bottom: 1rem;
 }
 
 .password-input {
  margin: 1rem 0;
 }
 
 .modal-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
 }
 
 .confirm-button {
  background-color: #007bff;
  color: white;
  flex: 1;
 }
 
 .user-info p {
  padding: 0.75rem;
  background-color: #f8f9fa;
  border-radius: 4px;
  margin: 0;
  color: #333;
 }
 </style>