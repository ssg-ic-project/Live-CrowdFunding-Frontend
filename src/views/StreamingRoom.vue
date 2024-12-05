<!-- StreamingRoom.vue -->
<template>
  <div class="streaming-layout">
    <!-- <div v-if="!joined">
      <room-join-form
        v-model:room-id="roomId"
        v-model:user-role="userRole"
        v-model:user-name="userName"
        @join="joinRoom"
      />
    </div> -->

    <div class="grid-container" v-if="socket">
      <!-- 스트리밍 영역 -->
      <div class="streaming-area">
        <host-controls
          v-if="userRole === 'maker'"
          :local-stream="localStream"
          :screen-producer="screenProducer"
          :socket="socket"
          :roomId="roomId"
          @leave="handleLeaveRoom" 
          @toggle-camera="toggleCamera"
        >
          <video-preview v-if="localStream" ref="localVideoRef" :stream="localStream" />
        </host-controls>
        <viewer-controls v-else @leave="handleLeaveRoom" :set-remote-media-el="setRemoteMediaEl" :socket="socket"/>
      </div>
      <!-- 채팅 영역 -->
      <div class="chat-area">
        <div class="area-header">실시간 채팅</div>
        <chat-component :roomId="roomId" :socket="socket" :user-name="userName" />
      </div>

      <!-- 상품 정보 영역 -->
      <div class="product-info-area" @click="goToProductDetail">
        <div class="area-header">상품 정보</div>
        <div class="scrollable-content">
          <product-info-component :roomId="roomId"  />
          <div class="stream-summary-section">
            <h3 class="section-header">스트리밍 요약</h3>
            <stream-summary-component :roomId="roomId" :socket="socket" />
          </div>
        </div>
      </div>

      <div v-if="showHostEndedModal" class="modal-overlay">
        <div class="modal host-ended-modal">
          <h3>방송이 종료되었습니다</h3>
          <p>호스트가 방송을 종료하였습니다</p>
          <div class="countdown" v-if="countdown > 0">
            {{ countdown }}초 후 자동으로 종료됩니다
          </div>
          <div class="modal-buttons">
            <button @click="handleHostEndedClose" class="confirm-button">
              확인 ({{ countdown }}s)
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import ChatComponent from '@/components/chat/ChatComponent.vue'
import ProductInfoComponent from '@/components/product/ProductInfoComponent.vue'
import StreamSummaryComponent from '@/components/user-statistics/StreamSummaryComponent.vue'
import { ref, onMounted, onBeforeUnmount, onBeforeMount } from 'vue'
import { useStreaming } from '../composables/useStreaming'
import HostControls from '@/components/streaming/HostControls.vue'
import ViewerControls from '@/components/streaming/ViewerControls.vue'
import VideoPreview from '@/components/streaming/VideoPreview.vue'
import { useRouter } from 'vue-router'

const userName = ref('')
const showHostEndedModal = ref(false)
const countdown = ref(3)
const router = useRouter()

const {
  localVideoRef,
  remoteMediaRef,
  socket,
  joined,
  roomId,
  peers,
  viewers,
  localStream,
  userRole,
  screenProducer,
  joinRoom,
  setupRoom,
  leaveRoom,
  toggleCamera,
  initializeSocket,
  setRemoteMediaEl,
} = useStreaming(history.state.productId)

onMounted(async () => {
  if (!socket.value) {
    await initializeSocket()
  }

  // 이전 경로에 mypage가 포함되어있는지 확인하는 함수
  const isFromMyPage = () => {
    const previousPath = history.state?.back || ''
    return previousPath.includes('mypage')
  }


  if (isFromMyPage()) {  // mypage에서 왔는지 체크 추가
    // 방송하기/마이페이지에서 접근하거나 mypage에서 돌아온 경우 localStorage 값 사용
    userRole.value = localStorage.getItem('userType') || 'user'
  } else {
    // 기본값은 시청자 화면
    userRole.value = 'user'
  }

  await new Promise(resolve => {
    if (socket.value.connected) {
      resolve()
    } else {
      socket.value.on('connect', async () => {
        resolve()

        if (userRole.value === 'maker') {
          try {
            await fetch(`/api/schedule/update/${history.state.scheduleId}`,{
              method: 'PATCH'
            })
          } catch (error) {
            console.error('서버에서 처리가 불가합니다.', error);
          }
        }
      })
    }
  })


  socket.value.on('room-joined', async (response) => {
    if (response.error) {
      console.error('Room join error:', response.error)
      alert('방 입장에 실패했습니다.')
      return
    }
    try {
      await setupRoom(response)
    } catch (error) {
      // console.error('Setup room error:', error)
      alert('방 설정에 실패했습니다.')
    }
  })

    // 호스트 방송 종료 이벤트 리스닝
  socket.value.on('host-ended-stream', () => {
    showHostEndedModal.value = true
    startCountdown()
  })

  // 방 참여 요청
  try {
    socket.value.emit('join-room', {
      roomId: roomId.value,
      peerId: socket.value.id,
    })
  } catch (error) {
    // console.error('Failed to join room:', error)
    alert('방 입장에 실패했습니다.')
  }
})
const handleLeaveRoom = async () => {
  await leaveRoom()
  await router.push('/')
}

onBeforeUnmount(() => {
  if (joined.value) {
    leaveRoom()
  }
  socket.value?.disconnect()
})

