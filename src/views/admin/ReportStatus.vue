<!-- src/views/ReportStatus.vue -->
<template>
  <div class="dashboard">
    <main class="content">
      <!-- 헤더 -->
      <header>
        <span>접속중인 ID: {{ userId }}</span>
        <button @click="logout">로그아웃</button>
      </header>

      <div class="main-content">
        <!-- 왼쪽 섹션: 신고 목록 -->
        <section class="content-section">
          <div class="section-header">
            <h2>신고 목록</h2>
          </div>
          <div class="section-content">
            <!-- 신고 목록 테이블 -->
            <div class="report-list">
              <table>
                <thead>
                  <tr>
                    <th>신고 ID</th>
                    <th>피신고인 ID</th>
                    <th>프로젝트 ID</th>
                    <th>신고자 ID</th>
                    <th>신고 날짜</th>
                  </tr>
                </thead>
                <tbody>
                  <tr 
                    v-for="report in reports" 
                    :key="report.id" 
                    @click="selectReport(report)"
                    :class="{ 'selected': selectedReport && selectedReport.id === report.id }"
                  >
                    <td>{{ report.id }}</td>
                    <td>{{ report.userId }}</td>
                    <td>{{ report.projectId }}</td>
                    <td>{{ report.managerId }}</td>
                    <td>{{ report.createdAt }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- 페이지네이션 -->
            <div class="pagination">
              <button
                :disabled="!pageInfo.prev"
                @click="changePage(currentPage - 1)"
                class="pagination-button"
              >
                이전
              </button>
              <span v-for="pageNum in pageNumbers" :key="pageNum">
                <button
                  @click="changePage(pageNum)"
                  :class="['page-btn', { active: currentPage === pageNum }]"
                >
                  {{ pageNum }}
                </button>
              </span>
              <button
                :disabled="!pageInfo.next"
                @click="changePage(currentPage + 1)"
                class="pagination-button"
              >
                다음
              </button>
            </div>
          </div>
        </section>

        <!-- 오른쪽 섹션: 신고 상세정보 -->
        <section class="content-section">
          <div class="section-header">
            <h2>신고 상세정보</h2>
          </div>
          <div class="section-content" v-if="selectedReport">
            <div class="report-details">
              <p><strong>신고내역 ID:</strong> {{ selectedReport.id }}</p>
              <p><strong>신고 프로젝트 ID:</strong> {{ selectedReport.projectId }}</p>
              <p><strong>피신고인 ID:</strong> {{ selectedReport.userId }}</p>
              <p><strong>신고 채팅 내용:</strong> {{ selectedReport.chatMessage }}</p>
              <p><strong>신고자(직원) ID:</strong> {{ selectedReport.managerId }}</p>
              <p><strong>신고 내용:</strong> {{ selectedReport.reason }}</p>
              <p><strong>신고 날짜:</strong> {{ selectedReport.createdAt }}</p>

              <!-- 버튼 그룹 -->
              <div class="action-buttons">
                <button class="action-button deactivate-button" @click="deactivateUser">비활성화</button>
                <button class="action-button suspend-button" @click="suspendUser">정지</button>
                <button class="action-button delete-button" @click="deleteReport">신고 삭제</button>
              </div>
            </div>
          </div>
          <div class="section-content empty-state" v-else>
            <p>신고를 선택하시면 상세정보가 표시됩니다.</p>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script>
import {chatApi} from '@/api/chatApi';

export default {
data() {
  return {
    userId: localStorage.getItem("adminId"),
    userName: "관리자",
    reports: [],
    currentPage: 1,
    showModal: false,
    selectedReport: null,
    pageInfo: {},
  };
},
  mounted(){
    this.fetchReports();
  },
  computed: {
    pageNumbers() {
      if (!this.pageInfo.start || !this.pageInfo.end) return [];
      const pages = [];
      for (let i = this.pageInfo.start; i <= this.pageInfo.end; i++) {
        pages.push(i);
      }
      return pages;
    }
  },
  methods: {
    async changePage(newPage) {
      this.currentPage = newPage;
      await this.fetchReports();
    },
    async fetchReports() {
      try {
        const response = await chatApi.getReportList({page: this.currentPage});
        this.reports = response.data.dataList;
        this.pageInfo = response.data.pageInfoDTO;
      } catch (error) {
        console.error('신고 데이터를 불러오는 중 오류가 발생했습니다: ', error);
      }
    },
    selectReport(report) {
      this.selectedReport = report;
    },
    async deactivateUser() {
      try {
        await chatApi.updateUserStatus(this.selectedReport.id, '비활성화', true);
        alert(`사용자 ${this.selectedReport.userId}가 비활성화되었습니다.`);
        await this.fetchReports();
      } catch (error) {
        console.error('사용자 비활성화 중 오류가 발생했습니다: ', error);
        alert('사용자 비활성화에 실패했습니다.');
      }
    },
    logout() {
      this.$router.push('/admin');
    },
    async suspendUser() {
      try {
        await chatApi.updateUserStatus(this.selectedReport.id, '정지', true);
        alert(`사용자 ${this.selectedReport.userId}가 정지되었습니다.`);
        await this.fetchReports();
      } catch (error) {
        console.error('사용자 정지 중 오류가 발생했습니다:', error);
        alert('사용자 정지에 실패했습니다.');
      }
    },
    async deleteReport() {
      const confirmed = confirm("이 신고를 삭제하시겠습니까?");
      if (confirmed) {
        try {
          await chatApi.updateUserStatus(this.selectedReport.id, '활성화', true);
          alert("신고가 삭제되었습니다.");
          this.selectedReport = null;
          await this.fetchReports();
        } catch (error) {
          console.error('신고 삭제 중 오류가 발생했습니다:', error);
          alert('신고 삭제에 실패했습니다.');
        }
      }
    },
  },
};
</script>

<style scoped>
.dashboard {
  display: flex;
  min-height: 100vh;
  background-color: #ffffff;
  width: 100%;
}

.content {
  flex: 1;
  padding: 1.5rem;
  width: 100%;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1rem 1.5rem;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  width: 100%;
}

header button {
  padding: 0.5rem 1rem;
  background-color: #FF5151;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

header button:hover {
  background-color: #FFD74E;
  color: #333333;
  transform: translateY(-1px);
}

.main-content {
  display: grid;
  grid-template-columns: 60% 40%;
  gap: 2rem;
  flex: 1;
  width: 100%;
}

.content-section {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  width: 100%;
}

.section-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #eee;
  background-color: #fff;
  border-radius: 12px 12px 0 0;
}

.section-header h2 {
  margin: 0;
  font-size: 1.25rem;
  color: #333;
  font-weight: 600;
}

.section-content {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
}

.report-list table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-bottom: 1rem;
}

