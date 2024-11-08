<template>
  <div class="manager-home">
    <aside class="sidebar">

      <button @click="goToMonitorPage" class="admin-btn">Monitor Page</button>
      <ul>
        <li
            v-for="table in tables"
            :key="table.name"
            :class="{ active: currentTable === table.name }"
            @click="selectTable(table.name)"
        >
          {{ table.name }}
        </li>
      </ul>
    </aside>
    <main class="content-area">
      <h2>{{ currentTable }} Table Data</h2>

      <!-- Action buttons -->
      <div class="action-buttons">
        <button @click="openEditModal" class="edit-btn" :disabled="selectedRows.length !== 1">Edit</button>
<!--        <button @click="deleteSelectedRows" class="delete-btn" :disabled="selectedRows.length !== 1">Delete</button>-->
      </div>

      <!-- data table -->
      <div v-if="tableData.length" class="table-container">
        <table>
          <thead>
          <tr>
            <th><input type="checkbox" @change="selectAllRows" /></th>
            <th v-for="(value, key) in tableData[0]" :key="key">{{ key }}</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="row in tableData" :key="row.id">
            <td>
              <input
                  type="checkbox"
                  :value="row"
                  v-model="selectedRows"
              />
            </td>
            <td v-for="(value, key) in row" :key="key">{{ value }}</td>
          </tr>
          </tbody>
        </table>
      </div>

      <div v-else>
        <p>Please select a table</p>
      </div>

      <!-- Edit modal -->
      <div v-if="showEditModal" class="modal">
        <div class="modal-content">
          <h3>编辑 {{ currentTable }} data</h3>
          <form @submit.prevent="saveEdit">
            <div v-for="(value, key) in editData" :key="key" class="form-group">
              <label :for="key">{{ key }}</label>
              <!-- 如果是身份字段，使用下拉框 -->
              <div v-if="key === 'userType'">
                <select v-model="editData[key]" :id="key">
                  <option value="admin">Parent</option>
                  <option value="user">Walker</option>
                </select>
              </div>
              <!-- 其他字段使用输入框 -->
              <div v-else>
                <input type="text" v-model="editData[key]" :id="key" />
              </div>
            </div>
            <button type="submit" class="save-btn">Save</button>
            <button type="button" class="cancel-btn" @click="closeEditModal">Cancel</button>
          </form>
        </div>
      </div>

      <!-- 添加新数据按钮 -->
