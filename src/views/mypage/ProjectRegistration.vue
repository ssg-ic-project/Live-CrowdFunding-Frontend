<!-- src/views/mypage/ProjectRegistration.vue -->

<!-- Template 영역 -->
<template>
  <div class="project-registration-page">
    <h2>프로젝트 등록</h2>

    <!-- 요금제 선택 섹션 -->
    <div class="pricing-section" v-if="step === 1">
      <h3>요금제 선택</h3>
      <div class="pricing-plans">
        <div
          v-for="plan in pricingPlans"
          :key="plan.id"
          class="pricing-card"
          :class="{ selected: selectedPlan === plan.id }"
          @click="selectPlan(plan.id)"
        >
          <h4>{{ plan.name }}</h4>
          <div class="plan-price">{{ formatPrice(plan.price) }}</div>
          <ul class="plan-features">
            <li v-for="feature in plan.features" :key="feature">
              {{ feature }}
            </li>
          </ul>
          <button
            class="select-plan-btn"
            :class="{ selected: selectedPlan === plan.id }"
          >
            {{ selectedPlan === plan.id ? "선택됨" : "선택하기" }}
          </button>
        </div>
      </div>
      <button class="next-step-btn" :disabled="!selectedPlan" @click="step = 2">
        다음 단계
      </button>
    </div>

     <!-- 프로젝트 정보 입력 폼 -->
     <form
      v-if="step === 2"
      @submit.prevent="submitProject"
      class="project-form"
    >
      <div class="form-section">
        <h3>기본 정보</h3>
        <!-- 선택된 요금제 정보 표시 -->
        <div class="selected-plan-info">
          <div class="plan-name">
            <span class="label">선택한 요금제:</span>
            <span class="value">{{ selectedPlanInfo.name }}</span>
          </div>
          <div class="plan-price">
            <span class="label">요금제 가격:</span>
            <span class="value">{{ formattedSelectedPrice }}</span>
          </div>
        </div>

        <div class="input-group">
          <label for="name">프로젝트 이름</label>
          <input
            type="text"
            id="name"
            v-model="project.name"
            placeholder="프로젝트 이름을 입력하세요"
            required
          />
        </div>

        <div class="input-group">
          <label for="category">카테고리</label>
          <select id="category" v-model="project.category" required>
            <option value="">카테고리 선택</option>
            <option
              v-for="category in categories"
              :key="category"
              :value="category"
            >
              {{ category }}
            </option>
          </select>
        </div>

        <div class="input-group">
          <label for="description">상품 설명</label>
          <textarea
            id="description"
            v-model="project.description"
            placeholder="상품에 대한 상세한 설명을 입력하세요"
            required
          ></textarea>
        </div>

        <div class="input-group">
          <label for="price">판매가</label>
          <input
            type="number"
            id="price"
            v-model="project.price"
            min="0"
            placeholder="상품의 판매 가격을 입력하세요"
            required
          />
        </div>

        <div class="input-group">
          <label for="discount">할인율 (%)</label>
          <input
            type="number"
            id="discount"
            v-model="project.discount"
            min="0"
            max="100"
            placeholder="라이브 방송 시 적용할 할인율을 입력하세요"
          />
        </div>

        <div class="input-group">
          <label for="targetAmount">목표 금액</label>
          <input
            type="number"
            id="targetAmount"
            v-model="project.targetAmount"
            min="0"
            placeholder="펀딩 목표 금액을 입력하세요"
            required
          />
        </div>
      </div>

      <div class="form-section">
        <h3>이미지 등록</h3>
        <div class="image-upload-group">
          <label>썸네일 이미지</label>
          <input
            type="file"
            @change="handleThumbnailUpload"
            accept="image/*"
            required
          />
          <img
            v-if="thumbnailPreview"
            :src="thumbnailPreview"
            class="image-preview"
          />
        </div>

        <div class="image-upload-group">
          <label>추가 이미지 (최대 5개)</label>
          <input
            type="file"
            @change="handleImagesUpload"
            accept="image/*"
            multiple
          />
          <div class="image-previews">
            <img
              v-for="(preview, index) in imagePreviews"
              :key="index"
              :src="preview"
              class="image-preview"
            />
          </div>
        </div>

        <div class="image-upload-group">
          <label>내용 이미지</label>
          <input
            type="file"
            @change="handleContentImageUpload"
            accept="image/*"
            required
          />
          <img
            v-if="contentImagePreview"
            :src="contentImagePreview"
            class="image-preview"
          />
        </div>
      </div>
