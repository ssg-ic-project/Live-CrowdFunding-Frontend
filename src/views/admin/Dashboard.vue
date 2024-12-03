<!-- src/views/admin/Dashboard.vue -->
<!-- src/views/admin/Dashboard.vue -->
<template>
  <div class="dashboard">
    <!-- 메인 콘텐츠 -->
    <main class="content">
      <!-- 상단 관리자 정보 -->
      <header>
        <span>접속중인 ID: {{userId }}</span>
        <button @click="logout">로그아웃</button>
      </header>

      <!-- 통계 섹션 -->
      <section class="stats" v-if="!loading">
        <div class="stat-box">오늘의 펀딩 등록: {{ statsData.dailyRegistrations }}</div>
        <div class="stat-box">이번 달 펀딩 등록: {{ statsData.monthlyRegistrations }}</div>
        <div class="stat-box">올해의 펀딩 등록: {{ statsData.yearlyRegistrations }}</div>
        <div class="stat-box">펀딩 심사 대기: {{ statsData.dailyRequests }}</div>
        <div class="stat-box">진행중 펀딩: {{ statsData.ongoingProjects }}</div>
      </section>

      <!-- 차트 섹션 -->
      <section class="charts">
        <div class="chart">
          <h3>신규 가입자 현황</h3>
          <LineChart :data="monthlySignUpData" x-Label="연도-월" y-Label="인원수(명)" />
        </div>
        <div class="chart">
<!--          <h3>월 수익</h3>-->
<!--          <LineChart :data="revenueData" x-Label="연도-월" y-Label="수익(만원)"/>-->
        <h3> 펀딩 성공 현황 </h3>
          <PieChart :data="fundingStatusData" />

        </div>
        <div class="chart">
          <h3>인기 펀딩 (전일)</h3>
          <BarChart :data="topFundingData" x-Label="프로젝트명" y-Label="인원수(명)"/>
        </div>
        <div class="chart">
          <h3>월별 회원 현황</h3>
          <LineChart :data="userGrowthData" x-Label="연도-월" y-Label="인원수(명)" />
        </div>
        <div class="chart">
          <h3>분야별 펀딩 성과 (전월)</h3>
          <BarChart :data="categoryFundingData" x-Label="카테고리명" y-Label="펀딩수" :useDoubleYAxis="true" />
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import LineChart from "@/components/LineChart.vue";
import BarChart from "@/components/BarChart.vue";
import PieChart from "@/components/PieChart.vue";
import {dashboardApi} from '@/api/index.js';
import { toRaw } from 'vue';

