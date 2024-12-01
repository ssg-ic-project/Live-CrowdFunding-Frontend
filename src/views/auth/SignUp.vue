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
            <button class="social-login naver-login" @click="handleNaverLogin">
              네이버로 간편 가입
            </button>
          </div>

          <!-- 이메일 입력 -->
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
                :disabled="isEmailVerified || !email"
              >
                {{ isCodeSent ? "인증하기" : "인증코드 보내기" }}
              </button>
            </div>
            <p v-if="errors.email" class="error-message">{{ errors.email }}</p>
          </div>

          <!-- 인증코드 입력 -->
          <div class="input-group" v-if="isCodeSent && !isEmailVerified">
            <label for="emailCode">인증코드</label>
            <input
              type="text"
              id="emailCode"
              v-model="emailCode"
              placeholder="인증코드를 입력하세요"
              required
            />
            <p v-if="errors.emailCode" class="error-message">
              {{ errors.emailCode }}
            </p>
          </div>

          <!-- 이름 입력 -->
          <div class="input-group">
            <label for="name">이름</label>
            <input
              type="text"
              id="name"
              v-model="name"
              placeholder="이름을 입력하세요"
              required
            />
            <p v-if="errors.name" class="error-message">{{ errors.name }}</p>
          </div>

          <!-- 닉네임 입력 (일반회원만) -->
          <div class="input-group" v-if="userType === 'user'">
            <label for="nickname">닉네임</label>
            <input
              type="text"
              id="nickname"
              v-model="nickname"
              placeholder="닉네임을 입력하세요"
              required
            />
            <p v-if="errors.nickname" class="error-message">
              {{ errors.nickname }}
            </p>
          </div>

          <!-- 전화번호 입력 -->
          <div class="input-group">
            <label for="phone">전화번호</label>
            <input
              type="text"
              id="phone"
              v-model="phone"
              placeholder="전화번호를 입력하세요"
              required
            />
            <p v-if="errors.phone" class="error-message">{{ errors.phone }}</p>
          </div>

          <!-- 비밀번호 입력 -->
          <div class="input-group">
            <label for="password">비밀번호</label>
            <input
              type="password"
              id="password"
              v-model="password"
              placeholder="비밀번호를 입력하세요"
              required
            />
            <p v-if="errors.password" class="error-message">
              {{ errors.password }}
            </p>
          </div>

          <!-- 비밀번호 확인 -->
          <div class="input-group">
            <label for="confirmPassword">비밀번호 확인</label>
            <input
              type="password"
              id="confirmPassword"
              v-model="confirmPassword"
              placeholder="비밀번호를 다시 입력하세요"
              required
            />
            <p v-if="errors.confirmPassword" class="error-message">
              {{ errors.confirmPassword }}
            </p>
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
            <p v-if="errors.postcode" class="error-message">
              {{ errors.postcode }}
            </p>
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
            <p v-if="errors.address" class="error-message">
              {{ errors.address }}
            </p>
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
            <p v-if="errors.detailAddress" class="error-message">
              {{ errors.detailAddress }}
            </p>
          </div>

          <!-- 메이커 전용 필드 -->
          <template v-if="userType === 'maker'">
            <!-- 생년월일 입력 -->
            <div class="input-group">
              <label for="birthDate">생년월일</label>
              <input type="date" id="birthDate" v-model="birthDate" required />
              <p v-if="errors.birthDate" class="error-message">
                {{ errors.birthDate }}
              </p>
            </div>

            <!-- 회사명 입력 -->
            <div class="input-group">
              <label for="companyName">회사명</label>
              <input
                type="text"
                id="companyName"
                v-model="companyName"
                placeholder="회사명을 입력하세요"
                required
              />
              <p v-if="errors.companyName" class="error-message">
                {{ errors.companyName }}
              </p>
            </div>

            <!-- 주민등록증 업로드 -->
            <div class="input-group">
              <label for="idCard">주민등록증</label>
              <div class="verification-upload">
                <input
                  type="file"
                  id="idCard"
                  @change="handleIdCardUpload"
                  accept="image/*"
                  required
                />
                <span v-if="idCardVerified" class="verification-badge success">
                  ✓ 인증완료
                </span>
              </div>
              <p v-if="errors.idCard" class="error-message">
                {{ errors.idCard }}
              </p>
            </div>

            <!-- 재직증명서 업로드 -->
            <div class="input-group">
              <label for="employmentCert">재직증명서</label>
              <div class="verification-upload">
                <input
                  type="file"
                  id="employmentCert"
                  @change="handleEmploymentCertUpload"
                  accept="image/*"
                  required
                />
                <span
                  v-if="employmentCertVerified"
                  class="verification-badge success"
                >
                  ✓ 인증완료
                </span>
              </div>
              <p v-if="errors.employmentCert" class="error-message">
                {{ errors.employmentCert }}
              </p>
            </div>

            <!-- 사업자등록번호 -->
            <div class="input-group">
              <label for="businessNumber">사업자등록번호</label>
              <div class="business-verification">
                <input
                  type="text"
                  id="businessNumber"
                  v-model="businessNumber"
                  placeholder="'-' 없이 입력하세요"
                  required
                />
                <button
                  @click="verifyBusinessNumber"
                  class="verify-button"
                  :class="{ verified: businessVerified }"
                  :disabled="!businessNumber || businessVerified"
                >
                  {{ businessVerified ? "인증완료" : "인증하기" }}
                </button>
              </div>
              <p v-if="errors.businessNumber" class="error-message">
                {{ errors.businessNumber }}
              </p>
            </div>
          </template>

          <!-- 개인정보 수집 동의 -->
          <div class="input-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="agreeToTerms" required />
              개인정보 수집 및 이용에 동의합니다.
            </label>
            <p v-if="errors.terms" class="error-message">{{ errors.terms }}</p>
          </div>

          <button
            @click="nextStep"
            class="signup-button"
            :disabled="!isEmailVerified"
          >
            {{ isEmailVerified ? "다음" : "이메일 인증이 필요합니다" }}
          </button>
        </div>

        <!-- 추가 정보 입력 (일반회원 전용) -->
        <div v-else-if="step === 'additionalInfo' && userType === 'user'">
          <h2>추가 정보 입력</h2>

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
            <p v-if="errors.gender" class="error-message">
              {{ errors.gender }}
            </p>
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
            <p v-if="errors.interest" class="error-message">
              {{ errors.interest }}
            </p>
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
      name: "",
      nickname: "",
      phone: "",
      password: "",
      confirmPassword: "",
      postcode: "",
      address: "",
      detailAddress: "",
      birthDate: "",
      companyName: "",
      businessNumber: "",
      gender: "",
      interest: [],
      isEmailVerified: false,
      isCodeSent: false,
      showModal: false,
      modalMessage: "",
      agreeToTerms: false,
      idCardFile: null,
      employmentCertFile: null,
      idCardVerified: false,
      employmentCertVerified: false,
      businessVerified: false,
      verifiedCompanyName: "",

      // 카테고리 목록
      categories: [
        "생활 가전",
        "주방가전",
        "스마트 가전",
        "DIY",
        "엔터테인먼트",
        "웨어러블",
        "주변 기기",
      ],

      // 각 필드별 에러 상태 관리
      errors: {
        email: "",
        emailCode: "",
        name: "",
        nickname: "",
        phone: "",
        password: "",
        confirmPassword: "",
        postcode: "",
        address: "",
        detailAddress: "",
        birthDate: "",
        companyName: "",
        businessNumber: "",
        idCard: "",
        employmentCert: "",
        gender: "",
        interest: "",
        terms: "",
      },
    };
  },

  watch: {
    // 각 입력값이 변경될 때 해당 에러 메시지 초기화
    email() {
      this.errors.email = "";
    },
    emailCode() {
      this.errors.emailCode = "";
    },
    name() {
      this.errors.name = "";
    },
    nickname() {
      this.errors.nickname = "";
    },
    phone() {
      this.errors.phone = "";
    },
    password() {
      this.errors.password = "";
    },
    confirmPassword() {
      this.errors.confirmPassword = "";
    },
    postcode() {
      this.errors.postcode = "";
    },
    address() {
      this.errors.address = "";
    },
    detailAddress() {
      this.errors.detailAddress = "";
    },
    birthDate() {
      this.errors.birthDate = "";
    },
    companyName() {
      this.errors.companyName = "";
    },
    businessNumber() {
      this.errors.businessNumber = "";
    },
    agreeToTerms() {
      this.errors.terms = "";
    },
  },

  methods: {
    setUserType(type) {
      this.userType = type;
      this.step = "basicForm";
    },

    // 에러 메시지 초기화
    clearErrors() {
      Object.keys(this.errors).forEach((key) => {
        this.errors[key] = "";
      });
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
        this.errors.email = "이메일을 입력해주세요.";
        return;
      }

      try {
        // 이메일 중복 체크
        const checkResponse = await authApi.checkEmail(this.email);
        if (checkResponse.data.isDuplicate) {
          this.errors.email = "이미 사용 중인 이메일입니다.";
          return;
        }

        // 인증 코드 발송
        const response = await authApi.sendVerificationCode(this.email);
        this.isCodeSent = true;
        this.showModal = true;
        this.modalMessage = response.data.message;
      } catch (error) {
        console.error("이메일 인증 에러:", error);
        this.errors.email = "이메일 인증 처리 중 오류가 발생했습니다.";
      }
    },

    async verifyEmailCode() {
      if (!this.emailCode) {
        this.errors.emailCode = "인증 코드를 입력해주세요.";
        return;
      }

      try {
        const response = await authApi.verifyCode(this.email, this.emailCode);
        if (response.data.verified) {
          this.isEmailVerified = true;
          this.showModal = true;
          this.modalMessage = "이메일 인증이 완료되었습니다.";
          this.errors.emailCode = "";
        } else {
          this.errors.emailCode = "잘못된 인증 코드입니다.";
        }
      } catch (error) {
        console.error("인증 코드 확인 에러:", error);
        this.errors.emailCode = "인증 코드 확인 중 오류가 발생했습니다.";
      }
    },

    validateForm() {
      let isValid = true;
      this.clearErrors();

      // 이메일 검증
      if (!this.email) {
        this.errors.email = "이메일을 입력해주세요.";
        isValid = false;
      }

      // 이름 검증
      if (!this.name) {
        this.errors.name = "이름을 입력해주세요.";
        isValid = false;
      }

      // 닉네임 검증 (일반회원만)
      if (this.userType === "user" && !this.nickname) {
        this.errors.nickname = "닉네임을 입력해주세요.";
        isValid = false;
      }

      // 전화번호 검증
      if (!this.phone) {
        this.errors.phone = "전화번호를 입력해주세요.";
        isValid = false;
      }

      // 비밀번호 검증
      if (!this.password) {
        this.errors.password = "비밀번호를 입력해주세요.";
        isValid = false;
      }

      if (this.password !== this.confirmPassword) {
        this.errors.confirmPassword = "비밀번호가 일치하지 않습니다.";
        isValid = false;
      }

      // 주소 검증
      if (!this.postcode || !this.address || !this.detailAddress) {
        this.errors.address = "주소를 모두 입력해주세요.";
        isValid = false;
      }

      // 메이커 전용 검증
      if (this.userType === "maker") {
        if (!this.birthDate) {
          this.errors.birthDate = "생년월일을 입력해주세요.";
          isValid = false;
        }

        if (!this.companyName) {
          this.errors.companyName = "회사명을 입력해주세요.";
          isValid = false;
        }

        if (!this.businessNumber) {
          this.errors.businessNumber = "사업자등록번호를 입력해주세요.";
          isValid = false;
        }

        if (!this.idCardVerified) {
          this.errors.idCard = "주민등록증 인증이 필요합니다.";
          isValid = false;
        }

        if (!this.employmentCertVerified) {
          this.errors.employmentCert = "재직증명서 인증이 필요합니다.";
          isValid = false;
        }
      }

      // 약관 동의 검증
      if (!this.agreeToTerms) {
        this.errors.terms = "개인정보 수집 및 이용에 동의해주세요.";
        isValid = false;
      }

      return isValid;
    },

    async nextStep() {
      if (!this.validateForm()) {
        return;
      }

      if (this.userType === "user") {
        this.step = "additionalInfo";
      } else {
        await this.completeRegistration();
      }
    },

    // 주소 API 열기
    openAddressAPI() {
      new window.daum.Postcode({
        oncomplete: (data) => {
          this.postcode = data.zonecode;
          this.address = data.roadAddress || data.jibunAddress;

          // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합
          if (data.userSelectedType === "R") {
            let extraAddr = "";
            if (data.bname !== "" && /[동|로|가]$/g.test(data.bname)) {
              extraAddr += data.bname;
            }
            if (data.buildingName !== "" && data.apartment === "Y") {
              extraAddr +=
                extraAddr !== "" ? `, ${data.buildingName}` : data.buildingName;
            }
            if (extraAddr !== "") {
              this.address += ` (${extraAddr})`;
            }
          }

          this.$nextTick(() => {
            document.getElementById("detailAddress").focus();
          });
        },
      }).open();
    },

    toggleInterest(category) {
      if (this.interest.includes(category)) {
        this.interest = this.interest.filter((item) => item !== category);
      } else {
        if (this.interest.length >= 3) {
          this.errors.interest = "관심 분야는 최대 3개까지 선택 가능합니다.";
          return;
        }
        this.interest.push(category);
      }
      this.errors.interest = "";
    },

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
      return selectedCategories
        .map((category) => categoryMap[category])
        .filter((id) => id !== undefined);
    },

    async handleIdCardUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      try {
        const formData = new FormData();
        formData.append("file", file);
        const response = await authApi.verifyIdCard(formData);

        if (response.data.success) {
          this.idCardVerified = true;
          this.idCardFile = file;
          this.errors.idCard = "";
        } else {
          this.idCardVerified = false;
          this.errors.idCard =
            response.data.errorMessage || "주민등록증 인증에 실패했습니다.";
        }
      } catch (error) {
        console.error("주민등록증 인증 오류:", error);
        this.idCardVerified = false;
        this.errors.idCard = "주민등록증 인증 처리 중 오류가 발생했습니다.";
      }
    },

    async handleEmploymentCertUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      try {
        const formData = new FormData();
        formData.append("file", file);
        const response = await authApi.verifyEmploymentCert(formData);

        if (response.data.success) {
          this.employmentCertVerified = true;
          this.employmentCertFile = file;
          this.errors.employmentCert = "";
          this.companyName = response.data.companyName;
          this.businessNumber = response.data.businessNumber;

          if (this.businessNumber) {
            await this.verifyBusinessNumber();
          }
        } else {
          this.employmentCertVerified = false;
          this.errors.employmentCert =
            response.data.errorMessage || "재직증명서 인증에 실패했습니다.";
        }
      } catch (error) {
        console.error("재직증명서 인증 오류:", error);
        this.employmentCertVerified = false;
        this.errors.employmentCert =
          "재직증명서 인증 처리 중 오류가 발생했습니다.";
      }
    },

    async verifyBusinessNumber() {
      if (!this.businessNumber) {
        this.errors.businessNumber = "사업자등록번호를 입력해주세요.";
        return;
      }

      try {
        const response = await authApi.verifyBusinessNumber(
          this.businessNumber
        );

        if (response.data.success) {
          this.businessVerified = true;
          this.errors.businessNumber = "";

          if (
            this.verifiedCompanyName &&
            this.verifiedCompanyName !== response.data.companyName
          ) {
            this.businessVerified = false;
            this.errors.businessNumber =
              "재직증명서의 회사명과 일치하지 않습니다.";
          }
        } else {
          this.businessVerified = false;
          this.errors.businessNumber =
            response.data.errorMessage || "유효하지 않은 사업자등록번호입니다.";
        }
      } catch (error) {
        console.error("사업자번호 인증 오류:", error);
        this.businessVerified = false;
        this.errors.businessNumber =
          "사업자번호 인증 처리 중 오류가 발생했습니다.";
      }
    },
    async completeRegistration() {
      try {
        if (this.userType === "maker") {
          if (
            !this.idCardVerified ||
            !this.employmentCertVerified ||
            !this.businessVerified
          ) {
            this.showModal = true;
            this.modalMessage = "모든 인증을 완료해주세요.";
            return;
          }

          const formData = new FormData();
          formData.append("name", this.name);
          formData.append("email", this.email);
          formData.append("password", this.password);
          formData.append("phone", this.phone);
          formData.append("birthDate", this.birthDate);
          formData.append("companyName", this.companyName);
          formData.append("businessNumber", this.businessNumber);
          formData.append("zipcode", this.postcode);
          formData.append("address", this.address);
          formData.append("detailAddress", this.detailAddress);
          formData.append("idCard", this.idCardFile);
          formData.append("employmentCert", this.employmentCertFile);

          await authApi.registerMaker(formData);
        } else {
          const formattedBirth = this.birthDate
            ? this.birthDate.split("T")[0]
            : null;

          const userData = {
            name: this.name,
            nickname: this.nickname,
            email: this.email,
            password: this.password,
            phone: this.phone,
            zipcode: parseInt(this.postcode),
            address: this.address,
            detailAddress: this.detailAddress,
            gender: this.gender === "male",
            birth: formattedBirth,
            categoryIds: this.mapCategoriesToIds(this.interest),
            loginMethod: false,
            notification: true,
          };

          console.log("Sending user data:", userData);
          await authApi.registerUser(userData);
        }

        this.step = "complete";
      } catch (error) {
        console.error("회원가입 에러:", error);
        this.showModal = true;
        this.modalMessage =
          error.response?.data?.message ||
          "회원가입 처리 중 오류가 발생했습니다.";
      }
    },

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
  background-color: #fff7b4;
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
  backdrop-filter: blur(3px);
}

