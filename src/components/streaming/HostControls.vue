<template>
  <div class="host-container">
    <div class="video-wrapper">
      <div class="video-container">
        <slot></slot>
      </div>
      <div class="controls-overlay">
        <div class="controls-bar">
          <h3>관리자 화면</h3>
          <div class="control-buttons">
            <button
              @click="handleRecording"
              :class="['control-button', isRecording ? 'recording' : '']"
            >
              {{ isRecording ? "녹화 중지" : "녹화 시작" }}
            </button>
            <button @click="handleToggleCamera" class="control-button">
              {{ localStream ? "방송 종료" : "방송 시작하기" }}
            </button>
            <button @click="handleLeave" class="leave-button">방 나가기</button>
          </div>
        </div>
      </div>
    </div>
    <!-- 방송 종료 모달 -->
    <div v-if="showEndModal" class="modal-overlay">
      <div class="modal">
        <h3>방송 종료</h3>
        <p>방송을 종료하시겠습니까?</p>
        <div class="modal-buttons">
          <button @click="showEndModal = false" class="cancel-button">취소</button>
          <button @click="confirmEndStream" class="confirm-button">확인</button>
        </div>
      </div>
    </div>
    <!-- 방 나가기 모달 -->
    <div v-if="showLeaveModal" class="modal-overlay">
      <div class="modal">
        <h3>방 나가기</h3>
        <p>현재까지의 녹화가 저장됩니다.</p>
        <div class="modal-buttons">
          <button @click="showLeaveModal = false" class="cancel-button">취소</button>
          <button @click="confirmLeave" class="confirm-button">나가기</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useScreenRecording } from "@/composables/useScreenRecording";
import { ref } from 'vue'

const showEndModal = ref(false)
const showLeaveModal = ref(false)

const emit = defineEmits(["leave", "toggle-camera"]);

const props = defineProps({
  localStream: {
    type: MediaStream,
    required: false,
  },
  screenProducer: {
    type: Object,
    required: false,
  },
  socket: {  // socket prop 추가
    type: Object,
    required: true
  },
  roomId: {  // roomId prop 추가
    type: String,
    required: true
  }
});

const { isRecording, startRecording, stopRecording } = useScreenRecording();

const handleRecording = async () => {
  if (isRecording.value) {
    stopRecording();
  } else {
    await startRecording(history.state.scheduleId);
  }
};

const handleToggleCamera = async () => {
  // localStream이 있을 때만(방송 중일 때만) 모달 표시
  if (props.localStream) {
    try {
      await fetch(`/api/schedule/update/${history.state.scheduleId}`,{
      method: 'PATCH'
      })
    } catch (error) {
      console.error('서버에서 처리가 불가합니다.', error);
    }


    showEndModal.value = true;
  } else {
    // 방송 중이 아닐 때는 바로 이벤트 발생
    emit('toggle-camera');
  }
};

const confirmEndStream = () => {
  emit('toggle-camera');

  props.socket.emit('end-stream', { roomId: props.roomId }) // props에서 socket과 roomId 사용

  showEndModal.value = false;
};

const handleLeave = () => {
  showLeaveModal.value = true;
};

const confirmLeave = () => {
  if (isRecording.value) {
    stopRecording();
  }

  props.socket.emit('end-stream', { roomId: props.roomId }) // props에서 socket과 roomId 사용

  emit('leave');
  showLeaveModal.value = false;
};
</script>

<!-- scoped는 해당 컴포넌트의 css가 다른 컴포넌트에 영향을 주지 않도록 한다.(scope) -->
<!-- https://blog.jeongwoo.in/vue-js-scoped-css-1b77c9a1b8bb -->
<style scoped>
.host-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
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

.control-button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background: #4a90e2;
  color: white;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.control-button:hover {
  background: #357abd;
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

.recording {
  background: #dc3545 !important;
  animation: pulse 2s infinite;
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
  background: #ffffff;
  color: #333;
}

.confirm-button {
  background: #dc3545;
  color: white;
}
@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
  100% {
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .host-container {
    padding: 0.5rem;
  }

  .video-wrapper {
    aspect-ratio: 16 / 9;
  }

  .controls-bar h3 {
    font-size: 1rem;
  }

  .control-button,
  .leave-button {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }
}
</style>