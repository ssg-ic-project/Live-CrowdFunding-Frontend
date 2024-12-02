// src/api/authApi.js
import api from "./axios";

export const authApi = {
  // 이메일 로그인
  login(data) {
    return api.post(
      "/api/account/login",
      {
        email: data.email,
        password: data.password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  },
  // 로그아웃
  logout() {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      return Promise.resolve(); // 토큰이 없으면 즉시 성공 처리
    }
    return api.post(
      "/api/account/logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  // 토큰 갱신
  refresh({ accessToken, refreshToken }) {
    return api.post("/api/account/refresh", null, {
      headers: {
        Authorization: refreshToken,
        AccessToken: accessToken,
      },
    });
  },

  // // 비밀번호 재설정 이메일 전송
  // sendResetPasswordEmail(data) {
  //   return api.post("/api/account/reset-password/email", data);
  // },

  // // 비밀번호 재설정 토큰 검증
  // validateResetToken(token) {
  //   return api.get(`/api/account/reset-password/validate?token=${token}`);
  // },

  // // 비밀번호 재설정
  // resetPassword(data) {
  //   return api.post("/api/account/reset-password/confirm", data);
  // },

  // 네이버 로그인 URL 받기
  getNaverLoginUrl() {
    return api.get("/api/account/oauth/naver");
  },

  // 네이버 로그인 콜백
  naverCallback(code, state) {
    return api.get(`/api/account/oauth/naver/callback?code=${code}&state=${state}`, {
      headers: {
        'Accept': 'application/json'
      }
    });
  },

  // 이메일 찾기
  findEmail(data) {
    return api.post("/api/account/find-email", null, {
      params: {
        name: data.name,
        phone: data.phone,
      },
    });
  },

  // 비밀번호 재설정 이메일 발송(중복)
  sendResetPasswordEmail(data) {
    return api.post("/api/account/reset-password/email", data);
  },

  // 비밀번호 재설정 토큰 검증
  validateResetToken(token) {
    return api.get("/api/account/reset-password/validate", {
      params: { token },
    });
  },

  // 비밀번호 재설정
  resetPassword(data) {
    return api.post("/api/account/reset-password/confirm", {
      token: data.token,
      email: data.email,
      newPassword: data.newPassword,
    });
  },
  // 이메일 중복 체크
  checkEmail(email) {
    return api.get(`/api/account/check-email`, {
      params: { email },
    });
  },

  // 인증 코드 발송
  sendVerificationCode(email) {
    return api.post("/api/account/send-verification", null, {
      params: { email },
    });
  },

  // 인증 코드 확인
  verifyCode(email, code) {
    return api.post("/api/account/verify-code", null, {
      params: { email, code },
    });
  },
  // 일반 회원 가입
  registerUser(userData) {
    return api.post("/api/account/signup/user", userData);
  },

  // 메이커 회원 가입
  registerMaker(makerData) {
    return api.post("/api/account/signup/maker", makerData);
  },
  verifyIdCard(formData) {
    return api.post("/api/account/signup/maker/verify/id-card", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // 재직증명서 OCR 검증
  verifyEmploymentCert(formData) {
    return api.post("/api/account/signup/maker/verify/employment", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // 사업자등록번호 검증
  verifyBusinessNumber(businessNumber) {
    return api.get("/api/account/signup/maker/verify/business", {
      params: { businessNumber },
    });
  },

  // 메이커 회원가입 메서드 수정 (multipart/form-data 지원)
  registerMaker(makerData) {
    return api.post("/api/account/signup/maker", makerData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};
