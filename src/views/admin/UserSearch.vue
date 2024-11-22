<!-- src/views/UserSearch.vue -->
 
<template>
  <div class="dashboard">


    <!-- 사이드바 -->
    <aside class="sidebar">
      <h3>대시보드</h3>
      <ul class="menu">
        <li :class="{ active: isActive('/admin/dashboard') }">
          <router-link to="/admin/dashboard">대시보드</router-link>
        </li>
        <li :class="{ active: isActive('/admin/projects') }">
          <router-link to="/admin/projects">프로젝트 관리</router-link>
        </li>
        <li :class="{ active: isActive('/admin/users') }">
          <div class="submenu-title">
            <span>사용자 관리</span>
            <i class="arrow-down"></i>
          </div>
          <ul class="submenu-list">
            <li :class="{ active: isActive('/admin/users/search') }">
              <router-link to="/admin/users/search">사용자 조회</router-link>
            </li>
            <li :class="{ active: isActive('/admin/users/reports') }">
              <router-link to="/admin/users/reports">신고 현황</router-link>
            </li>
          </ul>
        </li>
      </ul>
    </aside>


    <!-- 메인 콘텐츠 -->
    <main class="content">
      <!-- 헤더 -->
      <header>
        <span>접속중인 ID: {{ userId }} ({{ userName }})</span>
        <button @click="logout">로그아웃</button>
      </header>


      <!-- 필터 섹션 -->
      <section class="filters">
        <select v-model="selectedStatus">
          <option value="">사용자 상태</option>
          <option value="활성">활성</option>
          <option value="비활성">비활성</option>
          <option value="정지">정지</option>
        </select>

        <select v-model="selectedType">
          <option value="">회원 유형</option>
          <option value="일반회원">일반회원</option>
          <option value="판매자">판매자</option>
          <option value="관리자">관리자</option>
        </select>

        <input type="text" v-model="searchQuery" placeholder="닉네임 검색" />
        <button @click="searchUsers">검색</button>
      </section>


      <!-- 사용자 목록 -->
      <section class="user-list">
        <table>
          <thead>
            <tr>
              <th>닉네임</th>
              <th>가입일</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredUsers" :key="user.id" @click="openUserDetail(user)">
              <td>{{ user.nickname }}</td>
              <td>{{ user.signupDate }}</td>
              <td>{{ user.status }}</td>
            </tr>
          </tbody>
        </table>
      </section>

      
      <!-- 사용자 상세 모달 -->
      <div v-if="showModal" class="modal">
        <div class="modal-content">
          <span class="close" @click="closeModal">&times;</span>
          <h3>회원 상세 정보</h3>
          <p><strong>회원 ID:</strong> {{ selectedUser.id }}</p>
          <p><strong>이름:</strong> {{ selectedUser.name }}</p>
          <p><strong>전화번호:</strong> {{ selectedUser.phone }}</p>
          <p><strong>이메일:</strong> {{ selectedUser.email }}</p>
          <p><strong>우편번호:</strong> {{ selectedUser.postalCode }}</p>
          <p><strong>주소:</strong> {{ selectedUser.address }}</p>
          <p><strong>계정 생성일:</strong> {{ selectedUser.signupDate }}</p>
          <p><strong>계정 상태:</strong> {{ selectedUser.status }}</p>
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
      selectedStatus: "",
      selectedType: "",
      searchQuery: "",
      showModal: false,
      selectedUser: null,
      users: [
        {
          id: 1,
          nickname: "user1",
          name: "홍길동",
          phone: "010-1234-5678",
          email: "user1@example.com",
          postalCode: "12345",
          address: "서울시 강남구",
          signupDate: "2021-01-01",
          status: "활성",
          type: "일반회원",
        },
        {
          id: 2,
          nickname: "seller1",
          name: "이순신",
          phone: "010-9876-5432",
          email: "seller1@example.com",
          postalCode: "54321",
          address: "부산시 해운대구",
          signupDate: "2021-02-15",
          status: "비활성",
          type: "판매자",
        },
        {
          id: 3,
          nickname: "admin2",
          name: "김유신",
          phone: "010-5555-5555",
          email: "admin2@example.com",
          postalCode: "11111",
          address: "대구시 수성구",
          signupDate: "2021-03-20",
          status: "정지",
          type: "관리자",
        },
      ],
    };
  },
  computed: {
    filteredUsers() {
      return this.users.filter((user) => {
        const matchesStatus = !this.selectedStatus || user.status === this.selectedStatus;
        const matchesType = !this.selectedType || user.type === this.selectedType;
        const matchesSearchQuery =
          !this.searchQuery || user.nickname.toLowerCase().includes(this.searchQuery.toLowerCase());

        return matchesStatus && matchesType && matchesSearchQuery;
      });
    },
  },
  methods: {
    logout() {
  
  this.$router.push('/admin');
},
    isActive(path) {
      return this.$route.path.startsWith(path);
    },
    searchUsers() {
      console.log("검색 실행");
    },
    openUserDetail(user) {
      this.selectedUser = user;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.selectedUser = null;
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


.user-list table {
  width: 100%;
  border-collapse: collapse;
  cursor: pointer;
}

.user-list th,
.user-list td {
  border: 1px solid #ccc;
  padding: 0.75rem;
  text-align: left;
}

.user-list th {
  background-color: #f4f4f4;
}

.user-list tr:nth-child(even) {
  background-color: #fafafa;
}

.user-list tr:hover {
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
  max-width: 500px;
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
</style>
