// src/stores/auth.js
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: null,
    refreshToken: null,
    userEmail: null
  }),
  actions: {
    setTokens({ accessToken, refreshToken, userEmail }) {
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;
      this.userEmail = userEmail;
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('userEmail', userEmail);
    }
  }
});