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
      <!-- 기본 정보 섹션 -->
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
              :key="category.id"
              :value="category.id"
            >
              {{ category.name }}
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
      
  <!-- 필수 등록 서류 섹션 -->
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
        @change="(e) => handleDocumentUpload('agreement', e)"
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
        @change="(e) => handleDocumentUpload('additional', e)"
        accept=".pdf,.doc,.docx"
      />
      <small v-if="uploadedDocuments.additional">
        {{ uploadedDocuments.additional.name }}
      </small>
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
            <div class="payment-section">
              <h3>서비스 이용 기본료 결제</h3>
              <div class="payment-container">
                <div id="payment-method"></div>
                <div id="agreement"></div>
              </div>
              <div class="payment-buttons">
                <button @click="handlePayment" class="payment-btn">
                  결제하기
                </button>
                <button @click="closeModal" class="cancel-btn">취소</button>
              </div>
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

    <div v-if="showPaymentCompleteModal" class="modal">
      <div class="modal-content">
        <div class="payment-complete">
          <div v-if="isProjectRegistering">
            <div class="loading-spinner"></div>
            <h3>프로젝트 등록 중입니다</h3>
            <p>잠시만 기다려주세요...</p>
          </div>
          <div v-else>
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
  </div>

  <!--  &lt;!&ndash; 토스페이먼츠 결제 위젯 &ndash;&gt;-->
  <!--  <div v-if="showPaymentTossWidgetModal">-->
  <!--    <h2>결제 수단</h2>-->
  <!--    <div id="payment-method"></div>-->
  <!--  </div>-->
</template>

<script>
import axios from "axios";
import { ANONYMOUS, loadPaymentWidget } from "@tosspayments/payment-widget-sdk";
// 파일 상단에 추가할 IndexedDB 관련 유틸리티 함수들
const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('ProjectImages', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('images')) {
        db.createObjectStore('images', { keyPath: 'id' });
      }
    };
  });
};

const saveImageToIndexedDB = async (imageFile, imageId) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async () => {
      try {
        const db = await initDB();
        const transaction = db.transaction(['images'], 'readwrite');
        const store = transaction.objectStore('images');
        
        const imageData = {
          id: imageId,
          data: reader.result,
          type: imageFile.type,
          name: imageFile.name
        };

        // Promise를 트랜잭션 내에서 처리
        const putRequest = store.put(imageData);
        
        transaction.oncomplete = () => {
          resolve(imageId);
        };
        
        transaction.onerror = () => {
          reject(transaction.error);
        };
        
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(imageFile);
  });
};

const getImageFromIndexedDB = async (imageId) => {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['images'], 'readonly');
    const store = transaction.objectStore('images');
    const request = store.get(imageId);
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

var _sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

