<template>
  <div class="payment-success">
    <h2>결제 처리 중...</h2>
    <div v-if="isLoading">처리중...</div>
    <div v-if="error">
      <p>에러 발생: {{ error }}</p>
      <pre>{{ errorDetail }}</pre>
    </div>
    <div v-if="success">
      <h2>결제 성공</h2>
      <p>주문번호: {{ orderId }}</p>
      <p>결제 금액: {{ amount }}</p>
    </div>
  </div>
</template>

<script>
import {paymentApi} from "@/api/index.js";
import axios from "axios";

export default{
  name: 'PaymentSuccessBF',
  data() {
    return {
      orderId: '',
      orderName: '',
      paymentKey: '',
      // selectedPlan: '',
      amount: '',
      // category: '',
      // makerId: '',
      // summary: '',
      // discount: '',
      // targetAmount: '',
      // contentImage: [],
      isLoading: false,
      error: null,
      errorDetail: null,
      success: false
    }
  },
  methods: {
    async confirmPayment() {
      this.isLoading = true;
      try {
        // 결제 승인 처리
        const requestData = {
          orderId: this.orderId,
          orderName: this.orderName,
          amount: this.amount,
          paymentKey: this.paymentKey,
        };
        await paymentApi.basicFee(requestData);

        // 저장된 데이터 복원
        const projectData = JSON.parse(sessionStorage.getItem('projectData'));
        const fileData = JSON.parse(sessionStorage.getItem('fileData'));

        if (!projectData || !fileData) {
          throw new Error('프로젝트 데이터를 찾을 수 없습니다.');
        }

        // FormData 생성
        const formData = new FormData();

        // requestDTO 추가
        const requestDTO = {
          makerId: projectData.makerId,
          planId: parseInt(projectData.selectedPlan),
          categoryId: parseInt(projectData.category),
          productName: projectData.orderName,
          summary: projectData.summary,
          price: parseInt(projectData.amount),
          discountPercentage: parseInt(projectData.discount || 0),
          goalAmount: parseInt(projectData.targetAmount)
        };

        formData.append('requestDTO', new Blob([JSON.stringify(requestDTO)], {
          type: 'application/json'
        }));

        // Base64 데이터를 파일로 변환하여 추가
        if (fileData.thumbnailFile) {
          formData.append('images', this.base64ToFile(fileData.thumbnailFile));
        }

        fileData.additionalFiles.forEach(fileInfo => {
          if (fileInfo) {
            formData.append('images', this.base64ToFile(fileInfo));
          }
        });

        if (fileData.contentImageFile) {
          formData.append('contentImage', this.base64ToFile(fileData.contentImageFile));
        }

        // 문서 파일들 추가
        Object.entries(fileData.documents).forEach(([key, fileInfo]) => {
          if (fileInfo) {
            formData.append('documents', this.base64ToFile(fileInfo));
          }
        });

        // 프로젝트 등록 API 호출
        await api.post("/api/project", formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        // 데이터 정리
        sessionStorage.removeItem('projectData');
        sessionStorage.removeItem('fileData');
        
        this.success = true;
        this.$router.push({
          name: 'ProjectRegistration',
          query: { showSuccessModal: 'true' }
        });

      } catch (error) {
        console.error('에러 발생:', error);
        this.error = error.message;
      } finally {
        this.isLoading = false;
      }
    },
    base64ToFile(fileInfo) {
      const arr = fileInfo.data.split(',');
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], fileInfo.name, { type: fileInfo.type });
    }
  },
  mounted(){
    console.log('라우트 쿼리 파라미터:', this.$route.query)

    this.orderId = this.$route.query.orderId
    this.orderName = this.$route.query.orderName
    this.paymentKey = this.$route.query.paymentKey
    // this.selectedPlan = this.$route.query.selectedPlan
    this.amount = this.$route.query.amount
    // this.category = this.$route.query.category
    // this.makerId = this.$route.query.makerId
    // this.summary = this.$route.query.summary
    // this.discount = this.$route.query.discount
    // this.targetAmount = this.$route.query.targetAmount
    // this.contentImage = this.$route.query.contentImage

    //체크 용 - 예진
    console.log("쿼리 파라미터 할당 후 값들:", {
      orderName: this.orderName,
      // selectedPlan: this.selectedPlan,
    })

    //필수 파라미터 검증
    if(!this.orderId || !this.amount){
      this.error = '필수 결제 정보가 누락되었습니다.'
      this.errorDetail = `paymentKye: ${this.paymentKey}, orderId: ${this.orderId}, amount: ${this.amount}`
      return
    }
    this.confirmPayment();

    if (this.success) {
    // 결제 성공 시 프로젝트 등록 진행
    const projectData = sessionStorage.getItem('projectData');
      if (projectData) {
        this.$router.push({
          name: 'ProjectRegistration',
          query: { 
            showSuccessModal: 'true',
            registerProject: 'true'
          }
        });
      }
    }
  }
}
</script>

<style scoped>

</style>