<!--      <button @click="addRow" class="add-btn">添加新数据</button>-->
    </main>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  inject: ['apiBaseUrl'],
  name: 'ManagerHome',
  data() {
    return {
      tables: [
        { name: 'Users' },
        { name: 'Agreement' },
      ],
      currentTable: '',
      tableData: [],
      selectedRows: [], // Used to store selected rows
      showEditModal: false, // control the display of the edit modal
      editData: {} // store the data of the row being edited
    };
  },
  methods: {
    // load the table data when a table is selected
    selectTable(tableName) {
      this.currentTable = tableName;
      this.fetchTableData(tableName);
      this.selectedRows = []; // clear the selected rows
    },

    goToMonitorPage() {
      this.$router.push('/StatisticsPage');
    },

    async fetchTableData(tableName) {
      try {
        if (tableName === 'Users') {
          const response = await axios.get(`${this.apiBaseUrl}/user/all`);
          this.tableData = response.data;
        } else if (tableName === 'Agreement') {
          const response = await axios.get(`${this.apiBaseUrl}/agreements/all`);
          this.tableData = response.data;
        } else {
          this.tableData = [];
          alert(`Only Users and Agreement tables are supported. ${tableName} is not supported`);
        }
      } catch (error) {
        console.error('Error fetching table data:', error);
        alert(`Load ${tableName} table fail`);
      }
    },

    // select all rows
    selectAllRows(event) {
      if (event.target.checked) {
        this.selectedRows = [...this.tableData];
      } else {
        this.selectedRows = [];
      }
    },

    // open the edit modal
    openEditModal() {
      if (this.selectedRows.length === 1) {
        this.editData = { ...this.selectedRows[0] }; // 克隆选中的行数据
        this.showEditModal = true;
      }
    },

    // save the edited data
    async saveEdit() {
      const tableName = this.currentTable
      try {
        let url;
        let payload;

        if (tableName === 'Users') {
          url = `${this.apiBaseUrl}/user/${this.editData.userId}`; // use editData.userId as the user ID
          payload = {
            addressId: this.editData.addressId,
            communicationPreference: this.editData.communicationPreference,
            dateOfBirth: this.editData.dateOfBirth,
            description: this.editData.description,
            email: this.editData.email,
            firstName: this.editData.firstName,
            lastName: this.editData.lastName,
            password: this.editData.password,
            phoneNumber: this.editData.phoneNumber,
            preferredName: this.editData.preferredName,
            userId: this.editData.userId,
            userType: this.editData.userType
          };
        } else if (tableName === 'Agreement') {
          url = `${this.apiBaseUrl}/agreements/${this.editData.agreementId}`; // use editData.agreementId as the agreement ID
          payload = {
            agreementId: this.editData.agreementId,
            comments: this.editData.comments,
            endTime: this.editData.endTime,
            ratingValue: this.editData.ratingValue,
            requestId: this.editData.requestId,
            startTime: this.editData.startTime,
            status: this.editData.status,
            trackingData: this.editData.trackingData,
            walkerId: this.editData.walkerId
          };
        } else {
          alert('Invalid table name specified');
          return;
        }

        // 发送 PUT 请求
        const response = await axios.put(url, payload);

        // 更新表格中的数据
        const index = this.tableData.findIndex(row =>
            tableName === 'Users' ? row.userId === this.editData.userId : row.agreementId === this.editData.agreementId
        );
        if (index !== -1) {
          this.tableData.splice(index, 1, response.data); // replace the row with the updated data
        }

        this.closeEditModal(); // close the edit modal
        alert('Successfully saved');
        window.location.reload();  // reload the page to refresh the data
      } catch (error) {
        console.error('Error saving edit:', error);
        alert('Save failed, please try again');
      }
    },



    // close the edit modal
    closeEditModal() {
      this.showEditModal = false;
      this.editData = {};
    },

    // delete the selected rows
    async deleteSelectedRows() {
      if (confirm('Are you sure you want to delete the selected rows?')) {
        try {
          for (const row of this.selectedRows) {
            console.log(row); // 检查 row 是否包含 userId 或者 id 是正确的 ID
            await axios.delete(`${this.apiBaseUrl}/user/${row.userId}`);
          }
          this.tableData = this.tableData.filter(row => !this.selectedRows.includes(row));
          this.selectedRows = [];
          alert('delete successfully');
        } catch (error) {
          console.error('Error deleting rows:', error);
          alert('delete failed, please try again');
        }
      }
    },

    // add a new row
    addRow() {
      alert('addRow function is not implemented yet');
    },
  },
};
</script>

<style scoped>
.manager-home {
  display: flex;
  min-height: 100vh;
  color: #333;
  margin-top: 0;
}

.admin-btn {
  background-color: #ffaa00;
  color: white;
  border: none;
  padding: 10px 15px;
  margin-bottom: 20px;
  width: 100%;
  text-align: center;
  cursor: pointer;
  border-radius: 4px;
}
.admin-btn:hover {
  background-color: #ff9900;
}

.sidebar {
  width: 200px;
  background-color: #333;
  color: #fff;
  padding: 20px;
  position: fixed;
  top: 60px;
  height: calc(100vh - 60px);
}

.sidebar ul {
  list-style-type: none;
  padding: 0;
}
.sidebar li {
  padding: 10px;
  cursor: pointer;
}
.sidebar li.active {
  background-color: #ffaa00;
}

.content-area {
  flex: 1;
  padding: 20px;
  margin-left: 220px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.action-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.edit-btn, .delete-btn {
  background-color: #ffaa00;
  color: white;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 4px;
}

.edit-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.delete-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.table-container {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 80%;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: left;
}

.add-btn {
  margin-top: 20px;
  background-color: #ffaa00;
  color: white;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 4px;
}

.add-btn:hover {
  background-color: #ff9900;
}

/* 弹窗样式 */
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
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 30px; /* 增加内边距 */
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 20px; /* 增加输入框的下方间距 */
}

.form-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 8px; /* 增加标签和输入框之间的间距 */
}

.form-group input {
  width: 100%;
  padding: 10px; /* 增加输入框的内边距 */
  border: 1px solid #ddd;
  border-radius: 4px;
}

.save-btn {
  background-color: #4CAF50;
  color: white;
  padding: 10px 15px;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  margin-right: 10px;
}

.cancel-btn {
  background-color: #ccc;
  color: white;
  padding: 10px 15px;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}

.save-btn:hover {
  background-color: #45a049;
}

.cancel-btn:hover {
  background-color: #999;
}

</style>
