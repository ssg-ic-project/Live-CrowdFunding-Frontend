<!-- src/views/ReportStatus.vue -->
<template>
  <div class="dashboard">
    

    <!-- 메인 콘텐츠 -->
    <main class="content">


      <!-- 헤더 -->
      <header>
        <span>접속중인 ID: {{ userId }} ({{ userName }})</span>
        <button @click="logout">로그아웃</button>
      </header>


      <!-- 신고 목록 -->
      <section class="report-list">
        <table>
          <thead>
            <tr>
              <th>피신고인 ID</th>
              <th>신고 내용</th>
              <th>신고 프로젝트</th>
              <th>신고 날짜</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="report in reports" :key="report.id" @click="openReportDetail(report)">
              <td>{{ report.reportedUserId }}</td>
              <td>{{ report.reportContent }}</td>
              <td>{{ report.projectName }}</td>
              <td>{{ report.reportDate }}</td>
            </tr>
          </tbody>
        </table>
      </section>

      
      <!-- 신고 상세 모달 -->
      <div v-if="showModal" class="modal">
        <div class="modal-content">
          <span class="close" @click="closeModal">&times;</span>
          <h3>신고 상세 정보</h3>
          <p><strong>신고내역 ID:</strong> {{ selectedReport.id }}</p>
          <p><strong>신고 프로젝트 ID:</strong> {{ selectedReport.projectId }}</p>
          <p><strong>프로젝트명:</strong> {{ selectedReport.projectName }}</p>
          <p><strong>피신고인 ID:</strong> {{ selectedReport.reportedUserId }}</p>
          <p><strong>신고 채팅 내용:</strong> {{ selectedReport.chatContent }}</p>
          <p><strong>신고자(직원) ID:</strong> {{ selectedReport.reporterId }}</p>
          <p><strong>신고 내용 (관리자 코멘트):</strong> {{ selectedReport.reportContent }}</p>
          <p><strong>신고 날짜:</strong> {{ selectedReport.reportDate }}</p>


          <!-- 버튼 그룹 -->
          <div class="button-group">
            <button class="action-button deactivate-button" @click="deactivateUser">비활성화</button>
            <button class="action-button suspend-button" @click="suspendUser">정지</button>
            <button class="action-button delete-button" @click="deleteReport">신고 삭제</button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
data() {
  return {
    userId: "admin123",
    userName: "관리자",
    reports: [
      {
        id: 1,
        projectId: 101,
        projectName: "프로젝트 A",
        reportedUserId: "user1",
        chatContent: "문제의 채팅 내용",
        reporterId: "staff123",
        reportContent: "부적절한 언어 사용",
        reportDate: "2023-10-01",
      },

      {
        id: 2,
        projectId: 102,
        projectName: "프로젝트 B",
        reportedUserId: "user2",
        chatContent: "스팸 메시지",
        reporterId: "staff456",
        reportContent: "스팸 행위",
        reportDate: "2023-10-02",
      },

    ],
    showModal: false,
    selectedReport: null,
  };
},
methods: {
  logout() {
  
  this.$router.push('/admin');
},
  isActive(path) {
    return this.$route.path.startsWith(path);
  },
  openReportDetail(report) {
    this.selectedReport = report;
    this.showModal = true;
  },
  closeModal() {
    this.showModal = false;
    this.selectedReport = null;
  },
  deactivateUser() {
    alert(`사용자 ${this.selectedReport.reportedUserId}가 비활성화되었습니다.`);
    this.closeModal();
  },
  suspendUser() {
    alert(`사용자 ${this.selectedReport.reportedUserId}가 정지되었습니다.`);
    this.closeModal();
  },
  deleteReport() {
    const confirmed = confirm("이 신고를 삭제하시겠습니까?");
    if (confirmed) {
      this.reports = this.reports.filter(
        (report) => report.id !== this.selectedReport.id
      );
      alert("신고가 삭제되었습니다.");
      this.closeModal();
    }
  },
},
};
</script>

<style scoped>
.dashboard {
display: flex;
height: 100vh;
background-color: #f4f6f9;
}

.sidebar {
width: 250px;
background-color: #2f3a4f;
color: white;
padding: 1.5rem;
}

.sidebar h3 {
font-size: 1.8rem;
margin-bottom: 1.5rem;
}

.menu {
list-style-type: none;
padding: 0;
}

.menu li {
position: relative;
}

.menu li a {
display: block;
padding: 1rem 1.5rem;
color: #a9b7c6;
text-decoration: none;
}

.menu li a:hover,
.menu li.active > a {
background-color: #4b5b75;
color: white;
}

.submenu-title {
display: flex;
align-items: center;
padding: 1rem 1.5rem;
color: #a9b7c6;
}

.submenu-title:hover,
.menu li.active > .submenu-title {
background-color: #4b5b75;
color: white;
}

.submenu-list {
list-style-type: none;
padding-left: 0;
margin: 0;
display: block; 
}

.submenu-list li a {
padding: 0.5rem 2rem;
color: #a9b7c6;
}

.submenu-list li a:hover,
.submenu-list li.active > a {
background-color: #4b5b75;
color: white;
}

.arrow-down::after {
content: '';
margin-left: auto;
border: solid white;
border-width: 0 2px 2px 0;
display: inline-block;
padding: 4px;
transform: rotate(135deg);
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


.report-list table {
width: 100%;
border-collapse: collapse;
cursor: pointer;
}

.report-list th,
.report-list td {
border: 1px solid #ccc;
padding: 0.75rem;
text-align: left;
}

.report-list th {
background-color: #f4f4f4;
}

.report-list tr:nth-child(even) {
background-color: #fafafa;
}

.report-list tr:hover {
background-color: #f1f1f1;
}

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
max-width: 600px;
position: relative;
}

.close {
position: absolute;
top: 1rem;
right: 1rem;
cursor: pointer;
font-size: 1.5rem;
}

.modal-content p {
margin-bottom: 1rem;
}

.button-group {
display: flex;
justify-content: flex-end;
gap: 1rem;
margin-top: 2rem;
}

.action-button {
padding: 0.5rem 1rem;
font-size: 1rem;
color: white;
border: none;
border-radius: 4px;
cursor: pointer;
}

.deactivate-button {
background-color: #6c757d;
}

.deactivate-button:hover {
background-color: #5a6268;
}

.suspend-button {
background-color: #dc3545;
}

.suspend-button:hover {
background-color: #c82333;
}

.delete-button {
background-color: #007bff;
}

.delete-button:hover {
background-color: #0069d9;
}
</style>

