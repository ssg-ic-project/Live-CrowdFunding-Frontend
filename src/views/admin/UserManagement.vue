<!-- src/views/admin/UserManagement.vue --><template>
  <div class="dashboard">
    <main class="content">
      <!-- 헤더 -->
      <header>
        <span>접속중인 ID: {{ userId }} ({{ userName }})</span>
        <button @click="logout">로그아웃</button>
      </header>

      <div class="main-content">
        <!-- 왼쪽 섹션 -->
        <section class="content-section">
          <div class="section-header">
            <h2>회원 목록</h2>
          </div>
          <div class="section-content">
            <!-- 필터 섹션 -->
            <div class="filters">
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

              <input type="text" v-model="searchQuery" placeholder="이름 검색" />
              <button @click="searchUsers">검색</button>
            </div>

            <!-- 사용자 목록 -->
            <div class="user-list">
              <table>
                <thead>
                  <tr>
                    <th>아이디</th>
                    <th>가입일</th>
                    <th>상태</th>
                    <th>회원유형</th>
                  </tr>
                </thead>
                <tbody>
                  <tr 
                    v-for="user in paginatedUsers" 
                    :key="user.id" 
                    @click="selectUser(user)"
                    :class="{ 'selected': selectedUser && selectedUser.id === user.id }"
                  >
                    <td>{{ user.nickname }}</td>
                    <td>{{ user.signupDate }}</td>
                    <td>{{ user.status }}</td>
                    <td>{{ user.type }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- 페이지네이션 -->
            <div class="pagination">
              <button 
                :disabled="currentPage === 1"
                @click="currentPage--"
              >&lt;</button>
              <span>{{ currentPage }} / {{ totalPages }}</span>
              <button 
                :disabled="currentPage === totalPages"
                @click="currentPage++"
              >&gt;</button>
            </div>
          </div>
        </section>

        <!-- 오른쪽 섹션 -->
        <section class="content-section">
          <div class="section-header">
            <h2>회원 상세정보</h2>
          </div>
          <div class="section-content" v-if="selectedUser">
            <div class="user-details">
              <p><strong>회원 ID:</strong> {{ selectedUser.id }}</p>
              <p><strong>이름:</strong> {{ selectedUser.name }}</p>
              <p><strong>전화번호:</strong> {{ selectedUser.phone }}</p>
              <p><strong>이메일:</strong> {{ selectedUser.email }}</p>
              <p><strong>우편번호:</strong> {{ selectedUser.postalCode }}</p>
              <p><strong>주소:</strong> {{ selectedUser.address }}</p>
              <p><strong>계정 생성일:</strong> {{ selectedUser.signupDate }}</p>
              <p><strong>계정 상태:</strong> {{ selectedUser.status }}</p>
              <p><strong>회원유형:</strong> {{ selectedUser.type }}</p>
            </div>
          </div>
          <div class="section-content empty-state" v-else>
            <p>회원을 선택하시면 상세정보가 표시됩니다.</p>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'UserManagement',
  data() {
    return {
      userId: "admin123",
      userName: "관리자",
      selectedStatus: "",
      selectedType: "",
      searchQuery: "",
      selectedUser: null,
      currentPage: 1,
      itemsPerPage: 10,
      users: [
        {
          id: 1,
          nickname: "user1",
          name: "홍길동",
          phone: "010-1234-5678",
          email: "user1@example.com",
          postalCode: "12345",
          address: "서울시 강남구 테헤란로 123",
          signupDate: "2024-01-01",
          status: "활성",
          type: "일반회원",
        },
        {
          id: 2,
          nickname: "seller1",
          name: "김판매",
          phone: "010-2345-6789",
          email: "seller1@example.com",
          postalCode: "23456",
          address: "부산시 해운대구 해운대로 456",
          signupDate: "2024-01-05",
          status: "활성",
          type: "판매자",
        },
        {
          id: 3,
          nickname: "admin2",
          name: "이관리",
          phone: "010-3456-7890",
          email: "admin2@example.com",
          postalCode: "34567",
          address: "대구시 수성구 수성로 789",
          signupDate: "2024-01-10",
          status: "활성",
          type: "관리자",
        },
        {
          id: 4,
          nickname: "user2",
          name: "박서준",
          phone: "010-4567-8901",
          email: "user2@example.com",
          postalCode: "45678",
          address: "인천시 연수구 연수로 321",
          signupDate: "2024-01-15",
          status: "활성",
          type: "일반회원",
        },
        {
          id: 5,
          nickname: "seller2",
          name: "최판매",
          phone: "010-5678-9012",
          email: "seller2@example.com",
          postalCode: "56789",
          address: "광주시 서구 상무로 654",
          signupDate: "2024-01-20",
          status: "비활성",
          type: "판매자",
        },
        {
          id: 6,
          nickname: "user3",
          name: "정지민",
          phone: "010-6789-0123",
          email: "user3@example.com",
          postalCode: "67890",
          address: "대전시 유성구 대학로 987",
          signupDate: "2024-01-25",
          status: "정지",
          type: "일반회원",
        },
        {
          id: 7,
          nickname: "user4",
          name: "강동원",
          phone: "010-7890-1234",
          email: "user4@example.com",
          postalCode: "78901",
          address: "울산시 남구 삼산로 147",
          signupDate: "2024-02-01",
          status: "활성",
          type: "일반회원",
        },
        {
          id: 8,
          nickname: "seller3",
          name: "윤판매",
          phone: "010-8901-2345",
          email: "seller3@example.com",
          postalCode: "89012",
          address: "세종시 한누리대로 258",
          signupDate: "2024-02-05",
          status: "비활성",
          type: "판매자",
        },
        {
          id: 9,
          nickname: "user5",
          name: "조미래",
          phone: "010-9012-3456",
          email: "user5@example.com",
          postalCode: "90123",
          address: "제주시 삼도로 369",
          signupDate: "2024-02-10",
          status: "활성",
          type: "일반회원",
        },
        {
          id: 10,
          nickname: "admin3",
          name: "한관리",
          phone: "010-0123-4567",
          email: "admin3@example.com",
          postalCode: "01234",
          address: "서울시 서초구 서초로 159",
          signupDate: "2024-02-15",
          status: "활성",
          type: "관리자",
        },
        {
          id: 11,
          nickname: "user6",
          name: "송하나",
          phone: "010-1122-3344",
          email: "user6@example.com",
          postalCode: "11223",
          address: "서울시 마포구 마포로 753",
          signupDate: "2024-02-20",
          status: "활성",
          type: "일반회원",
        },
        {
          id: 12,
          nickname: "seller4",
          name: "임판매",
          phone: "010-2233-4455",
          email: "seller4@example.com",
          postalCode: "22334",
          address: "부산시 수영구 수영로 852",
          signupDate: "2024-02-25",
          status: "활성",
          type: "판매자",
        },
        {
          id: 13,
          nickname: "user7",
          name: "권둘",
          phone: "010-3344-5566",
          email: "user7@example.com",
          postalCode: "33445",
          address: "대구시 달서구 달서로 951",
          signupDate: "2024-03-01",
          status: "정지",
          type: "일반회원",
        },
        {
          id: 14,
          nickname: "user8",
          name: "신셋",
          phone: "010-4455-6677",
          email: "user8@example.com",
          postalCode: "44556",
          address: "인천시 부평구 부평로 753",
          signupDate: "2024-03-05",
          status: "활성",
          type: "일반회원",
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
    paginatedUsers() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredUsers.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredUsers.length / this.itemsPerPage);
    }
  },
  watch: {
    filteredUsers() {
      this.currentPage = 1;
    }
  },
  methods: {
    logout() {
      this.$router.push('/admin');
    },
    searchUsers() {
      console.log("검색 실행");
    },
    selectUser(user) {
      this.selectedUser = user;
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

.main-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  height: calc(100vh - 120px);
  margin-top: 1rem;
}

.content-section {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  height: 100%;
}

.section-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #eee;
}

.section-header h2 {
  margin: 0;
  font-size: 1.25rem;
  color: #333;
}

.section-content {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
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
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
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
  margin-bottom: 0;
}

.user-list th,
.user-list td {
  border: 1px solid #eee;
  padding: 0.75rem;
  text-align: left;
}

.user-list th {
  background-color: #f8f9fa;
  font-weight: 600;
}

.user-list tr {
  cursor: pointer;
  transition: background-color 0.2s;
}

.user-list tr:hover {
  background-color: #f5f5f5;
}

.user-list tr.selected {
  background-color: #e3f2fd;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
  margin-top: 1rem;
  border-top: 1px solid #eee;
}

.pagination button {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  background-color: white;
  border-radius: 4px;
  cursor: pointer;
}

.pagination button:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.pagination span {
  font-size: 0.9rem;
  color: #666;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #666;
  font-size: 0.9rem;
}

.user-details p {
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
}

.user-details p:last-child {
  border-bottom: none;
}

.user-details strong {
  display: inline-block;
  width: 120px;
  color: #666;
}
</style>