<!-- UploadProgressModal.vue -->
<template>
    <div v-if="isOpen" class="modal-overlay">
      <div class="modal-content">
        <div class="progress-circle">
          <svg viewBox="0 0 36 36" class="circular-progress">
            <path
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              :stroke-dasharray="`${progress}, 100`"
            />
          </svg>
          <span class="progress-text">{{ progress }}%</span>
        </div>
        <h3 class="modal-title">프로젝트 등록 중</h3>
        <p class="modal-description">잠시만 기다려주세요...</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'UploadProgressModal',
    props: {
      isOpen: {
        type: Boolean,
        required: true
      },
      progress: {
        type: Number,
        required: true
      }
    }
  }
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  
  .modal-content {
    background-color: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    text-align: center;
  }
  
  .progress-circle {
    width: 120px;
    height: 120px;
    margin: 0 auto 1rem;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .circular-progress {
    transform: rotate(-90deg);
    width: 100%;
    height: 100%;
  }
  
  .circular-progress path {
    stroke: #ff5151;
    stroke-width: 2.8;
    stroke-linecap: round;
    fill: none;
  }
  
  .progress-text {
    position: absolute;
    font-size: 1.2rem;
    color: #ff5151;
    font-weight: bold;
  }
  
  .modal-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #333;
  }
  
  .modal-description {
    color: #666;
    margin: 0;
  }
  </style>