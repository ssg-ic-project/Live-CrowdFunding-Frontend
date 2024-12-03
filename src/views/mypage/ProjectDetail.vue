<template>
  <div class="project-detail-page">
    <div class="header">
      <h2>프로젝트 상세 정보</h2>
      <div class="header-buttons">
        <template v-if="project?.showStatus === '반려'">
          <button class="btn edit-btn" @click="toggleEdit">
            {{ isEditing ? "수정 완료" : "수정하기" }}
          </button>
          <button
            class="btn review-btn"
            @click="requestApproval"
            :disabled="isEditing"
          >
            검토받기
          </button>
        </template>
        <template v-if="project?.showStatus === '펀딩중' && project.remainingLiveCount > 0">
          <!-- 예약하기 버튼 -->
          <button 
            v-if="[2, 3].includes(project.isStreaming)"
            class="btn broadcast-btn"
            @click="openBroadcastModal"
            :disabled="loading || error"
          >
            방송예약
          </button>
          <!-- 방송하기 버튼 -->
          <button 
            v-if="project.isStreaming === 0"
            class="btn broadcast-btn"
            @click="startBroadcast"
          >
            방송하기
          </button>
        </template>
        <button class="btn back-btn" @click="goToList">목록으로</button>
      </div>
    </div>

    <!-- 조회 모드 -->
    <div v-if="!isEditing && project" class="detail-content">
      <!-- 기본 정보 섹션 -->
      <div class="section">
        <h3>기본 정보</h3>
        <div class="info-grid">
          <div class="info-item">
            <span class="label">프로젝트명</span>
            <span class="value">{{ project.productName }}</span>
          </div>
          <div class="info-item">
            <span class="label">상태</span>
            <span
              class="status-badge"
              :class="project.showStatus.toLowerCase()"
            >
              {{ getStatusText(project.showStatus) }}
            </span>
          </div>
          <div class="info-item">
            <span class="label">카테고리</span>
            <span class="value">{{ project.category }}</span>
          </div>
          <div class="info-item">
            <span class="label">판매가</span>
            <span class="value">{{ formatPrice(project.price) }}</span>
          </div>
          <div class="info-item">
            <span class="label">할인율</span>
            <span class="value">{{ project.discountPercentage }}%</span>
          </div>
          <div class="info-item">
            <span class="label">목표 금액</span>
            <span class="value">{{ formatPrice(project.goalAmount) }}</span>
          </div>
          <div class="info-item">
            <span class="label">시작일</span>
            <span class="value">{{ formatDate(project.startAt) }}</span>
          </div>
          <div class="info-item">
            <span class="label">종료일</span>
            <span class="value">{{ formatDate(project.endAt) }}</span>
          </div>
        </div>
      </div>

      <!-- 펀딩 현황 섹션 -->
      <div class="section">
        <h3>펀딩 현황</h3>
        <div class="funding-stats">
          <div class="stat-card">
            <span class="stat-label">총 참여자</span>
            <span class="stat-value">{{ project.paymentCount }}명</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">현재 펀딩 금액</span>
            <span class="stat-value">{{
              formatPrice(project.currentSales)
            }}</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">달성률</span>
            <span class="stat-value achievement"
              >{{ project.percentage }}%</span
            >
          </div>
        </div>
      </div>

      <!-- 등록된 서류 섹션 -->
      <div class="section">
        <h3>등록된 서류</h3>
        <div class="document-list">
          <div
            v-for="doc in project.essentialDocuments"
            :key="doc.id"
            class="document-item"
          >
            <span class="doc-name">{{ doc.name }}</span>
            <div class="doc-actions">
              <button class="btn view-btn small" @click="viewDocument(doc.url)">
                보기
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 상품 정보 섹션 -->
      <div class="section">
        <h3>상품 정보</h3>
        <div class="description">{{ project.summary }}</div>
        <div class="image-section">
          <!-- 썸네일 이미지 -->
          <div class="image-group">
            <span class="label">썸네일 이미지</span>
            <div class="thumbnail-image">
              <img 
                v-if="thumbnailImage"
                :src="thumbnailImage.url"
                :alt="thumbnailImage.name"
                class="product-image thumbnail"
              />
            </div>
          </div>

          <!-- 추가 이미지 목록 -->
          <div class="image-group" v-if="additionalImages.length > 0">
            <span class="label">추가 이미지</span>
            <div class="additional-images">
              <img 
                v-for="image in additionalImages" 
                :key="image.id"
                :src="image.url"
                :alt="image.name"
                class="product-image"
              />
            </div>
          </div>

          <!-- 상세 이미지 -->
          <div class="image-group">
            <span class="label">내용 이미지</span>
            <img 
              v-if="project.contentImage" 
              :src="project.contentImage" 
              alt="상세 이미지" 
              class="detail-image" 
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 수정 모드 -->
    <div v-else-if="isEditing && editProject" class="detail-content">
      <div class="section">
        <h3>기본 정보 수정</h3>
        <div class="edit-form">
          <div class="form-group">
            <label>프로젝트명</label>
            <input
              type="text"
              v-model="editProject.productName"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label>카테고리</label>
            <select v-model="editProject.category" class="form-input">
              <option value="">카테고리 선택</option>
              <option v-for="category in categories" 
                      :key="category.id" 
                      :value="category.id">
                {{ category.name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>판매가</label>
            <input
              type="number"
              v-model="editProject.price"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label>할인율 (%)</label>
            <input
              type="number"
              v-model="editProject.discountPercentage"
              class="form-input"
              min="0"
              max="100"
            />
          </div>

          <div class="form-group">
            <label>목표 금액</label>
            <input
              type="number"
              v-model="editProject.goalAmount"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label>프로젝트 설명</label>
            <textarea
              v-model="editProject.summary"
              class="form-textarea"
            ></textarea>
          </div>
        </div>
      </div>

      <div class="section">
        <h3>이미지 수정</h3>
        <div class="edit-form">
          <!-- 썸네일 이미지 -->
          <div class="form-group">
            <label>썸네일 이미지</label>
            <div class="image-preview">
              <div class="image-item" v-if="editThumbnailImage">
                <img 
                  :src="editThumbnailImage.url" 
                  alt="썸네일 이미지" 
                  class="preview-image"
                />
                <button type="button" @click="removeThumbnail" class="remove-btn">삭제</button>
              </div>
            </div>
            <input 
              type="file" 
              @change="handleThumbnailUpload" 
              accept="image/*" 
              class="file-input" 
            />
          </div>

          <!-- 추가 이미지 -->
          <div class="form-group">
            <label>추가 이미지</label>
            <div class="image-list">
              <div v-for="(image, index) in editAdditionalImages" :key="index" class="image-item">
                <img :src="image.url" :alt="image.name" class="preview-image" />
                <button type="button" @click="removeImage(index)" class="remove-btn">삭제</button>
              </div>
            </div>
            <input 
              type="file" 
              @change="handleAdditionalImages" 
              multiple 
              accept="image/*" 
              class="file-input"
            />
            <small class="text-muted">최대 5개까지 추가 가능</small>
          </div>

          <!-- 상세 이미지 -->
          <div class="form-group">
            <label>내용 이미지</label>
            <div class="image-preview">
              <div class="image-item" v-if="editProject.contentImage">
                <img 
                  :src="editProject.contentImage" 
                  alt="상세 이미지" 
                  class="preview-image" 
                />
                <button type="button" @click="removeContentImage" class="remove-btn">삭제</button>
              </div>
            </div>
            <input 
              type="file" 
              @change="updateContentImage" 
              accept="image/*" 
              class="file-input" 
            />
          </div>
        </div>

        <div class="button-group">
          <button @click="cancelEdit" class="btn cancel-btn">취소</button>
          <button @click="saveChanges" class="btn save-btn">저장</button>
        </div>
      </div>
    </div>

    <!-- 로딩 상태 -->
    <div v-else-if="loading" class="loading">
      프로젝트 정보를 불러오는 중...
    </div>

    <!-- 에러 상태 -->
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
  </div>

  <!-- 검토 요청 확인 모달 -->
  <div v-if="showApprovalConfirmModal" class="modal">
    <div class="modal-content">
      <h3>검토 요청 확인</h3>
      <p>검토를 재요청하시겠습니까?</p>
      <div class="modal-buttons">
        <button @click="closeApprovalConfirmModal" class="btn cancel-btn">
          취소
        </button>
        <button @click="confirmApproval" class="btn submit-btn">확인</button>
      </div>
    </div>
  </div>
  <BroadcastScheduleModal
      :show="showBroadcastModal"
      :scheduleData="scheduleData"
      @close="closeBroadcastModal"
      @confirm="handleBroadcastConfirm"
    />
</template>

<script>
import axios from "axios";
import BroadcastScheduleModal from '../../components/BroadcastScheduleModal.vue';

export default {
  name: "ProjectDetail",
  components: {
    BroadcastScheduleModal  // 컴포넌트 등록
  },

  data() {
    return {
      project: null,
      editProject: null,
      loading: true,
      error: null,
      isEditing: false,
      showApprovalConfirmModal: false,
      categories: [
        { id: 1, name: "생활 가전" },
        { id: 2, name: "주방 가전" },
        { id: 3, name: "스마트 가전" },
        { id: 4, name: "DIY" },
        { id: 5, name: "엔터테인먼트" },
        { id: 6, name: "웨어러블" },
        { id: 7, name: "주변 기기" },
      ],
      thumbnailFile: null,
      additionalFiles: [],
      contentImageFile: null,
      // 방송 예약 관련 데이터 추가
      showBroadcastModal: false,
      scheduleData: [],
    }
  },

  computed: {
    // 조회 모드용 computed 속성
    thumbnailImage() {
      return this.project?.images?.find(img => img.imageNumber === "1") || null;
    },
    additionalImages() {
      return this.project?.images?.filter(img => img.imageNumber !== "1") || [];
    },

    // 수정 모드용 computed 속성
    editThumbnailImage() {
      return this.editProject?.images?.find(img => img.imageNumber === "1") || null;
    },
    editAdditionalImages() {
      return this.editProject?.images?.filter(img => img.imageNumber !== "1") || [];
    }
  },

  created() {
    this.fetchProjectDetails();
  },

  methods: {
    async fetchProjectDetails() {
      try {
        this.loading = true;
        const response = await axios.get(
          `/api/project/${this.$route.params.id}/maker`
        );
        this.project = response.data;
        console.log("프로젝트 정보:", this.project);
      } catch (error) {
        console.error("프로젝트 조회 실패:", error);
        this.error = "프로젝트 정보를 불러오는데 실패했습니다.";
      } finally {
        this.loading = false;
      }
    },
    removeThumbnail() {
      // 썸네일 이미지 제거
      const thumbnailIndex = this.editProject.images.findIndex(img => img.imageNumber === "1");
      if (thumbnailIndex !== -1) {
        this.editProject.images.splice(thumbnailIndex, 1);
      }
      this.thumbnailFile = null;
    },

    removeContentImage() {
      // 상세 이미지 제거
      this.editProject.contentImage = null;
      this.contentImageFile = null;
    },

    formatPrice(price) {
      return price?.toLocaleString("ko-KR") + "원";
    },

    formatDate(date) {
      if (!date) return '-';
      return new Date(date).toLocaleDateString('ko-KR')
    },

    getStatusText(status) {
      const statusMap = {
        REVIEWING: "검토중",
        APPROVED: "승인됨",
        REJECTED: "반려됨",
        FUNDING: "펀딩중",
        SUCCESS: "펀딩성공",
        FAILED: "펀딩실패",
      };
      return statusMap[status] || status;
    },

    viewDocument(url) {
      window.open(url, "_blank");
    },

    goToList() {
      this.$router.push("/mypage/funding-status");
    },

    async requestApproval() {
      this.showApprovalConfirmModal = true;
    },

    closeApprovalConfirmModal() {
      this.showApprovalConfirmModal = false;
    },

    async confirmApproval() {
      try {
        await axios.patch(`/api/project/${this.$route.params.id}/status`, {
          status: '검토중'
        });
        
        alert('재검토 요청이 완료되었습니다.');
        this.showApprovalConfirmModal = false;
        await this.fetchProjectDetails();
      } catch (error) {
        console.error('검토 요청 실패:', error);
        alert('검토 요청에 실패했습니다. 다시 시도해주세요.');
      }
    },

    async toggleEdit() {
      if (!this.isEditing) {
        try {
          const response = await axios.get(`/api/project/${this.$route.params.id}/update`);

          const categoryId = this.categories.find(
            category => category.name === response.data.category
          )?.id;

          this.editProject = {
            ...response.data,
            category: categoryId
          };
          this.isEditing = true;
        } catch (error) {
          console.error('수정 정보 조회 실패:', error);
          alert('수정 정보를 불러오는데 실패했습니다.');
        }
      } else {
        this.saveChanges();
      }
    },

    handleThumbnailUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.thumbnailFile = file;
        // 미리보기 생성
        const reader = new FileReader();
        reader.onload = (e) => {
          if (!this.editProject.images) {
            this.editProject.images = [];
          }
          
          // 기존 썸네일 찾기 및 교체/추가
          const thumbnailIndex = this.editProject.images.findIndex(img => img.imageNumber === "1");
          const newThumbnail = {
            url: e.target.result,
            name: file.name,
            imageNumber: "1"
          };
          
          if (thumbnailIndex !== -1) {
            this.editProject.images[thumbnailIndex] = newThumbnail;
          } else {
            this.editProject.images.push(newThumbnail);
          }
        };
        reader.readAsDataURL(file);
      }
    },

    handleAdditionalImages(event) {
      const files = Array.from(event.target.files);
      const maxAdditionalImages = 5 - this.editAdditionalImages.length;
      const selectedFiles = files.slice(0, maxAdditionalImages);

      this.additionalFiles = [...this.additionalFiles, ...selectedFiles];

      selectedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (!this.editProject.images) {
            this.editProject.images = [];
          }

          // 새로운 이미지의 imageNumber는 기존 가장 큰 번호 + 1
          const maxImageNumber = Math.max(
            ...this.editProject.images.map(img => parseInt(img.imageNumber) || 0)
          );
          
          this.editProject.images.push({
            url: e.target.result,
            name: file.name,
            imageNumber: String(maxImageNumber + 1)
          });
        };
        reader.readAsDataURL(file);
      });
    },

    updateContentImage(event) {
      const file = event.target.files[0];
      if (file) {
        this.contentImageFile = file;
        
        // 미리보기 생성
        const reader = new FileReader();
        reader.onload = (e) => {
          this.editProject.contentImage = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },

    removeImage(index) {
      // 추가 이미지 목록에서 해당 인덱스의 이미지를 제거
      const imageToRemove = this.editAdditionalImages[index];
      const imageIndex = this.editProject.images.findIndex(img => 
        img.url === imageToRemove.url && img.imageNumber === imageToRemove.imageNumber
      );
      
      if (imageIndex !== -1) {
        this.editProject.images.splice(imageIndex, 1);
      }
      
      // 파일 배열에서도 제거
      if (this.additionalFiles[index]) {
        this.additionalFiles.splice(index, 1);
      }
    },

    async saveChanges() {
      try {
        const formData = new FormData();
        
        // requestDTO 구성
        const requestDTO = {
          categoryId: this.editProject.category,
          productName: this.editProject.productName,
          summary: this.editProject.summary,
          price: parseInt(this.editProject.price),
          discountPercentage: parseInt(this.editProject.discountPercentage),
          goalAmount: parseInt(this.editProject.goalAmount),
          thumbnailRemoved: !this.editThumbnailImage && !this.thumbnailFile,
          contentImageRemoved: !this.editProject.contentImage && !this.contentImageFile
        };

        formData.append('requestDTO', new Blob([JSON.stringify(requestDTO)], { 
          type: 'application/json' 
        }));

        // 이미지 파일들 추가
        if (this.thumbnailFile) {
          formData.append('images', this.thumbnailFile);
        }

        if (this.additionalFiles.length > 0) {
          this.additionalFiles.forEach(file => {
            formData.append('images', file);
          });
        }

        // 상세 이미지 추가
        if (this.contentImageFile) {
          formData.append('contentImage', this.contentImageFile);
        }

        await axios.patch(`/api/project/${this.$route.params.id}`, formData, {
          headers: {
            'Content-Type': undefined
          }
        });

        alert('프로젝트가 성공적으로 수정되었습니다.');
        this.isEditing = false;
        await this.fetchProjectDetails();

      } catch (error) {
        console.error('프로젝트 수정 실패:', error);
        alert('프로젝트 수정 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    },

    cancelEdit() {
      if (confirm('수정을 취소하시겠습니까? 변경사항이 저장되지 않습니다.')) {
        this.isEditing = false;
        this.editProject = null;
        this.thumbnailFile = null;
        this.additionalFiles = [];
        this.contentImageFile = null;
      }
    },

    async openBroadcastModal() {
      try {
        const response = await axios.get(`/api/schedule`);
        console.log('스케줄 데이터:', response.data);
        this.scheduleData = this.transformScheduleData(response.data);
        this.showBroadcastModal = true;
      } catch (error) {
        console.error('스케줄 데이터 로딩 실패:', error);
        alert('방송 예약 정보를 불러오는데 실패했습니다.');
      }
    },

    closeBroadcastModal() {
      this.showBroadcastModal = false;
    },

    // API 응답 데이터 변환 (필요한 경우)
    transformScheduleData(data) {
      return data.map(schedule => ({
        date: schedule.date,
        timeSlot: schedule.timeSlot.map(slot => ({
          time: slot.time.trim(), // "12: 00" -> "12:00" 형식으로 정리
          available: slot.available,
          remainingSlots: slot.remainingSlots
        }))
      }));
    },

    async handleBroadcastConfirm(reservationData) {
      try {
        // 날짜와 시간을 조합하여 LocalDateTime 형식으로 변환
        const [hour, minute] = reservationData.time.split(':');
        const date = new Date(reservationData.date);
        date.setHours(parseInt(hour), 0, 0, 0); // 분과 초를 00:00으로 설정
        
        // 한국 시간대 유지하면서 포맷팅
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        
        const formattedDate = `${year}-${month}-${day}T${hours}:00:00`;

        const requestDTO = {
          projectId: parseInt(this.$route.params.id),
          date: formattedDate // "2024-12-02T13:00:00" 형식 (KST 기준)
        };

        await axios.post('/api/schedule/create', requestDTO);
        alert('방송 예약이 완료되었습니다.');
        this.closeBroadcastModal();
      } catch (error) {
        console.error('방송 예약 실패:', error);
        console.log('요청 데이터:', requestDTO); // 디버깅용
        alert('방송 예약 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    },
    async startBroadcast() {
      // 방송 시작 API 호출 로직은 나중에 구현
      console.log('방송 시작');
    },
  }
}
</script>

<style scoped>
/* 기존 스타일 */
.review-btn {
  background-color: #007bff;
  border: 1px solid #007bff;
  color: #fff;
  margin-left: 8px;
}

.review-btn:hover {
  background-color: #0056b3;
}

.review-btn:disabled {
  background-color: #cccccc;
  border-color: #cccccc;
  cursor: not-allowed;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.edit-btn {
  background-color: #fff;
  border: 1px solid #007bff;
  color: #007bff;
}

.edit-btn:hover {
  background-color: #007bff;
  color: #fff;
}

.back-btn {
  background-color: #ffffff;
  border: 1px solid #dee2e6;
  color: #495057;
}
.reservation-btn {
  background-color: #f13939;
  border: 1px solid #dee2e6;
  color: #ffffff;
  margin-right: 5px;
}

.back-btn:hover {
  background-color: #e9ecef;
}

/* 프로젝트 상세 페이지 스타일 */
.project-detail-page {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.section {
  background: white;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

/* 기본 정보 섹션 스타일 */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.label {
  color: #666;
  font-size: 0.9rem;
}

.value {
  font-size: 1.1rem;
  color: #333;
}

/* 상태 배지 스타일 */
.status-badge {
  align-self: flex-start;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 500;
}

.status-badge.reviewing {
  background-color: #e9ecef;
  color: #495057;
}
.status-badge.rejected {
  background-color: #ffebee;
  color: #c62828;
}
.status-badge.funding {
  background-color: #e3f2fd;
  color: #1976d2;
}
.status-badge.success {
  background-color: #e8f5e9;
  color: #2e7d32;
}
.status-badge.failed {
  background-color: #ffebee;
  color: #c62828;
}

/* 펀딩 현황 스타일 */
.funding-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.stat-card {
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
}

.stat-label {
  display: block;
  color: #666;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
}

.achievement {
  color: #2e7d32;
}

/* 문서 목록 스타일 */
.document-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.document-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #ffffff;
  border-radius: 4px;
}

.doc-name {
  font-size: 0.9rem;
  color: #495057;
}

/* 이미지 섹션 스타일 */
.image-section {
  margin-top: 1rem;
}

.image-group {
  margin-bottom: 2rem;
}

.additional-images {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.product-image {
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 4px;
}

.detail-image {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
}

/* 수정 폼 스타일 */
.edit-form {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
}

.form-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-textarea {
  width: 100%;
  min-height: 100px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.image-item {
  position: relative;
}

.preview-image {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 4px;
}

.remove-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  background: rgba(255, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
}

.file-input {
  margin-top: 10px;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.cancel-btn {
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.save-btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-btn:hover {
  background-color: #5a6268;
}

.save-btn:hover {
  background-color: #0056b3;
}

/* 로딩 및 에러 상태 스타일 */
.loading,
.error {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.error {
  color: #dc3545;
}

.broadcast-btn {
  background-color: #4CAF50;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.broadcast-btn:hover {
  background-color: #45a049;
}

.broadcast-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.header-buttons {
  display: flex;
  gap: 10px;
  align-items: center;
}

@media (max-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr;
  }

  .funding-stats {
    grid-template-columns: 1fr;
  }
}
</style>