<!-- //여기 -->
<div class="form-section">
  <h3>필수 등록 서류</h3>
  
  <!-- 상품 기획서 -->
  <div class="document-upload-group">
    <label>상품 기획서</label>
    <input
      type="file"
      @change="(e) => handleDocumentUpload('projectPlan', e)"
      accept=".pdf,.doc,.docx"
      required
    />
    <small v-if="uploadedDocuments.projectPlan">
      {{ uploadedDocuments.projectPlan.name }}
    </small>
  </div>

  <!-- 펀딩 기획서 -->
  <div class="document-upload-group">
    <label>펀딩 기획서</label>
    <input
      type="file"
      @change="(e) => handleDocumentUpload('developmentPlan', e)"
      accept=".pdf,.doc,.docx"
      required
    />
    <small v-if="uploadedDocuments.developmentPlan">
      {{ uploadedDocuments.developmentPlan.name }}
    </small>
  </div>

  <!-- 개인정보 이용동의서 -->
  <div class="document-upload-group">
    <label>개인정보 이용동의서</label>
    <input
      type="file"
      accept=".pdf,.doc,.docx"
      required
    />
    <small v-if="uploadedDocuments.agreement">
      {{ uploadedDocuments.agreement.name }}
    </small>
  </div>

  <!-- 추가 서류 -->
  <div class="document-upload-group">
    <label>추가 서류</label>
    <input
      type="file"
      accept=".pdf,.doc,.docx"
    />
    <small v-if="uploadedDocuments.additional">
      {{ uploadedDocuments.additional.name }}
    </small>
  </div>
</div>
<!-- 여기 -->
      <div class="form-buttons">
        <button type="button" class="cancel-btn" @click="cancelRegistration">
          취소
        </button>
        <button type="submit" class="submit-btn">검토받기</button>
      </div>
    </form>

    <!-- 검토 진행 모달 -->
    <div v-if="showReviewModal" class="modal">
      <div class="modal-content">
        <h3>프로젝트 검토 중</h3>
        <div class="progress-bar">
          <div class="progress" :style="{ width: `${reviewProgress}%` }"></div>
        </div>
        <p>{{ reviewMessage }}</p>
        <div v-if="reviewComplete" class="review-result">
  <template v-if="reviewSuccess">
    <p class="success">승인되었습니다!</p>
    <div class="button-group">
      <button @click="showPaymentModal" class="payment-btn">
        결제하기
      </button>
      <button @click="closeModal" class="cancel-btn">
        취소
      </button>
    </div>
  </template>
  <template v-else>
    <p class="failure">반려되었습니다.</p>
    <p class="reject-reason">{{ rejectReason }}</p>
    <button @click="closeModal" class="close-btn">확인</button>
  </template>
</div>
      </div>
    </div>

    <!-- 결제 완료 모달 -->
    <div v-if="showPaymentCompleteModal" class="modal">
      <div class="modal-content">
        <div class="payment-complete">
          <div class="check-icon">✓</div>
          <h3>결제가 완료되었습니다!</h3>
          <p>프로젝트가 성공적으로 등록되었습니다.</p>
          <button @click="goToProjectList" class="confirm-btn">
            프로젝트 목록으로
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';


