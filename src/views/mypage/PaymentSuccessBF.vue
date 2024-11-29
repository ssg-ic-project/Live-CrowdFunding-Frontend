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
    async confirmPayment(){
      this.isLoading = true
      this.error = null
      this.errorDetail = null

      const requestData = {
        orderId: this.orderId,
        orderName: this.orderName, //프로젝트 이름
        amount: this.amount, //7만원
        paymentKey: this.paymentKey,
        // selectedPlan: this.selectedPlan, //요금제 타입
        // category: this.category,
        // makerId: this.makerId,
        // summary: this.summary,
        // discount: this.discount,
        // targetAmount: this.targetAmount,
        // contentImage: this.contentImage

      }
      try{
        console.log('API 호출 시작')
        console.log('결제 수단 체크 by yejin1: ', this.method);
        console.log('떡볶이 라볶이: ', this.approvedAt);
        const response = await paymentApi.basicFee(requestData)
        console.log('성공 응답 데이터: ', response.data)

        // this.method = response.data.method //결제 수단
        // console.log('결제 수단 체크 by yejin: ', this.method);
        // this.paymentAt = response.data.approvedAt //승인시각
        // console.log('승인 시각 체크 by yejin: ', this.paymentAt);

        this.success = true
        //성공시 redirect
        // setTimeout(()=> {
        //   this.$router.push('/success-bf')
        // }, 3000)

        this.$router.push({
          name: 'ProjectRegistration',
          query: { showSuccessModal: 'true' }
        });


      } catch(err){
        console.error('상세 에러: ', err)
        this.error = err.message || '결제 확인 중 오류가 발생했습니다.'
        this.errorDetail = JSON.stringify(err, null, 2)

        //에러 시 redirect
        setTimeout(()=>{
          this.$router.push(`/fail-bf?message=${encodeURIComponent(this.error)}`)
        }, 3000)


      }finally{
        this.isLoading = false
      }
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
    this.confirmPayment()
  }
}
</script>

<style scoped>

</style>