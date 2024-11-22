<!-- src/views/auth/SignUp.vue -->
<template>
  <div class="signup-container">
    <!-- 뒤로가기 버튼 -->
    <button @click="$router.go(-1)" class="back-button">
      <span class="material-icons">arrow_back</span>
    </button>

    <div class="login-content">
      <img src="../../assets/image/logo.png" alt="Logo" class="logo" />

      <div class="signup-box">
        <!-- 회원 유형 선택 -->
        <div v-if="step === 'selectType'" class="type-selection">
          <h2>회원 유형 선택</h2>
          <div class="type-buttons">
            <button @click="setUserType('user')" class="type-button">
              일반회원
            </button>
            <button @click="setUserType('maker')" class="type-button">
              판매자<br />(메이커)
            </button>
          </div>
        </div>

        <!-- 기본 정보 입력 (일반회원/메이커 공통) -->
        <div v-else-if="step === 'basicForm'">
          <h2>
            {{ userType === "user" ? "일반 회원가입" : "메이커 회원가입" }}
          </h2>

          <!-- 소셜 간편가입 (일반회원 전용) -->
          <div class="social-signup" v-if="userType === 'user'">
            <button class="social-login naver-login">네이버로 간편 가입</button>
          </div>
          <br />
          <br />
          <br />

          <!-- 이메일 간편가입 폼 -->
          <h3>이메일 간편 가입</h3>
          <div class="input-group">
            <label for="email">이메일</label>
            <div class="email-verification">
              <input
                type="email"
                id="email"
                v-model="email"
                placeholder="이메일을 입력하세요"
                :disabled="isEmailVerified"
                required
              />
              <button
                @click="
                  isCodeSent ? verifyEmailCode() : sendEmailVerification()
                "
                class="verify-button"
                :class="{ verified: isEmailVerified }"
                :disabled="isEmailVerified"
              >
                {{ isCodeSent ? "인증하기" : "인증코드 보내기" }}
              </button>
            </div>
            <p v-if="emailVerificationError" class="error-message">
              {{ emailVerificationError }}
            </p>
          </div>

          <div class="input-group" v-if="isCodeSent && !isEmailVerified">
            <label for="emailCode">인증코드</label>
            <input
              type="text"
              id="emailCode"
              v-model="emailCode"
              placeholder="인증코드를 입력하세요"
              required
            />
          </div>

          <div class="input-group">
            <label for="nickname">닉네임</label>
            <input
              type="text"
              id="nickname"
              v-model="nickname"
              placeholder="닉네임을 입력하세요"
              required
            />
          </div>

          <div class="input-group">
            <label for="phone">전화번호</label>
            <input
              type="text"
              id="phone"
              v-model="phone"
              placeholder="전화번호를 입력하세요"
              required
            />
          </div>

          <div class="input-group">
            <label for="password">비밀번호</label>
            <input
              type="password"
              id="password"
              v-model="password"
              placeholder="비밀번호를 입력하세요"
              required
            />
          </div>

          <div class="input-group">
            <label for="confirmPassword">비밀번호 확인</label>
            <input
              type="password"
              id="confirmPassword"
              v-model="confirmPassword"
              placeholder="비밀번호를 다시 입력하세요"
              required
            />
          </div>

          <!-- 주소 입력 -->
          <div class="input-group address-group">
            <label for="postcode">우편번호</label>
            <div class="address-input">
              <input
                type="text"
                id="postcode"
                v-model="postcode"
                readonly
                required
              />
              <button @click="openAddressAPI" class="address-button">
                주소 찾기
              </button>
            </div>
          </div>

          <div class="input-group">
            <label for="address">주소</label>
            <input
              type="text"
              id="address"
              v-model="address"
              readonly
              required
            />
          </div>

          <div class="input-group">
            <label for="detailAddress">상세주소</label>
            <input
              type="text"
              id="detailAddress"
              v-model="detailAddress"
              placeholder="상세주소를 입력하세요"
              required
            />
          </div>

          <!-- 사업자 번호 추가 필드 (메이커 전용) -->
          <div class="input-group" v-if="userType === 'maker'">
            <label for="businessNumber">사업자 번호</label>
            <div class="business-verification">
              <input
                type="text"
                id="businessNumber"
                v-model="businessNumber"
                placeholder="사업자 번호를 입력하세요"
                required
              />
              <button @click="verifyBusinessNumber" class="verify-button">
                사업자 확인
              </button>
            </div>
          </div>

          <!-- 개인정보 수집 동의 -->
          <div class="input-group">
            <label>
              <input type="checkbox" v-model="agreeToTerms" required />
              개인정보 수집 및 이용에 동의합니다.
            </label>
          </div>

          <button @click="nextStep" class="signup-button">
            {{ isEmailVerified ? "다음" : "이메일 인증이 필요합니다" }}
          </button>
        </div>

        <!-- 추가 정보 입력 (일반회원 전용) -->
        <div v-else-if="step === 'additionalInfo' && userType === 'user'">
          <h2>추가 정보 입력</h2>
          <div class="input-group">
            <label for="birthdate">생년월일</label>
            <input
              type="text"
              id="birthdate"
              v-model="birthdate"
              placeholder="YYYYMMDD 형식으로 입력하세요"
              maxlength="8"
              required
            />
          </div>

          <div class="input-group">
            <label>성별</label>
            <div class="gender-checkboxes">
              <label>
                <input type="radio" value="male" v-model="gender" />
                남성
              </label>
              <label>
                <input type="radio" value="female" v-model="gender" />
                여성
              </label>
            </div>
          </div>

          <div class="input-group">
            <label>관심 분야</label>
            <div class="interest-categories">
              <div
                v-for="category in categories"
                :key="category"
                :class="[
                  'category-item',
                  { selected: interest.includes(category) },
                ]"
                @click="toggleInterest(category)"
              >
                {{ category }}
              </div>
            </div>
          </div>

          <button @click="completeRegistration" class="signup-button">
            가입완료
          </button>
        </div>

        <!-- 가입 완료 메시지 -->
        <div v-else-if="step === 'complete'">
          <h2>회원가입이 완료되었습니다!</h2>
          <p>로그인 페이지로 이동합니다.</p>
          <button @click="goToLogin" class="signup-button">로그인하기</button>
        </div>
      </div>
    </div>
  </div>

  <!-- 모달 창 -->
  <div v-if="showModal" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <p>{{ modalMessage }}</p>
      <button @click="closeModal" class="modal-button">확인</button>
    </div>
  </div>