export default {
  name: "ProjectRegistration",
  data() {
    return {
      step: 1,
      selectedPlan: null,
      pricingPlans: [
        {
          id: "A",
          name: "베이직 플랜",
          price: 100000,
          features: [
            "기본 프로젝트 등록",
            "1회 라이브 방송",
            "기본 통계 제공",
            "채팅 기능 제공",
          ],
        },
        {
          id: "B",
          name: "스탠다드 플랜",
          price: 300000,
          features: [
            "프로젝트 우선 검토",
            "3회 라이브 방송",
            "상세 통계 제공",
            "채팅 & 알림톡 기능",
            "실시간 문의응대",
          ],
        },
        {
          id: "C",
          name: "프리미엄 플랜",
          price: 500000,
          features: [
            "VIP 프로젝트 등록",
            "무제한 라이브 방송",
            "프리미엄 통계 제공",
            "모든 서비스 제공",
            "전담 매니저 배정",
            "우선 기술지원",
          ],
        },
      ],
      project: {
        name: "",
        category: "",
        description: "",
        price: "",
        discount: 0,
        targetAmount: "",
      },
      categories: [
        "생활 가전",
        "주방 가전",
        "스마트 가전",
        "DIY",
        "엔터테인먼트",
        "웨어러블",
        "주변 기기",
      ],
      thumbnailPreview: null,
      imagePreviews: [],
      contentImagePreview: null,
      uploadedDocuments: {
        projectPlan: null,
        developmentPlan: null,
        agreement: null,
        additional: null,
      },
      showReviewModal: false,
      showPaymentCompleteModal: false,
      reviewProgress: 0,
      reviewMessage: "프로젝트를 검토중입니다...",
      reviewComplete: false,
      reviewSuccess: false,
      rejectReason: "",
      reviewMessages: [
        "기본 정보를 확인하고 있습니다...",
        "프로젝트 기획서를 검토중입니다...",
        "개발 기획서를 분석하고 있습니다...",
        "이미지 적합성을 검사중입니다...",
        "최종 검토를 진행중입니다...",
      ],
      currentMessageIndex: 0,
    };
  },
  computed: {
    selectedPlanInfo() {
      return this.pricingPlans.find(plan => plan.id === this.selectedPlan) || { name: '-', price: 0 };
    },
    formattedSelectedPrice() {
      return this.selectedPlanInfo.price ? 
        new Intl.NumberFormat('ko-KR', { 
          style: 'currency', 
          currency: 'KRW'
        }).format(this.selectedPlanInfo.price) : '0원';
    }
  },
  methods: {
    formatPrice(price) {
      return new Intl.NumberFormat('ko-KR', { 
        style: 'currency', 
        currency: 'KRW'
      }).format(price);
    },

    selectPlan(planId) {
      this.selectedPlan = planId;
    },

    handleThumbnailUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.thumbnailPreview = URL.createObjectURL(file);
      }
    },

    handleImagesUpload(event) {
      const files = Array.from(event.target.files).slice(0, 5);
      this.imagePreviews = files.map((file) => URL.createObjectURL(file));
    },

    handleContentImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.contentImagePreview = URL.createObjectURL(file);
      }
    },

    handleDocumentUpload(type, event) {
      if (!event?.target?.files?.[0]) return;
      this.uploadedDocuments[type] = event.target.files[0];
    },

    async processTextContent(content) {
      return content
        .replace(/\r\n|\r|\n/g, '\n')
        .replace(/[\u0000-\u0019]+/g, " ")
        .replace(/\\/g, "\\\\")
        .replace(/"/g, '\\"')
        .trim();
    },

    async extractDocumentText(file) {
      if (file.type === 'text/plain') {
        const text = await file.text();
        return this.processTextContent(text);
      }
      
      if (file.type.includes('word') || file.type.includes('docx')) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await window.mammoth.extractRawText({ arrayBuffer });
        return this.processTextContent(result.value);
      }
      
      throw new Error(`지원하지 않는 파일 형식입니다: ${file.type}`);
    },

    async processDocuments() {
      try {
        const projectText = await this.extractDocumentText(this.uploadedDocuments.projectPlan);
        const fundingText = await this.extractDocumentText(this.uploadedDocuments.developmentPlan);
        
        return {
          projectDocument: projectText,
          fundingDocument: fundingText
        };
      } catch (error) {
        console.error('문서 처리 오류:', error);
        return null;
      }
    },

    validateForm() {
      const requiredFields = [
        this.project.name,
        this.project.category,
        this.project.description,
        this.project.price,
        this.project.targetAmount,
        this.thumbnailPreview,
        this.uploadedDocuments.projectPlan,
        this.uploadedDocuments.developmentPlan
      ];

      if (requiredFields.some(field => !field)) {
        alert("모든 필수 항목을 입력해주세요.");
        return false;
      }
      return true;
    },

    async simulateReviewProcess() {
      let progress = 0;
      this.currentMessageIndex = 0;

      return new Promise(resolve => {
        const interval = setInterval(() => {
          progress += 2;
          this.reviewProgress = progress;

          if (progress % 20 === 0 && this.currentMessageIndex < this.reviewMessages.length) {
            this.reviewMessage = this.reviewMessages[this.currentMessageIndex];
            this.currentMessageIndex++;
          }

          if (progress >= 100) {
            clearInterval(interval);
            resolve();
          }
        }, 50);
      });
    },

    async submitProject() {
      if (!this.validateForm()) return;

      try {
        const documents = await this.processDocuments();
        if (!documents) {
          throw new Error('문서 처리 중 오류가 발생했습니다.');
        }

        this.showReviewModal = true;
        await this.simulateReviewProcess();

        const response = await axios.post('/api/proposals/analyze', documents);
        const { proposalScore, rejectionReason } = response.data;

        this.reviewComplete = true;
        this.reviewSuccess = proposalScore >= 80;
        
        if (!this.reviewSuccess) {
          this.rejectReason = rejectionReason;
        }
      } catch (error) {
        console.error('프로젝트 제출 오류:', error);
        alert('프로젝트 제출 중 오류가 발생했습니다.');
        this.closeModal();
      }
    },

    cancelRegistration() {
      if (confirm("프로젝트 등록을 취소하시겠습니까?\n입력된 내용은 저장되지 않습니다.")) {
        this.$router.push("/mypage/funding-status");
      }
    },

    showPaymentModal() {
      this.showReviewModal = false;
      this.showPaymentCompleteModal = true;
    },

    goToProjectList() {
      this.showPaymentCompleteModal = false;
      this.$router.push("/mypage/funding-status");
    },

    closeModal() {
      this.showReviewModal = false;
      this.reviewProgress = 0;
      this.reviewComplete = false;
      this.reviewMessage = "프로젝트를 검토중입니다...";
    }
  }
}
</script>

