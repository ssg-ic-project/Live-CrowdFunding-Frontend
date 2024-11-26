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
  
  <!--            &lt;!&ndash; 토스페이먼츠 결제 위젯 &ndash;&gt;-->
  <!--            <div v-if="showPaymentTossWidgetModal">-->
  <!--              <h2>결제 수단</h2>-->
  <!--              <div id="payment-method"></div>-->
  <!--            </div>-->
  
          </div>
          <p>{{ reviewMessage }}</p>
          <div v-if="reviewComplete" class="review-result">
    <template v-if="reviewSuccess">
      <p class="success">승인되었습니다!</p>
      <div class="button-group">
        <button @click="handlePayment" class="payment-btn">
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
            <!-- 토스페이먼츠 결제 위젯 -->
  
            <h3>결제가 완료되었습니다!</h3>
            <p>프로젝트가 성공적으로 등록되었습니다.</p>
            <button @click="goToProjectList" class="confirm-btn">
              프로젝트 목록으로
            </button>
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
import {ANONYMOUS, loadPaymentWidget} from "@tosspayments/payment-widget-sdk";

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
      clientKey: 'test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm',
      initialPrice: 70000,
      paymentWidget: null,
      showPaymentTossWidgetModal: false,
    };
  },
  computed: {
    selectedPlanInfo() {
      return this.pricingPlans.find(plan => plan.id === this.selectedPlan) || {name: '-', price: 0};
    },
    formattedSelectedPrice() {
      return this.selectedPlanInfo.price ?
          new Intl.NumberFormat('ko-KR', {
            style: 'currency',
            currency: 'KRW'
          }).format(this.selectedPlanInfo.price) : '0원';
    }
  },

  async mounted() {
    await this.initTossPayments()
  },


  methods: {

    async handlePayment() {
      this.showPaymentTossWidgetModal = true;
      try {
        await this.initTossPayments();

        await this.showPaymentModal();

        await this.confirmPayment();

      } catch (error) {
        console.error('결제 처리 중 오류 발생:', error);
      }

    },

    sout() {
      console.log('checking Yejin')
    },

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
      if (!event || !event.target || !event.target.files) {
        console.error('Invalid event object');
        return;
      }

      const file = event.target.files[0];
      if (!file) return;

      this.uploadedDocuments[type] = file;

      if (type === 'projectPlan' || type === 'developmentPlan') {
        if (file.type === 'text/plain') {
          const reader = new FileReader();
          reader.onload = (e) => {
            try {
              let content = e.target.result;

              content = content.replace(/\r\n|\r|\n/g, '\n');
              content = content.replace(/[\u0000-\u0019]+/g, " ");
              content = content.replace(/\\/g, "\\\\");
              content = content.replace(/"/g, '\\"');

              const jsonResult = {
                [type === 'projectPlan' ? 'projectDocument' : 'fundingDocument']: content.trim()
              };

              console.log(JSON.stringify(jsonResult));

              return jsonResult;
            } catch (error) {
              console.error('텍스트 파일 처리 중 오류:', error);
            }
          };
          reader.readAsText(file, 'UTF-8');
        } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            || file.type === 'application/msword') {
          const reader = new FileReader();
          reader.onload = async (e) => {
            try {
              const arrayBuffer = e.target.result;
              const result = await window.mammoth.extractRawText({arrayBuffer});

              if (result.value) {
                let content = result.value;

                content = content.replace(/\r\n|\r|\n/g, '\n');
                content = content.replace(/[\u0000-\u0019]+/g, " ");
                content = content.replace(/\\/g, "\\\\");
                content = content.replace(/"/g, '\\"');

                const jsonResult = {
                  [type === 'projectPlan' ? 'projectDocument' : 'fundingDocument']: content.trim()
                };

                console.log(JSON.stringify(jsonResult));

                return jsonResult;
              }
            } catch (error) {
              console.error('Word 문서 처리 중 오류:', error);
            }
          };
          reader.readAsArrayBuffer(file);
        } else {
          console.log('지원하지 않는 파일 형식입니다:', file.type);
        }
      } else if (type === 'agreement' || type === 'additional') {
        console.log(`${type === 'agreement' ? '개인정보 동의서' : '추가 서류'} 첨부됨:`, file.name);
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
    submitProject() {
      if (!this.validateForm()) {
        return;
      }
      this.showReviewModal = true;
      this.startReview();
    },
    validateForm() {
      if (
          !this.project.name ||
          !this.project.category ||
          !this.project.description ||
          !this.project.price ||
          !this.project.targetAmount ||
          !this.thumbnailPreview
      ) {
        alert("모든 필수 항목을 입력해주세요.");
        return false;
      }
      return true;
    },
    startReview() {
      let progress = 0;
      this.currentMessageIndex = 0;

      const interval = setInterval(() => {
        progress += 1;
        this.reviewProgress = progress;

        if (
            progress % 20 === 0 &&
            this.currentMessageIndex < this.reviewMessages.length
        ) {
          this.reviewMessage = this.reviewMessages[this.currentMessageIndex];
          this.currentMessageIndex++;
        }

        if (progress >= 100) {
          clearInterval(interval);
          this.completeReview();
        }
      }, 50);
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
    selectedPlanInfo() {
      return this.pricingPlans.find(plan => plan.id === this.selectedPlan) || {name: '', price: 0};
    },
    async initTossPayments() {
      try {

        const paymentWidget = await loadPaymentWidget(this.clientKey, ANONYMOUS)

        await paymentWidget.renderPaymentMethods('#payment-method', {
          value: this.initialPrice,
          currency: 'KRW',
          country: 'KR'
        })

        await paymentWidget.renderAgreement('#agreement')

        this.paymentWidget = paymentWidget
      } catch (error) {
        console.error('토스페이먼츠 초기화 실패:', error)
      }
    },


    async showPaymentModal() {

      console.log("탱큐 포 결제💸")


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
    console.log("탱큐 포 결제💸")
    if(this.paymentWidget){
      try{
        const paymentConfig = {

        };

        //결제 요청
        await this.paymentWidget.requestPayment(paymentConfig);

        this.showPaymentCompleteModal = true;


      }catch(error){
        console.error(error);
      }
    }else{
      alert('결제가 진행되지 않았습니다.');
    }
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
  },
  },

};
</script>