.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  max-width: 400px;
  width: 90%;
  border: 1px solid #ffd74e;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-button {
  margin-top: 1.5rem;
  padding: 0.75rem 1.5rem;
  background-color: #ff5151;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.modal-button:hover {
  background-color: #ff3333;
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
  color: #ff5151;
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
  margin-bottom: 2rem;
}

.signup-box {
  width: 100%;
  padding: 2rem;
  background-color: white;
  border: 1px solid #ffd74e;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(255, 81, 81, 0.1);
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
  border: 2px solid #ff5151;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: bold; /* 글씨 굵기 추가 */
  color: #ff5151; /* 텍스트 색상 설정 */
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.type-button:hover {
  background-color: #ff5151;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 81, 81, 0.2); /* 그림자 효과 추가 */
}

h2 {
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
  font-weight: bold; /* 제목도 굵게 */
}
.social-signup {
  margin-bottom: 2rem;
}

.input-group {
  margin-bottom: 1.5rem;
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
  border: 1px solid #ffd74e;
  border-radius: 4px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.input-group input:focus,
.input-group select:focus {
  outline: none;
  border-color: #ff5151;
  box-shadow: 0 0 0 2px rgba(255, 81, 81, 0.1);
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
  background-color: #ff5151;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
  min-width: 120px;
  font-weight: 500;
  transition: background-color 0.3s ease;
}

.verify-button:hover:not(:disabled),
.address-button:hover {
  background-color: #ff3333;
}

.signup-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #ff5151;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1.5rem;
  font-size: 1.1rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.signup-button:hover:not(:disabled) {
  background-color: #ff3333;
  transform: translateY(-1px);
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
  transition: opacity 0.3s ease;
}

.naver-login {
  background-color: #03c75a;
}

.naver-login:hover {
  opacity: 0.9;
}

.gender-checkboxes {
  display: flex;
  gap: 2rem;
  margin-top: 0.5rem;
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
  border: 2px solid #ffd74e;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-item:hover {
  border-color: #ff5151;
}

.category-item.selected {
  border-color: #ff5151;
  background-color: #ff5151;
  color: white;
}

.error-message {
  color: #ff5151;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.verify-button.verified {
  background-color: #28a745;
  cursor: not-allowed;
}

.verification-upload {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.verification-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
}

.verification-badge.success {
  background-color: #28a745;
  color: white;
}

input[type="file"] {
  padding: 0.5rem;
  border: 1px solid #ffd74e;
  border-radius: 4px;
  width: 100%;
}

input[type="file"]::-webkit-file-upload-button {
  background: #ff5151;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 1rem;
  transition: background-color 0.3s ease;
}

input[type="file"]::-webkit-file-upload-button:hover {
  background: #ff3333;
}

.signup-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
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

  .verify-button,
  .address-button {
    min-width: auto;
    padding: 0.75rem;
  }
}
</style>