export default {
  
  name: "ProjectRegistration",
  data() {
    return {
      isProjectRegistering: true,
      step: 1,
      selectedPlan: null,
      pricingPlans: [
        {
          id: "1",
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
          id: "2",
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
          id: "3",
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
        { id: 1, name: "생활 가전" },
        { id: 2, name: "주방 가전" },
        { id: 3, name: "스마트 가전" },
        { id: 4, name: "DIY" },
        { id: 5, name: "엔터테인먼트" },
        { id: 6, name: "웨어러블" },
        { id: 7, name: "주변 기기" },
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
      clientKey: "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm",
      initialPrice: 70000,
      paymentWidget: null,
      showPaymentTossWidgetModal: false,
    };
  },
  computed: {
    selectedPlanInfo() {
      return (
        this.pricingPlans.find((plan) => plan.id === this.selectedPlan) || {
          name: "-",
          price: 0,
        }
      );
    },
    formattedSelectedPrice() {
      return this.selectedPlanInfo.price
        ? new Intl.NumberFormat("ko-KR", {
            style: "currency",
            currency: "KRW",
          }).format(this.selectedPlanInfo.price)
        : "0원";
      return this.selectedPlanInfo.price
        ? new Intl.NumberFormat("ko-KR", {
            style: "currency",
            currency: "KRW",
          }).format(this.selectedPlanInfo.price)
        : "0원";
    },
  },

  // async mounted() {
  //   await this.initTossPayments()
  // },

  watch: {
    reviewSuccess: {
      async handler(newVal) {
        if (newVal) {
          await this.initTossPayments();
        }
      },
      immediate: false,
    },

    // URL query parameter 감시
    "$route.query.showSuccessModal": {
      immediate: true,
      handler(newVal) {
        if (newVal === "true") {
          this.showPaymentCompleteModal = true;
        }
      },
    },

    "$route.query.registerProject": {
      immediate: true,
      handler(newVal) {
        if (newVal === "true") {
          this.registerProject();
        }
      },
    },
  },

  mounted() {
    console.log("Query params:", this.$route.query);
    if (this.$route.query.isRegistered === 'true') {
      this.showPaymentCompleteModal = true;
    }
  },

  beforeRouteUpdate(to, from, next) {
  if (to.query.isRegistered === 'true') {
      this.showPaymentCompleteModal = true;}
      next();
  },

  
  methods: {
    validateForm() {
      if (
        !this.project.name ||
        !this.project.category ||
        !this.project.description ||
        !this.project.price ||
        !this.project.targetAmount ||
        !this.thumbnailFile
      ) {
        alert("모든 필수 항목을 입력해주세요.");
        return false;
      }

      // 필수 문서 검증
      const requiredDocs = ['projectPlan', 'developmentPlan', 'agreement'];
      for (const docType of requiredDocs) {
        if (!this.uploadedDocuments[docType]) {
          alert(`${docType === 'projectPlan' ? '상품 기획서' : 
                docType === 'developmentPlan' ? '펀딩 기획서' : 
                '개인정보 이용동의서'}를 업로드해주세요.`);
          return false;
        }
      }

      // 이미지 파일 검증
      if (!this.contentImageFile) {
        alert("내용 이미지를 업로드해주세요.");
        return false;
      }

      return true;
    },
    async handlePayment() {
      try {
        //project 데이터 저장
        const projectData = {
          makerId: localStorage.getItem("userId"), // 실제 로그인된 사용자 ID
          selectedPlan: this.selectedPlan,
          category: this.project.category,
          orderName: this.project.name,
          summary: this.project.description,
          amount: this.project.price,
          discount: this.project.discount || 0,
          targetAmount: this.project.targetAmount,
        };

        const imageIds = {
          thumbnailId: 'thumbnailImage',
          contentImageId: 'contentImage',
          additionalImageIds: Array.from({ length: 5 }, (_, i) => `additionalImage${i}`)
        };

        // 프로젝트 데이터만 sessionStorage에 저장
        sessionStorage.setItem("projectData", JSON.stringify(projectData));
        sessionStorage.setItem("imageIds", JSON.stringify(imageIds));

        await this.confirmPayment();
      } catch (error) {
        console.error("결제 처리 중 오류 발생:", error);
      }
    },
    // File 객체를 Base64로 변환하는 유틸리티 함수
    async fileToBase64(file) {
      if (!file) return null;

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve({
            name: file.name,
            type: file.type,
            data: reader.result,
            lastModified: file.lastModified,
          });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    },

    formatPrice(price) {
      return new Intl.NumberFormat("ko-KR", {
        style: "currency",
        currency: "KRW",
      }).format(price);
    },
    selectPlan(planId) {
      this.selectedPlan = planId;
    },
    async handleImagesUpload(event) {
      const files = Array.from(event.target.files).slice(0, 5);
      try {
        // 각 이미지를 IndexedDB에 저장
        await Promise.all(files.map((file, index) => 
          saveImageToIndexedDB(file, `additionalImage${index}`)
        ));
        
        this.additionalFiles = files;
        this.imagePreviews = files.map(file => URL.createObjectURL(file));
      } catch (error) {
        console.error('추가 이미지 저장 실패:', error);
        alert('추가 이미지 저장 중 오류가 발생했습니다.');
      }
    },
    async handleContentImageUpload(event) {
      const file = event.target.files[0];
        if (file) {
          try {
            // IndexedDB에 원본 이미지 저장
            await saveImageToIndexedDB(file, 'contentImage');
            
            // 미리보기용 URL 생성
            this.contentImagePreview = URL.createObjectURL(file);
            this.contentImageFile = file;
            
          } catch (error) {
            console.error('이미지 저장 실패:', error);
            alert('이미지 저장 중 오류가 발생했습니다.');
          }
        }
      },
    
    async compressImage(file) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // 최대 너비/높이 설정
            const maxWidth = 1024;
            const maxHeight = 1024;
            let width = img.width;
            let height = img.height;
            
            if (width > height && width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            } else if (height > maxHeight) {
              width *= maxHeight / height; 
              height = maxHeight;
            }
            
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);

            const mimeType = file.type || 'image/jpeg';
            
            // 품질 조정 (0.6 = 60% 품질)
            canvas.toBlob((blob) => {
              resolve(new File([blob], file.name, {
                type: mimeType,
                lastModified: Date.now()
              }));
            }, mimeType, 0.6);
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      });
    },

    async startReview() {
      return new Promise((resolve) => {
        let progress = 0;
        this.currentMessageIndex = 0;

        const interval = setInterval(() => {
          progress += 1;
          this.reviewProgress = progress;

          // 20% 단위로 메시지 업데이트
          if (progress % 20 === 0 && this.currentMessageIndex < this.reviewMessages.length) {
            this.reviewMessage = this.reviewMessages[this.currentMessageIndex];
            this.currentMessageIndex++;
          }

          // 검토 완료
          if (progress >= 100) {
            clearInterval(interval);
            this.completeReview();
            resolve();
          }
        }, 50);
      });
    },

    handleDocumentUpload(type, event) {
      if (!event || !event.target || !event.target.files) {
        console.error("Invalid event object");
        return;
      }

      const file = event.target.files[0];
      if (!file) return;

      this.uploadedDocuments[type] = file;
      if (!file) return;

      this.uploadedDocuments[type] = file;
      console.log(`${type} 문서 저장됨:`, file);

      if (type === "projectPlan" || type === "developmentPlan") {
        if (file.type === "text/plain") {
          const reader = new FileReader();
          reader.onload = (e) => {
            try {
              let content = e.target.result;

              content = content.replace(/\r\n|\r|\n/g, "\n");
              content = content.replace(/[\u0000-\u0019]+/g, " ");
              content = content.replace(/\\/g, "\\\\");
              content = content.replace(/"/g, '\\"');

              const jsonResult = {
                [type === "projectPlan"
                  ? "projectDocument"
                  : "fundingDocument"]: content.trim(),
              };

              console.log(JSON.stringify(jsonResult));

              return jsonResult;
            } catch (error) {
              console.error("텍스트 파일 처리 중 오류:", error);
            }
          };
          reader.readAsText(file, "UTF-8");
        } else if (
          file.type ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
          file.type === "application/msword"
        ) {
          const reader = new FileReader();
          reader.onload = async (e) => {
            try {
              const arrayBuffer = e.target.result;
              const result = await window.mammoth.extractRawText({
                arrayBuffer,
              });

              if (result.value) {
                let content = result.value;

                content = content.replace(/\r\n|\r|\n/g, "\n");
                content = content.replace(/[\u0000-\u0019]+/g, " ");
                content = content.replace(/\\/g, "\\\\");
                content = content.replace(/"/g, '\\"');

                const jsonResult = {
                  [type === "projectPlan"
                    ? "projectDocument"
                    : "fundingDocument"]: content.trim(),
                };

                console.log(JSON.stringify(jsonResult));

                return jsonResult;
              }
            } catch (error) {
              console.error("Word 문서 처리 중 오류:", error);
            }
          };
          reader.readAsArrayBuffer(file);
        } else {
          console.log("지원하지 않는 파일 형식입니다:", file.type);
        }
      } else if (type === "agreement" || type === "additional") {
        console.log(
          `${type === "agreement" ? "개인정보 동의서" : "추가 서류"} 첨부됨:`,
          file.name
        );
      }
    },
    cancelRegistration() {
      if (
        confirm(
          "프로젝트 등록을 취소하시겠습니까?\n입력된 내용은 저장되지 않습니다."
        )
      ) {
        this.$router.push("/mypage/funding-status");
      }
    },
    

    // 파일 업로드 핸들러 수정
    async handleThumbnailUpload(event) {
      const file = event.target.files[0];
      if (file) {
        try {
          this.thumbnailFile = file; // 파일 먼저 저장
          this.thumbnailPreview = URL.createObjectURL(file); // 미리보기 URL 생성
          
          // IndexedDB 저장은 마지막에
          await saveImageToIndexedDB(file, 'thumbnailImage');
        } catch (error) {
          console.error('썸네일 저장 실패:', error);
          alert('썸네일 저장 중 오류가 발생했습니다.');
        }
      }
    },
    async submitProject() {
      if (!this.validateForm()) {
        return;
      }

      try {
        this.showReviewModal = true;
        await this.startReview();

        if (this.reviewSuccess) {
          await this.handlePayment();

          // IndexedDB에서 이미지 데이터 가져오기
          const [thumbnailImage, contentImage] = await Promise.all([
            getImageFromIndexedDB('thumbnailImage'),
            getImageFromIndexedDB('contentImage')
          ]);

          const additionalImages = await Promise.all(
            Array.from({ length: 5 }, (_, i) => 
              getImageFromIndexedDB(`additionalImage${i}`).catch(() => null)
            )
          ).then(images => images.filter(img => img !== null));

          // FormData 준비
          const formData = await this.prepareFormData(
            thumbnailImage,
            contentImage,
            additionalImages
          );

          // FormData 내용 확인
          console.log('전송할 FormData 내용:');
          for (let [key, value] of formData.entries()) {
            if (value instanceof File) {
              console.log(`${key}: File - ${value.name} (${value.size} bytes)`);
            } else if (value instanceof Blob) {
              console.log(`${key}: Blob - ${value.size} bytes`);
            } else {
              console.log(`${key}:`, value);
            }
          }

          // 결제 처리 전에 먼저 FormData가 제대로 구성되었는지 확인
          if (!formData.has('requestDTO') || !formData.has('images')) {
            throw new Error('필수 데이터가 누락되었습니다.');
          }

          // API 호출 (axios 대신 fetch 사용하여 테스트)
          const response = await fetch("/api/project", {
            method: 'POST',
            body: formData
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          // 성공 시 처리
          this.showPaymentCompleteModal = true;

        }
      } catch (error) {
        console.error('프로젝트 제출 중 오류 발생:', error);
        // 상세 에러 정보 출력
        if (error.response) {
          console.error('서버 응답:', error.response.data);
          console.error('상태 코드:', error.response.status);
        }
        alert('프로젝트 제출 중 오류가 발생했습니다.');
      }
    },

    async prepareFormData(thumbnailImage, contentImage, additionalImages) {
      const formData = new FormData();
      
      // requestDTO 추가
      const requestDTO = {
        makerId: localStorage.getItem("userId"),
        planId: parseInt(this.selectedPlan),
        categoryId: parseInt(this.project.category),
        productName: this.project.name,
        summary: this.project.description,
        price: parseInt(this.project.price),
        discountPercentage: parseInt(this.project.discount || 0),
        goalAmount: parseInt(this.project.targetAmount),
      };

      console.log('requestDTO 값:', requestDTO);

      formData.append(
        'requestDTO',
        new Blob([JSON.stringify(requestDTO)], { type: 'application/json' })
      );

      // 이미지 파일들 추가 (null 체크 추가)
      if (thumbnailImage && thumbnailImage.data) {
        const response = await fetch(thumbnailImage.data);
        const blob = await response.blob();
        formData.append('images', new File([blob], thumbnailImage.name, { 
          type: thumbnailImage.type 
        }));
      }

      if (additionalImages && additionalImages.length > 0) {
        for (const image of additionalImages) {
          if (image && image.data) {
            const response = await fetch(image.data);
            const blob = await response.blob();
            formData.append('images', new File([blob], image.name, { 
              type: image.type 
            }));
          }
        }
      }

      if (contentImage && contentImage.data) {
        const response = await fetch(contentImage.data);
        const blob = await response.blob();
        formData.append('contentImage', new File([blob], contentImage.name, { 
          type: contentImage.type 
        }));
      }

      // 문서 파일들 추가 (이미 File 객체이므로 직접 추가)
      Object.entries(this.uploadedDocuments)
        .filter(([_, doc]) => doc !== null)
        .forEach(([_, doc]) => {
          formData.append('documents', doc);
        });

      return formData;
    },
    
    completeReview() {
      this.reviewComplete = true;

      this.reviewSuccess = Math.random() > 0.3;

      if (!this.reviewSuccess) {
        const reasons = [
          "프로젝트 기획서의 내용이 부족합니다. 보완 후 다시 신청해주세요.",
        ];
        this.rejectReason = reasons[Math.floor(Math.random() * reasons.length)];
      }
    },
    // selectedPlanInfo() {
    //   return this.pricingPlans.find(plan => plan.id === this.selectedPlan) || {name: '', price: 0};
    // },
    async initTossPayments() {
      try {
        const paymentWidget = await loadPaymentWidget(
          this.clientKey,
          ANONYMOUS
        );

        await paymentWidget.renderPaymentMethods("#payment-method", {
          value: this.initialPrice,
          currency: "KRW",
          country: "KR",
        });

        await paymentWidget.renderAgreement("#agreement");

        this.paymentWidget = paymentWidget;
      } catch (error) {
        console.error("토스페이먼츠 초기화 실패:", error);
      }
    },

    async showPaymentModal() {
      console.log("탱큐 포 결제💸");

      this.showReviewModal = false;
      // this.showPaymentCompleteModal = true;
    },

    // //결제창 열기
    // await this.paymentWidget.requestPayment({
    //   orderId: this.generateOrderId(),
    //   orderName: "상품명",
    //   customerName: "고객명",
    //   amount: this.totalPayment,
    //   successUrl: `${window.location.origin}/success`,
    //   failUrl: `${window.location.origin}/fail`
    // });

    async confirmPayment() {
      console.log("탱큐 포 결제💸");
      const orderId = this.generateOrderId();
      await _sleep(100);

      if (this.paymentWidget) {
        try {
          const paymentConfig = {
            orderId: orderId, //토스에서 필요함
            orderName: this.project.name, //토스에서 필요함
            // selectedPlan:this.pricingPlans.id,
            amount: this.initialPrice,
            // category: this.project.category,
            // makerId: 1, //이 부분은 어떻게 가지고 와야하는거지? 로그인된 정보 활용하기
            // summary: this.project.description,
            // discount: this.project.discount,
            // targetAmount: this.project.targetAmount,
            // contentImage: this.imagePreviews,
            successUrl: `${window.location.origin}${
              this.$router.resolve({ name: "PaymentSuccessBF" }).href
            }`,
            failUrl: `${window.location.origin}${
              this.$router.resolve({ name: "PaymentFailBF" }).href
            }`,
          };

          // 결제 요청
          await this.paymentWidget.requestPayment(paymentConfig);

          // 결제 성공시 모달 표시
          // this.showPaymentCompleteModal = true;
        } catch (error) {
          console.error(error);
        }
      } else {
        alert("결제가 진행되지 않았습니다.");
      }
    },

    goToProjectList() {
      this.showPaymentCompleteModal = false;
      this.$nextTick(() => {
        this.$router.push("/mypage/funding-status");
      });
    },
    closeModal() {
      this.showReviewModal = false;
      this.reviewProgress = 0;
      this.reviewComplete = false;
      this.reviewMessage = "프로젝트를 검토중입니다...";
    },
    generateOrderId() {
      const timestamp = Date.now().toString();
      const random = Math.random().toString().slice(2, 8);
      return timestamp + random;
    },
  },
};
</script>
<style scoped>
.project-registration-page {
  padding: 2rem;
  max-width: 1600px; /* 최대 너비 증가 */
  margin: 0 auto;
}

.project-form {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
}

h2 {
  font-size: 1.8rem;
  color: #333333;
  margin-bottom: 2rem;
  font-weight: bold;
  text-align: center;
}

h3 {
  font-size: 1.4rem;
  color: #333333;
  margin-bottom: 1.5rem;
  font-weight: 600;
  text-align: center;
}

/* 요금제 섹션 스타일 */
.pricing-section {
  margin-bottom: 3rem;
  width: 100%;
}

.pricing-plans {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin: 2rem 0;
}

.pricing-card {
  border: 1px solid #dee2e6;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 500px;
  position: relative;
}

.pricing-card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  border-color: #6d63ff;
}

.pricing-card.selected {
  border: 2px solid #6d63ff;
  box-shadow: 0 0 0 2px rgba(109, 99, 255, 0.1);
}

.pricing-card h4 {
  font-size: 1.4rem;
  color: #333333;
  margin-bottom: 1rem;
  font-weight: 600;
}

.plan-price {
  font-size: 1.8rem;
  font-weight: bold;
  color: #6d63ff;
  margin: 1.5rem 0;
}

.plan-features {
  list-style: none;
  padding: 0;
  margin: 1.5rem 0;
  text-align: left;
  flex-grow: 1;
}

.plan-features li {
  margin: 0.8rem 0;
  color: #666666;
  padding-left: 1.5rem;
  position: relative;
}

.plan-features li::before {
  content: "✓";
  position: absolute;
  left: 0;
  color: #9e94f8;
  font-weight: bold;
}

.select-plan-btn {
  width: calc(100% - 4rem);
  padding: 0.8rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
  position: absolute;
  bottom: 2rem;
  left: 2rem;
  right: 2rem;
  background-color: #6d63ff;
  color: white;
}

.select-plan-btn.selected {
  background-color: #9e94f8;
}

.select-plan-btn:not(.selected) {
  background-color: #6d63ff;
}

.select-plan-btn:hover {
  filter: brightness(110%);
}

.next-step-btn {
  background-color: #6d63ff;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 1rem 3rem;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: block;
  margin: 3rem auto 0;
}

/* 폼 섹션 스타일 */
.form-section {
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  flex: 1;
  min-width: 400px;
}

/* 이미지 섹션은 전체 너비 사용 */
.form-section:last-of-type {
  flex-basis: 100%;
  width: 100%;
}

.input-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333333;
}

