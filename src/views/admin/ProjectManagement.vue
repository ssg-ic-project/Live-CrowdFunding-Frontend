<!-- src/views/admin/ProjectManagement.vue -->
<template>
  <div class="dashboard">
    <main class="content">
      <!-- 헤더 -->
      <header>
        <span>접속중인 ID: {{ userId }}</span>
        <button @click="logout">로그아웃</button>
      </header>
 
      <!-- 필터 및 검색 섹션 -->
      <section class="filters">
        <select v-model="selectedReviewStatus">
          <option value="">프로젝트 검토 상태</option>
          <option value="검토중">검토중</option>
          <option value="승인">승인</option>
          <option value="반려">반려</option>
        </select>
 
        <select v-model="selectedProgressStatus">
          <option value="">진행 상태</option>
          <option value="펀딩중">펀딩중</option>
          <option value="성공">성공</option>
          <option value="미달성">미달성</option>
        </select>
 
        <input type="date" v-model="startDate" placeholder="시작일" />
        <input type="date" v-model="endDate" placeholder="종료일" />
 
        <input type="text" v-model="searchQuery" placeholder="검색어를 입력하세요" />
        <button @click="fetchProject">검색</button>
      </section>
 
      <!-- 프로젝트 카드 목록 -->
      <section class="project-cards">
        <div 
          v-for="project in projects" 
          :key="project.id" 
          class="project-card"
          @click="goToProjectDetail(project.id)"
        >
          <div class="image-container">
            <img :src="project.contentImage" alt="Project Image" class="project-image" />
          </div>
          <div class="project-info">
            <div class="status-container">
              <span class="category-badge">
                <i class="fas fa-tag"></i>
                {{ project.category.classification }}
              </span>
              <span :class="['status-badge', getStatusClass(getDummyStatus(project.id))]">
                {{ getDummyStatus(project.id) }}
              </span>
            </div>
            <h3>{{ project.productName }}</h3>
            <p>
              <i class="fas fa-user"></i>
              판매자: {{ project.maker.id }} ({{ project.maker.name }})
            </p>
          </div>
        </div>
      </section>
 
      <!-- 페이지네이션 -->
      <div class="pagination">
        <button
          :disabled="currentPage === 1"
          @click="prevPage"
          class="pagination-btn">
          이전
        </button>
        <span v-for="pageNum in totalPages" :key="pageNum">
          <button
            @click="goToPage(pageNum)"
            :class="['page-btn', {active: currentPage === pageNum}]">
            {{pageNum}}
          </button>
        </span>
        <button
          :disabled="currentPage === totalPages"
          @click="nextPage"
          class="pagination-btn">
          다음
        </button>
      </div>
    </main>
  </div>
 </template>
 
 <script>
 import {projectApi} from "@/api/projectApi.js";
 
 export default {
  data() {
    return {
      userId: localStorage.getItem("adminId"),
      userName: "관리자",
      selectedReviewStatus: "검토중",
      selectedProgressStatus: "",
      startDate: "",
      endDate: "",
      searchQuery: "",
      projects: [],
      reviewStatusOptions: ['검토중', '승인', '반려'],
      progressStatusOptions: ['펀딩중', '성공', '미달성'],
      currentPage: 1,
      total: 0,
    }
  },
  computed: {
    totalPages(){
      return Math.ceil(this.total/10);
    }
  },
  methods: {
    async filteredProjects() {
      try {
        const params = {
          page: this.currentPage,
          RS: this.selectedReviewStatus,
          PS: this.selectedProgressStatus,
          SD: this.startDate,
          ED: this.endDate,
          projname: this.searchQuery
        };
        const response = await projectApi.getFilteredProjects(params);
        this.projects = response.data.dataList;
        this.total = response.data.pageInfoDTO.total;
      } catch (error) {
        console.error('프로젝트 조회 실패:', error);
      }
    },
    getStatusClass(status) {
      switch(status) {
        case '펀딩중': return 'status-funding';
        case '성공': return 'status-success';
        case '미달성': return 'status-fail';
        default: return '';
      }
    },
    getDummyStatus(id) {
      const statuses = ['펀딩중', '성공', '미달성'];
      return statuses[id % 3];
    },
    fetchProject() {
      this.currentPage = 1;
      this.filteredProjects();
    },
    logout() {
      localStorage.removeItem('isAdminLoggedIn');
      this.$router.push('/admin/login');
    },
    goToProjectDetail(id) {
      this.$router.push({ name: 'AdminProjectDetail', params: { id } });
    },
    prevPage() {
      if(this.currentPage > 1) {
        this.currentPage--;
        this.filteredProjects();
      }
    },
    nextPage() {
      if(this.currentPage < this.totalPages) {
        this.currentPage++;
        this.filteredProjects();
      }
    },
    goToPage(pageNum) {
      this.currentPage = pageNum;
      this.filteredProjects();
    }
  },
  async created() {
    await this.filteredProjects();
  }
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
  background-color: #ff5151;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

header button:hover {
  background-color: #ffd74e;
  color: #333333;
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
  border: 1px solid #ddd;
  border-radius: 4px;
}

.filters button {
  padding: 0.5rem 1rem;
  background-color: #ff5151;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filters button:hover {
  background-color: #ffd74e;
  color: #333333;
}

.project-cards {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.project-card {
  width: 100%;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  cursor: pointer;
  transition: box-shadow 0.3s ease;
  padding: 1rem;
  gap: 1.5rem;
}

.project-card:hover {
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
}

.image-container {
  width: 200px;
  height: 150px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.project-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.project-card:hover .project-image {
  transform: scale(1.05);
}

.project-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  padding: 0.5rem 0;
}

.status-container {
  display: flex;
  gap: 0.8rem;
  margin-bottom: 0.2rem;
}

.category-badge,
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.category-badge {
  background-color: #f3f4f6;
  color: #666;
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

.project-info h3 {
  font-size: 1.3rem;
  margin: 0;
  color: #333;
  line-height: 1.4;
}

.project-info p {
  margin: 0;
  color: #666;
  font-size: 0.95rem;
  line-height: 1.4;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.project-info i {
  font-size: 0.9em;
  color: #888;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
}

.pagination-btn {
  padding: 0.5rem 1rem;
  background-color: #ff5151;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  min-width: 80px;
  transition: all 0.3s ease;
}

.pagination-btn:disabled {
  background-color: #ffe3e3;
  cursor: not-allowed;
  color: #666;
}

.pagination-btn:not(:disabled):hover {
  background-color: #ffd74e;
  color: #333333;
}

.page-btn {
  padding: 0.5rem;
  border: none;
  background-color: transparent;
  color: #666;
  cursor: pointer;
  min-width: 35px;
  height: 35px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.page-btn.active {
  background-color: #ff5151;
  color: white;
  border-radius: 4px;
}

.page-btn:hover:not(.active) {
  background-color: #ffd74e;
  color: #333333;
  border-radius: 4px;
}

@media (max-width: 768px) {
  .project-card {
    flex-direction: column;
  }

  .image-container {
    width: 100%;
    height: 200px;
  }

  .filters {
    flex-direction: column;
  }

  .filters select,
  .filters input,
  .filters button {
    width: 100%;
  }
}

.content {
  scrollbar-width: thin;
  scrollbar-color: #ff5151 #f4f6f9;
}

.content::-webkit-scrollbar {
  width: 8px;
}

.content::-webkit-scrollbar-track {
  background: #f4f6f9;
}

.content::-webkit-scrollbar-thumb {
  background-color: #ff5151;
  border-radius: 4px;
}

.content::-webkit-scrollbar-thumb:hover {
  background-color: #ffd74e;
}
</style>