.report-list th,
.report-list td {
  border: 1px solid #eee;
  padding: 1rem;
  text-align: left;
}

.report-list th {
  background-color: #ffffff;
  font-weight: 600;
  color: #444;
}

.report-list tr {
  cursor: pointer;
  transition: all 0.2s ease;
}

.report-list tr:hover {
  background-color: #fff8e7;
}

.report-list tr.selected {
  background-color: #FFF3D4;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 0;
  margin-top: 1rem;
  border-top: 1px solid #eee;
}

.pagination button {
  padding: 0.5rem 1rem;
  border: 1px solid #e0e0e0;
  background-color: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #666;
}

.pagination button:not(:disabled):hover {
  background-color: #FFD74E;
  border-color: #FFD74E;
  color: #333333;
  transform: translateY(-1px);
}

.pagination button:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
  border-color: #eee;
}

.page-btn {
  padding: 0.5rem;
  min-width: 35px;
  height: 35px;
  border: 1px solid #e0e0e0;
  background-color: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #666;
}

.page-btn.active {
  background-color: #FF5151;
  color: white;
  border-color: #FF5151;
}

.page-btn:hover:not(.active) {
  background-color: #FFD74E;
  border-color: #FFD74E;
  color: #333333;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #666;
  font-size: 1rem;
  background-color: #ffffff;
  border-radius: 8px;
}

.report-details p {
  padding: 0.75rem 0;
  border-bottom: 1px solid #eee;
  margin: 0;
}

.report-details p:last-child {
  border-bottom: none;
}

.report-details strong {
  display: inline-block;
  width: 120px;
  color: #555;
  font-weight: 600;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  justify-content: flex-end;
}

.action-button {
  padding: 0.625rem 1.25rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.deactivate-button {
  background-color: #FF5151;
  color: white;
}

.deactivate-button:hover {
  background-color: #FFD74E;
  color: #333333;
}

.suspend-button {
  background-color: #FF5151;
  color: white;
}

.suspend-button:hover {
  background-color: #FFD74E;
  color: #333333;
}

.delete-button {
  background-color: #FF5151;
  color: white;
}

.delete-button:hover {
  background-color: #FFD74E;
  color: #333333;
}

@media (max-width: 768px) {
  .main-content {
    grid-template-columns: 1fr;
  }
  
  .content-section {
    margin-bottom: 2rem;
  }
}
</style>