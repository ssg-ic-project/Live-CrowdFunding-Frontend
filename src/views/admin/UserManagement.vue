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

        // if (response.data.pageInfoDTO) {
        //   this.totalPages = response.data.pageInfoDTO.total;
        //   // this.currentPage = response.data.pageInfoDTO.page;
        // }
        if (response.data.pageInfoDTO) {
          // 전체 데이터 개수를 페이지당 아이템 수로 나누어 올림하여 총 페이지 수 계산
          this.totalPages = Math.ceil(response.data.pageInfoDTO.total / 10);
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

<!-- src/layouts/AdminLayout.vue -->
<style scoped>
.admin-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #ffffff;
}

.admin-main {
  flex: 1;
  width: 100%;
}

.content-wrapper {
  max-width: 1800px;
  margin: 0 auto;
  padding: 0 20px;
  width: 100%;
  box-sizing: border-box;
}

.admin-container {
  display: flex;
  flex: 1;
  margin-top: 2rem;
  position: relative;
}

.sidebar-container {
  width: 250px;
  background-color: #ffffff;
  flex-shrink: 0;
  border-right: 1px solid #dee2e6;
  margin-right: 1rem; /* 사이드바와 콘텐츠 사이 간격 축소 */
}

.admin-content {
  flex: 1;
  padding: 1rem; /* padding 축소 */
  background-color: #ffffff;
  min-width: 0;
}

.admin-content.with-sidebar {
  margin-left: 0;
}

@media (max-width: 768px) {
  .admin-container {
    flex-direction: column;
  }
  
  .sidebar-container {
    width: 100%;
  }
  
  .admin-content.with-sidebar {
    margin-top: 1rem;
  }
  
  .content-wrapper {
    padding: 0 10px;
  }
}
</style>

<!-- src/views/admin/UserManagement.vue -->
<style scoped>
.dashboard {
  display: flex;
  min-height: 100vh;
  background-color: #ffffff;
  width: 100%;
}

.content {
  flex: 1;
  padding: 1.5rem;
  width: 100%;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1rem 1.5rem;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  width: 100%;
}

header button {
  padding: 0.5rem 1rem;
  background-color: #FF5151;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

header button:hover {
  background-color: #FFD74E;
  color: #333333;
  transform: translateY(-1px);
}

.main-content {
  display: grid;
  grid-template-columns: 60% 40%;
  gap: 2rem;
  flex: 1;
  width: 100%;
}

.content-section {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  width: 100%;
}

.content-section:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
}

.section-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #eee;
  background-color: #fff;
  border-radius: 12px 12px 0 0;
}

.section-header h2 {
  margin: 0;
  font-size: 1.25rem;
  color: #333;
  font-weight: 600;
}

.section-content {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
  height: 100%;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
}

.filters select,
.filters input {
  padding: 0.625rem;
  font-size: 0.95rem;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  transition: border-color 0.3s ease;
  min-width: 120px;
}

.filters select:focus,
.filters input:focus {
  outline: none;
  border-color: #FFD74E;
  box-shadow: 0 0 0 2px rgba(255, 215, 78, 0.1);
}

.filters button {
  padding: 0.625rem 1.25rem;
  background-color: #FF5151;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filters button:hover {
  background-color: #FFD74E;
  color: #333333;
  transform: translateY(-1px);
}

.user-list {
  margin: -0.5rem -1.5rem;
  padding: 0.5rem 1.5rem;
}

.user-list table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-bottom: 1rem;
}

.user-list th,
.user-list td {
  border: 1px solid #eee;
  padding: 1rem;
  text-align: left;
}

.user-list th {
  background-color: #ffffff;
  font-weight: 600;
  color: #444;
}

.user-list tr {
  cursor: pointer;
  transition: all 0.2s ease;
}

.user-list tr:hover {
  background-color: #fff8e7;
}

.user-list tr.selected {
  background-color: #FFF3D4;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 0;
  margin-top: 1rem;
  border-top: 1px solid #eee;
}

.pagination button {
  padding: 0.5rem 1rem;
  border: 1px solid #e0e0e0;
  background-color: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #666;
}

.pagination button:not(:disabled):hover {
  background-color: #FFD74E;
  border-color: #FFD74E;
  color: #333333;
  transform: translateY(-1px);
}

.pagination button:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
  border-color: #eee;
}

.pagination span {
  font-size: 0.95rem;
  color: #666;
  font-weight: 500;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #666;
  font-size: 1rem;
  background-color: #ffffff;
  border-radius: 8px;
}

.user-details p {
  padding: 0.75rem 0;
  border-bottom: 1px solid #eee;
  margin: 0;
}

.user-details p:last-child {
  border-bottom: none;
}

.user-details strong {
  display: inline-block;
  width: 120px;
  color: #555;
  font-weight: 600;
}
</style>