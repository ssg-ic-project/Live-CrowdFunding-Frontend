<template>
  <div class="viewer-container">
    <div class="video-wrapper">
      <div class="video-container">
        <RemoteMedia ref="remoteRef" :set-remote-media-el="setRemoteMediaEl" />
      </div>
      <div class="controls-overlay">
        <div class="controls-bar">
          <h3>시청자 화면</h3>
          <div class="control-buttons">
            <button @click="handleLeave" class="leave-button">방 나가기</button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <h3>방 나가기</h3>
        <p>방을 나가시겠습니까?</p>
        <div class="modal-buttons">
          <button @click="showModal = false" class="cancel-button">취소</button>
          <button @click="confirmLeave" class="confirm-button">나가기</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import RemoteMedia from './RemoteMedia.vue'

const showModal = ref(false)

const props = defineProps({
  setRemoteMediaEl: {
    type: Function,
    required: true,
  },
})

const remoteRef = ref(null)


const handleLeave = () => {
  showModal.value = true
}

const confirmLeave = () => {
  if (remoteRef.value?.videoRef) {
    remoteRef.value.videoRef.srcObject = null
  }
  emit('leave')
  showModal.value = false
}

const emit = defineEmits(['leave'])

defineExpose({
  remoteRef,
})
</script>

<style scoped>
.viewer-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f8f9fa;
  border-radius: 0.5rem;
  padding: 1rem;
}

.video-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
}

.video-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.controls-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  z-index: 10;
}

.controls-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
}

.control-buttons {
  display: flex;
  gap: 0.5rem;
}

.leave-button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background: #dc3545;
  color: white;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.leave-button:hover {
  background: #c82333;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  display: flex;
  flex-direction: column;
  background: white;
  padding: 1.25rem;
  border-radius: 8px;
  max-width: 280px;
  width: auto;
  height: auto;
  min-width: 250px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.modal h3 {
  margin: 0 0 0.5rem;
  color: #333;
  font-size: 1rem;
}

.modal p {
  margin: 0 0 1rem;
  color: #666;
  font-size: 0.9rem;
}

.modal-buttons {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 1rem;
}

.cancel-button, .confirm-button {
  padding: 0.35rem 1rem;
  border-radius: 4px;
  font-size: 0.85rem;
  cursor: pointer;
  border: none;
}

.cancel-button {
  background: #f8f9fa;
  color: #333;
}

.confirm-button {
  background: #dc3545;
  color: white;
}

@media (max-width: 768px) {
  .viewer-container {
    padding: 0.5rem;
  }

  .video-wrapper {
    aspect-ratio: 16 / 9;
  }

  .controls-bar h3 {
    font-size: 1rem;
  }

  .leave-button {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }
}
</style>
