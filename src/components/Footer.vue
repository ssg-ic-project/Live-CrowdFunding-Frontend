<template>
  <footer class="footer">
    <div class="footer-content">
      <p>&copy; 2024 CROFLE.</p>
      <router-link to="/terms" class="footer-link">개인정보 이용약관</router-link>
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
  background-color: #2f3a4f;
  color: white;
  padding: 1rem 0;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  box-sizing: border-box;
}

.footer-link {
  color: #ffffff;
  text-decoration: underline;
  font-size: 0.875rem;
}

.footer-link:hover {
  color: #a9b7c6;
}
</style>