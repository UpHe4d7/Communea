<template>
  <div class="home-view">
    <div class="content-wrapper">
      <div class="statistics">
        <p><strong>{{ requests.length }}</strong> Requests results nearby ({{ filter.radius }} km)</p>
        <a href="#" class="filter" @click.prevent="showFilterModal = true">+ Filter</a>
      </div>
      <div class="results-list">
        <!-- Iterate through the list of requests and add click events -->
        <div class="result-item" v-for="request in requests" :key="request.id" @click="goToDetail(request.requestId)">
          <img :src="request.avatar" alt="Request Image" class="request-image" />
          <div class="request-info">
            <h2>{{ request.title }}</h2>
            <p class="description">{{ request.description }}</p>
          </div>
        </div>
      </div>

      <!-- filter modal -->
      <div v-if="showFilterModal" class="modal-overlay" @click.self="showFilterModal = false">
        <div class="filter-modal">
          <h3>Filter Options</h3>
          <form @submit.prevent="applyFilter">
            <div class="form-group">
              <label for="radius">Radius (km):</label>
              <select v-model="filter.radius" id="radius">
                <option value="2">2 km</option>
                <option value="3">3 km</option>
                <option value="5">5 km</option>
              </select>
            </div>
            <button type="submit">Apply</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  inject: ['apiBaseUrl'],
  name: 'HomeView',
  data() {
    return {
      requests: [
        {
          id: 1,
          title: 'A walker Needed for a toddler (1-3 years) in Lane Cove 2066',
          description: 'We are looking for a reliable Walker to help walk our child to school on weekdays. Ideally, someone with experience and flexibility in the mornings. Please reach out if you are available.',
          avatar: '/images/3.jpg'
        },
        {
          id: 2,
          title: 'Urgent: A walker Needed for Our Child in Liverpool',
          description: 'We are looking for a reliable Walker to help walk our child to school on weekdays. Ideally, someone with experience and flexibility in the mornings. Please reach out if you are available.',
          avatar: '/images/4.jpg'
        }
      ],
      showFilterModal: false,
      filter: {
        radius: '5' // dafault radius
      }
    };
  },
  mounted() {
    this.fetchNearbyRequests();
  },
  methods: {
    fetchUserPhoto(userId) {

      console.log(userId);
      return axios.get(`${this.apiBaseUrl}/user/getPhotoUrl/?userId=${userId}`)
          .then(response => {
            return response.data;
          })
          .catch(error => {
            console.error('Error fetching user photo:', error);
          });
    },

    goToDetail(requestId) {
      // redirect to request detail page
      this.$router.push({ name: 'RequestDetail', params: { id: requestId } });
    },
    applyFilter() {
      console.log('Applying filter with:', this.filter);
      this.showFilterModal = false; // close the modal
    },
    // send GET request to fetch nearby requests
    fetchNearbyRequests() {
      const walkerId = localStorage.getItem('userId');  // Get walkerId from localStorage
      const radius = this.filter.radius;  // Use filter radius

      // Send GET request to backend
      axios.get(`${this.apiBaseUrl}/requests/nearby-requests`, {
        params: {
          rangeInKm: radius,  // Pass radius
          walkerId: walkerId  // Pass walkerId
        }
      })
          .then(async (response) => {
            this.requests = response.data;  // Save the returned request data to requests array
            //filter out only open requests
            this.requests = this.requests.filter(request => request.status === 'Open');
            // Create an array of Promises for fetching avatars
            const avatarPromises = this.requests.map(async (request) => {
              const avatarUrl = await this.fetchUserPhoto(request.parentId);
              request.avatar = avatarUrl;  // Set avatar URL to each request
            });

            // Wait for all Promises to resolve
            await Promise.all(avatarPromises);

            console.log('Nearby requests with avatars:', this.requests);
          })
          .catch(error => {
            console.error('Error fetching nearby requests:', error);
          });
    }



  }
};
</script>

<style scoped>

.app-content{
  padding: 0px;
}

.home-view {
  display: flex;
  justify-content: center;
  top-padding: 0px;
  padding: 20px;
  width: 80%;
  max-width: 800px;
}

.content-wrapper {
  max-width: 800px; /* 设置最大宽度 */
  width: 100%; /* 让容器的宽度自适应 */
  background-color: #fff; /* 大框背景色 */
  border: 1px solid #ddd; /* 大框边框 */
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* 添加阴影 */
}

.statistics {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.filter {
  color: #0A2640;
  text-decoration: none;
  cursor: pointer;
}

.results-list {
  display: flex;
  flex-direction: column;
}

.result-item {
  display: flex;
  align-items: flex-start; /* 确保图片和内容顶部对齐 */
  margin-bottom: 20px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
  cursor: pointer;
}

.request-image {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  margin-right: 20px;
}

.request-info {
  flex-grow: 1;
}

.request-info h2 {
  margin: 0;
  font-size: 18px;
}

.description {
  margin-top: 10px;
  color: #333;
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.filter-modal {
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.form-group {
  margin-bottom: 15px;
}

button {
  padding: 8px 16px;
  background-color: #0A2640;
  border: none;
  color: #fff;
  cursor: pointer;
  border-radius: 4px;
}
</style>
