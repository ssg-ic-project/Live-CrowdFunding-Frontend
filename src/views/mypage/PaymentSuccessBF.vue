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

        this.isProjectRegistering = true;

        // 저장된 데이터 복원
        const projectData = JSON.parse(sessionStorage.getItem('projectData'));
        const fileData = JSON.parse(sessionStorage.getItem('fileData'));

        console.log('프로젝트 데이터:', projectData);
        console.log('파일 데이터:', fileData);

        if (!projectData || !fileData) {
          throw new Error('프로젝트 데이터를 찾을 수 없습니다.');
        }

        // FormData 생성
        const formData = new FormData();

        // requestDTO 추가
        const requestDTO = {
          makerId: Number(projectData.makerId || 1), // Long 타입으로 변환
          planId: Number(projectData.selectedPlan), // Long 타입으로 변환
          categoryId: Number(projectData.category), // Long 타입으로 변환
          productName: projectData.orderName,
          summary: projectData.summary,
          price: Number(projectData.amount), // Integer 타입으로 변환
          discountPercentage: Number(projectData.discount || 0), // Integer 타입으로 변환
          goalAmount: Number(projectData.targetAmount), // Integer 타입으로 변환
        };

        formData.append('requestDTO', new Blob([JSON.stringify(requestDTO)], {
          type: 'application/json'
        }));
        
        const imageFiles = [];

        // Base64 데이터를 File 객체로 변환하여 추가
      if (fileData.thumbnailFile) {
        const thumbnailFile = await this.base64ToFile(fileData.thumbnailFile);
        imageFiles.push(thumbnailFile);
      }

      if (fileData.additionalFiles && fileData.additionalFiles.length > 0) {
        for (const fileInfo of fileData.additionalFiles) {
          if (fileInfo) {
            const file = await this.base64ToFile(fileInfo);
            imageFiles.push(file);
          }
        }
      }

      // 모든 이미지 파일들을 formData에 추가
      imageFiles.forEach(file => {
        formData.append('images', file, file.name);
      });

      if (fileData.contentImageFile) {
        const contentFile = await this.base64ToFile(fileData.contentImageFile);
        formData.append('contentImage', contentFile, contentFile.name);
      }

      // 문서 파일들 처리
      if (fileData.documents) {
        const documentFiles = [
          fileData.documents.projectPlan,
          fileData.documents.developmentPlan,
          fileData.documents.agreement,
          fileData.documents.additional
        ].filter(doc => doc !== null);

        for (const docInfo of documentFiles) {
          const docFile = await this.base64ToFile(docInfo);
          formData.append('documents', docFile, docFile.name);
        }
      }

      // FormData 내용 로깅
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

      // API 호출
      await axios.post("/api/project", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // 데이터 정리
      sessionStorage.removeItem('projectData');
      sessionStorage.removeItem('fileData');

      this.isProjectRegistering = false;
      this.success = true;
      this.$router.push({
        name: 'ProjectRegistration',
        query: { showSuccessModal: 'true', isRegistered: 'true'}
      });

    } catch (error) {
      this.isProjectRegistering = false;
      console.error('에러 발생:', error);
      this.error = error.message;
      this.errorDetail = JSON.stringify(error.response?.data || error, null, 2);
    } finally {
      this.isLoading = false;
    }
  },
    async base64ToFile(fileInfo) {
      if (!fileInfo || !fileInfo.data) return null;

      // Base64 데이터에서 실제 바이너리 데이터 추출
      const base64Response = await fetch(fileInfo.data);
      const blob = await base64Response.blob();

      // 새로운 File 객체 생성
      return new File([blob], fileInfo.name, {
        type: fileInfo.type,
        lastModified: fileInfo.lastModified
      });
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