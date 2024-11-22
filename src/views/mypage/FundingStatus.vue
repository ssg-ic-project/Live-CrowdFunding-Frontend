<!-- src/views/mypage/FundingStatus.vue -->
<template>
  <div class="funding-status-page">
    <h2>펀딩 진행 목록</h2>
    

    <!-- 상태 필터 -->
    <div class="status-filter">
      <button 
        @click="currentFilter = 'before'"
        :class="{ active: currentFilter === 'before' }"
      >
        진행 전 펀딩
      </button>
      <button 
        @click="currentFilter = 'ongoing'"
        :class="{ active: currentFilter === 'ongoing' }"
      >
        현재 진행중인 펀딩
      </button>
      <button 
        @click="currentFilter = 'ended'"
        :class="{ active: currentFilter === 'ended' }"
      >
        종료된 펀딩
      </button>
    </div>
 
    
    <!-- 프로젝트 목록 -->
    <div class="projects-list">
      <div 
        v-for="project in filteredProjects" 
        :key="project.id"
        class="project-card"
        @click="goToProjectDetail(project.id)"
      >
        <div class="project-info">
          <h3 class="project-name">{{ project.name }}</h3>
          <div class="project-details">
            <div class="detail-item">
              <span class="label">시작일:</span>
              <span class="value">{{ formatStartDate(project) }}</span>
            </div>
            <div class="detail-item">
              <span class="status-badge" :class="project.status">
                {{ getStatusText(project.status) }}
              </span>
            </div>
            <div class="detail-item">
              <span class="funding-progress">
                {{ project.fundingAmount.toLocaleString() }}원 ({{ project.progressPercentage }}%)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
 </template>
 
 <script>
 export default {
  name: 'FundingStatus',
  data() {
    return {
      currentFilter: 'ongoing',
      projects: [
        // 진행 전 프로젝트 (검토중, 반려)
        {
          id: 1,
          name: '스마트 공기청정기 프로젝트',
          startDate: '2024-03-20',
          status: 'reviewing',
          fundingAmount: 0,
          progressPercentage: 0,
          targetAmount: 10000000
        },
        {
          id: 2,
          name: '스마트 워치 프로젝트',
          startDate: '2024-03-25',
          status: 'reviewing',
          fundingAmount: 0,
          progressPercentage: 0,
          targetAmount: 8000000
        },
        {
          id: 3,
          name: '휴대용 프로젝터 프로젝트',
          startDate: '2024-03-18',
          status: 'rejection',
          fundingAmount: 0,
          progressPercentage: 0,
          targetAmount: 15000000
        },
        
        // 진행중인 프로젝트 (펀딩중)
        {
          id: 4,
          name: '무선 이어버드 프로젝트',
          startDate: '2024-03-15',
          status: 'funding',
          fundingAmount: 5000000,
          progressPercentage: 45,
          targetAmount: 11000000
        },
        {
          id: 5,
          name: '스마트 백팩 프로젝트',
          startDate: '2024-03-10',
          status: 'funding',
          fundingAmount: 7500000,
          progressPercentage: 75,
          targetAmount: 10000000
        },
        {
          id: 6,
          name: '전기자전거 프로젝트',
          startDate: '2024-03-05',
          status: 'funding',
          fundingAmount: 12000000,
          progressPercentage: 60,
          targetAmount: 20000000
        },
        
        // 종료된 프로젝트 (성공, 실패)
        {
          id: 7,
          name: '스마트 도어락 프로젝트',
          startDate: '2024-02-01',
          status: 'success',
          fundingAmount: 15000000,
          progressPercentage: 120,
          targetAmount: 12500000
        },
        {
          id: 8,
          name: '태양광 보조배터리 프로젝트',
          startDate: '2024-01-20',
          status: 'success',
          fundingAmount: 25000000,
          progressPercentage: 125,
          targetAmount: 20000000
        },
        {
          id: 9,
          name: '로봇청소기 프로젝트',
          startDate: '2024-01-15',
          status: 'failed',
          fundingAmount: 8000000,
          progressPercentage: 65,
          targetAmount: 15000000
        },
        {
          id: 10,
          name: '스마트 화분 프로젝트',
          startDate: '2024-01-10',
          status: 'failed',
          fundingAmount: 3000000,
          progressPercentage: 30,
          targetAmount: 10000000
        }
      ]
    };
  },
  computed: {
    filteredProjects() {
      if (this.currentFilter === 'ongoing') {
        return this.projects.filter(p => 
          p.status === 'reviewing' || p.status === 'funding'
        );
      } else {
        return this.projects.filter(p => 
          p.status === 'success' || p.status === 'failed'
        );
      }
    }
  },
  methods: {
    formatStartDate(project) {
      if (project.status === 'reviewing') {
        return '-';
      }
      return project.startDate;
    },
    getStatusText(status) {
      const statusMap = {
        reviewing: '검토중',
        rejection: '반려',
        funding: '펀딩중',
        success: '펀딩성공',
        failed: '펀딩실패'
      };
      return statusMap[status];
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