<!-- src/views/admin/ProjectDetail.vue -->
<template>
  <div class="dashboard">
    <main class="content">
      <!-- 헤더 -->
      <header>
        <span>접속중인 ID: {{ userId }}</span>
        <button @click="logout">로그아웃</button>
      </header>

      <!-- 프로젝트 상세 정보 -->
      <div class="project-detail">
        <!-- 좌측 패널: 이미지 섹션 -->
        <div class="left-panel">
          <div class="image-section">
            <h3>대표 이미지</h3>
            <img :src="project.thumbnailImage" alt="Thumbnail" class="main-image" />
            
            <h3>추가 이미지</h3>
            <div class="additional-images">
              <img v-for="(image, index) in project.additionalImages" 
                   :key="index" 
                   :src="image"
                   :alt="'Additional image ' + (index + 1)" 
                   class="additional-image" />
            </div>
            
            <h3>상세 이미지</h3>
            <img :src="project.contentImage" alt="Content" class="content-image" />
          </div>
        </div>

        <!-- 우측 패널: 프로젝트 정보 -->
        <div class="right-panel">
          <div class="project-info">


<!--            <h2>{{ project.productName }}-->

<!--&lt;!&ndash;            상태 확인하기&ndash;&gt;-->
<!--            <span :class="['status-badge', getStatusClass(project.progressProjectStatus)]">-->
<!--                {{ project.progressProjectStatus }}-->
<!--              </span>-->
<!--            </h2>-->

            <div class="status-container">
              <h2>{{ project.productName }}</h2>
              <span class="category-badge">
                <i class="fas fa-tag"></i>
                {{ project.category.classification }}
              </span>
              &nbsp;
              <span :class="['status-badge', getStatusClass(project.progressProjectStatus)]">
                {{ project.progressProjectStatus }}
              </span>

            </div>



            
            <!-- 기본 정보 섹션 -->
            <div class="info-section">
              <h3>기본 정보</h3>
              <div class="info-grid">
                <div class="info-item">
                  <label>판매자</label>
                  <p>{{ project.maker.name }}</p>
                </div>
                <div class="info-item">
                  <label>카테고리</label>
                  <p>{{ project.category.classification }}</p>
                </div>
                <div class="info-item">
                  <label>선택 요금제</label>
                  <p>{{ project.ratePlan.planName }}</p>
                </div>
                <div class="info-item">
                  <label>판매가</label>
                  <p>{{ formatPrice(project.price) }}</p>
                </div>
                <div class="info-item">
                  <label>할인율</label>
                  <p>{{ project.discountPercentage }}%</p>
                </div>
                <div class="info-item">
                  <label>목표 금액</label>
                  <p>{{ formatPrice(project.goalAmount) }}</p>
                </div>
              </div>
            </div>

            <!-- 상품 설명 -->
            <div class="description-section">
              <h3>상품 설명</h3>
              <p>{{ project.summary }}</p>
            </div>

            <!-- 문서 검토 섹션 -->
            <div class="document-section">
              <h3>제출 문서</h3>
              <ul class="document-list">
                <li v-for="(doc, index) in project.documents" :key="index">
                  <div class="document-item">
                    <span class="doc-name" @click="openDocument(doc)">
                      {{ doc.content }}
                    </span>
                    <div class="doc-controls">
                      <button
                        :class="['review-status', { reviewed: doc.reviewed }]"
                        @click="toggleReviewStatus(index)"
                      >
                        {{ doc.reviewed ? '검토 완료' : '검토 중' }}
                      </button>
                      <button 
                        class="review-memo"
                        @click="openMemoModal(index)"
                      >
                        메모
                      </button>
                    </div>
                  </div>
                  <p v-if="doc.memo" class="doc-memo">메모: {{ doc.memo }}</p>
                </li>
              </ul>
            </div>

            <!-- 승인/반려 버튼 그룹 -->
            <div class="button-group">
              <button class="action-button" @click="goBack">목록</button>
              <button
                class="action-button approve-button"
                :disabled="!allDocumentsReviewed"
                @click="openApproveModal"
              >
                승인
              </button>
              <button 
                class="action-button reject-button" 
                @click="openRejectModal"
              >
                반려
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 문서 조회 모달 -->
      <div v-if="showModal" class="modal">
        <div class="modal-content" style="width: 95%; max-width: 1200px; height: 50vh;">
          <span class="close" @click="closeModal">&times;</span>
          <h3>{{ selectedDoc.name }}</h3>