</template>

<script>
import { authApi } from "@/api";

export default {
  name: "SignUp",
  data() {
    return {
      step: "selectType",
      userType: null,
      email: "",
      emailCode: "",
      nickname: "",
      phone: "",
      password: "",
      confirmPassword: "",
      postcode: "",
      address: "",
      detailAddress: "",
      businessNumber: "",
      agreeToTerms: false,
      birthdate: "",
      gender: "",
      interest: [],
      categories: [
        "생활 가전",
        "주방가전",
        "스마트 가전",
        "DIY",
        "엔터테인먼트",
        "웨어러블",
        "주변 기기",
      ],
      isEmailVerified: false, // 이메일 인증 완료 여부
      isEmailDuplicate: false, // 이메일 중복 여부
      isCodeSent: false, // 인증코드 발송 여부
      emailVerificationError: "", // 이메일 관련 에러 메시지
      showModal: false,
      modalMessage: "",
    };
  },
  methods: {
    setUserType(type) {
      this.userType = type;
      this.step = "basicForm";
    },

    closeModal() {
      this.showModal = false;
      if (this.isEmailVerified) {
        this.modalMessage = "";
      }
    },

    // 이메일 중복 체크 및 인증 코드 발송
    async sendEmailVerification() {
      if (!this.email) {
        this.emailVerificationError = "이메일을 입력해주세요.";
        return;
      }

      try {
        // 이메일 중복 체크
        const checkResponse = await authApi.checkEmail(this.email);
        if (checkResponse.data.isDuplicate) {
          this.emailVerificationError = "이미 사용 중인 이메일입니다.";
          return;
        }

        // 인증 코드 발송
        const response = await authApi.sendVerificationCode(this.email);
        this.isCodeSent = true;
        this.showModal = true;
        this.modalMessage = response.data.message;
      } catch (error) {
        console.error("이메일 인증 에러:", error);
        this.emailVerificationError =
          "이메일 인증 처리 중 오류가 발생했습니다.";
      }
    },

    async verifyEmailCode() {
      if (!this.emailCode) {
        this.emailVerificationError = "인증 코드를 입력해주세요.";
        return;
      }

      try {
        const response = await authApi.verifyCode(this.email, this.emailCode);
        if (response.data.verified) {
          this.isEmailVerified = true;
          this.showModal = true;
          this.modalMessage = "이메일 인증이 완료되었습니다.";
        } else {
          this.emailVerificationError = "잘못된 인증 코드입니다.";
        }
      } catch (error) {
        console.error("인증 코드 확인 에러:", error);
        this.emailVerificationError = "인증 코드 확인 중 오류가 발생했습니다.";
      }
    },

    // 다음 단계로 이동
    async nextStep() {
      // 필수 필드 검증
      if (!this.isEmailVerified) {
        this.emailVerificationError = "이메일 인증이 필요합니다.";
        return;
      }

      if (
        !this.email ||
        !this.nickname ||
        !this.phone ||
        !this.password ||
        !this.confirmPassword ||
        !this.postcode ||
        !this.address
      ) {
        alert("모든 필수 정보를 입력해주세요.");
        return;
      }

      // 비밀번호 일치 확인
      if (this.password !== this.confirmPassword) {
        alert("비밀번호가 일치하지 않습니다.");
        return;
      }

      // 약관 동의 확인
      if (!this.agreeToTerms) {
        alert("개인정보 수집 및 이용에 동의해주세요.");
        return;
      }

      // 사업자 번호 확인 (메이커인 경우)
      if (this.userType === "maker" && !this.businessNumber) {
        alert("사업자 번호를 입력해주세요.");
        return;
      }

      if (this.userType === "user") {
        this.step = "additionalInfo";
      } else {
        this.completeRegistration();
      }
    },

    // 주소 API
    openAddressAPI() {
      new window.daum.Postcode({
        oncomplete: (data) => {
          // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분
          this.postcode = data.zonecode;
          this.address = data.roadAddress || data.jibunAddress;

          // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
          if (data.userSelectedType === "R") {
            // 법정동명이 있을 경우 추가한다.
            let extraAddr = "";
            if (data.bname !== "" && /[동|로|가]$/g.test(data.bname)) {
              extraAddr += data.bname;
            }
            // 건물명이 있고, 공동주택일 경우 추가한다.
            if (data.buildingName !== "" && data.apartment === "Y") {
              extraAddr +=
                extraAddr !== "" ? ", " + data.buildingName : data.buildingName;
            }
            // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
            if (extraAddr !== "") {
              extraAddr = " (" + extraAddr + ")";
              this.address += extraAddr;
            }
          }

          // 상세주소 필드에 포커스
          this.$nextTick(() => {
            document.getElementById("detailAddress").focus();
          });
        },
      }).open();
    },

    // 사업자 번호 확인
    async verifyBusinessNumber() {
      if (!this.businessNumber) {
        alert("사업자 번호를 입력해주세요.");
        return;
      }

      try {
        // 사업자 번호 확인 API 호출 (구현 필요)
        const response = await fetch(
          `/api/auth/verify-business?number=${this.businessNumber}`
        );
        const result = await response.json();

        if (result.verified) {
          alert("사업자 번호가 확인되었습니다.");
        } else {
          alert("유효하지 않은 사업자 번호입니다.");
        }
      } catch (error) {
        alert("사업자 번호 확인에 실패했습니다.");
      }
    },

    // 관심 카테고리 토글
    toggleInterest(category) {
      if (this.interest.includes(category)) {
        this.interest = this.interest.filter((item) => item !== category);
      } else {
        if (this.interest.length >= 3) {
          alert("관심 분야는 최대 3개까지 선택 가능합니다.");
          return;
        }
        this.interest.push(category);
      }
    },

    // 카테고리 이름을 ID로 변환
    mapCategoriesToIds(selectedCategories) {
      const categoryMap = {
        "생활 가전": 1,
        주방가전: 2,
        "스마트 가전": 3,
        DIY: 4,
        엔터테인먼트: 5,
        웨어러블: 6,
        "주변 기기": 7,
      };

      return selectedCategories.map((category) => categoryMap[category]);
    },

    // 회원가입 완료
    async completeRegistration() {
    try {
        const commonData = {
            email: this.email,
            password: this.password,
            name: this.nickname,
            nickname: this.nickname,
            phone: this.phone,
            zipcode: parseInt(this.postcode),
            address: this.address,
            detailAddress: this.detailAddress,
            loginMethod: false,
            notification: true
        };

        if (this.userType === "user") {
            const userData = {
                ...commonData,
                gender: this.gender === "male",
                birth: this.birthdate,
                categoryIds: this.mapCategoriesToIds(this.interest)
            };

            await authApi.registerUser(userData);
        } else {
            const makerData = {
                ...commonData,
                business: this.businessNumber
            };

            await authApi.registerMaker(makerData);
        }

        this.step = "complete";
        
    } catch (error) {
        console.error('회원가입 에러:', error.response?.data || error);
        
        let errorMessage = "회원가입에 실패했습니다.";
        if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
        }
        
        this.showModal = true;
        this.modalMessage = errorMessage;
    }
},

    // 로그인 페이지로 이동
    goToLogin() {
      this.$router.push("/auth/login");
    },
  },
};
</script>
<style scoped>
.signup-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #ffffff;
  position: relative;
  padding: 2rem 0;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  max-width: 400px;
  width: 90%;
}