input,
select,
textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #6d63ff;
  box-shadow: 0 0 0 3px rgba(109, 99, 255, 0.1);
}

textarea {
  min-height: 150px;
  resize: vertical;
}

/* 이미지 업로드 영역 */
.image-upload-group {
  margin-bottom: 2rem;
}

.image-preview {
  width: 200px;
  height: 200px;
  object-fit: cover;
  margin-top: 1rem;
  border-radius: 8px;
  border: 1px solid #dee2e6;
}

.image-previews {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 1rem;
}

/* 문서 업로드 영역 */
.document-upload-group {
  margin-bottom: 1.5rem;
}

input[type="file"] {
  padding: 0.5rem;
  background-color: #ffffff;
  border: 2px dashed #dee2e6;
  cursor: pointer;
}

small {
  display: block;
  margin-top: 0.5rem;
  color: #666666;
}

/* 버튼 스타일 */
.form-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
  width: 100%;
}

.submit-btn,
.confirm-btn {
  background-color: #6d63ff;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.8rem 2.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 150px;
}

.cancel-btn,
.close-btn {
  background-color: #9e94f8;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.8rem 2.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 150px;
}

button:hover:not(:disabled) {
  filter: brightness(110%);
  transform: translateY(-1px);
}

button:disabled {
  background-color: #dee2e6;
  cursor: not-allowed;
}

