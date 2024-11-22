<!-- src/views/admin/ProjectDetail.vue -->
<template>
  <div class="dashboard">


    <!-- 메인 콘텐츠 -->
    <main class="content">


      <!-- 헤더 -->
      <header>
        <span>접속중인 ID: {{ userId }} ({{ userName }})</span>
        <button @click="logout">로그아웃</button>
      </header>


      <!-- 프로젝트 상세 정보 -->
      <div class="project-detail">


        <!-- 좌측 패널 -->
        <div class="left-panel">
          <img :src="project.image" alt="Project Image" class="project-image" />
        </div>


        <!-- 우측 패널 -->
        <div class="right-panel">
          <h2>{{ project.name }}</h2>
          <p>판매자: {{ project.seller }}</p>


          <!-- 문서 리스트 -->
          <ul class="document-list">
            <li v-for="(doc, index) in project.documents" :key="index">
              <span @click="openDocument(doc)">{{ doc.name }}</span>
              <button
                :class="{ reviewed: doc.reviewed }"
                @click="toggleReviewStatus(index)"
              >
                {{ doc.reviewed ? '검토 완료' : '검토 중' }}
              </button>
            </li>
          </ul>


          <!-- 버튼 그룹 -->
          <div class="button-group">
            <button class="action-button" @click="goBack">목록</button>
            <button
              class="action-button approve-button"
              :disabled="!allDocumentsReviewed"
              @click="openApproveModal"
            >
              승인
            </button>
            <button class="action-button reject-button" @click="openRejectModal">
              반려
            </button>
          </div>
        </div>
      </div>


      <!-- 문서 모달 -->
      <div v-if="showModal" class="modal">
        <div class="modal-content">
          <span class="close" @click="closeModal">&times;</span>
          <h3>{{ selectedDoc.name }}</h3>
          <p>{{ selectedDoc.content }}</p>
        </div>
      </div>


      <!-- 승인 확인 모달 -->
      <div v-if="showApproveModal" class="modal">
        <div class="modal-content">
          <h3>승인하시겠습니까?</h3>
          <div class="button-group">
            <button class="confirm-button" @click="confirmApproval">확인</button>
            <button class="cancel-button" @click="closeApproveModal">취소</button>
          </div>
        </div>
      </div>


      <!-- 승인 완료 모달 -->
      <div v-if="showApprovedModal" class="modal">
        <div class="modal-content">
          <h3>프로젝트가 승인되었습니다.</h3>
          <button class="close-button" @click="closeApprovedModal">확인</button>
        </div>
      </div>

      
      <!-- 반려 사유 모달 -->
      <div v-if="showRejectModal" class="modal">
        <div class="modal-content">
          <span class="close" @click="closeRejectModal">&times;</span>
          <h3>반려 사유 입력</h3>
          <textarea v-model="rejectReason" placeholder="반려 사유를 입력하세요"></textarea>
          <button class="submit-button" @click="submitRejection">제출</button>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'ProjectDetail',
  props: ['id'],
  data() {
    return {
      userId: 'admin123',
      userName: '관리자',
      project: {
        id: this.id,
        name: '',
        seller: '판매자 A',
        image: 'https://via.placeholder.com/300',
        documents: [
          { name: '설계서.pdf', content: '설계서 내용', reviewed: false },
          { name: '사업 계획서.pdf', content: '사업 계획서 내용', reviewed: false },
          { name: '마케팅 전략.pdf', content: '마케팅 전략 내용', reviewed: false },
        ],
        reviewStatus: '승인 대기',
      },
      showModal: false,
      selectedDoc: null,
      showRejectModal: false,
      rejectReason: '',
      showApproveModal: false,
      showApprovedModal: false,
    };
  },
  computed: {
    allDocumentsReviewed() {
      return this.project.documents.every((doc) => doc.reviewed);
    },
  },
  methods: {
    logout() {
      this.$router.push('/admin');
    },
    isActive(path) {
      return this.$route.path.startsWith(path);
    },
    openDocument(doc) {
      this.selectedDoc = doc;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.selectedDoc = null;
    },
    toggleReviewStatus(index) {
      this.project.documents[index].reviewed = !this.project.documents[index].reviewed;
    },
    openApproveModal() {
      this.showApproveModal = true;
    },
    closeApproveModal() {
      this.showApproveModal = false;
    },
    confirmApproval() {
      this.showApproveModal = false;
      this.project.reviewStatus = '승인';
      this.showApprovedModal = true;
    },
    closeApprovedModal() {
      this.showApprovedModal = false;
      this.$router.push({ name: 'ProjectManagement' });
    },
    goBack() {
      this.$router.push({ name: 'ProjectManagement' });
    },
    openRejectModal() {
      this.showRejectModal = true;
    },
    closeRejectModal() {
      this.showRejectModal = false;
      this.rejectReason = '';
    },
    submitRejection() {
      if (this.rejectReason.trim() === '') {
        alert('반려 사유를 입력해주세요.');
        return;
      }
      alert(`프로젝트가 반려되었습니다.\n사유: ${this.rejectReason}`);

      this.project.reviewStatus = '반려';
      this.closeRejectModal();
      this.goBack();
    },
  },
  mounted() {
    this.project.name = `프로젝트 ${this.project.id}`;
  },
};
</script>

<style scoped>
.dashboard {
  display: flex;
  height: 100vh;
  background-color: #f4f6f9;
}

.content {
  flex: 1;
  padding: 2rem;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

header button {
  padding: 0.5rem 1rem;
  background-color: #0065cb;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

header button:hover {
  background-color: #0055a3;
}

.project-detail {
  display: flex;
  gap: 2rem;
}

.left-panel {
  flex: 1;
}

.right-panel {
  flex: 2;
}

.project-image {
  width: 100%;
  border-radius: 8px;
}

.document-list {
  list-style-type: none;
  padding: 0;
  margin-top: 1rem;
}

.document-list li {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.document-list span {
  cursor: pointer;
  color: #0065cb;
  text-decoration: underline;
}

.document-list button {
  margin-left: 1rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.document-list button.reviewed {
  background-color: green;
  color: white;
}

.document-list button:not(.reviewed) {
  background-color: red;
  color: white;
}

.button-group {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.action-button {
  flex: 1;
  padding: 0.75rem 0;
  font-size: 1rem;
  background-color: #cccccc;
  color: #333;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.action-button:hover {
  background-color: #bbbbbb;
}

.approve-button {
  background-color: #28a745;
  color: white;
}

.approve-button:hover {
  background-color: #218838;
}

.approve-button:disabled {
  background-color: gray;
  cursor: not-allowed;
}

.reject-button {
  background-color: #dc3545;
  color: white;
}

.reject-button:hover {
  background-color: #c82333;
}

/* 모달 스타일 */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  position: relative;
  text-align: center;
}

.close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  cursor: pointer;
  font-size: 1.5rem;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
}

.confirm-button,
.cancel-button,
.close-button {
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.confirm-button {
  background-color: #28a745;
  color: white;
}

.confirm-button:hover {
  background-color: #218838;
}

.cancel-button {
  background-color: #dc3545;
  color: white;
}

.cancel-button:hover {
  background-color: #c82333;
}

.close-button {
  background-color: #0065cb;
  color: white;
}

.close-button:hover {
  background-color: #0055a3;
}

.modal textarea {
  width: 100%;
  height: 100px;
  margin-top: 1rem;
  padding: 0.5rem;
  font-size: 1rem;
}

.submit-button {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background-color: #0065cb;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #0055a3;
}
</style>
