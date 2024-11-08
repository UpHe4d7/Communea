<template>
  <div class="request-detail">
    <div class="content">
      <div class="banner"></div>
      <div class="detail-container">
        <div class="image-container">
          <img :src="request.image" alt="Family" class="family-image">
        </div>
        <div class="detail-content">
          <div class="info-container">
            <h2 class="request-title">{{ request.title}}</h2>
            <p class="location">{{ request.location}}</p>
            <p class="description">{{ request.description}}</p>
            <div class="child-info">
              <p><strong>Child Information :</strong> {{ request.childInfo}}</p>
            </div>

            <div class="schedule">
              <h3>Schedule Time</h3>
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
                          disabled
                      />
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="destination">
              <p><strong>Destination Address :</strong> {{ request.destinationAddress}}</p>
            </div>
            <div class="action-buttons">
              <button v-if="!hasApplied" class="apply-button" @click="applyForRequest">Apply</button>
              <button v-else class="reject-button" @click="cancelApplication">Cancel Application</button>
            </div>
            <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'RequestDetail',
  inject: ['apiBaseUrl'],
  data() {
    return {
      request: {
        title: 'A walker Needed for a toddler(1-3 years) in Lane Cove 2066',
        location: '2066, Lane Cove North, Lane Cove',
        description: 'We are looking for a reliable walker to help with our child on weekdays. Ideally, we need someone who lives nearby and can start as soon as possible. Please note our 7 am start time.',
        image: '/images/家庭照片1.png',
        childInfo: 'Ryan, Male, 3 years old',
        destinationAddress: '50 Greenslope St., Huntville',
      },

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
      isLoading: false,
      errorMessage: '',
    };
  },
  mounted() {
    this.fetchRequestDetail();
  },
  methods: {
    // check if a time slot is checked
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

    async fetchRequestDetail() {
      // 获取请求ID从路由参数
      const requestId = this.$route.params.id;
      if (!requestId) {
        this.errorMessage = 'request ID not found in route parameters.';
        return;
      }

      this.isLoading = true;
      try {
        const response = await axios.get(`${this.apiBaseUrl}/requests/${requestId}`);
        this.schedule = JSON.parse(response.data.scheduletime);
        if (response.data) {
          // 映射API返回的数据到request对象

          this.request = {
            description: response.data.description || this.request.description,
            parentId: response.data.parentId,
          };
          console.log(response.data);
          const response1 = await axios.get(`${this.apiBaseUrl}/user/getPhotoUrl/?userId=${this.request.parentId}`);
          this.request.image = response1.data || this.request.image;

          const child = await axios.get(`${this.apiBaseUrl}/children/${response.data.childId}`);
          this.request.childInfo = `${child.data.name}, ${child.data.gender}, ${child.data.age} years old` || this.request.childInfo;

          const pickupAddress = await axios.get(`${this.apiBaseUrl}/address/${response.data.pickupAddress}`);
          this.request.location = pickupAddress.data.addressLine1;
          const dropoffAddress = await axios.get(`${this.apiBaseUrl}/address/${response.data.dropoffAddress}`);
          this.request.destinationAddress = dropoffAddress.data.addressLine1 || this.request.destinationAddress;
          this.request.title = `From ${this.request.location} to ${this.request.destinationAddress}`;
        } else {
          this.errorMessage = 'cannot find request details.';
        }
      } catch (error) {
        console.error('Error fetching request details:', error);
        this.errorMessage = 'get request details failed.';
      } finally {
        this.isLoading = false;
      }
    },
    handleReject() {
      alert('Rejected');
    },

    async applyForRequest() {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        this.errorMessage = 'User not logged in.';
        return;
      }

      try {
        const response = await axios.post(`${this.apiBaseUrl}/applications/create`, {
          walkerId: userId,
          requestId: this.$route.params.id
        });
        if (response.status === 200) {
          this.hasApplied = true;
          this.applicationId = response.data.id; // 更新 applicationId
          alert('Successfully applied for the request.');
        }
      } catch (error) {
        console.error('Error applying for request:', error);
        this.errorMessage = 'Failed to apply for the request.';
      }
    },

    async cancelApplication() {
      if (!this.applicationId) {
        this.errorMessage = 'No application to cancel.';
        return;
      }

      try {
        const response = await axios.delete(`${this.apiBaseUrl}/applications/${this.applicationId}`);
        if (response.status === 200) {
          this.hasApplied = false;
          this.applicationId = null;
          alert('Cancel application successfully.');
        }
      } catch (error) {
        console.error('Error canceling application:', error);
        this.errorMessage = 'Failed to cancel the application.';
      }
    },
  },
};
</script>

<style scoped>
.request-detail {
  font-family: Arial, sans-serif;
  width: 80%;
  max-width: 800px;
  margin: 0 auto;
}

.banner {
  height: 30px;
  background-color: #0A2640;
  margin-bottom: 20px;
}

.detail-container {
  padding: 0 20px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}

.detail-content {
  display: flex;
  align-items: flex-start;
}

.image-container {
  margin-right: 20px;
  flex-shrink: 0;
}

.family-image {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}

.info-container {
  flex-grow: 1;
  width: 100%;
}

.request-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.location,
.description,
.child-info p,
.destination p {
  font-size: 14px;
  line-height: 1.4;
  margin-bottom: 15px;
}

h3 {
  font-size: 16px;
  margin-top: 20px;
  margin-bottom: 10px;
}

.schedule table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.schedule th,
.schedule td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}

.schedule th {
  background-color: #f2f2f2;
}

.schedule td {
  cursor: pointer;
}

.circle {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid #000;
  transition: background-color 0.2s;
}

.filled {
  background-color: #000;
}

.destination p {
  margin-bottom: 20px;
}

.action-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
}

.apply-button,
.reject-button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
}

.apply-button {
  background-color: #0A2640;
  color: white;
}

.reject-button {
  background-color: black;
  color: white;
}

.error-message {
  color: red;
  margin-top: 10px;
}


.schedule-table {
  width: 100%;
  border-collapse: collapse;
}

.schedule-table {
  overflow-x: auto;
}
</style>
