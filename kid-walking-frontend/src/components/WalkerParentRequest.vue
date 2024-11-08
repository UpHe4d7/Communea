<template>
  <div class="parent-request">
    <div class="content">
      <div class="banner">Parent Request</div>
      <div class="request-list">
        <div v-for="request in parentRequests" :key="request.id" class="request-card">
          <img :src="request.image" :alt="request.description" class="request-image">
          <div class="request-content">
            <p class="request-description">{{ request.description }}</p>
            <p class="request-status">
              {{ request.status }}
            </p>
          </div>
          <button v-if="request.status === 'Pending'" @click="reject(request.shareId)" class="reject-button">Reject</button>
          <router-link
              v-if="request.status === 'Pending'"
              :to="{ name: 'RequestDetail', params: { id: request.id }}"
              class="details-button"
          >
            Details
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  inject: ['apiBaseUrl'],
  name: 'ParentRequest',
  data() {
    return {
      userid: '',
      parentRequests: [
        {
          id: 1,
          image: '/images/家庭照片1.png',
          description: 'A walker Needed for a toddler(1-3 years) in Lane Cove 2066',
          status: 'Pending'
        },
        {
          id: 2,
          image: '/images/家庭照片2.png',
          description: 'Need pickup for 3-year-old, near Sydney CBD, urgent help!',
          status: 'Agreed'
        },
        {
          id: 3,
          image: '/images/家庭照片3.png',
          description: 'Looking for help with pickup for 5-year-old, based in Chatswood',
          status: 'Rejected'
        }
      ],
      request: {}
    }
  },
  mounted() {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      this.userId = storedUserId; // retrieve userId from localStorage
      console.log(this.userId);
      this.fetchParentRequests();
    } else {
      // if userId is not found in localStorage, redirect to login page
      window.location.href = '/login';
    }
  },
  methods: {
    // retrieve parent requests from the API
    fetchParentRequests() {
      // clear the existing parentRequests array
      this.parentRequests = [];

      axios.get(`${this.apiBaseUrl}/share-requests/by-walker/${this.userId}`)
          .then(response => {
            const requests = response.data;

            // get the description for each request
            const requestsWithDescriptions = requests.map(request => {
              return axios.get(`${this.apiBaseUrl}/requests/${request.requestId}`)
                  .then(async reqResponse => {
                    // get the parent's avatar
                    const parentAvatar = await this.fetchParentPhoto(request.parentId) || '/images/default.png';

                    // format the request data
                    return {
                      id: request.requestId,  // use the request ID as the ID
                      shareId: request.id,
                      image: parentAvatar,  // use the parent's avatar as the image
                      description: reqResponse.data.description,  // get the description from the response
                      status: request.shareStatus  // get the status from the request
                    };
                  })
                  .catch(err => {
                    console.error(`Error fetching request ${request.requestId}:`, err);
                    return {
                      id: request.requestId,
                      shareId: request.id,
                      image: '/images/default.png',  // set a default image
                      description: 'Description not available',  // set a default description
                      status: 'Error'  // set an error status
                    };
                  });
            });

            // use Promise.all to wait for all requests to be resolved
            Promise.all(requestsWithDescriptions).then(resolvedRequests => {
              this.parentRequests = resolvedRequests;  // assign the resolved requests to the parentRequests array
            });
          })
          .catch(err => {
            console.error('Error fetching parent requests:', err);
          });
    },

    async fetchParentPhoto(parentId) {
      try {
        const response = await axios.get(`${this.apiBaseUrl}/user/getPhotoUrl/?userId=${parentId}`);
        return response.data;
      } catch (error) {
        console.error(`Error fetching photo for parent with ID ${parentId}:`, error);
        return null;
      }
    },


    reject(id) {
      axios.put(`${this.apiBaseUrl}/share-requests/updateStatus/${id}`, null, {
        params: {
          shareStatus: "Rejected"
        }
      })
          .then(response => {
            console.log(response.data);
            window.location.reload();
          })
          .catch(error => {
            console.error('Error updating status:', error);
          });
    }

  },
}
</script>

<style scoped>
.parent-request {
  font-family: Arial, sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 0px;
  width: 70%;
}

.banner {
  background-color: #0A2640;
  color: white;
  padding: 10px 15px;
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 20px;
}

.request-list {
  padding: 0 15px;
}

.request-card {
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 8px;
  margin-bottom: 15px;
  padding: 15px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.request-image {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 15px;
}

.request-content {
  flex: 1;
}

.request-description {
  margin: 0 0 5px 0;
  font-size: 16px;
  line-height: 1.3;
}

.request-status {
  font-size: 14px;
  font-weight: bold;
  margin: 0;
  color: #000000;
}

.details-button {
  background-color: #0A2640;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  text-decoration: none;
  margin-left: 15px;
}

@media (max-width: 768px) {
  .parent-request {
    max-width: 100%;
    width: 90%;
  }

  .request-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .request-image {
    margin-bottom: 10px;
  }

  .request-content {
    width: 100%;
    margin-bottom: 10px;
  }

  .details-button {
    align-self: flex-end;
    margin-left: 0;
  }
}

.reject-button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
}
</style>