export default {
  name: 'AdminDashboard',
  components: {
    LineChart,
    BarChart,
    PieChart
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
        userId: localStorage.getItem("adminId"),
        // userName: localStorage.getItem("userName"),

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
        fundingStatusData: {
          labels: ['성공', '미달성'],
          datasets: [{
            data: [300, 150, 100],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
          }]
        },
        // revenueData: {
        //   labels: [],
        //   datasets: [
        //     {
        //       label: "수익",
        //       data: [],
        //       borderColor: "orange",
        //       backgroundColor: "rgba(255, 165, 0, 0.1)",
        //       // fill: true,
        //     },
        //   ],
        // },
        topFundingData: {
          labels: [],
          datasets: [
            {
              label: "구매자 수",
              data: [],
              backgroundColor: "rgba(54, 162, 235, 0.5)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
            },
            {
              label: "스트리밍 참가자 수",
              data: [],
              backgroundColor: "rgba(255, 99, 132, 0.5)",
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 1,
            },
          ],
        },
        userGrowthData: {
          labels: [],
          datasets: [
            {
              label: "판매자",
              data: [],
              borderColor: "green",
              backgroundColor: "rgba(0, 255, 0, 0.1)",
              fill: true,
            },
            {
              label: "사용자",
              data: [],
              borderColor: "blue",
              backgroundColor: "rgba(0, 0, 255, 0.1)",
              fill: true,
            },
            {
              label: "전체",
              data: [],
              borderColor: "purple",
              backgroundColor: "rgba(128, 0, 128, 0.1)",
              fill: true,
            },
          ],
        },
        categoryFundingData: {
          labels: [],
          datasets: [
            {
              label: "펀딩 수",
              data: [],
              backgroundColor: "rgba(54, 162, 235, 0.5)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
            },
            {
              label: "펀딩 수익 (만원)",
              data: [],
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
      const [generalStatsResponse, newUsersResponse, fundingStatusResponse, popularFundingResponse, categoryRevenueResponse] = await Promise.all([
        dashboardApi.getStats(),
        dashboardApi.getNewUsers(),
        dashboardApi.getFundingStatus(),
        // dashboardApi.getTotalRevenue(), revenueResponse
        dashboardApi.getPopularFunding(),
        // dashboardApi.getCurrentUsers(), currentUsersResponse -- 빼기
        dashboardApi.getCategoryRevenue(),

      ]);
      this.statsData =  {
        dailyRegistrations: generalStatsResponse.data.dailyRegistrations,
        monthlyRegistrations: generalStatsResponse.data.monthlyRegistrations,
        yearlyRegistrations: generalStatsResponse.data.yearlyRegistrations,
        dailyRequests: generalStatsResponse.data.dailyRequests,
        ongoingProjects: generalStatsResponse.data.ongoingProjects
      };

      // 상수로 label 매핑 정의
      const USER_TYPE_LABELS = {
        GENERAL_USER: '일반회원',
        MAKER: '매이커',
        TOTAL: '전체'
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

      // 수익 데이터 설정
      // this.revenueData = toRaw({
      //   labels: revenueResponse.data.labels,
      //   datasets: [
      //     {
      //       label: "수익",
      //       data: revenueResponse.data.revenue.map(revenue => revenue.count),  // revenue 데이터 매핑
      //       borderColor: "orange",
      //       backgroundColor: "rgba(255, 165, 0, 0.1)",
      //       fill: true,
      //     }
      //   ]
      // });
      //펀딩 결과
      // this.fundingStatusData.datasets[0].data = [
      //   fundingStatusResponse.data.success,
      //   fundingStatusResponse.data.failed,
      // ];

      this.fundingStatusData = {
        ...this.fundingStatusData,
        datasets: [{
          ...this.fundingStatusData.datasets[0],
          data: [fundingStatusResponse.data.success, fundingStatusResponse.data.failed]
        }]
      };

      console.log("fundingstatus 확ㅇ니: ", fundingStatusResponse)


      // 스트리밍 데이터 설정
      this.topFundingData = toRaw({
        labels: popularFundingResponse.data.map(project => project.projectName),
        datasets: [
          {
            label: "구매자 수",
            data: popularFundingResponse.data.map(project => project.totalBuyers),
            backgroundColor: "rgba(54, 162, 235, 0.5)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
          {
            label: "시청자 수",
            data: popularFundingResponse.data.map(project => project.totalViewers),
            backgroundColor: "rgba(255, 99, 132, 0.5)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
          }
        ]
      });
      //월별 회원 현황 NEED REFACTORING
      const userGrowthData = {
          labels: [
            "2024-01", "2024-02", "2024-03", "2024-04", "2024-05", "2024-06",
            "2024-07", "2024-08", "2024-09", "2024-10", "2024-11", "2024-12"
          ],
          datasets: [
              {
                  label: "매이커",
                  data: [85, 92 , 108, 125, 143, 167, 189, 210, 235, 258, 275, 290],
                  borderColor: "green",
                  backgroundColor: "rgba(0, 255, 0, 0.1)",
                  fill: true,
              },
              {
                  label: "일반회원",
                  data: [320, 345, 378, 412, 445, 482, 515, 548, 572, 585, 592, 598],

                borderColor: "blue",
                  backgroundColor: "rgba(0, 0, 255, 0.1)",
                  fill: true,
                },
                {
                  label: "전체",
                  data: [405, 437, 486, 537, 588, 649, 704, 758, 807, 843, 867, 888],
                  borderColor: "purple",
                  backgroundColor: "rgba(128, 0, 128, 0.1)",
                  fill: true,
                }
              ]
      };
      this.userGrowthData = userGrowthData;



      // 현재 사용자 통계 데이터 설정
      // this.userGrowthData = toRaw({
      //   labels: currentUsersResponse.data.labels,
      //   datasets: [
      //     {
      //       label: "매이커",
      //       data: currentUsersResponse.data.makers.map(maker => maker.count),
      //       borderColor: "green",
      //       backgroundColor: "rgba(0, 255, 0, 0.1)",
      //       fill: true,
      //     },
      //     {
      //       label: "일반회원",
      //       data: currentUsersResponse.data.users.map(user => user.count),
      //       borderColor: "blue",
      //       backgroundColor: "rgba(0, 0, 255, 0.1)",
      //       fill: true,
      //     },
      //     {
      //       label: "전체",
      //       data: currentUsersResponse.data.total.map(total => total.count),
      //       borderColor: "purple",
      //       backgroundColor: "rgba(128, 0, 128, 0.1)",
      //       fill: true,
      //     }
      //   ]
      // });


      // 카테고리별 펀딩 수와 수익 데이터 설정
      this.categoryFundingData = {
        labels: categoryRevenueResponse.data.labels,
        datasets: [
          {
            label: "펀딩 수",
            data: categoryRevenueResponse.data.catrevenue.map(item => item.successCount),
            backgroundColor: "rgba(54, 162, 235, 0.5)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
            yAxisID: 'y-axis-1'
          },
          {
            label: "펀딩 수익 (만원)",
            data: categoryRevenueResponse.data.catrevenue.map(item => item.revenue / 10000), // 수익 데이터를 만원 단위로 변환
            backgroundColor: "rgba(255, 206, 86, 0.5)",
            borderColor: "rgba(255, 206, 86, 1)",
            borderWidth: 1,
            yAxisID: 'y-axis-2'
          },
        ],
      };


      console.log('Category Funding Data:', this.categoryFundingData);
      console.log('Current Users Data:', this.userGrowthData);
      console.log('Streaming Stats Data:', this.topFundingData);
      console.log('Revenue Chart Data:', this.revenueData);
      console.log('Transformed Chart Data:', this.monthlySignUpData); // 변환된 값

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
  background-color:  #FF5151;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

header button:hover {
  background-color: #FFD74E;
  
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