// 카운트다운 함수 추가
const startCountdown = () => {
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
      handleHostEndedClose()
    }
  }, 1000)
}

// 호스트 방송 종료 모달 닫기 함수
const handleHostEndedClose = async () => {
  showHostEndedModal.value = false
  countdown.value = 3
  // await handleLeaveRoom()
}
const goToProductDetail = () => {
  router.push(`/product/${history.state.productId}`)
}

</script>

<style scoped>
.streaming-layout {
  width: 100%;
  height: 100vh;
  max-height: 100vh;
  padding: 1rem;
  overflow: hidden;
  box-sizing: border-box;
}
.product-info-area:hover {
  background-color: #f8f9fa;
}

.grid-container {
  display: grid;
  gap: 1rem;
  height: calc(100vh - 2rem);
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: repeat(12, 1fr);
}

/* 데스크탑 레이아웃 */
@media screen and (min-width: 1024px) {
  .streaming-area {
    grid-column: 1 / 8; /* 7칸 차지 */
    grid-row: 1 / 8; /* 7칸 차지 */
    background-color: #ffffff;
    border-radius: 0.5rem;
    padding: 1rem;
    overflow: hidden;
    min-height: 0;
  }

  .chat-area {
    grid-column: 8 / 13; /* 5칸 차지 */
    grid-row: 1 / 13; /* 전체 높이 */
    background-color: #ffffff;
    border-radius: 0.5rem;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .product-info-area {
    grid-column: 1 / 8; /* 7칸 차지 */
    grid-row: 8 / 13; /* 5칸 차지 */
    background-color: #ffffff;
    border-radius: 0.5rem;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }
}

/* 태블릿 레이아웃 */
@media screen and (min-width: 768px) and (max-width: 1023px) {
  .grid-container {
    grid-template-rows: auto;
    gap: 0.75rem;
  }

  .streaming-area {
    grid-column: 1 / 8;
    grid-row: 1 / 7;
  }

  .chat-area {
    grid-column: 8 / 13;
    grid-row: 1 / 13;
  }

  .product-info-area {
    grid-column: 1 / 8;
    grid-row: 7 / 13;
  }
}

/* 모바일 레이아웃 */
@media screen and (max-width: 767px) {
  .streaming-layout {
    height: auto;
    padding: 0.5rem;
    overflow-y: auto;
  }

  .grid-container {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    height: auto;
  }

  .streaming-area {
    width: 100%;
    aspect-ratio: 16/9;
    min-height: 200px;
    order: 1; /* 첫 번째로 표시 */
  }

  .chat-area {
    width: 100%;
    height: 400px;
    order: 2; /* 두 번째로 표시 */
  }

  .product-info-area {
    width: 100%;
    height: 300px;
    order: 3; /* 세 번째로 표시 */
  }
}

/* 작은 모바일 화면 */
@media screen and (max-width: 480px) {
  .chat-area {
    height: 350px;
  }

  .product-info-area {
    height: 250px;
  }
}

/* 공통 스타일 */
.area-header {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #dee2e6;
}

.scrollable-content {
  flex: 1;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.section-header {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 1rem 0 0.5rem;
  padding-top: 1rem;
  border-top: 1px solid #dee2e6;
}

/* 스크롤바 스타일링 */
.scrollable-content::-webkit-scrollbar {
  width: 4px;
}

.scrollable-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.scrollable-content::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 2px;
}

.scrollable-content::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* 각 영역 내부 스크롤 설정 */
.streaming-area,
.chat-area,
.product-info-area {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

:deep(.chat-container) {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

:deep(.messages-wrapper) {
  flex: 1;
  overflow-y: auto;
}

:deep(.input-wrapper) {
  flex-shrink: 0;
  margin-top: auto;
  background-color: white;
  border-top: 1px solid #dee2e6;
  padding: 0.5rem;
}

/* 호스트 종료 모달 관련 스타일 추가 */
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
  animation: fadeIn 0.3s ease;
}

.host-ended-modal {
  display: flex;
  flex-direction: column;
  background: white;
  padding: 1.75rem;
  border-radius: 12px;
  height: auto;
  max-width: 320px;
  width: 90%;
  text-align: center;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  position: relative;
  animation: slideIn 0.3s ease;
}

.host-ended-modal h3 {
  color: #dc3545;
  font-size: 1.25rem;
  margin: 0 0 0.75rem;
  font-weight: 600;
}

.host-ended-modal p {
  color: #666;
  margin: 0 0 1rem;
  font-size: 0.95rem;
  line-height: 1.5;
}

.countdown {
  margin: 1rem 0;
  font-size: 1.1rem;
  color: #dc3545;
  font-weight: 500;
}

.modal-buttons {
  display: flex;
  justify-content: center;
  margin-top: 1.25rem;
}

.confirm-button {
  padding: 0.6rem 1.5rem;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.confirm-button:hover {
  background: #c82333;
  transform: translateY(-1px);
}

.confirm-button:active {
  transform: translateY(0);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .host-ended-modal {
    width: 85%;
    max-width: 300px;
    padding: 1.5rem;
  }
  
  .host-ended-modal h3 {
    font-size: 1.1rem;
  }
  
  .host-ended-modal p {
    font-size: 0.9rem;
  }
  
  .countdown {
    font-size: 1rem;
  }
  
  .confirm-button {
    padding: 0.5rem 1.25rem;
    font-size: 0.9rem;
  }
}
</style>
