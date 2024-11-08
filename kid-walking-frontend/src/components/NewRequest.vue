<template>
  <div class="post-request-page">
    <header class="header">
    </header>
    <main class="main-content">
      <h2 class="page-title">Post a Request</h2>
      <form @submit.prevent="submitRequest" class="request-form">
        <div class="form-group">
          <!--=label for="title">Title:</label>
          <input type="text" id="title" v-model="title" required /-->
        </div>
        <div class="form-group">
          <label for="description">Request Description:</label>
          <textarea id="description" v-model="description" rows="5" required></textarea>
        </div>
        <div class="form-row">
          <div class="form-group half-width">
            <label for="child">Choose Your Child</label>
            <div class="select-wrapper">
              <select id="child" v-model="selectedChild" required>
                <option value="">Select a Child</option>
                <option v-for="child in childrenList" :key="child.childrenId" :value="child.childrenId">
                  {{ child.name }} (Age: {{ child.age }}, Gender: {{ child.gender }})
                </option>
              </select>
            </div>
          </div>
          <div class="form-group half-width">
            <label for="destination">Choose Your Destination Address</label>
            <div class="select-wrapper">
              <select id="destination" v-model="selectedDestination" required>
                <option value="">Select a Destination</option>
                <option v-for="address in addressesList" :key="address.addressId" :value="address.addressId">
                  {{ address.addressLine1 }}, {{ address.city }}, {{ address.state }}, {{ address.postcode }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <div class="schedule-section">
          <h3>My Schedule</h3>
          <div class="schedule-table">
            <table>
              <thead>
              <tr>
                <th></th>
                <th v-for="day in days" :key="day">{{ day }}</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(time, index) in times" :key="index">
                <td>{{ time }}</td>
                <td v-for="day in days" :key="day">
                  <input
                      type="checkbox"
                      :name="`${day}-${time}`"
                      :checked="isChecked(day, time)"
                      @change="toggleTime(day, time)"
                  />
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="button-container">
          <button type="submit" class="submit-button" :disabled="isSubmitting">
            {{ isSubmitting ? 'Submitting...' : 'Post a Request' }}
          </button>
        </div>
        <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </form>
    </main>
  </div>
</template>

<script>
/* eslint-disable */
import axios from 'axios';

export default {
  name: 'PostRequestPage',
  inject: ['apiBaseUrl'],
  data() {
    return {
      // 表单数据
      title: '',
      description: '',
      selectedChild: '',
      selectedDestination: '',

      days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      times: ["Morning", "Afternoon", "Evening", "Night"],
      schedule: {
        Mon: [],
        Tue: [],
        Wed: [],
        Thu: [],
        Fri: [],
        Sat: [],
        Sun: [],
      },

      // fetched data
      childrenList: [], // children list
      addressesList: [], // addresses list

      // user data
      userId: '',
      pickupAddress: '',

      // status
      isLoading: false,
      isSubmitting: false,
      errorMessage: '',
      successMessage: '',
    };
  },
  mounted() {
    this.initializeData();
  },
  methods: {
    // initialize data
    async initializeData() {
      this.isLoading = true;
      try {
        // get userId
        this.userId = localStorage.getItem('userId');
        if (!this.userId) {
          this.errorMessage = 'User ID not found. Please log in.';
          return;
        }

        // get pickup address
        const userResponse = await axios.get(`${this.apiBaseUrl}/user/${this.userId}`);
        this.pickupAddress = userResponse.data.addressId || 'Default Pickup Address';

        // get children list
        await this.fetchChildren();

        // get addresses list
        await this.fetchAddresses();

      } catch (error) {
        console.error(error);
        this.errorMessage = 'Failed to initialize data. Please try again later.';
      } finally {
        this.isLoading = false;
      }
    },

    async fetchChildren() {
      try {
        const parentId = localStorage.getItem('userId');
        if (!parentId) {
          throw new Error('Cannot find parentId, please login first.');
        }
        const response = await axios.get(`${this.apiBaseUrl}/children/parent/${parentId}`);
        this.childrenList = response.data;
      } catch (error) {
        console.error('Failed to get children inform', error);
        throw error;
      }
    },

    async fetchAddresses() {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          throw new Error('未找到用户ID，请先登录。');
        }
        const response = await axios.get(`${this.apiBaseUrl}/parentsAddress/${userId}`);
        this.addressesList = response.data;

        // retrieve address details for each address
        await Promise.all(
            this.addressesList.map(async (address) => {
              const addressResponse = await axios.get(`${this.apiBaseUrl}/address/${address.addressId}`);
              Object.assign(address, addressResponse.data); // 将返回的值合并到 address 对象中
            })
        );
        console.log('Addresses List:', this.addressesList);
      } catch (error) {
        console.error('Failed: ', error);
        throw error;
      }
    },

    // check if a time is selected
    isChecked(day, time) {
      return this.schedule[day] && this.schedule[day].includes(time);
    },

    // toggle a time slot
    toggleTime(day, time) {
      if (this.schedule[day].includes(time)) {
        this.schedule[day] = this.schedule[day].filter((t) => t !== time);
      } else {
        this.schedule[day].push(time);
      }
    },

    // handle form submission
    async submitRequest() {
      // 清除之前的消息
      this.errorMessage = '';
      this.successMessage = '';

      // verify form data
      if (!this.selectedChild || !this.selectedDestination) {
        this.errorMessage = 'Please select both a child and a destination address.';
        return;
      }

      // initialize request body
      const requestBody = {
        childId: this.selectedChild,
        description: this.description,
        dropoffAddress: this.selectedDestination,
        parentId: this.userId,
        pickupAddress: this.pickupAddress,
        scheduletime: JSON.stringify(this.schedule),
        status: 'Open',
      };

      this.isSubmitting = true;
      try {
        const response = await axios.post(`${this.apiBaseUrl}/requests/createRequest`, requestBody);
        this.successMessage = 'Request posted successfully!';
        // reset form
        this.resetForm();

      } catch (error) {
        console.error(error);
        this.errorMessage = 'Failed to post request. Please try again later.';
      } finally {
        this.isSubmitting = false;
      }
      //go to my post page
      this.$router.push({ name: 'MyPost' });
    },

    resetForm() {
      this.title = '';
      this.description = '';
      this.selectedChild = '';
      this.selectedDestination = '';
      this.schedule = {
        Mon: [],
        Tue: [],
        Wed: [],
        Thu: [],
        Fri: [],
        Sat: [],
        Sun: [],
      };
    },
  },
};
</script>

