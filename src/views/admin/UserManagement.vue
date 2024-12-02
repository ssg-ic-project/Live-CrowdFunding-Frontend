<!-- src/views/admin/UserManagement.vue --><template>
  <div class="dashboard">
    <main class="content">
      <!-- 헤더 -->
      <header>
        <span>접속중인 ID: {{ userId }} </span>
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
                <option value="활성화">활성화</option>
                <option value="비활성화">비활성화</option>
                <option value="정지">정지</option>
              </select>

              <select v-model="selectedType">
                <option value="">회원 유형</option>
                <option value="USER">user</option>
                <option value="MAKER">maker</option>
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
                    <td>{{ user.name }}</td>
                    <td>{{ user.createdAt }}</td>
                    <td>{{ user.accountStatus }}</td>
                    <td>{{ user.memberType }}</td>
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
              <p><strong>우편번호:</strong> {{ selectedUser.zipCode}}</p>
              <p><strong>주소:</strong> {{ selectedUser.address }}</p>
              <p><strong>계정 생성일:</strong> {{ selectedUser.createdAt }}</p>
              <p><strong>계정 상태:</strong> {{ selectedUser.accountStatus }}</p>
              <p><strong>회원유형:</strong> {{ selectedUser.memberType }}</p>
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
import {userApi} from "@/api/index.js";

export default {
  name: 'UserManagement',
  data() {
    return {
      userId: localStorage.getItem("adminId"),
      userName: "관리자",
      selectedStatus: "",
      selectedType: "",
      searchQuery: "",
      selectedUser: null,
      currentPage: 1,
      itemsPerPage: 10,
      totalPages: 0,
      users: [],
    };
  },
  computed: {

    paginatedUsers() {
      // console.log("yejin user check:", this.users);
      return this.users;

    },

  },
  watch: {

    currentPage(){
      this.findUsers();
    }
  },
  methods: {
    async findUsers() {
      try {
        const params = {
          page: this.currentPage,
          status: this.selectedStatus || "",
          memberType: this.selectedType || "",
          name: this.searchQuery || ""
        };

        console.log("parms", params);

        const response = await userApi.getUsers(params);

        console.log("check check yejin users: ", response);
        this.users = response.data.dataList;
        //
        // console.log("check check yejin users: ");

        if (response.data.pageInfoDTO) {
          this.totalPages = response.data.pageInfoDTO.total;
          // this.currentPage = response.data.pageInfoDTO.page;
        }
      } catch (error) {
        console.error('사용자 조회 실패: ', error);
      }
    },

    logout() {
      this.$router.push('/admin');
    },
    searchUsers() {
      this.currentPage = 1;
      this.findUsers();
      console.log("검색 실행");
    },
    selectUser(user) {
      this.selectedUser = user;
    },
  },
  async created(){
    await this.findUsers();
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