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

          <!-- 실명 입력 -->
          <div class="input-group">
            <label for="name">실명</label>
            <input
              type="text"
              id="name"
              v-model="name"
              placeholder="실명을 입력하세요"
              required
            />
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
          </div>

          <!-- 생년월일 입력 (기본 정보 입력 단계에 추가) -->
          <div class="input-group">
            <label for="birthDate">생년월일</label>
            <input
              type="date"
              id="birthDate"
              v-model="birthDate"
              placeholder="YYYY-MM-DD"
              required
            />
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
          <!-- 메이커 전용 필드 -->
          <template v-if="userType === 'maker'">
            <!-- 생년월일 입력 -->
            <div class="input-group">
              <label for="birthDate">생년월일</label>
              <input
                type="text"
                id="birthDate"
                v-model="birthDate"
                placeholder="YYYYMMDD 형식으로 입력하세요"
                maxlength="8"
                required
              />
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
              <p v-if="idCardError" class="error-message">{{ idCardError }}</p>
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
              <p v-if="employmentCertError" class="error-message">
                {{ employmentCertError }}
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
                  :disabled="!businessNumber"
                >
                  {{ businessVerified ? "인증완료" : "인증하기" }}
                </button>
              </div>
              <p v-if="businessError" class="error-message">
                {{ businessError }}
              </p>
            </div>
          </template>

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
      // 공통 필드
      name: "", // 실명 추가
      nickname: "", // 일반 회원용 닉네임
      phone: "",
      password: "",
      confirmPassword: "",
      postcode: "",
      address: "",
      detailAddress: "",

      // 메이커 전용 필드
      birthDate: "", // 생년월일
      companyName: "", // 회사명
      businessNumber: "", // 사업자번호
      idCardFile: null,
      employmentCertFile: null,
      idCardVerified: false,
      employmentCertVerified: false,
      businessVerified: false,
      idCardError: "",
      employmentCertError: "",
      businessError: "",

      // 일반 회원 전용 필드
      gender: "",
      birthDate: "",
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
      idCardFile: null,
      employmentCertFile: null,
      idCardVerified: false,
      employmentCertVerified: false,
      businessVerified: false,
      idCardError: "",
      employmentCertError: "",
      businessError: "",
      verifiedCompanyName: "",
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

    async nextStep() {
      // 먼저 각 필드의 값을 로깅
      console.log("Current Form Data:", {
        email: this.email,
        name: this.name,
        phone: this.phone,
        password: this.password,
        confirmPassword: this.confirmPassword,
        postcode: this.postcode,
        address: this.address,
        detailAddress: this.detailAddress,
        birthDate: this.birthDate,
        companyName: this.companyName,
        businessNumber: this.businessNumber,
        idCardVerified: this.idCardVerified,
        employmentCertVerified: this.employmentCertVerified,
        businessVerified: this.businessVerified,
      });

      // 이메일 인증 검증
      if (!this.isEmailVerified) {
        this.emailVerificationError = "이메일 인증이 필요합니다.";
        return;
      }

      // 공통 필수 필드 검증
      const requiredFields = {
        이메일: this.email,
        이름: this.name,
        전화번호: this.phone,
        비밀번호: this.password,
        "비밀번호 확인": this.confirmPassword,
        우편번호: this.postcode,
        주소: this.address,
        상세주소: this.detailAddress,
      };

      if (this.userType === "maker") {
        // 메이커 전용 필수 필드
        Object.assign(requiredFields, {
          생년월일: this.birthDate,
          회사명: this.companyName,
          사업자등록번호: this.businessNumber,
        });
      }

      // 빈 필드 확인
      const emptyFields = Object.entries(requiredFields)
        .filter(([_, value]) => !value)
        .map(([key]) => key);

      if (emptyFields.length > 0) {
        this.showModal = true;
        this.modalMessage = `다음 필수 정보를 입력해주세요:\n${emptyFields.join(
          ", "
        )}`;
        console.log("Empty fields:", emptyFields); // 빈 필드 로깅
        return;
      }

      // 비밀번호 일치 확인
      if (this.password !== this.confirmPassword) {
        this.showModal = true;
        this.modalMessage = "비밀번호가 일치하지 않습니다.";
        return;
      }

      // 약관 동의 확인
      if (!this.agreeToTerms) {
        this.showModal = true;
        this.modalMessage = "개인정보 수집 및 이용에 동의해주세요.";
        return;
      }

      // 메이커 인증 확인
      if (this.userType === "maker") {
        console.log("Verification status:", {
          idCard: this.idCardVerified,
          employment: this.employmentCertVerified,
          business: this.businessVerified,
        });

        if (
          !this.idCardVerified ||
          !this.employmentCertVerified ||
          !this.businessVerified
        ) {
          this.showModal = true;
          this.modalMessage = "모든 인증을 완료해주세요.";
          return;
        }
      }

      // 검증 통과 시 다음 단계로
      if (this.userType === "user") {
        this.step = "additionalInfo";
      } else {
        await this.completeRegistration();
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
        "생활 가전": 1, // 기존 id=1 업데이트
        주방가전: 2, // 기존 id=2 업데이트
        "스마트 가전": 3, // 기존 id=3 업데이트
        DIY: 4, // 새로 추가
        엔터테인먼트: 5, // 새로 추가
        웨어러블: 6, // 새로 추가
        "주변 기기": 7,
      };

      // 선택된 카테고리에 해당하는 ID가 있는지 확인하고 유효한 ID만 반환
      return selectedCategories
        .map((category) => categoryMap[category])
        .filter((id) => id !== undefined);
    },

    // 회원가입 완료
    async completeRegistration() {
      try {
        if (this.userType === "maker") {
          // 메이커 회원가입
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
          // 일반 회원가입
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
            birth: formattedBirth, // YYYY-MM-DD 형식으로 변환
            categoryIds: this.mapCategoriesToIds(this.interest),
            loginMethod: false,
            notification: true,
          };

          console.log("Sending user data:", userData); // 데이터 확인용 로그
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

    // 로그인 페이지로 이동
    goToLogin() {
      this.$router.push("/auth/login");
    },

    async handleIdCardUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await authApi.verifyIdCard(formData);
        console.log("ID Card verification response:", response); // 로그 추가

        if (response.data.success) {
          this.idCardVerified = true;
          this.idCardFile = file;
          this.idCardError = "";
        } else {
          this.idCardVerified = false; // 명시적으로 false 설정
          this.idCardError =
            response.data.errorMessage || "주민등록증 인증에 실패했습니다.";
        }
      } catch (error) {
        console.error("주민등록증 인증 오류:", error);
        this.idCardVerified = false; // 에러 시에도 false로 설정
        this.idCardError = "주민등록증 인증 처리 중 오류가 발생했습니다.";
      }
      console.log("ID Card verification status:", this.idCardVerified); // 상태 확인
    },

    async handleEmploymentCertUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await authApi.verifyEmploymentCert(formData);
        console.log("Employment cert verification response:", response);

        if (response.data.success) {
          this.employmentCertVerified = true;
          this.employmentCertFile = file;
          this.employmentCertError = "";
          this.companyName = response.data.companyName;
          this.businessNumber = response.data.businessNumber;

          // 사업자번호가 있으면 자동으로 검증 실행
          if (this.businessNumber) {
            console.log(
              "Automatically verifying business number:",
              this.businessNumber
            );
            await this.verifyBusinessNumber(); // 사업자번호 자동 검증
          }
        } else {
          this.employmentCertVerified = false;
          this.employmentCertError =
            response.data.errorMessage || "재직증명서 인증에 실패했습니다.";
        }
      } catch (error) {
        console.error("재직증명서 인증 오류:", error);
        this.employmentCertVerified = false;
        this.employmentCertError =
          "재직증명서 인증 처리 중 오류가 발생했습니다.";
      }
      console.log(
        "Employment cert verification status:",
        this.employmentCertVerified
      );
    },

    async verifyBusinessNumber() {
      if (!this.businessNumber) {
        this.businessError = "사업자등록번호를 입력해주세요.";
        return;
      }

      try {
        console.log("Verifying business number:", this.businessNumber);
        const response = await authApi.verifyBusinessNumber(
          this.businessNumber
        );
        console.log("Business verification response:", response);

        if (response.data.success) {
          this.businessVerified = true; // 성공 시 true로 설정
          this.businessError = "";
          console.log("Business verification successful");
        } else {
          this.businessVerified = false;
          this.businessError =
            response.data.errorMessage || "유효하지 않은 사업자등록번호입니다.";
        }
      } catch (error) {
        console.error("사업자번호 인증 오류:", error);
        this.businessVerified = false;
        this.businessError = "사업자번호 인증 처리 중 오류가 발생했습니다.";
      }

      console.log("Business verification status:", this.businessVerified);
    },

    async verifyBusinessNumber() {
      if (!this.businessNumber) {
        this.businessError = "사업자등록번호를 입력해주세요.";
        return;
      }

      try {
        const response = await authApi.verifyBusinessNumber(
          this.businessNumber
        );
        console.log("Business verification response:", response); // 로그 추가

        if (response.data.success) {
          this.businessVerified = true;
          this.businessError = "";
          // 회사명 일치 여부 확인
          if (
            this.verifiedCompanyName &&
            this.verifiedCompanyName !== response.data.companyName
          ) {
            this.businessVerified = false;
            this.businessError = "재직증명서의 회사명과 일치하지 않습니다.";
          }
        } else {
          this.businessVerified = false; // 명시적으로 false 설정
          this.businessError =
            response.data.errorMessage || "유효하지 않은 사업자등록번호입니다.";
        }
      } catch (error) {
        console.error("사업자번호 인증 오류:", error);
        this.businessVerified = false; // 에러 시에도 false로 설정
        this.businessError = "사업자번호 인증 처리 중 오류가 발생했습니다.";
      }
      console.log("Business verification status:", this.businessVerified); // 상태 확인
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

.business-verification {
  display: flex;
  gap: 0.5rem;
}

.business-verification input {
  flex: 1;
}

.verify-button.verified {
  background-color: #28a745;
  cursor: not-allowed;
}

/* 파일 업로드 input 스타일링 */
input[type="file"] {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 100%;
}

input[type="file"]::-webkit-file-upload-button {
  background: var(--primary-color);
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 1rem;
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

.business-verification {
  display: flex;
  gap: 0.5rem;
}

.business-verification input {
  flex: 1;
}

.verify-button.verified {
  background-color: #28a745;
  cursor: not-allowed;
}
</style>
