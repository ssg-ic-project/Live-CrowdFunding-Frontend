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
      <p>paymentKey: {{ paymentKey }}</p>
      <p>주문번호: {{ orderId }}</p>
      <p>결제 금액: {{ amount }}</p>
    </div>
  </div>
</template>

<script>
import {paymentApi} from "@/api/index.js";

export default{
  name: 'PaymentSuccess',
  data() {
    return {
      paymentKey: '',
      orderId: '',
      amount: '',
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
        paymentKey: this.paymentKey,
        orderId: this.orderId,
        amount: this.amount
      }
      try{
        console.log('API 호출 시작')
        const response = await paymentApi.confirm(requestData)
        console.log('성공 응답 데이터: ', response.data)

        this.success = true
        //성공시 redirect
        setTimeout(()=> {
          this.$router.push('/success')
        }, 3000)
      } catch(err){
        console.error('상세 에러: ', err)
        this.error = err.message || '결제 확인 중 오류가 발생했습니다.'
        this.errorDetail = JSON.stringify(err, null, 2)

        //에러 시 redirect
        setTimeout(()=>{
          this.$router.push(`/fail?message=${encodeURIComponent(this.error)}`)
        }, 3000)
      }finally{
        this.isLoading = false
      }
    }
  },
  mounted(){
    console.log('라우트 쿼리 파라미터:', this.$route.query)

    this.paymentKey = this.$route.query.paymentKey
    this.orderId = this.$route.query.orderId
    this.amount = this.$route.query.amount

    //필수 파라미터 검증
    if(!this.paymentKey || !this.orderId || !this.amount){
      this.error = '필수 결제 정보가 누락되었습니다.'
      this.errorDetail = `paymentKey: ${this.paymentKey}, orderId: ${this.orderId}, amount: ${this.amount}`
      return
    }
    this.confirmPayment()
  }
}
</script>

<style scoped>

</style>