<!--          <div class="document-preview" v-html="convertedHtml">-->
<!--          <div class="document-preview" ref="convertedHtml">-->
          <div class="document-preview">
            <iframe
                :src="getDocumentViewerUrl(selectedDoc.url)"
                width="100%"
                height="1000px"
                frameborder="0">
            </iframe>
          </div>


<!--            <iframe :src="selectedDoc.url" frameborder="0"></iframe>-->
<!--            <p>{{ selectedDoc.url }}</p>-->
          </div>
        </div>


      <!-- 메모 입력 모달 -->
      <div v-if="showMemoModal" class="modal">
        <div class="modal-content">
          <span class="close" @click="closeMemoModal">&times;</span>
          <h3>검토 메모</h3>
          <textarea 
            v-model="currentMemo" 
            placeholder="검토 메모를 입력하세요"
          ></textarea>
          <button class="submit-button" @click="saveMemo">저장</button>
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

      <!-- 반려 사유 모달 -->
      <div v-if="showRejectModal" class="modal">
        <div class="modal-content">
          <span class="close" @click="closeRejectModal">&times;</span>
          <h3>반려 사유 입력</h3>
          <textarea 
            v-model="rejectReason" 
            placeholder="반려 사유를 입력하세요"
          ></textarea>
          <button class="submit-button" @click="submitRejection">제출</button>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import {projectApi} from "@/api/projectApi.js";

