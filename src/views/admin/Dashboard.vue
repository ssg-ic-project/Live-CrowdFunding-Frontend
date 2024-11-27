<!-- src/views/admin/Dashboard.vue -->
<!-- src/views/admin/Dashboard.vue -->
<template>
  <div class="dashboard">
    <!-- 메인 콘텐츠 -->
    <main class="content">
      <!-- 상단 관리자 정보 -->
      <header>
        <span>접속중인 ID: {{userId }} ({{userName }})</span>
        <button @click="logout">로그아웃</button>
      </header>

      <!-- 통계 섹션 -->
      <section class="stats" v-if="!loading">
        <div class="stat-box">일간 펀딩 등록 건 수: {{ statsData.dailyRegistrations }}</div>
        <div class="stat-box">월간 펀딩 등록 건 수: {{ statsData.monthlyRegistrations }}</div>
        <div class="stat-box">연간 펀딩 등록 건 수: {{ statsData.yearlyRegistrations }}</div>
        <div class="stat-box">승인 대기 중 펀딩 수: {{ statsData.dailyRequests }}</div>
        <div class="stat-box">진행중인 총 프로젝트 수: {{ statsData.ongoingProjects }}</div>
      </section>

      <!-- 차트 섹션 -->
      <section class="charts">
        <div class="chart">
          <h3>월별 신규 가입자 수 (일반회원, 메이커, 총계)</h3>
          <LineChart :data="monthlySignUpData" />
        </div>
        <div class="chart">
          <h3>12개월 수익 실적</h3>
          <LineChart :data="revenueData" />
        </div>
        <div class="chart">
          <h3>어제자 인기 펀딩 (구매자 수 및 스트리밍 참가자 수)</h3>
          <BarChart :data="topFundingData" />
        </div>
        <div class="chart">
          <h3>판매자, 사용자, 전체 이용자 수</h3>
          <LineChart :data="userGrowthData" />
        </div>
        <div class="chart">
          <h3>전월 카테고리별 펀딩 수와 수익</h3>
          <BarChart :data="categoryFundingData" />
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import LineChart from "@/components/LineChart.vue";
import BarChart from "@/components/BarChart.vue";
import {dashboardApi} from '@/api/index.js';
import { toRaw } from 'vue';

