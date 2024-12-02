<template>
  <div class="profile-page">
    <h2>회원정보 관리</h2>
    <div v-if="loading" class="loading">데이터를 불러오는 중입니다...</div>
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    <div v-else class="profile-container">
      <!-- 기본 정보 표시 -->
      <div v-if="!isEditing" class="user-info">
        <div class="info-group">
          <label>이름</label>
          <p>{{ userData.name }}</p>
        </div>
        <div v-if="!isMaker" class="info-group">
          <label>닉네임</label>
          <p>{{ userData.nickname }}</p>
        </div>
        <div class="info-group">
          <label>전화번호</label>
          <p>{{ userData.phone }}</p>
        </div>
        <div class="info-group">
          <label>이메일</label>
          <p>{{ userData.email }}</p>
        </div>
        <div class="info-group">
          <label>주소</label>
          <p>{{ userData.address }}</p>
        </div>
        <div class="info-group">
          <label>상세주소</label>
          <p>{{ userData.detailAddress }}</p>
        </div>
        <div class="info-group">
          <label>로그인 방법</label>
          <p>{{ userData.loginMethod ? "소셜 로그인" : "일반 로그인" }}</p>
        </div>
        <div v-if="!isMaker" class="info-group">
          <label>알림수신 동의</label>
          <p>{{ userData.notification ? "동의" : "미동의" }}</p>
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
          <p>{{ userData.name }}</p>
        </div>
        <div v-if="!isMaker" class="input-group">
          <label>닉네임</label>
          <input type="text" v-model="editUserData.nickname" />
        </div>
        <div class="input-group">
          <label>전화번호</label>
          <input
            type="tel"
            v-model="editUserData.phone"
            pattern="[0-9]{3}-[0-9]{4}-[0-9]{4}"
          />
        </div>
        <div class="input-group">
          <label>이메일</label>
          <p>{{ userData.email }}</p>
        </div>
        <div class="input-group">
          <label>주소</label>
          <div class="address-group">
            <input type="text" v-model="editUserData.address" readonly />
            <button type="button" @click="openAddressAPI" class="address-button">주소찾기</button>
          </div>
        </div>
        <div class="input-group">
          <label>상세주소</label>
          <input type="text" v-model="editUserData.detailAddress" />
        </div>
        <div v-if="!isMaker" class="input-group">
          <label>알림수신 동의</label>
          <div class="notification-checkboxes">
            <div class="checkbox-group">
              <input
                type="checkbox"
                id="notification"
                v-model="editUserData.notification"
              />
              <label for="notification">알림 수신 동의</label>
            </div>
          </div>
        </div>
        <div class="form-buttons">
          <button type="submit" class="save-button">저장</button>
          <button type="button" @click="cancelEdit" class="cancel-button">
            취소
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Profile",
  data() {
    return {
      isEditing: false,
      showPasswordModal: false,
      password: "",
      loading: true,
      error: null,
      userData: null,
      editUserData: {
        nickname: "",
        phone: "",
        address: "",
        detailAddress: "",
        notification: false,
      },
      isMaker: false,
    };
  },
  async created() {
    this.isMaker = localStorage.getItem("userType") === "maker";
    await this.fetchUserData();
  },
  methods: {
    async fetchUserData() {
      const userId = localStorage.getItem("userId");
      const userType = localStorage.getItem("userType");
      
      if (!userId || !userType) {
        this.$router.push("/auth/login");
        return;
      }

      const endpoint = userType === "maker" ? "/api/maker/" : "/api/user/";
      
      try {
        const response = await axios.get(`${endpoint}${userId}`);
        this.userData = response.data;
        this.loading = false;
      } catch (err) {
        console.error("API Error:", err);
        this.error = "사용자 정보를 불러오는데 실패했습니다.";
        this.loading = false;
      }
    },
    async deleteAccount() {
      const confirmDelete = confirm("정말로 탈퇴하시겠습니까?");

      if (confirmDelete) {
        try {
          const userId = localStorage.getItem("userId");
          const userType = localStorage.getItem("userType");
          const endpoint = userType === "maker" ? "/api/maker/" : "/api/user/";
          
          await axios.delete(`${endpoint}${userId}`);
          localStorage.clear();
          alert("회원 탈퇴가 완료되었습니다.");
          this.$router.push("/auth/login");
        } catch (err) {
          if (err.response) {
            switch (err.response.status) {
              case 400:
                alert("잘못된 요청입니다.");
                break;
              case 401:
                alert("로그인이 필요합니다.");
                this.$router.push("/login");
                break;
              case 403:
                alert("권한이 없습니다.");
                break;
              case 404:
                alert("사용자를 찾을 수 없습니다.");
                break;
              case 500:
                alert("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
                break;
              default:
                alert("회원 탈퇴에 실패했습니다.");
            }
          } else {
            alert("서버와 통신 중 오류가 발생했습니다.");
          }
          console.error("Error deleting account:", err);
        }
      }
    },
    startEdit() {
      this.showPasswordModal = true;
    },
    cancelEdit() {
      this.isEditing = false;
      this.showPasswordModal = false;
      this.password = "";
      this.editUserData = {
        nickname: this.userData.nickname,
        phone: this.userData.phone,
        address: this.userData.address,
        detailAddress: this.userData.detailAddress,
        notification: this.userData.notification,
      };
    },
    async verifyPassword() {
      if (this.password) {
        try {
          // 비밀번호 확인 API 호출 필요
          this.showPasswordModal = false;
          this.isEditing = true;
          this.password = "";
          this.editUserData = {
            nickname: this.userData.nickname,
            phone: this.userData.phone,
            address: this.userData.address,
            detailAddress: this.userData.detailAddress,
            notification: this.userData.notification,
          };
        } catch (err) {
          alert("비밀번호가 일치하지 않습니다.");
          console.error("Error verifying password:", err);
        }
      }
    },
    validateForm() {
      if (!this.isMaker && !this.editUserData.nickname.trim()) {
        alert("닉네임을 입력해주세요.");
        return false;
      }
      if (!this.editUserData.phone.trim()) {
        alert("전화번호를 입력해주세요.");
        return false;
      }
      if (!this.editUserData.phone.match(/^\d{3}-\d{4}-\d{4}$/)) {
        alert("전화번호 형식이 올바르지 않습니다. (예: 010-1234-5678)");
        return false;
      }
      if (!this.editUserData.address.trim()) {
        alert("주소를 입력해주세요.");
        return false;
      }
      return true;
    },
    openAddressAPI() {
      new window.daum.Postcode({
        oncomplete: (data) => {
          this.editUserData.address = data.roadAddress || data.jibunAddress;
          if (data.userSelectedType === "R") {
            let extraAddr = "";
            if (data.bname !== "" && /[동|로|가]$/g.test(data.bname)) {
              extraAddr += data.bname;
            }
            if (data.buildingName !== "" && data.apartment === "Y") {
              extraAddr += extraAddr !== "" ? ", " + data.buildingName : data.buildingName;
            }
            if (extraAddr !== "") {
              this.editUserData.address += " (" + extraAddr + ")";
            }
          }
        },
      }).open();
    },
    async updateProfile() {
      if (!this.validateForm()) {
        return;
      }

      try {
        const userId = localStorage.getItem("userId");
        const userType = localStorage.getItem("userType");
        const endpoint = userType === "maker" ? "/api/maker/" : "/api/user/";
        
        const updateData = { ...this.editUserData };
        if (this.isMaker) {
          delete updateData.nickname;
          delete updateData.notification;
        }

        const response = await axios.put(`${endpoint}${userId}`, updateData);
        if (response.status === 200) {
          await this.fetchUserData();
          this.isEditing = false;
          alert("회원정보가 성공적으로 수정되었습니다.");
        }
      } catch (err) {
        if (err.response) {
          switch (err.response.status) {
            case 400:
              alert("잘못된 요청입니다. 입력하신 정보를 확인해주세요.");
              break;
            case 401:
              alert("로그인이 필요합니다.");
              this.$router.push("/login");
              break;
            case 403:
              alert("권한이 없습니다.");
              break;
            default:
              alert("회원정보 수정에 실패했습니다.");
          }
        } else {
          alert("서버와 통신 중 오류가 발생했습니다.");
        }
        console.error("Error updating profile:", err);
      }
    },
  },
};
</script>

