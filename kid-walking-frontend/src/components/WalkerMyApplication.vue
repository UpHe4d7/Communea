<template>
  <div class="my-application">
    <div class="content">
      <div class="banner">My Application</div>
      <div class="application-list">
        <div v-for="application in applications" :key="application.applicationId" class="application-card">
          <img :src="application.requestInfo.avatar" :alt="图片链接" class="application-image">
          <div class="application-content">
            <p class="application-description">{{ application.requestInfo.description}}</p>
          </div>
          <!-- Put button and status in the container -->
          <div class="application-actions">
            <button @click="goToDetails(application.requestId)" class="details-button">
              View Request Details
            </button>
            <div class="application-status-container">
              <p class="application-status">
                {{ application.applicationStatus }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  inject: ['apiBaseUrl'],
  name: 'MyApplication',
  data() {
    return {
      applications: [], // To store fetched applications
    };
  },
  methods: {
    fetchApplications() {
      const userId = localStorage.getItem('userId');
      console.log(userId);

      // 获取应用信息
      axios.get(`${this.apiBaseUrl}/applications/byWalker/${userId}`)
          .then(async response => {
            const applications = response.data;

            // 为每个 application 通过 requestId 获取 request 信息
            const enrichedApplications = await Promise.all(applications.map(async app => {
              const request = await this.fetchRequestById(app.requestId);  // get request info

              return {
                ...app,  // keep original application info
                requestInfo: request || {},  // add request info
              };
            }));

            this.applications = enrichedApplications;  // store applications in the data
          })
          .catch(error => {
            console.error('Error fetching applications:', error);
          });
    },

    // fetchRequestById method to get request details, including user avatar
    async fetchRequestById(requestId) {
      try {
        // get request info by requestId
        const response = await axios.get(`${this.apiBaseUrl}/requests/${requestId}`);
        const request = response.data;

        // get user avatar URL
        const avatarUrl = await this.fetchUserPhoto(request.parentId) || '';

        return {
          ...request,  // keep original request info
          avatar: avatarUrl  // add avatar URL
        };

      } catch (error) {
        console.error(`Error fetching request with ID ${requestId}:`, error);
        return null;
      }
    },

// get user avatar URL by userId
    async fetchUserPhoto(userId) {
      try {
        const response = await axios.get(`${this.apiBaseUrl}/user/getPhotoUrl/?userId=${userId}`);
        return response.data;  // return photo URL
      } catch (error) {
        console.error(`Error fetching photo for user with ID ${userId}:`, error);
        return null;  // return null if error
      }
    },


    goToDetails(requestId) {
      // navigate to RequestDetail page with requestId as parameter
      this.$router.push({ name: 'RequestDetail', params: { id: requestId } });
    }
  },
  mounted() {
    this.fetchApplications(); // Fetch applications when component is mounted
  }
}
</script>

<style scoped>
.my-application {
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

.application-list {
  padding: 0 15px;
}

.application-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: white;
  border-radius: 8px;
  margin-bottom: 15px;
  padding: 15px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.application-image {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 15px;
}

.application-content {
  flex: 1;
}

.application-description {
  margin: 0 0 5px 0;
  font-size: 16px;
  line-height: 1.3;
}

.application-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end; /* 将按钮和状态右对齐 */
  justify-content: center;
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
  margin-top: auto;
}

.application-status-container {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.application-status {
  font-size: 14px;
  font-weight: bold;
  margin: 0;
  color: #000000;
}

@media (max-width: 768px) {
  .my-application {
    max-width: 100%;
    width: 90%;
  }

  .application-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .application-image {
    margin-bottom: 10px;
  }

  .application-actions {
    align-items: flex-start;
    margin-top: 10px;
  }

  .application-status-container {
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    margin-top: 10px;
  }
}
</style>

