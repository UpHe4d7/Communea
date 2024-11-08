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
      this.userId = storedUserId; // 从 localStorage 读取并赋值
      console.log(this.userId);
      this.fetchParentRequests();
    } else {
      // 如果没有 userId，重定向回登录页面
      window.location.href = '/login';
    }
  },
  methods: {
    // 获取 Walker 的所有请求
    fetchParentRequests() {
      // 清空 parentRequests 以避免数据累积
      this.parentRequests = [];

      axios.get(`${this.apiBaseUrl}/share-requests/by-walker/${this.userId}`)
          .then(response => {
            const requests = response.data;

            // 遍历请求，获取每个 requestId 和 parentId 的详细信息
            const requestsWithDescriptions = requests.map(request => {
              return axios.get(`${this.apiBaseUrl}/requests/${request.requestId}`)
                  .then(async reqResponse => {
                    // 获取 parentId 后查询头像
                    const parentAvatar = await this.fetchParentPhoto(request.parentId) || '/images/default.png';

                    // 格式化返回的数据到你的预期格式
                    return {
                      id: request.requestId,  // 使用 requestId 作为 id
                      shareId: request.id,
                      image: parentAvatar,  // 使用通过 parentId 获取到的头像
                      description: reqResponse.data.description,  // 获取 description
                      status: request.shareStatus  // 从请求中获取状态
                    };
                  })
                  .catch(err => {
                    console.error(`Error fetching request ${request.requestId}:`, err);
                    return {
                      id: request.requestId,
                      shareId: request.id,
                      image: '/images/default.png',  // 错误情况下设置默认图片
                      description: 'Description not available',  // 设置默认的描述
                      status: 'Error'  // 设置默认的状态
                    };
                  });
            });

            // 使用 Promise.all 来确保所有请求完成后再更新数据
            Promise.all(requestsWithDescriptions).then(resolvedRequests => {
              this.parentRequests = resolvedRequests;  // 将格式化后的数据赋值到 parentRequests
            });
          })
          .catch(err => {
            console.error('Error fetching parent requests:', err);
          });
    },

// 新增的方法，通过 parentId 获取头像
    async fetchParentPhoto(parentId) {
      try {
        const response = await axios.get(`${this.apiBaseUrl}/user/getPhotoUrl/?userId=${parentId}`);
        return response.data;  // 返回头像 URL
      } catch (error) {
        console.error(`Error fetching photo for parent with ID ${parentId}:`, error);
        return null;  // 返回 null 以便使用默认头像
      }
    },


    reject(id) {
      // 发送PUT请求更新ShareRequest的状态
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
  background-color: #FFAA00;
  color: black;
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
  background-color: #FFAA00;
  color: black;
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