.modal-button {
  margin-top: 1rem;
  padding: 0.5rem 1.5rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.verify-button.verified {
  background-color: #28a745;
  cursor: not-allowed;
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
  width: 200px;
  margin-bottom: 1rem;
}

.signup-box {
  width: 100%;
  padding: 2rem;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.type-selection {
  text-align: center;
}

.type-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 2rem;
}

.type-button {
  width: 150px;
  height: 150px;
  padding: 1rem;
  background-color: white;
  border: 2px solid var(--primary-color);
  border-radius: 12px;
  cursor: pointer;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.type-button:hover {
  background-color: var(--primary-color);
  color: white;
}

h2 {
  color: #333;
  margin-bottom: 2rem;
}

.social-signup {
  margin-bottom: 2rem;
}

.input-group {
  margin-bottom: 1rem;
  text-align: left;
}

.input-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #333;
}

.input-group input,
.input-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.input-group input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.email-verification,
.business-verification,
.address-input {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.email-verification input,
.business-verification input,
.address-input input {
  flex: 1;
}

.verify-button,
.address-button {
  padding: 0.75rem 1rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
  min-width: 120px;
  font-weight: 500;
}

.signup-button {
  width: 100%;
  padding: 0.75rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1.5rem;
  font-size: 1.1rem;
  font-weight: 500;
}

.verify-button:hover,
.address-button:hover,
.signup-button:hover {
  background-color: var(--secondary-color);
}

.social-login {
  width: 100%;
  padding: 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 0.5rem;
  color: white;
  font-weight: 500;
  font-size: 1rem;
  border: none;
}

.naver-login {
  background-color: #03c75a;
}

.gender-checkboxes {
  display: flex;
  gap: 2rem;
}

.gender-checkboxes label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.interest-categories {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.category-item {
  padding: 0.5rem 1rem;
  border: 2px solid #ddd;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-item:hover {
  border-color: var(--primary-color);
}

.category-item.selected {
  border-color: var(--primary-color);
  background-color: var(--primary-color);
  color: white;
}

.error-message {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

@media (max-width: 480px) {
  .signup-box {
    padding: 1.5rem;
  }

  .type-buttons {
    flex-direction: column;
    align-items: center;
  }

  .type-button {
    width: 100%;
    max-width: 200px;
  }
}

.verify-button.verified {
  background-color: #28a745;
}

.error-message {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}
.signup-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>
