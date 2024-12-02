<!-- BroadcastScheduleModal.vue -->
<template>
    <div v-if="props.show" class="modal-overlay">
      <div class="modal-container">
        <div class="modal-header">
          <h3>방송 예약하기</h3>
          <button class="close-btn" @click="handleClose">
            <span>&times;</span>
          </button>
        </div>
  
        <div class="modal-body">
          <!-- 날짜 선택 -->
          <div class="date-selector">
            <div
              v-for="schedule in props.scheduleData"
              :key="schedule.date"
              class="date-item"
              :class="{ active: selectedDate === schedule.date }"
              @click="handleDateSelect(schedule.date)"
            >
              <span class="day">{{ formatDay(schedule.date) }}</span>
              <span class="date">{{ formatDate(schedule.date) }}</span>
            </div>
          </div>
  
          <!-- 시간 선택 -->
          <div v-if="selectedDate" class="time-slots">
            <div class="time-grid">
              <button
                v-for="slot in getTimeSlots"
                :key="slot.time"
                class="time-slot"
                :class="{
                  'available': slot.available && slot.remainingSlots > 0,
                  'unavailable': !slot.available || slot.remainingSlots <= 0
                }"
                :disabled="!slot.available || slot.remainingSlots <= 0"
                @click="handleTimeSelect(slot)"
              >
                <span class="time">{{ slot.time }}</span>
                <span class="slots">남은 자리: {{ slot.remainingSlots }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- 확인 모달 -->
      <div v-if="showConfirm" class="confirm-modal">
        <div class="confirm-content">
          <h4>예약 확인</h4>
          <p>{{ formatFullDate(selectedDate) }} {{ selectedTime?.time }}에</p>
          <p>방송을 예약하시겠습니까?</p>
          <div class="confirm-buttons">
            <button class="cancel-btn" @click="closeConfirm">취소</button>
            <button class="confirm-btn" @click="confirmReservation">확인</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { format } from 'date-fns'
  import { ko } from 'date-fns/locale'
  
  const props = defineProps({
    show: {
      type: Boolean,
      required: true
    },
    scheduleData: {
      type: Array,
      required: true
    }
  })
  
  const emit = defineEmits(['close', 'confirm'])
  
  const selectedDate = ref(null)
  const selectedTime = ref(null)
  const showConfirm = ref(false)
  
  // 날짜 포맷 함수들
  const formatDay = (dateString) => {
    const date = new Date(dateString)
    return format(date, 'E', { locale: ko })
  }
  
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return format(date, 'M.d')
  }
  
  const formatFullDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return format(date, 'yyyy년 MM월 dd일', { locale: ko })
  }
  
  // 선택된 날짜의 시간대 목록
  const getTimeSlots = computed(() => {
    if (!selectedDate.value) return []
    const schedule = props.scheduleData.find(s => s.date === selectedDate.value)
    return schedule ? schedule.timeSlot : []
  })
  
  // 이벤트 핸들러
  const handleDateSelect = (date) => {
    selectedDate.value = date
    selectedTime.value = null
  }
  
  const handleTimeSelect = (slot) => {
    selectedTime.value = slot
    showConfirm.value = true
  }
  
  const handleClose = () => {
    emit('close')
    resetState()
  }
  
  const closeConfirm = () => {
    showConfirm.value = false
    selectedTime.value = null
  }
  
  const confirmReservation = () => {
    if (!selectedDate.value || !selectedTime.value) return;
  
    emit('confirm', {
      date: selectedDate.value,
      time: selectedTime.value.time.trim() // "19:00" 형식으로 전달
    });
    resetState();
    handleClose();
  }
  
  const resetState = () => {
    selectedDate.value = null
    selectedTime.value = null
    showConfirm.value = false
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
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal-container {
    background-color: white;
    border-radius: 8px;
    width: 90%;
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
    padding: 20px;
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .close-btn {
    font-size: 28px;
    background: none;
    border: none;
    cursor: pointer;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;
  }
  .close-btn:hover {
    background-color: #f3f4f6;
  }

  .close-btn span {
    line-height: 1;
    color: #666;
  }
  
  .date-selector {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #eee;
  }
  
  .date-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;
    cursor: pointer;
    border-radius: 8px;
    transition: all 0.2s;
  }
  
  .date-item:hover {
    background-color: #f5f5f5;
  }
  
  .date-item.active {
    background-color: #3b82f6;
    color: white;
  }
  
  .day {
    font-size: 0.9em;
  }
  
  .date {
    font-size: 1.2em;
    font-weight: bold;
  }
  
  .time-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    padding: 15px 0;
  }
  
  .time-slot {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
    transition: all 0.2s;
    background-color: white;  /* 배경색을 흰색으로 변경 */
  }
    
  .time-slot.available {
    background-color: #f3f4f6;
    cursor: pointer;
  }
  
  .time-slot.available:hover {
    background-color: #edf5ff;  /* 호버 시 밝은 파란색 배경 */
  }
  
  .time-slot.unavailable {
    background-color: #f3f4f6;
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .confirm-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    z-index: 1100;
    text-align: center;
  }
  
  .confirm-buttons {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 20px;
  }
  
  .cancel-btn, .confirm-btn {
    padding: 8px 20px;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .cancel-btn {
    background-color: #f3f4f6;
    border: 1px solid #e5e7eb;
    color: #666;
  }
  
  .confirm-btn {
    background-color: #3b82f6;
    color: white;
    border: none;
  }
  
  .time {
    font-size: 0.8em;
    color: #666;
    margin-top: 4px;
  }
  
  .slots {
    font-size: 0.8em;
    color: #666;
  }

  /* 선택 가능한 시간 슬롯의 텍스트 색상 */
  .time-slot.available .time {
    color: #3b82f6;  /* 파란색으로 변경 */
  }

  .time-slot.available .slots {
    color: #6b7280;  /* 조금 더 진한 회색으로 변경 */
  }
  </style>