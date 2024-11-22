<!-- src/views/mypage/MyPage.vue -->
<template>
  <div class="mypage-home">
    <h2>마이페이지</h2>
    <p>안녕하세요, {{ userName }}님!</p>
    <p>마이페이지에서 개인 정보와 활동 내역을 확인하세요.</p>
  </div>
</template>

<script>
export default {
  name: 'MyPage',
  data() {
    return {
      userName: '',
    };
  },
  methods: {
    loadUserName() {
      this.userName = localStorage.getItem('userName') || '';
    },
  },
  mounted() {
    this.loadUserName();
    window.addEventListener('storage', this.loadUserName);
  },
  beforeUnmount() {
    window.removeEventListener('storage', this.loadUserName);
  },
};
</script>

<style scoped>
.mypage-home {
  padding: 2rem;
  color: #000;
}

.mypage-home h2 {
  margin-bottom: 1rem;
  color: #000;
  font-size: 2rem;
  font-weight: bold;
}

.mypage-home p {
  color: #333;
  font-size: 1.1rem;
  margin-bottom: 1rem;
}
</style>