export default {
  name: 'ProjectDetail',
  props: ['id'],
  data() {
    return {
      userId: localStorage.getItem("adminId"),
      userName: '관리자',
      project: {
        id: null,
        productName: '',
        maker: {},
        manager: {},
        ratePlan: {},
        category: {},
        contentImage: '',
        discountPercentage: 0,
        endAt: '',
        goalAmount: 0,
        percentage: 0,
        price: 0,
        progressProjectStatus: '',
        rejectionReason: null,
        reviewProjectStatus: '',
        startAt: '',
        summary: '',
        thumbnailImage: '',
        additionalImages: [],
        documents: [],
        reviewStatus: '승인 대기'
      },
      showModal: false,
      showMemoModal: false,
      showRejectModal: false,
      showApproveModal: false,
      // selectedDoc: null,
      selectedDoc: {
        name: '',
        url: ''
      },
      convertedHtml: '',
      currentMemoIndex: null,
      currentMemo: '',
      rejectReason: '',
    };
  },
  computed: {
    allDocumentsReviewed() {
      return this.project.documents.every((doc) => doc.reviewed);
    }
  },
  methods: {

    getStatusClass(status) {
      if (!status) return ''
      switch(status) {
        case '펀딩중': return 'status-funding';
        case '성공': return 'status-success';
        case '미달성': return 'status-fail';
        default: return '';
      }
    },

    getDocumentViewerUrl(docUrl){
      return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(docUrl)}`;
    },
    formateDate(dateString){
      const date = new Date(dateString);
      return date.toLocaleDateString();
    },
    formatPrice(price) {
      return new Intl.NumberFormat('ko-KR', { 
        style: 'currency', 
        currency: 'KRW'
      }).format(price);
    },
    logout() {
      this.$router.push('/admin');
    },
    openDocument(doc) {
      this.selectedDoc = doc;
      // this.selectedDoc = {
      //   url: url,
      //   name: name
      // }
      this.showModal = true;
    },
      // try {
      //   console.log('check open doc yejin', doc.url);
      //   // API로부터 docx 파일을 Blob으로 가져오기
        //const response = await fetch(doc.url);

          // // fetch에 옵션 추가
          // const response = await fetch(doc.url, {
          //   method: 'GET',
          //   headers: {
          //     'Accept': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          //   },
          //   mode: 'cors', // CORS 모드 명시
          // });
          //
          // if (!response.ok) {
          //   throw new Error(`HTTP error! status: ${response.status}`);
          // }
          //
        // const response = await projectApi.getDocumentContent(doc.url);
        // const arrayBuffer = response.data;
        // const result = await mammoth.convertedHtml({arrayBuffer});
        // const container = this.$refs.convertedHtml;
        // if(container){
        //   container.innerHTML = result.value;
        // }

        // console.log('check open response yejin', response);
        // const blob = await response.blob();
        // console.log("chcek blob:", blob);
        // // Blob을 ArrayBuffer로 변환
        // const arrayBuffer = await blob.arrayBuffer();
        // onsole.log("chcek arrayBuffer:", arrayBuffer);
        //
        // // mammoth를 사용해 HTML로 변환
        // const result = await mammoth.convertToHtml({arrayBuffer: arrayBuffer});
        //
        // // 안전하게 HTML 삽입
        // const changedContent = this.$refs.convertedHtml;
        // if (changedContent) {
        //   changedContent.innerHTML = result.value;
        //   console.log(changedContent);
      //   // }
      // } catch (error) {
      //   console.error('문서 변환 실패:', error);
      // }

      //
      // try {
      //   const mammoth = require('mammoth');
      //   const result = await mammoth.convertToHtml({path: url});
      //   let convertedHtml;
      //   convertedHtml = result.value;
      // }catch (error) {
      //   console.log('문서 변환 실패: ', error);
      //   throw new Error('지원되지 않는 문서 유형입니다.');
      // }
    // },
    closeModal() {
      this.showModal = false;
      this.convertedHtml = '',
      this.selectedDoc = {
        name: '',
        url: ''
      }
      // this.selectedDoc = null;
    },
    toggleReviewStatus(index) {
      this.project.documents[index].reviewed = !this.project.documents[index].reviewed;
    },
    openMemoModal(index) {
      this.currentMemoIndex = index;
      this.currentMemo = this.project.documents[index].memo;
      this.showMemoModal = true;
    },
    closeMemoModal() {
      this.showMemoModal = false;
      this.currentMemoIndex = null;
      this.currentMemo = '';
    },
    saveMemo() {
      if (this.currentMemoIndex !== null) {
        this.project.documents[this.currentMemoIndex].memo = this.currentMemo;
      }
      this.closeMemoModal();
    },
    openApproveModal() {
      this.showApproveModal = true;
    },
    closeApproveModal() {
      this.showApproveModal = false;
    },
    async confirmApproval() {
      try{
        const request = {
          status: '승인',
          rejectionReason: null,
          managerId: localStorage.getItem("adminId")
        };
        await projectApi.updateApprovalStatus(this.project.id, request);
        alert('승인이 완료되었습니다');
        this.closeApproveModal();
        this.$router.push({ name: 'ProjectManagement' });
      }catch(error){
        console.error('프로젝트 승인 실패: ', error);
        alert('프로젝트 승인 처리 중 오류가 발생했습니다');
      }

    },
    openRejectModal() {
      this.showRejectModal = true;
    },
    closeRejectModal() {
      this.showRejectModal = false;
      this.rejectReason = '';
    },
    async submitRejection() {
      if (!this.rejectReason.trim()) {
        alert('반려 사유를 입력해주세요.');
        return;
      }
      try{
        const request = {
          status: '반려',
          rejectionReason: this.rejectReason
        };
        await projectApi.updateApprovalStatus(this.project.id, request);
        this.closeRejectModal();
        this.$router.push({name: 'ProjectManagement'});
      }catch(error){
        console.error('프로젝트 반려 실패: ', error);
        alert('프로젝트 반려 처리 중 오류가 발생했습니다.');
      }

    },
    goBack() {
      this.$router.push({ name: 'ProjectManagement' });
    }
  },
  async created() {
    try {
      const response = await projectApi.getProject(this.id);
      //this.project = response.data;
      this.project = {
        ...response.data,
        documents: this.project.documents
      }
      console.log("check: ", this.project);
      console.log(response.data.productName);

      //images 가지고 오기
      const imageresponse = await projectApi.getImages(this.id);
      this.project.thumbnailImage = imageresponse.data[0].url;
      this.project.additionalImages = imageresponse.data.slice(1).map(img => img.url);  // 나머지 이미지들
      console.log("check images:", imageresponse);

      //docs 가지고 오기
      const docsresponse = await projectApi.getProjectDocs(this.id);
      console.log(docsresponse);
      docsresponse.data.forEach(doc => {
        this.project.documents.push({
          name: doc.name,
          content: doc.docType,
          url: doc.url,
          reviewed: false,
          memo: ''
        })
      })
      //this.project.documents = docsresponse.data;


    } catch (error) {
      console.error('프로젝트 상세 정보 조회 실패:', error);
      // 에러 처리 로직 작성
    }
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
  transition: background-color 0.3s;
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

.image-section h3 {
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  color: #333;
  font-size: 1.2rem;
}

.main-image,
.content-image {
  width: 100%;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.additional-images {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}

.additional-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s;
}

.additional-image:hover {
  transform: scale(1.05);
}

.project-info h2 {
  margin-bottom: 1.5rem;
  color: #333;
  font-size: 1.8rem;
}

.info-section {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.info-section h3 {
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.info-item {
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 4px;
}

.info-item label {
  color: #666;
  font-size: 0.9rem;
  display: block;
  margin-bottom: 0.5rem;
}

.info-item p {
  font-size: 1.1rem;
  color: #333;
  font-weight: 500;
  margin: 0;
}

.description-section {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.description-section h3 {
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.description-section p {
  color: #666;
  line-height: 1.6;
}

.document-section {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.document-section h3 {
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.document-list {
  list-style: none;
  padding: 0;
}

.document-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  background: #f8f9fa;
}

.doc-name {
  color: #0065cb;
  cursor: pointer;
  text-decoration: underline;
  font-weight: 500;
}

.doc-name:hover {
  color: #0055a3;
}

.doc-controls {
  display: flex;
  gap: 0.5rem;
}

.review-status,
.review-memo {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s;
}

.review-status.reviewed {
  background-color: #28a745;
  color: white;
}

.review-status.reviewed:hover {
  background-color: #218838;
}

.review-status:not(.reviewed) {
  background-color: #dc3545;
  color: white;
}

.review-status:not(.reviewed):hover {
  background-color: #c82333;
}

.review-memo {
  background-color: #6c757d;
  color: white;
}

.review-memo:hover {
  background-color: #5a6268;
}

.doc-memo {
  margin: 0.5rem 0 1rem 1rem;
  color: #666;
  font-style: italic;
  font-size: 0.9rem;
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
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.action-button:first-child {
  background-color: #6c757d;
  color: white;
}

.action-button:first-child:hover {
  background-color: #5a6268;
}

.approve-button {
  background-color: #28a745;
  color: white;
}

.approve-button:hover {
  background-color: #218838;
}

.approve-button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
  opacity: 0.7;
}

.reject-button {
  background-color: #dc3545;
  color: white;
}

.reject-button:hover {
  background-color: #c82333;
}

/* Modal Styles */
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
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  position: relative;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  cursor: pointer;
  font-size: 1.5rem;
  color: #666;
  transition: color 0.3s;
}

.close:hover {
  color: #333;
}

.modal h3 {
  margin-bottom: 1.5rem;
  color: #333;
  font-size: 1.4rem;
}

.document-preview {
  max-height: 400px;
  overflow-y: auto;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 4px;
  margin-bottom: 1rem;
}

textarea {
  width: 100%;
  min-height: 120px;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  margin: 1rem 0;
  resize: vertical;
}

textarea:focus {
  outline: none;
  border-color: #0065cb;
}

.submit-button {
  padding: 0.75rem 1.5rem;
  background-color: #0065cb;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #0055a3;
}

.confirm-button,
.cancel-button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
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

/* Responsive Styles */
@media (max-width: 1024px) {
  .project-detail {
    flex-direction: column;
  }

  .left-panel,
  .right-panel {
    flex: none;
    width: 100%;
  }

  .info-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .content {
    padding: 1rem;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .additional-images {
    justify-content: center;
  }

  .button-group {
    flex-direction: column;
  }

  .modal-content {
    width: 95%;
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .document-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .doc-controls {
    width: 100%;
    justify-content: stretch;
  }

  .review-status,
  .review-memo {
    flex: 1;
    text-align: center;
  }

  /* 상태별 스타일 */

  .status-badge.status-funding {
    background-color: #e3f2fd;
    color: #1976d2;
    border: 1px solid #90caf9;
  }

  .status-badge.status-funding {
    background-color: rgba(25, 118, 210, 0.1);
    color: #1976D2;
    border: 1px solid rgba(25, 118, 210, 0.3);
  }


  .status-badge.status-success i {
    color: #2e7d32;
  }
  .status-badge.status-success {
    background-color: rgba(46, 125, 50, 0.1);
    color: #2E7D32;
    border: 1px solid rgba(46, 125, 50, 0.3);
  }
  .status-badge.status-fail {
    background-color: rgba(198, 40, 40, 0.1);
    color: #C62828;
    border: 1px solid rgba(198, 40, 40, 0.3);
  }

  .status-badge.status-fail i {
    color: #c62828;
  }

  .status-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.3rem 0.8rem;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 500;
  }

  /*.category-badge {
  //  background-color: #f3f4f6;
  //  color: #666;
  }*/

  .category-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.3rem 0.8rem;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 500;
    background-color: #f3f4f6;
    color: #666;
  }





}
</style>