// src/router/index.js

import { createRouter, createWebHistory } from 'vue-router';

// 레이아웃 컴포넌트
import MainLayout from '../layouts/MainLayout.vue';
import AdminLayout from '../layouts/AdminLayout.vue';
import MyPageLayout from '../layouts/MyPageLayout.vue';

// 메인 페이지 뷰 컴포넌트
import Home from '../views/main/Home.vue';
import Category from '../views/main/Category.vue';
import Live from '../views/main/Live.vue';
import Schedule from '../views/main/Schedule.vue';
import WishlistMain from '../views/mypage/Wishlist.vue';
import CategoryResults from '@/views/main/CategoryResults.vue';
import SearchResults from '../views/main/SearchResults.vue';
import ProductDetail from '../views/main/ProductDetail.vue';
import Terms from '../views/main/Terms.vue'; 

// 스트리밍 페이지 컴포넌트
import Streaming from '../views/main/Streaming.vue';
import StreamingRoom from '@/views/StreamingRoom.vue';

//결제 페이지 컴포넌트
import Payment from '@/views/main/Payment.vue'; 

// 마이페이지 뷰 컴포넌트
import MyPage from '../views/mypage/MyPage.vue';
import Profile from '../views/mypage/Profile.vue';
import FundingStatus from '../views/mypage/FundingStatus.vue';
import WishlistMyPage from '../views/mypage/Wishlist.vue'; 
import EventWins from '../views/mypage/EventWins.vue';
import FundingParticipation from '../views/mypage/FundingParticipation.vue';
import ProjectRegistration from '../views/mypage/ProjectRegistration.vue';
import ProjectDetail from '../views/mypage/ProjectDetail.vue';

// 관리자 뷰 컴포넌트
import AdminLogin from '../views/admin/AdminLogin.vue';
import Dashboard from '../views/admin/Dashboard.vue';
import ProjectManagement from '../views/admin/ProjectManagement.vue';
import AdminProjectDetail from '../views/admin/ProjectDetailAdmin.vue'; 
import UserManagement from '../views/admin/UserManagement.vue';
import UserSearch from '../views/admin/UserSearch.vue';
import ReportStatus from '../views/admin/ReportStatus.vue';

// 인증 관련 뷰 컴포넌트
import Login from '../views/auth/Login.vue';
import SignUp from '../views/auth/SignUp.vue';
import IdPasswordRecovery from '../views/auth/IdPasswordRecovery.vue';
import PaymentSuccessBF from "@/views/mypage/PaymentSuccessBF.vue";
import PaymentFailBF from "@/views/mypage/PaymentFailBF.vue";



// 라우트 정의
const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', name: 'Home', component: Home },
      { path: 'category', name: 'Category', component: Category },
      { path: 'live', name: 'Live', component: Live },
      { path: 'schedule', name: 'Schedule', component: Schedule },
      { path: 'categorySearch', name: 'CategoryResults', component: CategoryResults},
      { path: 'search', name: 'SearchResults', component: SearchResults },
      { path: 'product/:productId', name: 'ProductDetail', component: ProductDetail }, 
      { path: 'wishlist', name: 'WishlistMain', component: WishlistMain },
      { path: 'stream/:streamId', name: 'Streaming', component: Streaming },
      { path: 'terms', name: 'Terms', component: Terms },
      { path: '/payment', name: 'Payment', component: Payment, props: true,},
      { path: 'streaming', component: StreamingRoom, props: true },
    ],
  },
  {
    path: '/mypage',
    component: MyPageLayout,
    children: [
      { path: '', name: 'MyPage', component: MyPage },
      { path: 'profile', name: 'Profile', component: Profile },
      { path: 'funding-status', name: 'FundingStatus', component: FundingStatus },
      { path: 'wishlist', name: 'WishlistMyPage', component: WishlistMyPage },
      { path: 'event-wins', name: 'EventWins', component: EventWins },
      { path: 'funding-participation', name: 'FundingParticipation', component: FundingParticipation },
      { path: 'project-registration', name: 'ProjectRegistration', component: ProjectRegistration },
      { path: 'project/:id', name: 'ProjectDetail', component: ProjectDetail },

      { path: '/success-bf', name: 'PaymentSuccessBF', component: () => import('../views/mypage/PaymentSuccessBF.vue') },
      { path: '/fail-bf', name: 'PaymentFailBF', component: () => import('../views/mypage/PaymentFailBF.vue') }



    ],
  },
  {
    path: '/admin',
    component: AdminLayout,
    children: [
      { path: 'login', name: 'AdminLogin', component: AdminLogin },
      { path: '', name: 'AdminDashboard', component: Dashboard },
      { path: 'projects', name: 'ProjectManagement', component: ProjectManagement },
      { path: 'project/:id', name: 'AdminProjectDetail', component: AdminProjectDetail, props: true }, 
   
      { path: 'users', name: 'UserManagement', component: UserManagement },
      { path: 'users/search', name: 'UserSearch', component: UserSearch },
      { path: 'reports', name: 'ReportStatus', component: ReportStatus },
    ],
  },
  {
    path: '/auth',
    children: [
      { path: 'login', name: 'Login', component: Login },
      { path: 'signup', name: 'SignUp', component: SignUp },
      { path: 'recovery', name: 'IdPasswordRecovery', component: IdPasswordRecovery },
      { path: 'reset-password', name: 'ResetPassword', component: () => import('../views/auth/ResetPassword.vue')},
    ],
  },

  {
    path: '/main',
    component: MainLayout,
    children: [
      // ... 기존 라우트들 ...
      { path: '/payment', name: 'Payment', component: Payment, props: true },
      { path: '/success', name: 'PaymentSuccess', component: () => import('../views/main/PaymentSuccess.vue') },
      { path: '/fail', name: 'PaymentFail', component: () => import('../views/main/PaymentFail.vue') }
    ]
  }


];

// 라우터 생성
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 관리자 인증 상태 확인 
function isAdminAuthenticated() {
  return localStorage.getItem('isAdminLoggedIn') === 'true';
}

// 네비게이션 가드 
router.beforeEach((to, from, next) => {
  if (to.path.startsWith('/admin') && to.name !== 'AdminLogin') {
    if (!isAdminAuthenticated()) {
      next({ name: 'AdminLogin' });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