export default {
  name: 'AdminDashboard',
  components: {
    LineChart,
    BarChart,
  },

  data() {
    return {
      statsData: {
        dailyRegistrations: 0,
        monthlyRegistrations: 0,
        yearlyRegistrations: 0,
        dailyRequests: 0,
        ongoingProjects: 0, // 진행중인 총 프로젝트 수 데이터 추가

      },

        //localStorage에 저장되어있는 정보 가지고 오기.
        userId: localStorage.getItem("userId"),
        userName: localStorage.getItem("userName"),

        // userId: "admin123",
        // userName: "관리자",
        loading: true,

        monthlySignUpData: {
          labels: [],
          datasets: [
            {
              label: "users",
              data: [],
              borderColor: "blue",
              backgroundColor: "rgba(0, 0, 255, 0.1)",
              fill: true,
            },
            {
              label: "makers",
              data: [],
              borderColor: "green",
              backgroundColor: "rgba(0, 255, 0, 0.1)",
              fill: true,
            },
            {
              label: "total",
              data: [],
              borderColor: "purple",
              backgroundColor: "rgba(128, 0, 128, 0.1)",
              fill: true,
            },
          ],
        },
        revenueData: {
          labels: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
          datasets: [
            {
              label: "수익",
              data: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200],
              borderColor: "orange",
              backgroundColor: "rgba(255, 165, 0, 0.1)",
              fill: true,
            },
          ],
        },
        topFundingData: {
          labels: ["펀딩1", "펀딩2", "펀딩3", "펀딩4", "펀딩5", "펀딩6", "펀딩7", "펀딩8", "펀딩9", "펀딩10"],
          datasets: [
            {
              label: "구매자 수",
              data: [25, 20, 15, 18, 22, 27, 30, 35, 28, 19],
              backgroundColor: "rgba(54, 162, 235, 0.5)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
            },
            {
              label: "스트리밍 참가자 수",
              data: [15, 12, 8, 10, 18, 15, 20, 22, 19, 10],
              backgroundColor: "rgba(255, 99, 132, 0.5)",
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 1,
            },
          ],
        },
        userGrowthData: {
          labels: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
          datasets: [
            {
              label: "판매자",
              data: [5, 10, 6, 12, 7, 15, 9, 18, 11, 13, 10, 17],
              borderColor: "green",
              backgroundColor: "rgba(0, 255, 0, 0.1)",
              fill: true,
            },
            {
              label: "사용자",
              data: [20, 22, 25, 27, 29, 32, 34, 36, 39, 41, 43, 45],
              borderColor: "blue",
              backgroundColor: "rgba(0, 0, 255, 0.1)",
              fill: true,
            },
            {
              label: "전체",
              data: [25, 32, 31, 39, 36, 47, 43, 54, 50, 54, 53, 62],
              borderColor: "purple",
              backgroundColor: "rgba(128, 0, 128, 0.1)",
              fill: true,
            },
          ],
        },
        categoryFundingData: {
          labels: ["DIY", "엔터테인먼트", "웨어러블", "주변기기", "생활가전", "주방가전", "스마트기기"],
          datasets: [
            {
              label: "펀딩 수",
              data: [25, 18, 30, 22, 27, 19, 23],
              backgroundColor: "rgba(54, 162, 235, 0.5)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
            },
            {
              label: "펀딩 수익 (만원)",
              data: [300, 220, 500, 400, 310, 250, 450],
              backgroundColor: "rgba(255, 206, 86, 0.5)",
              borderColor: "rgba(255, 206, 86, 1)",
              borderWidth: 1,
            },
          ],
        },

      };
  },

  async created() {
    try {
      this.loading = true

      // 여러 API 호출을 동시에 처리
      const [generalStatsResponse, newUsersResponse] = await Promise.all([
        dashboardApi.getStats(),
        dashboardApi.getNewUsers(),


      ]);
      console.log('New Users Data:', newUsersResponse.data);
      console.log("chking", newUsersResponse.data.makers);
      console.log("chking", newUsersResponse.data.users);
      console.log("chking", newUsersResponse.data.total);

      this.statsData =  {
        dailyRegistrations: generalStatsResponse.data.dailyRegistrations,
        monthlyRegistrations: generalStatsResponse.data.monthlyRegistrations,
        yearlyRegistrations: generalStatsResponse.data.yearlyRegistrations,
        dailyRequests: generalStatsResponse.data.dailyRequests,
        ongoingProjects: generalStatsResponse.data.ongoingProjects
      };

      // 상수로 label 매핑 정의
      const USER_TYPE_LABELS = {
        GENERAL_USER: 'users',
        MAKER: 'makers',
        TOTAL: 'total'
      };

      // 신규 사용자 통계 데이터 설정
      this.monthlySignUpData ={
        labels: newUsersResponse.data.labels,
        //labels: newUsersResponse.data.makers.map(item => item.month),

        datasets: [
          {
            label: USER_TYPE_LABELS.GENERAL_USER,
            data: newUsersResponse.data.users.map(user => user.count),
            borderColor: "blue",
            backgroundColor: "rgba(0, 0, 255, 0.1)",
            fill: true,
          },
          {
            label: USER_TYPE_LABELS.MAKER,
            data: newUsersResponse.data.makers.map(maker=> maker.count),
            borderColor: "green",
            backgroundColor: "rgba(0, 255, 0, 0.1)",
            fill: true,
          },
          {
            label: USER_TYPE_LABELS.TOTAL,
            data: newUsersResponse.data.total.map(total => total.count),
            borderColor: "purple",
            backgroundColor: "rgba(128, 0, 128, 0.1)",
            fill: true,
          }
        ]
      };

      console.log('Transformed Chart Data:', this.monthlySignUpData); // 변

      //
      // API 응답 데이터 확인
      console.log('Users data:', newUsersResponse.data.users);
      console.log('Makers data:', newUsersResponse.data.makers);
      console.log('Total data:', newUsersResponse.data.total);

// 변환된 데이터 각각 확인
      const chartData = {
        labels: newUsersResponse.data.makers.map(item => item.month),
        datasets: [
          {
            label: USER_TYPE_LABELS.GENERAL_USER,
            data: newUsersResponse.data.users.map(user => user.count),
            borderColor: "blue",
            backgroundColor: "rgba(0, 0, 255, 0.1)",
            fill: true,
          },
          // ... 나머지 datasets
        ]
      };
      console.log('Chart data before toRaw:', chartData);
      //this.monthlySignUpData = toRaw(chartData);
      console.log('Chart data after toRaw:', this.monthlySignUpData);


    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error)
    }finally{
      this.loading = false
    }
  },


  methods: {
    logout() {
      localStorage.removeItem('isAdminLoggedIn');
      this.$router.push('/admin/login');
    },
    isActive(path) {
      return this.$route.path.startsWith(path);
    },
  },
};
</script>

<style scoped>
.dashboard {
  display: flex;
  min-height: 100vh;
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
  cursor: pointer;
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

.stats {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-box {
  background-color: #ffffff;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  flex: 1 1 200px;
  text-align: center;
}

.charts {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
}

.chart {
  flex: 1 1 45%;
  background-color: #ffffff;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

.chart h3 {
  margin-bottom: 1rem;
  text-align: center;
}

.chart canvas {
  width: 100% !important;
  height: 300px !important;
}
</style>