<style scoped>
.project-registration-page {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

h2 {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
}

h3 {
  font-size: 1.4rem;
  color: #333;
  margin-bottom: 1.5rem;
}

.pricing-section {
  margin-bottom: 3rem;
}

.pricing-plans {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin: 2rem 0;
}

.pricing-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
}

.pricing-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.pricing-card.selected {
  border: 2px solid #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.2);
}

.selected-plan-info {
  background-color: #f8f9fa;
  padding: 1rem;
  margin-bottom: 1.5rem;
  border-radius: 4px;
  border: 1px solid #e9ecef;
}

.selected-plan-info .plan-name,
.selected-plan-info .plan-price {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.selected-plan-info .label {
  color: #6c757d;
  font-weight: 500;
}

.selected-plan-info .value {
  color: #212529;
  font-weight: 600;
}

.selected-plan-info .plan-price {
  margin-bottom: 0;
}

.pricing-card h4 {
  font-size: 1.4rem;
  color: #333;
  margin-bottom: 1rem;
}

.button-group {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1rem;
}

.button-group .payment-btn,
.button-group .cancel-btn {
  flex: 1;
  max-width: 150px;
}
.plan-price {
  font-size: 1.8rem;
  font-weight: bold;
  color: #007bff;
  margin: 1.5rem 0;
}

.plan-features {
  list-style: none;
  padding: 0;
  margin: 1.5rem 0;
  text-align: left;
}

.plan-features li {
  margin: 0.8rem 0;
  color: #666;
  padding-left: 1.5rem;
  position: relative;
}

.plan-features li::before {
  content: "✓";
  position: absolute;
  left: 0;
  color: #28a745;
}

.select-plan-btn {
  width: 100%;
  padding: 0.8rem;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.select-plan-btn:hover {
  background-color: #0056b3;
}

.next-step-btn {
  display: block;
  margin: 2rem auto 0;
  padding: 1rem 2rem;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.next-step-btn:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.form-section {
  background: white;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.input-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}

input,
select,
textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #007bff;
}

textarea {
  height: 150px;
  resize: vertical;
}

.image-upload-group {
  margin-bottom: 2rem;
}

.image-preview {
  width: 200px;
  height: 200px;
  object-fit: cover;
  margin-top: 1rem;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.image-previews {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  overflow-x: auto;
  padding-bottom: 1rem;
}

.document-upload-group {
  margin-bottom: 1.5rem;
}

input[type="file"] {
  padding: 0.5rem;
  border: 1px dashed #ddd;
  background-color: #f8f9fa;
}

.form-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 3rem;
}

.cancel-btn,
.submit-btn {
  padding: 0.75rem 2.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s;
}

.cancel-btn {
  background-color: #6c757d;
  color: white;
}

.submit-btn {
  background-color: #007bff;
  color: white;
}

.cancel-btn:hover {
  background-color: #5a6268;
}

.submit-btn:hover {
  background-color: #0056b3;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.progress-bar {
  width: 100%;
  height: 10px;
  background-color: #e9ecef;
  border-radius: 5px;
  margin: 1.5rem 0;
  overflow: hidden;
}

.progress {
  height: 100%;
  background-color: #007bff;
  transition: width 0.3s ease;
}

.review-result {
  margin-top: 1.5rem;
}

.success {
  color: #28a745;
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.failure {
  color: #dc3545;
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.reject-reason {
  color: #666;
  margin-bottom: 1.5rem;
}

.payment-btn,
.close-btn {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.payment-btn {
  background-color: #28a745;
  color: white;
}

.close-btn {
  background-color: #6c757d;
  color: white;
}

.payment-btn:hover {
  background-color: #218838;
}

.close-btn:hover {
  background-color: #5a6268;
}

@media (max-width: 768px) {
  .pricing-plans {
    grid-template-columns: 1fr;
  }

  .form-buttons {
    flex-direction: column;
  }

  .cancel-btn,
  .submit-btn {
    width: 100%;
  }

  .image-preview {
    width: 150px;
    height: 150px;
  }
}

@media (max-width: 480px) {
  .project-registration-page {
    padding: 1rem;
  }

  .form-section {
    padding: 1rem;
  }

  h2 {
    font-size: 1.5rem;
  }

  h3 {
    font-size: 1.2rem;
  }
}

.payment-complete {
  text-align: center;
  padding: 1rem;
}

.check-icon {
  width: 60px;
  height: 60px;
  background-color: #28a745;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin: 0 auto 1.5rem;
}

.payment-complete h3 {
  color: #28a745;
  margin-bottom: 1rem;
}

.payment-complete p {
  color: #666;
  margin-bottom: 1.5rem;
}

.confirm-btn {
  padding: 0.75rem 2rem;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.confirm-btn:hover {
  background-color: #218838;
}
</style>
