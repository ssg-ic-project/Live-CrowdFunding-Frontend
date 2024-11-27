<!-- src/views/mypage/FundingStatus.vue -->
<template>
  <div class="funding-status-page">
    <h2>펀딩 진행 목록</h2>
    
    <!-- 상태 필터 -->
    <div class="status-filter">
      <button 
        @click="changeFilter(1)"
        :class="{ active: currentFilter === 1 }"
      >
        진행 전 펀딩
      </button>
      <button 
        @click="changeFilter(2)"
        :class="{ active: currentFilter === 2 }"
      >
        현재 진행중인 펀딩
      </button>
      <button 
        @click="changeFilter(3)"
        :class="{ active: currentFilter === 3 }"
      >
        종료된 펀딩
      </button>
    </div>
    
    <!-- 로딩 상태 표시 -->
    <div v-if="loading" class="loading-state">
      데이터를 불러오는 중...
    </div>
    
    <!-- 프로젝트 목록 -->
    <div v-else class="projects-list">
      <div 
        v-for="project in projects" 
        :key="project.id"
        class="project-card"
        @click="goToProjectDetail(project.id)"
      >
        <div class="project-info">
          <h3 class="project-name">{{ project.productName }}</h3>
          <div class="project-details">
            <div class="detail-item">
              <span class="label">시작일:</span>
              <span class="value">{{ formatStartDate(project) }}</span>
            </div>
            <div class="detail-item">
              <span class="status-badge" :class="getStatusClass(project.status)">
                {{ getStatusText(project.status) }}
              </span>
            </div>
            <div class="detail-item">
              <span class="funding-progress">
                {{ project.totalPrice?.toLocaleString() }}원 ({{ project.percentage }}%)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="pagination" v-if="pageInfo">
  <button 
    :disabled="!pageInfo.hasPrev"
    @click="changePage(pageInfo.start - 1)"
  >
    이전
  </button>
  
    <template v-for="pageNum in (pageInfo.end - pageInfo.start + 1)" :key="pageNum">
      <button 
        :class="{ active: pageInfo.currentPage === (pageInfo.start + pageNum - 1) }"
        @click="changePage(pageInfo.start + pageNum - 1)"
      >
        {{ pageInfo.start + pageNum - 1 }}
      </button>
    </template>
    
    <button 
      :disabled="!pageInfo.hasNext"
      @click="changePage(pageInfo.end + 1)"
    >
      다음
    </button>
  </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'FundingStatus',
  data() {
    return {
      currentFilter: 2, // 기본값은 진행중(2)
      projects: [],
      pageInfo: null,
      loading: false,
      pageSize: 10 // 한 페이지당 보여줄 항목 수
    };
  },
  
  created() {
    this.fetchProjects();
  },
  
  methods: {
  async fetchProjects(page = 1) {
    this.loading = true;
    const makerId = localStorage.getItem('userId');
    
    try {
      const response = await axios.get('/api/project/list/' + makerId, {
        params: {
          page: page,
          size: this.pageSize,
          statusNumber: this.currentFilter
        }
      });
      
      const { pageInfoDTO, dataList } = response.data;
      this.projects = dataList;
      this.pageInfo = {
        currentPage: pageInfoDTO.page,
        totalElements: pageInfoDTO.total,
        start: pageInfoDTO.start,
        end: pageInfoDTO.end,
        hasPrev: pageInfoDTO.prev,
        hasNext: pageInfoDTO.next
      };
    } catch (error) {
      console.error('프로젝트 목록을 불러오는데 실패했습니다:', error);
    } finally {
      this.loading = false;
    }
  },
    
    formatStartDate(project) {
      if (!project.startAt) return '-';
      return new Date(project.startAt).toLocaleDateString();
    },
    
    getStatusText(status) {
      const statusMap = {
        'REVIEWING': '검토중',
        'REJECTED': '반려',
        'FUNDING': '펀딩중',
        'SUCCESS': '펀딩성공',
        'FAILED': '펀딩실패'
      };
      return statusMap[status] || status;
    },
    
    getStatusClass(status) {
      const statusClassMap = {
        'REVIEWING': 'reviewing',
        'REJECTED': 'failed',
        'FUNDING': 'funding',
        'SUCCESS': 'success',
        'FAILED': 'failed'
      };
      return statusClassMap[status] || '';
    },
    
    async changeFilter(filterValue) {
      this.currentFilter = filterValue;
      await this.fetchProjects(1); // 필터 변경시 첫 페이지부터 조회
    },
    
    async changePage(newPage) {
      await this.fetchProjects(newPage);
    },
    
    goToProjectDetail(projectId) {
      this.$router.push(`/mypage/project/${projectId}`);
    }
  }
};
</script>
 
 <style scoped>
 .funding-status-page {
  padding: 2rem;
  max-width: 1000px;
  margin: 0 auto;
 }
 
 .status-filter {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
 }
 
 .status-filter button {
  padding: 0.75rem 1.5rem;
  border: none;
  background: none;
  font-size: 1.1rem;
  color: #666;
  cursor: pointer;
  position: relative;
 }
 
 .status-filter button.active {
  color: #000;
  font-weight: 500;
 }
 
 .status-filter button.active::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #000;
 }
 
 .projects-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
 }
 
 .project-card {
  padding: 1.5rem;
  border: 1px solid #eee;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
 }
 
 .project-card:hover {
  background-color: #f8f9fa;
  transform: translateX(5px);
 }
 
 .project-name {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #000;
 }
 
 .project-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
 }
 
 .detail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
 }
 
 .label {
  color: #666;
  font-size: 0.9rem;
 }
 
 .value {
  color: #333;
 }
 
 .status-badge {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
 }
 
 .status-badge.reviewing {
  background-color: #e9ecef;
  color: #495057;
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
 
 .funding-progress {
  color: #333;
  font-weight: 500;
 }
 
 @media (max-width: 768px) {
  .project-details {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
 }
 </style>