<style scoped>
.post-request-page {
  font-family: Arial, sans-serif;
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.menu-button {
  background: none;
  border: none;
  font-size: 24px;
  margin-right: 10px;
  cursor: pointer;
}

.logo {
  font-size: 20px;
  font-weight: bold;
}

.highlight {
  color: #ffaa00;
}

.page-title {
  background-color: #ffaa00;
  color: white;
  padding: 10px;
  margin-bottom: 20px;
  text-align: center;
  border-radius: 4px;
}

.request-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-row {
  display: flex;
  gap: 20px;
}

.half-width {
  width: 50%;
}

label {
  margin-bottom: 5px;
  font-weight: bold;
}

input[type="text"],
textarea,
select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.select-wrapper {
  position: relative;
}

.select-wrapper::after {
  content: '▼';
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  pointer-events: none;
}

.schedule-section {
  margin-top: 20px;
}

.schedule-section h3 {
  margin-bottom: 10px;
}

.schedule-table {
  width: 100%;
  border-collapse: collapse;
}

.schedule-table th,
.schedule-table td {
  border: 1px solid #eee;
  padding: 10px;
  text-align: center;
}

.schedule-table th {
  background-color: #f5f5f5;
}

.button-container {
  display: flex;
  justify-content: center;
}

.submit-button {
  background-color: #ffaa00;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;
  border-radius: 4px;
}

.submit-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.error-message {
  color: red;
  text-align: center;
}

.success-message {
  color: green;
  text-align: center;
}
</style>
