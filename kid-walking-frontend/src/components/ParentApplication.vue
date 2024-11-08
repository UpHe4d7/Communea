<template>
  <div class="application-page">
    <div class="page-header">
      <h2>Application</h2>
    </div>

    <div v-if="isLoading" class="loading">
      <p>Loading...</p>
    </div>

    <div v-else-if="errorMessage" class="error">
      <p>{{ errorMessage }}</p>
    </div>
    <div v-else class="application-list">
      <div
          v-for="request in requests"
          :key="request.requestId"
          class="application-card"
      >
        <div class="application-info">
          <h3>{{ request.title }}</h3>
          <p>{{ request.description }}</p>
          <div v-if="request.applications && request.applications.length">
            <h4>Applications:</h4>

            <div class="application-list">
              <div v-for="application in request.applications" :key="application.applicationId" class="application-card">
                <div class="application-info">
                  <img :src="application.walkerPhoto" alt="Walker Image" class="walker-image" />
                  <h3>{{ application.walkerName }} - {{ application.applicationStatus }}</h3>
                </div>
                <div v-if="application.applicationStatus == 'waiting for parents response' " class="details-button">
<!--                  <button @click="goToDetails(request.requestId)">View Details</button>-->
                  <button @click="goToDetails(application.applicationId)">View Details</button>
                </div>
              </div>
            </div>
          </div>
          <div v-else>
            <p>No applications available.</p>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ParentApplication',
  inject: ['apiBaseUrl'],
  data() {
    return {
      requests: [
      ],          // requests data

      isLoading: false,
      errorMessage: '',
    };
  },
  mounted() {
    this.fetchRequest()
  },
  methods: {
    /**
     * get requests data
     */
    fetchRequest() {
      const userId = localStorage.getItem('userId');
      axios.get(`${this.apiBaseUrl}/requests/list/?parentId=${userId}`)
        .then(response => {
          this.requests = response.data;
          // fetch applications for each request
          this.requests.forEach(request => {
            this.fetchApplications(request);
          });
        })
        .catch(error => {
          console.error('error when fetching requests:', error);
          this.errorMessage = 'cannot get requests data, please try again later.';
        });
    },

    fetchApplications(request) {
      axios.get(`${this.apiBaseUrl}/applications/byRequest/${request.requestId}`)
          .then(response => {
            request.applications= response.data;
            console.log(request.applications);
            request.applications.forEach(application => {
              this.fetchWalkerName(application);
               this.fetchWalkerPhoto(application);
            });
          })
          .catch(error => {
            console.error('Error when fetching applications', error);
            this.errorMessage = 'Cannot get applications data, please try again later.';
          });
    },
    fetchWalkerName(application) {
      axios.get(`${this.apiBaseUrl}/user/${application.walkerId}`)
          .then(response => {
            application.walkerName = response.data.firstName+' '+response.data.lastName;
          })
          .catch(error => {
            console.error('Error when fetching walker', error);
            this.errorMessage = 'Cannot get walker data, please try again later.';
          });
    },
    fetchWalkerPhoto(application) {
      axios.get(`${this.apiBaseUrl}/user/getPhotoUrl/?userId=${application.walkerId}`)
          .then(response => {
            application.walkerPhoto = response.data;
          })
          .catch(error => {
            console.error('Error when fetching walker avatar', error);
            this.errorMessage = 'Cannot get walker avatar, please try again later.';
          });
    },

    /**
     * go to application details page
     * @param {String} id - application id
     */
    goToDetails(id) {
      this.$router.push(`/pending-detail/${id}`);
    },
  },
};
</script>

<style scoped>
.application-page {
  width: 80%;
  max-width: 1200px;
  padding: 20px;
  background-color: #f9f9f9;
}

.page-header {
  padding-bottom: 20px;
  border-bottom: 2px solid #ffaa00;
  margin-bottom: 20px;
}

.loading, .error {
  text-align: center;
  margin-top: 50px;
  font-size: 18px;
  color: #ff0000;
}

.application-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.application-card {
  display: flex;
  align-items: center;
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.walker-image {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 20px;
}

.application-info {
  flex-grow: 1;
}

.application-info h3 {
  margin: 0;
}

.status {
  font-weight: bold;
  margin-top: 5px;
}

.message {
  margin-top: 5px;
  color: #555;
}

.details-button button {
  background-color: #ffaa00;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

.details-button button:hover {
  background-color: #e69500;
}
</style>
