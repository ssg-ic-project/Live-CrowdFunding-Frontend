<template>
  <div class="project-detail-page">
    <div class="header">
      <h2>프로젝트 상세 정보</h2>
      <div class="header-buttons">
        <template v-if="project?.showStatus === '반려'">
          <button class="btn edit-btn" @click="toggleEdit">
            {{ isEditing ? '수정 완료' : '수정하기' }}
          </button>
          <button class="btn review-btn" @click="requestApproval" :disabled="isEditing">
            검토받기
          </button>
        </template>
        <button class="btn back-btn" @click="goToList">
          목록으로
        </button>
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
            <span class="status-badge" :class="project.showStatus.toLowerCase()">
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
            <span class="stat-value">{{ formatPrice(project.currentSales) }}</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">달성률</span>
            <span class="stat-value achievement">{{ project.percentage }}%</span>
          </div>
        </div>
      </div>

      <!-- 등록된 서류 섹션 -->
      <div class="section">
        <h3>등록된 서류</h3>
        <div class="document-list">
          <div v-for="doc in project.essentialDocuments" :key="doc.id" class="document-item">
            <span class="doc-name">{{ doc.name }}</span>
            <div class="doc-actions">
              <button class="btn view-btn small" @click="viewDocument(doc.url)">보기</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 상품 정보 섹션 -->
      <div class="section">
        <h3>상품 정보</h3>
        <div class="description">{{ project.summary }}</div>
        <div class="image-section">
          <div class="image-group">
            <span class="label">이미지 목록</span>
            <div class="additional-images">
              <img 
                v-for="image in project.images" 
                :key="image.id"
                :src="image.url"
                :alt="image.name"
                class="product-image"
              />
            </div>
          </div>
          <div class="image-group">
            <span class="label">상세 이미지</span>
            <img :src="project.contentImage" alt="상세 이미지" class="detail-image" />
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
            <input type="text" v-model="editProject.productName" class="form-input" />
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
            <input type="number" v-model="editProject.price" class="form-input" />
          </div>

          <div class="form-group">
            <label>할인율 (%)</label>
            <input type="number" v-model="editProject.discountPercentage" class="form-input" min="0" max="100" />
          </div>

          <div class="form-group">
            <label>목표 금액</label>
            <input type="number" v-model="editProject.goalAmount" class="form-input" />
          </div>

          <div class="form-group">
            <label>프로젝트 설명</label>
            <textarea v-model="editProject.summary" class="form-textarea"></textarea>
          </div>
        </div>
      </div>

      <div class="section">
        <h3>이미지 수정</h3>
        <div class="edit-form">
          <div class="form-group">
            <label>이미지 목록</label>
            <div class="image-list">
              <div v-for="(image, index) in editProject.images" :key="index" class="image-item">
                <img :src="image.url" :alt="image.name" class="preview-image" />
                <button @click="removeImage(index)" class="remove-btn">삭제</button>
              </div>
            </div>
            <input type="file" @change="addImages" multiple accept="image/*" class="file-input" />
          </div>

          <div class="form-group">
            <label>상세 이미지</label>
            <img v-if="editProject.contentImage" :src="editProject.contentImage" alt="상세 이미지" class="preview-image" />
            <input type="file" @change="updateContentImage" accept="image/*" class="file-input" />
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

  <div v-if="showApprovalConfirmModal" class="modal">
    <div class="modal-content">
      <h3>검토 요청 확인</h3>
      <p>검토를 재요청하시겠습니까?</p>
      <div class="modal-buttons">
        <button @click="closeApprovalConfirmModal" class="btn cancel-btn">취소</button>
        <button @click="confirmApproval" class="btn submit-btn">확인</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ProjectDetail',
  
  data() {
    return {
      project: null,
      editProject: null,
      loading: true,
      error: null,
      isEditing: false,
      newImages: [], // 새로 추가된 이미지 파일들
      newContentImage: null, // 새로 추가된 상세 이미지 파일
      categories: [
        { id: 1, name: "생활 가전" },
        { id: 2, name: "주방 가전" },
        { id: 3, name: "스마트 가전" },
        { id: 4, name: "DIY" },
        { id: 5, name: "엔터테인먼트" },
        { id: 6, name: "웨어러블" },
        { id: 7, name: "주변 기기" },
      ]
    }
  },

  created() {
    this.fetchProjectDetails()
  },

  methods: {
    async fetchProjectDetails() {
      try {
        this.loading = true;
        const response = await axios.get(`/api/project/${this.$route.params.id}/maker`);
        this.project = response.data;
      } catch (error) {
        console.error('프로젝트 조회 실패:', error);
        this.error = '프로젝트 정보를 불러오는데 실패했습니다.';
      } finally {
        this.loading = false;
      }
    },

    formatPrice(price) {
      return price?.toLocaleString('ko-KR') + '원'
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString('ko-KR')
    },

    getStatusText(status) {
      const statusMap = {
        REVIEWING: '검토중',
        APPROVED: '승인됨',
        REJECTED: '반려됨',
        FUNDING: '펀딩중',
        SUCCESS: '펀딩성공',
        FAILED: '펀딩실패'
      }
      return statusMap[status] || status
    },

    viewDocument(url) {
      window.open(url, '_blank')
    },

    goToList() {
      this.$router.push('/mypage/funding-status')
    },

    async requestApproval() {
      const confirmed = confirm('검토를 재요청하시겠습니까?');
    
      if (confirmed) {
        try {
          await axios.patch(`/api/project/${this.$route.params.id}/status`, {
            status: '검토중'  // 검토중 상태로 변경
          });
          
          // 성공 시 데이터 다시 불러오기
          alert('재검토 요청이 완료되었습니다.');
          await this.fetchProjectDetails();
        } catch (error) {
          console.error('검토 요청 실패:', error);
          alert('검토 요청에 실패했습니다. 다시 시도해주세요.');
        }
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
            category: categoryId // 카테고리 이름 대신 ID를 설정
          };
          this.isEditing = true;
        } catch (error) {
          console.error('수정 정보 조회 실패:', error);
          // 에러 처리
        }
      } else {
        this.saveChanges();
      }
    },

    addImages(event) {
      const files = Array.from(event.target.files);
      this.newImages.push(...files);
      
      // 미리보기 생성
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.editProject.images.push({
            url: e.target.result,
            name: file.name
          });
        };
        reader.readAsDataURL(file);
      });
    },

    updateContentImage(event) {
      const file = event.target.files[0];
      if (file) {
        this.newContentImage = file;
        
        // 미리보기 생성
        const reader = new FileReader();
        reader.onload = (e) => {
          this.editProject.contentImage = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },

    removeImage(index) {
      this.editProject.images.splice(index, 1);
      if (this.newImages[index]) {
        this.newImages.splice(index, 1);
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
          goalAmount: parseInt(this.editProject.goalAmount)
        };

        const requestDTOBlob = new Blob([JSON.stringify(requestDTO)], { 
          type: 'application/json' 
        });
        formData.append('requestDTO', requestDTOBlob);

        // 이미지 파일들 추가
        if (this.newImages.length > 0) {
          this.newImages.forEach((file) => {
            formData.append('images', file);
          });
        }

        // 상세 이미지 추가
        if (this.newContentImage) {
          formData.append('contentImage', this.newContentImage);
        }

        // FormData 내용 확인
        for (let pair of formData.entries()) {
          console.log(pair[0] + ': ' + pair[1]); 
        }

        // 서버로 전송
        const response = await axios.patch(`/api/project/${this.$route.params.id}`, formData, {
          headers: {
            'Content-Type': undefined
          }
        });

        console.log('서버 응답:', response); // 응답 확인

        // 성공 처리
        alert('프로젝트가 성공적으로 수정되었습니다.');
        this.isEditing = false;
        await this.fetchProjectDetails();

      } catch (error) {
        console.error('프로젝트 수정 실패:', error);
        console.error('에러 응답:', error.response?.data); // 서버 에러 메시지 확인
        alert('프로젝트 수정 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    },

    cancelEdit() {
      if (confirm('수정을 취소하시겠습니까? 변경사항이 저장되지 않습니다.')) {
        this.isEditing = false;
        this.editProject = null;
        this.newImages = [];
        this.newContentImage = null;
      }
    }
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
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  color: #495057;
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

.status-badge.reviewing { background-color: #e9ecef; color: #495057; }
.status-badge.rejected { background-color: #ffebee; color: #c62828; }
.status-badge.funding { background-color: #e3f2fd; color: #1976d2; }
.status-badge.success { background-color: #e8f5e9; color: #2e7d32; }
.status-badge.failed { background-color: #ffebee; color: #c62828; }

/* 펀딩 현황 스타일 */
.funding-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.stat-card {
  background: #f8f9fa;
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
  background-color: #f8f9fa;
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
.loading, .error {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.error {
  color: #dc3545;
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