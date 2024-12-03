<!-- src/views/auth/ResetPassword.vue -->
<template>
  <div class="recovery-container">
    <div v-if="!isTokenValid" class="recovery-box">
      <div class="error-message text-center">
        <h2 class="text-xl font-bold mb-4">유효하지 않은 링크</h2>
        <p class="mb-4">
          비밀번호 재설정 링크가 만료되었거나 유효하지 않습니다.
        </p>
        <p class="mb-4">비밀번호 재설정을 다시 요청해주세요.</p>
        <router-link to="/auth/login" class="submit-button block text-center">
          로그인 페이지로 이동
        </router-link>
      </div>
    </div>

    <div v-else-if="!isCompleted" class="recovery-box">
      <h2 class="text-2xl font-bold text-center mb-6">새 비밀번호 설정</h2>

      <!-- 새 비밀번호 입력 -->
      <div class="input-group">
        <label for="password">새 비밀번호</label>
        <input
          type="password"
          id="password"
          v-model="password"
          @input="validatePassword"
          placeholder="새 비밀번호를 입력하세요"
          required
        />
        <p v-if="passwordError" class="error-message">
          {{ passwordError }}
        </p>
      </div>

      <!-- 비밀번호 확인 -->
      <div class="input-group">
        <label for="passwordConfirm">비밀번호 확인</label>
        <input
          type="password"
          id="passwordConfirm"
          v-model="passwordConfirm"
          @input="validatePasswordConfirm"
          placeholder="비밀번호를 다시 입력하세요"
          required
        />
        <p v-if="passwordConfirmError" class="error-message">
          비밀번호가 일치하지 않습니다.
        </p>
      </div>

      <!-- 비밀번호 규칙 안내 -->
      <div class="password-rules">
        <p class="text-sm text-gray-600 mb-2">비밀번호 규칙:</p>
        <ul class="text-sm text-gray-600 list-disc pl-5">
          <li>8자 이상 입력</li>
          <li>영문, 숫자, 특수문자 조합</li>
          <li>연속된 문자 3자리 이상 사용 불가</li>
        </ul>
      </div>

      <!-- 상태 메시지 -->
      <div
        v-if="status.message"
        :class="[
          'status-message',
          status.type === 'error' ? 'error' : 'success',
        ]"
      >
        {{ status.message }}
      </div>

      <!-- 비밀번호 변경 버튼 -->
      <button
        @click="handleSubmit"
        class="submit-button"
        :disabled="isLoading || hasErrors"
      >
        {{ isLoading ? "처리중..." : "비밀번호 변경" }}
      </button>
    </div>

    <!-- 변경 완료 메시지 -->
    <div v-else class="recovery-box">
      <div class="success-message">
        <h2 class="text-xl font-bold mb-4">비밀번호 변경 완료</h2>
        <p class="mb-4">비밀번호가 성공적으로 변경되었습니다.</p>
        <p class="mb-4">새로운 비밀번호로 로그인해주세요.</p>
        <button @click="$router.push('/auth/login')" class="submit-button">
          로그인 페이지로 이동
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { authApi } from "@/api";

export default {
  name: "ResetPassword",
  data() {
    return {
      token: "",
      email: "",
      password: "",
      passwordConfirm: "",
      passwordError: "",
      passwordConfirmError: "",
      isLoading: false,
      isTokenValid: true,
      isCompleted: false,
      status: {
        type: "",
        message: "",
      },
    };
  },
  computed: {
    hasErrors() {
      return (
        this.passwordError ||
        this.passwordConfirmError ||
        !this.password ||
        !this.passwordConfirm
      );
    },
  },
  methods: {
    validatePassword() {
      this.passwordError = "";

      if (this.password.length < 8) {
        this.passwordError = "비밀번호는 8자 이상이어야 합니다.";
        return;
      }

      // 영문, 숫자, 특수문자 조합 검사
      const hasLetter = /[a-zA-Z]/.test(this.password);
      const hasNumber = /[0-9]/.test(this.password);
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(this.password);

      if (!hasLetter || !hasNumber || !hasSpecial) {
        this.passwordError = "영문, 숫자, 특수문자를 모두 포함해야 합니다.";
        return;
      }

      // 연속된 문자 검사
      for (let i = 0; i < this.password.length - 2; i++) {
        const current = this.password.charCodeAt(i);
        const next1 = this.password.charCodeAt(i + 1);
        const next2 = this.password.charCodeAt(i + 2);

        if (next1 - current === 1 && next2 - next1 === 1) {
          this.passwordError = "연속된 문자를 3자리 이상 사용할 수 없습니다.";
          return;
        }
      }

      this.validatePasswordConfirm();
    },

    validatePasswordConfirm() {
      if (this.passwordConfirm) {
        this.passwordConfirmError = this.password !== this.passwordConfirm;
      } else {
        this.passwordConfirmError = false;
      }
    },
    async checkToken() {
      try {
        await authApi.validateResetToken(this.token);
        this.isTokenValid = true;
      } catch (error) {
        console.error("토큰 검증 에러:", error);
        this.isTokenValid = false;
      }
    },

    async handleSubmit() {
      try {
        this.isLoading = true;
        this.status.message = "";

        console.log("비밀번호 재설정 시도:", {
          token: this.token,
          email: this.email,
        });

        await authApi.resetPassword({
          token: this.token,
          email: this.email,
          newPassword: this.password,
        });

        console.log("비밀번호 재설정 성공");
        this.isCompleted = true;
      } catch (error) {
        console.error("비밀번호 재설정 에러:", error);
        this.status.type = "error";
        if (error.response?.status === 400) {
          this.status.message =
            "링크가 만료되었거나 이미 사용되었습니다. 비밀번호 재설정을 다시 요청해주세요.";
        } else {
          this.status.message =
            "비밀번호 변경에 실패했습니다. 다시 시도해주세요.";
        }
      } finally {
        this.isLoading = false;
      }
    },
  },
  mounted() {
    // URL에서 토큰과 이메일 파라미터 추출
    const urlParams = new URLSearchParams(window.location.search);
    this.token = urlParams.get("token");
    this.email = urlParams.get("email");

    // 토큰 유효성 검사
    if (this.token && this.email) {
      this.checkToken();
    } else {
      this.isTokenValid = false;
    }
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

.submit-button {
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
  text-align: center;
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
  color: #666;
}

.success-message {
  text-align: center;
  color: #6D63FF;
}

.text-center {
  text-align: center;
}

.text-xl {
  font-size: 1.25rem;
  line-height: 1.75rem;
}

.text-2xl {
  font-size: 1.5rem;
  line-height: 2rem;
}

.font-bold {
  font-weight: bold;
}

.mb-4 {
  margin-bottom: 1rem;
}

.mb-6 {
  margin-bottom: 1.5rem;
}

.block {
  display: block;
}
</style>