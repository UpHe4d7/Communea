<template>
  <div class="request-detail" v-if="parent">
    <div class="content">
      <div class="banner"></div>
      <div class="navigation">
        <a href="/walker-home" class="back-link">‹ View all request</a>
        <a :href="nextRequestUrl" class="next-link">Next request ›</a>
      </div>
      <div class="detail-container">
        <div class="detail-content">
          <div class="image-container">
            <img :src="parent.image" alt="Family" class="family-image">
          </div>
          <div class="info-container">
            <h2 class="request-title">{{ parent.title }}</h2>
            <p class="location">{{ parent.location }}</p>
            <p class="description">{{ parent.description }}</p>
            <div class="child-info">
              <p><strong>Child Information :</strong>
                <span v-for="(child, index) in parent.children" :key="child.childrenId">
                  {{ child.name }}
                  <span v-if="index < parent.children.length - 1"> | </span>
                </span>
              </p>
            </div>
            <div class="schedule">
              <h3>Schedule Time </h3>
              <table>
                <thead>
                <tr>
                  <th></th>
                  <th v-for="day in weekDays" :key="day">{{ day }}</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(row, index) in scheduleRows" :key="index">
                  <td>{{ row.time }}</td>
                  <td v-for="day in weekDays" :key="`${row.time}-${day}`" @click="toggleSchedule(row.time, day)">
                    <span :class="{'circle': true, 'filled': row.schedule[day]}"></span>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
            <div class="destination">
              <p><strong>Destination Address :</strong> {{ parent.destinationAddress }}</p>
            </div>
            <div class="action-buttons">
              <button class="apply-button" @click="applyToRequest">Apply</button>
              <button class="reject-button">Reject</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="error-message">
    <p>Sorry, the requested parent information is not available.</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ParentDetail',
  props: ['id'],
  inject: ['apiBaseUrl'],
  data() {
    return {
      parent: null,
      weekDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      scheduleRows: [
        { time: 'Morning', schedule: { Mon: false, Tue: false, Wed: false, Thu: false, Fri: false, Sat: false, Sun: false } },
        { time: 'Afternoon', schedule: { Mon: false, Tue: false, Wed: false, Thu: false, Fri: false, Sat: false, Sun: false } },
        { time: 'Evening', schedule: { Mon: false, Tue: false, Wed: false, Thu: false, Fri: false, Sat: false, Sun: false } },
        { time: 'Night', schedule: { Mon: false, Tue: false, Wed: false, Thu: false, Fri: false, Sat: false, Sun: false } },
      ],
      isLoading: false,
      errorMessage: '',
    };
  },
  computed: {
    nextRequestUrl() {
      const nextId = parseInt(this.id) + 1;
      return `/parent-detail/${nextId}`;
    }
  },
  mounted() {
    this.fetchParentDetail();
  },
  methods: {
    async fetchParentDetail() {
      this.isLoading = true;
      try {
        // Step 1: get request details
        const requestResponse = await axios.get(`${this.apiBaseUrl}/requests/${this.id}`);
        const requestData = requestResponse.data;

        if (!requestData) {
          throw new Error('Request data not found');
        }

        // Step 2: get user details
        const parentId = requestData.parentId;
        const userResponse = await axios.get(`${this.apiBaseUrl}/user/${parentId}`);
        const userData = userResponse.data;

        if (!userData) {
          throw new Error('User data not found');
        }

        // Step 3: get address details
        const pickupAddressId = requestData.pickupAddress;
        const dropoffAddressId = requestData.dropoffAddress;

        const [pickupAddressResponse, dropoffAddressResponse] = await Promise.all([
          axios.get(`${this.apiBaseUrl}/address/${pickupAddressId}`),
          axios.get(`${this.apiBaseUrl}/address/${dropoffAddressId}`)
        ]);

        const pickupAddress = pickupAddressResponse.data;
        const dropoffAddress = dropoffAddressResponse.data;

        // Step 4: get children details
        const childrenResponse = await axios.get(`${this.apiBaseUrl}/children/parent/${parentId}`);
        const childrenData = childrenResponse.data;

        // Step 5: get parent photo
        // 假设 /user/getPhotoUrl/{userId} 返回 { imageUrl: 'url' }
        let imageUrl = '/images/default-family.png'; // 默认图片
        try {
          const photoResponse = await axios.get(`${this.apiBaseUrl}/user/getPhotoUrl/${parentId}`);
          imageUrl = photoResponse.data.imageUrl || imageUrl;
        } catch (photoError) {
          console.warn('error when fetching avatar', photoError);
        }

        // setup parent data
        this.parent = {
          id: requestData.requestId,
          title: requestData.description, // adjust as needed
          location: pickupAddress ? `${pickupAddress.addressLine1}, ${pickupAddress.city}` : 'Unknown Location',
          description: requestData.description,
          image: imageUrl,
          children: childrenData.map(child => ({
            childrenId: child.childrenId,
            name: child.name
          })),
          destinationAddress: dropoffAddress ? `${dropoffAddress.addressLine1}, ${dropoffAddress.city}` : 'Unknown Address',
        };

      } catch (error) {
        console.error(error);
        this.errorMessage = 'could not load parent details';
      } finally {
        this.isLoading = false;
      }
    },
    applyToRequest() {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        alert('请先登录');
        return;
      }

      const applicationData = {
        walkerId: userId,
        requestId: this.parent.id,
        applicationStatus: 'Pending',
        description: 'I am interested in this request.',
        preMeetScheduled: false,

      };

      axios.post(`${this.apiBaseUrl}/applications/create`, applicationData)
          .then(response => {
            if (response.data) {
              alert('Application submitted successfully');
              // 可选：重定向或更新 UI
            } else {
              alert('Application submission failed');
            }
          })
          .catch(error => {
            console.error(error);
            alert('Error submitting application');
          });
    },
    toggleSchedule(time, day) {
      const row = this.scheduleRows.find(row => row.time === time);
      if (row) {
        row.schedule[day] = !row.schedule[day];
      }
    }
  }
};
</script>

<style scoped>
.request-detail {
  font-family: Arial, sans-serif;
  max-width: 800px;
  margin: 0 auto;
}

.header {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #e0e0e0;
}

.navigation {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 10px;
}

.back-link, .next-link {
  color: #555;
  text-decoration: none;
  font-size: 14px;
}

.back-link:hover, .next-link:hover {
  text-decoration: underline;
}

.banner {
  height: 30px;
  background-color: #FFAA00;
  margin-bottom: 20px;
}

.detail-container {
  padding: 0 20px;
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
}

.request-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.location, .description, .child-info p, .destination p {
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

.schedule th, .schedule td {
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

.action-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
}

.apply-button, .reject-button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
}

.apply-button {
  background-color: #FFAA00;
  color: white;
}

.reject-button {
  background-color: black;
  color: white;
}

.check-button {
  background-color: #FFD700;
  border: none;
  border-radius: 4px;
  padding: 2px 8px;
  margin-left: 10px;
  cursor: pointer;
  font-size: 12px;
}

@media (max-width: 600px) {
  .detail-content {
    flex-direction: column;
  }

  .image-container {
    margin-right: 0;
    margin-bottom: 20px;
  }

  .family-image {
    width: 80px;
    height: 80px;
  }

  .action-buttons {
    flex-direction: column;
  }

  .apply-button, .reject-button {
    width: 100%;
    margin-bottom: 10px;
  }
}
</style>
