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
          <img :src="project.contentImage" alt="Project Image" class="project-image" />
          <div class="project-info">
            <h3>{{ project.productName }}</h3>
            <p>카테고리: {{ project.category.classification }}</p>
            <p>판매자: {{ project.maker.id }} ({{ project.maker.name }})</p>
          </div>
        </div>
      </section>
<!--      페이지네이션 추가-->
      <div class="pagination">
        <button
          :disabled="currentPage === 1"
          @click="prevPage"
          class="pagination-btn">
          이전
        </button>
        <span v-for="pageNum in totalPages":key="pageNum">
          <button
            @click="goToPage(pageNum)"
            :class="['page-btn', {active:currentPage === pageNum}]">
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
      userId: "admin123", //
      userName: "관리자",
      selectedReviewStatus: "검토중", //기본값 설정
      selectedProgressStatus: "",
      startDate: "",
      endDate: "",
      searchQuery: "",
      projects: [],
      reviewStatusOptions: ['검토중', '승인', '반려'],
      progressStatusOptions: ['펀딩중', '성공', '미달성'],
      currentPage: 1,
      // totalPages: 0,
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
        // console.log('inside method');
        // console.log(page);
        // API 요청 전 파라미터 확인
        console.log('Request params:', params);
        //
        const response = await projectApi.getFilteredProjects(params);
        this.projects = response.data.dataList;
        //
        console.log("checking yejin", response.data);
        // // 응답 데이터 확인
        console.log('Response:', response.data.pageInfoDTO.total);
        console.log('Response:', response.data.dataList);

        // // //
        this.total = response.data.pageInfoDTO.total;
        console.log("response for pages ", response.data.pageInfoDTO.total);
      } catch (error) {
        console.error('프로젝트 조회 실패:', error);
      }
    },

    fetchProject() {
      this.currentPage = 1;
      this.filteredProjects();
    },
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

    prevPage(){
      console.log('이전 페이지, 현재: ', this.currentPage);
      if(this.currentPage > 1){
        this.currentPage--;
        console.log('변경 후 ', this.currentPage);
        this.filterProjects();
      }
    },
    nextPage(){
      if(this.currentPage < this.totalPages){
        this.currentPage++;
        this.filteredProjects();
      }
    },
    goToPage(pageNum){
      this.currentPage = pageNum;
      this.filteredProjects();
    }

  },

  async created() {
    await this.filteredProjects();
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
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
}

.pagination-btn {
  padding: 0.5rem 1rem;
  background-color: #0065cb;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.pagination-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.page-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #0065cb;
  background-color: white;
  color: #0065cb;
  border-radius: 4px;
  cursor: pointer;
}

.page-btn.active {
  background-color: #0065cb;
  color: white;
}

.page-btn:hover {
  background-color: #e6f0ff;
}



</style>