/* 모달 스타일 */
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
  padding: 2.5rem;
  border-radius: 12px;
  width: 95%;
  max-width: 800px;
  text-align: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.progress-bar {
  width: 100%;
  height: 8px;
  background-color: #ffffff;
  border-radius: 4px;
  margin: 1.5rem 0;
  overflow: hidden;
}

.progress {
  height: 100%;
  background-color: #6d63ff;
  transition: width 0.3s ease;
}

/* 결제 완료 모달 */
.payment-complete {
  text-align: center;
  padding: 2rem;
}

.check-icon {
  width: 60px;
  height: 60px;
  background-color: #9e94f8;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin: 0 auto 1.5rem;
}

.success {
  color: #6d63ff;
  font-size: 1.4rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.failure {
  color: #dc3545;
  font-size: 1.4rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.reject-reason {
  color: #666666;
  margin-bottom: 1.5rem;
}

/* 결제 섹션 스타일 */
.payment-section {
  width: 100%;
  max-width: 450px;
  margin: 0 auto;
  padding: 1rem 0;
}

.payment-container {
  background: #ffffff;
  border-radius: 8px;
  padding: 1.5rem;
  margin: 1rem 0;
}

.payment-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  justify-content: center;
}

/* 결제 위젯 커스텀 스타일 */
:deep(#payment-method) {
  border: 1px solid #dee2e6;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

:deep(#agreement) {
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 0.5rem;
}

.payment-btn,
.cancel-btn {
  flex: 1;
  max-width: 200px;
  padding: 0.8rem 1.5rem;
}

/* 반응형 디자인 */
@media (max-width: 1200px) {
  .form-section {
    flex-basis: 100%;
  }
}

@media (max-width: 768px) {
  .pricing-plans {
    grid-template-columns: 1fr;
  }

  .pricing-card {
    min-height: auto;
    padding-bottom: 5rem;
  }

  .form-section {
    padding: 1.5rem;
    min-width: 100%;
  }

  .image-preview {
    width: 150px;
    height: 150px;
  }

  .form-buttons {
    flex-direction: column;
  }

  .submit-btn,
  .cancel-btn,
  .confirm-btn,
  .close-btn {
    width: 100%;
    min-width: auto;
  }

  .next-step-btn {
    width: 100%;
    padding: 0.8rem;
    font-size: 1rem;
  }
}
</style>
