<template>
  <div class="details-page">
    <header class="header">
    </header>
    <main class="main-content">
      <h2 class="page-title">Details</h2>

      <div v-if="isLoading" class="loading">
        <p>加载中...</p>
      </div>

      <div v-else-if="errorMessage" class="error-message">
        <p>{{ errorMessage }}</p>
      </div>

      <form v-else @submit.prevent="submitEdit" class="details-form">
        <div class="form-group">
          <!--label for="title">Title:</label>
          <input type="text" id="title" v-model="title" required /-->
        </div>
        <div class="form-group">
          <label for="description">Agreement Description:</label>
          <textarea id="description" v-model="description" rows="5" required></textarea>
        </div>
        <div class="form-row">
          <div class="form-group half-width">
            <label for="child">Choose Your Child</label>
            <div class="select-wrapper">
              <select id="child" v-model="selectedChild" required>
                <option value="">Select a child</option>
                <option v-for="child in childrenList" :key="child.childrenId" :value="child.childrenId">
                  {{ child.name }}
                </option>
              </select>
            </div>
          </div>
          <div class="form-group half-width">
            <label for="destination">Choose Your Destination Address</label>
            <div class="select-wrapper">
              <select id="destination" v-model="selectedDestination" required>
                <option value="">Select a destination</option>
                <option v-for="address in addressesList" :key="address.addressId" :value="address.addressId">
                  {{ address.addressLine1 }}, {{ address.city }}, {{ address.state }}
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
          <button type="submit" class="submit-button">Edit</button>
        </div>
      </form>
    </main>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'PostDetails',
  inject: ['apiBaseUrl'],
  data() {
    return {
      description: 'default description',
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
      childrenList: [],
      addressesList: [],
      isLoading: false,
      errorMessage: '',
      requestId: '',
    };
  },
  mounted() {
    // get requestId
    this.requestId = this.$route.params.id || localStorage.getItem('postId');
    if (!this.requestId) {
      this.errorMessage = 'Cannot find request id, please try again.';
      return;
    }
    // store requestId in localStorage
    localStorage.setItem('requestId', this.requestId);
    // get details page data
    this.fetchDetailsPageData();
  },
  methods: {
    //
    async fetchDetailsPageData() {
      this.isLoading = true;
      try {
        await Promise.all([
          this.fetchRequestDetails(),
          this.fetchChildren(),
          this.fetchAddresses(),
        ]);
      } catch (error) {
        console.error(error);
        this.errorMessage = 'Load data failed, please try again.';
      } finally {
        this.isLoading = false;
      }
    },
    async fetchRequestDetails() {
      try {
        const response = await axios.get(`${this.apiBaseUrl}/requests/${this.requestId}`);
        const data = response.data;
        console.log('Request Details:', data);
        // parse scheduletime to string
        this.schedule = JSON.parse(data.scheduletime) || this.schedule;
        this.description = data.description || '';
        this.selectedChild = data.childId || '';
        this.selectedDestination = data.dropoffAddress || '';
        console.log('Parsed Schedule:', this.schedule);
      } catch (error) {
        console.error('Faild:', error);
        throw error;
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
          throw new Error('cannot find userId, please login first.');
        }
        const response = await axios.get(`${this.apiBaseUrl}/parentsAddress/${userId}`);
        this.addressesList = response.data;

        // Iterate through the addressesList, getting the address details one by one using the addressId and updating each address
        await Promise.all(
            this.addressesList.map(async (address) => {
              const addressResponse = await axios.get(`${this.apiBaseUrl}/address/${address.addressId}`);
              Object.assign(address, addressResponse.data); // Merge the returned values into the address object
            })
        );
        console.log('Addresses List:', this.addressesList);
      } catch (error) {
        console.error('Error:', error);
        throw error;
      }
    },
    // Check if a time is selected
    isChecked(day, time) {
      return this.schedule[day] && this.schedule[day].includes(time);
    },

    // Toggles the selected state at a certain time
    toggleTime(day, time) {
      if (this.schedule[day].includes(time)) {
        this.schedule[day] = this.schedule[day].filter((t) => t !== time);
      } else {
        this.schedule[day].push(time);
      }
    },

    async submitEdit() {
      this.isLoading = true;
      this.errorMessage = '';
      try {
        const response0 = await axios.get(`${this.apiBaseUrl}/requests/${this.requestId}`);
        const payload = response0.data;
        //only update the description, childId, dropoffAddress, and scheduletime
        payload.description = this.description;
        payload.childId = this.selectedChild;
        payload.dropoffAddress = this.selectedDestination;
        payload.scheduletime = JSON.stringify(this.schedule);
        console.log('Payload:', payload);
        const response = await axios.put(`${this.apiBaseUrl}/requests/${this.requestId}/edit`, payload);
        if (response.status === 200 || response.status === 204) {
          alert('Request Updated');
        } else {
          this.errorMessage = 'failed to update request, please try again.';
        }
      } catch (error) {
        console.error('Update failed', error);
        this.errorMessage = 'failed to update request, please check input.';
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style scoped>
.details-page {
  font-family: Arial, sans-serif;
  max-width: 800px;
  height: 100vh;
  width: 100vw;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.page-title {
  background-color: #ffaa00;
  color: white;
  padding: 10px;
  margin-bottom: 20px;
}

.details-form {
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
}

.loading,
.error-message {
  text-align: center;
  font-size: 18px;
  color: #ff0000;
}
</style>
