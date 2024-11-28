<!-- src/views/main/Terms.vue -->
<template>
    <div class="terms-page">
      <h1>개인정보 이용약관</h1>
      <p>
        여기에 개인정보 이용약관 내용을 입력하세요.
      </p>
    </div>
  </template>
  
  <script>
  export default {
    name: "Terms",
  };
  </script>
  
  <style scoped>
  .terms-page {
    padding: 2rem;
    max-width: 800px;
    margin: 0 auto;
  }
  
  .terms-page h1 {
    margin-bottom: 1.5rem;
    color: var(--primary-color);
  }
  
  .terms-page p {
    line-height: 1.6;
    color: #333;
  }
  </style>
  