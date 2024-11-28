<!-- src/views/admin/ProjectManagement.vue -->
<template>
  <div class="dashboard">


    <!-- 메인 콘텐츠 -->
    <main class="content">


      <!-- 헤더 -->
      <header>
        <span>접속중인 ID: {{ userId }} ({{ userName }})</span>
        <button @click="logout">로그아웃</button>
      </header>


      <!-- 필터 및 검색 섹션 -->
      <section class="filters">
        <select v-model="selectedReviewStatus">
          <option value="">프로젝트 검토 상태</option>
          <option value="승인 대기">승인 대기</option>
          <option value="승인">승인</option>
          <option value="반려">반려</option>
        </select>

        <select v-model="selectedProgressStatus">
          <option value="">진행 상태</option>
          <option value="진행 중">진행 중</option>
          <option value="완료">완료</option>
          <option value="취소">취소</option>
        </select>

        <input type="date" v-model="startDate" placeholder="시작일" />
        <input type="date" v-model="endDate" placeholder="종료일" />

        <input type="text" v-model="searchQuery" placeholder="검색어를 입력하세요" />
        <button @click="filterProjects">검색</button>
      </section>

      s
      <!-- 프로젝트 카드 목록 -->
      <section class="project-cards">
        <div
          v-for="project in filteredProjects"
          :key="project.id"
          class="project-card"
          @click="goToProjectDetail(project.id)"
        >
          <img :src="project.image" alt="Project Image" class="project-image" />
          <div class="project-info">
            <h3>{{ project.name }}</h3>
            <p>판매자: {{ project.seller }}</p>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userId: "admin123",
      userName: "관리자",
      selectedReviewStatus: "",
      selectedProgressStatus: "",
      startDate: "",
      endDate: "",
      searchQuery: "",
      projects: [
      { id: 1, name: '프로젝트 A', seller: '판매자 A', image: 'https://via.placeholder.com/150', reviewStatus: '승인 대기', progressStatus: '진행 중' },
      { id: 2, name: '프로젝트 B', seller: '판매자 B', image: 'https://via.placeholder.com/150', reviewStatus: '승인', progressStatus: '완료' },
      { id: 3, name: '프로젝트 C', seller: '판매자 C', image: 'https://via.placeholder.com/150', reviewStatus: '승인 대기', progressStatus: '진행 중' },
      { id: 4, name: '프로젝트 D', seller: '판매자 D', image: 'https://via.placeholder.com/150', reviewStatus: '반려', progressStatus: '취소' },
      { id: 5, name: '프로젝트 E', seller: '판매자 E', image: 'https://via.placeholder.com/150', reviewStatus: '승인', progressStatus: '진행 중' },
      { id: 6, name: '프로젝트 F', seller: '판매자 F', image: 'https://via.placeholder.com/150', reviewStatus: '승인 대기', progressStatus: '완료' },
      { id: 7, name: '프로젝트 G', seller: '판매자 G', image: 'https://via.placeholder.com/150', reviewStatus: '승인', progressStatus: '취소' },
      { id: 8, name: '프로젝트 H', seller: '판매자 H', image: 'https://via.placeholder.com/150', reviewStatus: '승인', progressStatus: '진행 중' },
      { id: 9, name: '프로젝트 I', seller: '판매자 I', image: 'https://via.placeholder.com/150', reviewStatus: '반려', progressStatus: '진행 중' },
      { id: 10, name: '프로젝트 J', seller: '판매자 J', image: 'https://via.placeholder.com/150', reviewStatus: '승인 대기', progressStatus: '완료' },
      { id: 11, name: '프로젝트 K', seller: '판매자 K', image: 'https://via.placeholder.com/150', reviewStatus: '승인', progressStatus: '진행 중' },
      { id: 12, name: '프로젝트 L', seller: '판매자 L', image: 'https://via.placeholder.com/150', reviewStatus: '승인 대기', progressStatus: '취소' },
      { id: 13, name: '프로젝트 M', seller: '판매자 M', image: 'https://via.placeholder.com/150', reviewStatus: '승인', progressStatus: '완료' },
      { id: 14, name: '프로젝트 N', seller: '판매자 N', image: 'https://via.placeholder.com/150', reviewStatus: '반려', progressStatus: '진행 중' },
      { id: 15, name: '프로젝트 O', seller: '판매자 O', image: 'https://via.placeholder.com/150', reviewStatus: '승인', progressStatus: '취소' },
      { id: 16, name: '프로젝트 P', seller: '판매자 P', image: 'https://via.placeholder.com/150', reviewStatus: '승인 대기', progressStatus: '완료' },
      { id: 17, name: '프로젝트 Q', seller: '판매자 Q', image: 'https://via.placeholder.com/150', reviewStatus: '승인', progressStatus: '진행 중' },
      { id: 18, name: '프로젝트 R', seller: '판매자 R', image: 'https://via.placeholder.com/150', reviewStatus: '반려', progressStatus: '취소' },
      { id: 19, name: '프로젝트 S', seller: '판매자 S', image: 'https://via.placeholder.com/150', reviewStatus: '승인', progressStatus: '진행 중' },
      { id: 20, name: '프로젝트 T', seller: '판매자 T', image: 'https://via.placeholder.com/150', reviewStatus: '승인 대기', progressStatus: '완료' },
      { id: 21, name: '프로젝트 U', seller: '판매자 U', image: 'https://via.placeholder.com/150', reviewStatus: '승인', progressStatus: '취소' },
      { id: 22, name: '프로젝트 V', seller: '판매자 V', image: 'https://via.placeholder.com/150', reviewStatus: '반려', progressStatus: '진행 중' },
      { id: 23, name: '프로젝트 W', seller: '판매자 W', image: 'https://via.placeholder.com/150', reviewStatus: '승인', progressStatus: '완료' },
      { id: 24, name: '프로젝트 X', seller: '판매자 X', image: 'https://via.placeholder.com/150', reviewStatus: '승인 대기', progressStatus: '취소' },
      { id: 25, name: '프로젝트 Y', seller: '판매자 Y', image: 'https://via.placeholder.com/150', reviewStatus: '승인', progressStatus: '진행 중' },
      { id: 26, name: '프로젝트 Z', seller: '판매자 Z', image: 'https://via.placeholder.com/150', reviewStatus: '반려', progressStatus: '완료' },
      { id: 27, name: '프로젝트 AA', seller: '판매자 AA', image: 'https://via.placeholder.com/150', reviewStatus: '승인', progressStatus: '취소' },
      { id: 28, name: '프로젝트 BB', seller: '판매자 BB', image: 'https://via.placeholder.com/150', reviewStatus: '승인 대기', progressStatus: '진행 중' },
      { id: 29, name: '프로젝트 CC', seller: '판매자 CC', image: 'https://via.placeholder.com/150', reviewStatus: '승인', progressStatus: '완료' },
      { id: 30, name: '프로젝트 DD', seller: '판매자 DD', image: 'https://via.placeholder.com/150', reviewStatus: '반려', progressStatus: '진행 중' },
    ],
    reviewStatusOptions: ['승인', '승인 대기', '반려'],
    progressStatusOptions: ['진행 중', '완료', '취소'],
    selectedReviewStatus: '',
    selectedProgressStatus: '',
    startDate: '',
    endDate: '',
    searchQuery: '',
  }
},
  computed: {
    filteredProjects() {
      return this.projects.filter((project) => {
        const matchesReviewStatus =
          !this.selectedReviewStatus || project.reviewStatus === this.selectedReviewStatus;
        const matchesProgressStatus =
          !this.selectedProgressStatus || project.progressStatus === this.selectedProgressStatus;
        const matchesDateRange =
          (!this.startDate || new Date(project.date) >= new Date(this.startDate)) &&
          (!this.endDate || new Date(project.date) <= new Date(this.endDate));
        const matchesSearchQuery =
          !this.searchQuery || project.name.toLowerCase().includes(this.searchQuery.toLowerCase());

        return matchesReviewStatus && matchesProgressStatus && matchesDateRange && matchesSearchQuery;
      });
    },
  },
  methods: {
    logout() {
      localStorage.removeItem('isAdminLoggedIn');
      this.$router.push('/admin/login');
    },
    isActive(path) {
      return this.$route.path.startsWith(path);
    },
    goToProjectDetail(id) {
      this.$router.push({ name: 'AdminProjectDetail', params: { id } });
    },
    filterProjects() {
      console.log("필터링된 프로젝트 수:", this.filteredProjects.length);
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

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.filters select,
.filters input {
  padding: 0.5rem;
  font-size: 1rem;
}

.filters button {
  padding: 0.5rem 1rem;
  background-color: #0065cb;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.filters button:hover {
  background-color: #0055a3;
}

.project-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.project-card {
  width: 180px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  text-align: center;
  cursor: pointer;
}

.project-card:hover {
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.15);
}

.project-image {
  width: 100%;
  height: 100px;
  object-fit: cover;
}

.project-info {
  padding: 0.5rem;
}

.project-info h3 {
  font-size: 1.1rem;
  margin: 0.5rem 0;
}

.project-info p {
  margin: 0;
  color: #555;
}
</style>
