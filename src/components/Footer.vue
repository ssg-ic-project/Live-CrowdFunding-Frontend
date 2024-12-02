<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-section">
        <h3 class="footer-title">CROFLE</h3>
        <p class="footer-description">크로플은 신제품 라이브 리뷰 전문 플랫폼입니다.</p>
        <div class="social-links">
          <a href="#" class="social-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="social-icon">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
            </svg>
          </a>
          <a href="#" class="social-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="social-icon">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>
          <a href="#" class="social-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="social-icon">
              <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
            </svg>
          </a>
        </div>
      </div>

      <div class="footer-section">
        <h4 class="footer-subtitle">Quick Links</h4>
        <nav class="footer-nav">
          <router-link to="/about" class="footer-link">회사소개</router-link>
          <router-link to="/contact" class="footer-link">제휴문의</router-link>
          <router-link to="/career" class="footer-link">채용정보</router-link>
        </nav>
      </div>

      <div class="footer-section">
        <h4 class="footer-subtitle">Support</h4>
        <nav class="footer-nav">
          <router-link to="/faq" class="footer-link">자주 묻는 질문</router-link>
          <router-link to="/terms" class="footer-link">이용약관</router-link>
          <router-link to="/privacy" class="footer-link">개인정보처리방침</router-link>
        </nav>
      </div>

      <div class="footer-section">
        <h4 class="footer-subtitle">Contact Us</h4>
        <address class="contact-info">
          <p>서울특별시 강남구 테헤란로</p>
          <p>Email: contact@crofle.com</p>
          <p>Tel: 02-1234-5678</p>
        </address>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; 2024 CROFLE. All rights reserved.</p>
    </div>
  </footer>
</template>

<script>
export default {
  name: "Footer",
};
</script>

<style scoped>
.footer {
  width: 100%;
  background-color: #FFF7B4;  /* 밝은 배경 */
  color: #333333;  /* 어두운 텍스트 */
  padding: 3rem 0 1rem;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  box-sizing: border-box;
  flex-wrap: wrap;
  gap: 2rem;
}

.footer-section {
  flex: 1;
  min-width: 200px;
}

.footer-title {
  color: #FF5151;  /* 제목에 포인트 컬러 */
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-weight: bold;
}


.footer-subtitle {
  color: #FF5151;  /* 서브 제목도 포인트 컬러 */
  font-size: 1.1rem;
  margin-bottom: 1rem;
}
.footer-description {
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-link {
  color: #FF5151;  /* 소셜 링크도 포인트 컬러 */
  transition: color 0.3s ease;
}

.social-link:hover {
  color: #FFD74E;  /* 호버 시 따뜻한 노란색 */
}

.footer-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}


.footer-link {
  color: #333333;  /* 기본 링크는 어두운 색상 */
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: #FF5151;  /* 호버 시 포인트 컬러 */
}

.contact-info {
  font-style: normal;
  line-height: 1.6;
}

.footer-bottom {
  margin-top: 3rem;
  padding-top: 1rem;
  text-align: center;
  border-top: 1px solid rgba(255, 81, 81, 0.2);  /* 구분선 색상 변경 */
  color: #666666;  /* 저작권 텍스트는 좀 더 연한 색상 */
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    gap: 2rem;
  }

  .footer-section {
    text-align: center;
  }

  .social-links {
    justify-content: center;
  }

  .contact-info {
    text-align: center;
  }
}
</style>