// src/stores/auth.js
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: localStorage.getItem('accessToken') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
    userEmail: localStorage.getItem('userEmail') || null,
  }),
  
  actions: {
    setTokens({ accessToken, refreshToken, userEmail }) {
      console.log("Setting tokens in store:", { accessToken, refreshToken, userEmail });
      
      // 상태 업데이트
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;
      this.userEmail = userEmail;
      
      // localStorage에 저장
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('userEmail', userEmail);
      localStorage.setItem('isLoggedIn', 'true');
      
      console.log("Tokens saved successfully");
    },
    
    clearTokens() {
      this.accessToken = null;
      this.refreshToken = null;
      this.userEmail = null;
      
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('isLoggedIn');
    }
  }
});