<style scoped>
.profile-page {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

h2 {
  color: #333333;
  margin-bottom: 2rem;
  font-weight: bold;
  font-size: 1.8rem;
}

.profile-container {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.info-group,
.input-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333333;
  font-size: 1rem;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

input:focus {
  outline: none;
  border-color: #FF5151;
  box-shadow: 0 0 0 3px rgba(255, 81, 81, 0.1);
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

/* 버튼 스타일 통일 */
button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.edit-button {
  background-color: #FF5151;
  color: white;
  width: 40%;
  margin-top: 1rem;
  margin-right: 1rem;
}

.delete-button {
  background-color: #666666;
  color: white;
  width: 40%;
  margin-top: 1rem;
}

.address-button {
  background-color: #FFD74E;
  color: #333333;
  white-space: nowrap;
}

.form-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.save-button {
  background-color: #FF5151;
  color: white;
  flex: 1;
}

.cancel-button {
  background-color: #666666;
  color: white;
  flex: 1;
}

button:hover {
  filter: brightness(110%);
  transform: translateY(-1px);
}

/* 모달 스타일 개선 */
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
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.modal-content h3 {
  margin-bottom: 1rem;
  color: #333333;
  font-weight: bold;
}

.password-input {
  margin: 1rem 0;
}

.modal-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.confirm-button {
  background-color: #FF5151;
  color: white;
  flex: 1;
}

/* 사용자 정보 표시 영역 */
.user-info p {
  padding: 0.75rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  margin: 0;
  color: #333333;
  border: 1px solid #dee2e6;
}

/* 체크박스 스타일 */
.notification-checkboxes {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.checkbox-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.checkbox-group input[type="checkbox"] {
  width: 18px;
  height: 18px;
  border: 2px solid #FF5151;
  border-radius: 4px;
  cursor: pointer;
}

.checkbox-group label {
  margin-bottom: 0;
  cursor: pointer;
}

/* 반응형 디자인 개선 */
@media (max-width: 768px) {
  .profile-page {
    padding: 1rem;
  }

  .profile-container {
    padding: 1.5rem;
  }

  .edit-button,
  .delete-button {
    width: 100%;
    margin: 0.5rem 0;
  }

  .form-buttons {
    flex-direction: column;
  }

  .address-group {
    flex-direction: column;
    gap: 0.5rem;
  }

  .address-button {
    width: 100%;
  }
}
</style>