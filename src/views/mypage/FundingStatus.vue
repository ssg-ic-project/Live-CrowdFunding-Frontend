<!-- src/views/mypage/FundingStatus.vue -->
 
<template>
  <div class="funding-status-page">
    <h2>펀딩 진행 목록</h2>
    
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
    
    <div v-if="loading" class="loading-state">
      데이터를 불러오는 중...
    </div>
    
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
      currentFilter: 1, 
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
      console.log(response.data);

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
  background-color: #ffffff;
}

h2 {
  color: #6D63FF;
  margin-bottom: 2rem;
  font-size: 1.8rem;
  font-weight: bold;
}

.status-filter {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid #9E94F8;
  padding-bottom: 0.5rem;
}

.status-filter button {
  padding: 0.75rem 1.5rem;
  border: none;
  background: none;
  font-size: 1.1rem;
  color: #666666;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
}

.status-filter button.active {
  color: #6D63FF;
  font-weight: 500;
}

.status-filter button.active::after {
  content: '';
  position: absolute;
  bottom: -0.5rem;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #6D63FF;
}

.projects-container {
  min-height: 600px;
  display: flex;
  flex-direction: column;
}

.projects-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
}

.project-card {
  padding: 1.5rem;
  border: 1px solid #9E94F8;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(109, 99, 255, 0.1);
}

.project-card:hover {
  transform: translateX(5px);
  box-shadow: 0 4px 8px rgba(109, 99, 255, 0.2);
  border-color: #6D63FF;
}

.project-name {
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: #6D63FF;
  font-weight: 500;
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
  color: #666666;
  font-size: 0.9rem;
}

.value {
  color: #6D63FF;
  font-weight: 500;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
}

.status-badge.reviewing {
  background-color: #ffffff;
  color: #666666;
}

.status-badge.funding {
  background-color: #9E94F8;
  color: #ffffff;
}

.status-badge.success {
  background-color: #6D63FF;
  color: #ffffff;
}

.status-badge.failed {
  background-color: #FF9966;
  color: #ffffff;
}

.funding-progress {
  color: #6D63FF;
  font-weight: 600;
  font-size: 1.1rem;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
  padding: 1rem 0;
}

.pagination button {
  min-width: 40px;
  height: 40px;
  border: 1px solid #9E94F8;
  background-color: #ffffff;
  border-radius: 8px;
  color: #666666;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pagination button:hover:not(:disabled) {
  background-color: #9E94F8;
  color: #ffffff;
  border-color: #9E94F8;
}

.pagination button.active {
  background-color: #6D63FF;
  color: #ffffff;
  border-color: #6D63FF;
  font-weight: 500;
}

.pagination button:disabled {
  background-color: #ffffff;
  color: #adb5bd;
  cursor: not-allowed;
}

.loading-state {
  text-align: center;
  padding: 2rem;
  color: #666666;
}

@media (max-width: 768px) {
  .funding-status-page {
    padding: 1rem;
  }

  .status-filter {
    overflow-x: auto;
    padding-bottom: 1rem;
    margin-bottom: 1.5rem;
    gap: 0.5rem;
  }

  .status-filter button {
    padding: 0.5rem 1rem;
    font-size: 1rem;
    white-space: nowrap;
  }

  .project-details {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .pagination {
    gap: 0.25rem;
  }

  .pagination button {
    min-width: 36px;
    height: 36px;
    font-size: 0.9rem;
  }
}
</style>