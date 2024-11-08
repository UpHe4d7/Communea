<template>
  <div class="my-post-page">
    <main class="main-content">
      <div class="my-post-header">My Post</div>

      <!-- loading -->
      <div v-if="isLoading" class="loading">
        <p>Loading posts...</p>
      </div>

      <!-- error -->
      <div v-else-if="errorMessage" class="error-message">
        <p>{{ errorMessage }}</p>
      </div>

      <!-- show request in the table -->
      <div v-else class="table-container">
        <table class="post-table">
          <thead>
          <tr>
            <th>#</th>
            <th>Request Title</th>
            <th>Child</th>
            <th>Post Time</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(post, index) in posts" :key="post.requestId">
            <td>{{ index + 1 }}</td> <!-- 使用 index 显示行号 -->
            <td>{{ post.description }}</td>
            <td>{{ post.childName }}</td>
            <td>{{ post.updatedAt }}</td>
            <td>{{ post.status }}</td>
            <td>
              <button @click="goToDetails(post.requestId)" class="action-button details">Details</button>
              <template v-if="post.status === 'Open'">
                <button @click="closePost(post.requestId)" class="action-button close">Close</button>
              </template>
              <button v-else @click="reactivatePost(post.requestId)" class="action-button reactivate">↻ Reactivate</button>
              <button @click="deletePost(post.requestId)" class="action-button delete">Delete</button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <div class="button-container">
        <button @click="goToNewRequest" class="new-request-button">Post a New Request</button>
      </div>
    </main>
  </div>
</template>

<script>

import axios from 'axios';

export default {
  name: 'ParentMyPostPage',
  inject: ['apiBaseUrl'],
  data() {
    return {
      posts: [],             // store all requests
      isLoading: false,
      errorMessage: '',
    };
  },
  mounted() {
    this.fetchPosts();
  },
  methods: {
    /**
     * formatDate
     * @param {string} dateStr - ISO 8601 format date string
     * @returns {string} date string in the format of 'dd/mm/yyyy'
     */
    formatDate(dateStr) {
      const date = new Date(dateStr);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    },

    /**
     * get all requests
     */
    async fetchPosts() {
      this.isLoading = true;
      this.errorMessage = '';
      const userId = localStorage.getItem('userId');
      if (!userId) {
        this.errorMessage = 'User ID not found. Please log in.';
        this.isLoading = false;
        return;
      }

      try {
        const response = await axios.get(`${this.apiBaseUrl}/requests/list`, {
          params:{
            parentId: userId
          }
        });
        this.posts = response.data;
        // get child name for each post
        await Promise.all(
            this.posts.map(async (post) => {
              const Response = await axios.get(`${this.apiBaseUrl}/children/${post.childId}`);
              post.childName = Response.data.name;
            })
        );
      } catch (error) {
        console.error(error);
        this.errorMessage = 'Failed to fetch posts. Please try again later.';
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * navigate to the details page
     * @param {string} postId - request ID
     */
    goToDetails(postId) {
      this.$router.push({ name: 'PostDetails', params: { id: postId } });
    },

    /**
     * close the request
     * @param {string} postId - request ID
     */
    async closePost(postId) {
      try {
        const response = await axios.get(`${this.apiBaseUrl}/requests/${postId}`)
        const updatePost = response.data;
        updatePost.status = 'In Review';
        await axios.put(`${this.apiBaseUrl}/requests/${postId}/edit`, updatePost);
        // refresh the page
        this.fetchPosts();
      } catch (error) {
        console.error(error);
        alert('Failed to close the post. Please try again.');
      }
    },


    /**
     * reactivate the request
     * @param {string} postId - request ID
     */
    async reactivatePost(postId) {
      try {
        const response = await axios.get(`${this.apiBaseUrl}/requests/${postId}`)
        const updatePost = response.data;
        updatePost.status = 'Open';
        await axios.put(`${this.apiBaseUrl}/requests/${postId}/edit`, updatePost);
        // refresh the page
        this.fetchPosts();
      } catch (error) {
        console.error(error);
        alert('Failed to close the post. Please try again.');
      }
    },

    /**
     * navigate to the new request page
     */
    goToNewRequest() {
      this.$router.push({ name: 'NewRequest' });
    },

    async deletePost(postId) {
      try {
        const response = await axios.delete(`${this.apiBaseUrl}/requests/${postId}/delete`);
        this.posts = this.posts.filter(post => post.requestId !== postId);
        alert(response.data);
      } catch (error) {
        console.error(error);
        alert('Failed to delete the post. Please try again.');
      }
    }
  }
};
</script>

<style scoped>
.my-post-page {
  font-family: Arial, sans-serif;
  background-color: #ffffff;
  width: 80%;
  max-width: 1200px;
}


.main-content {
  padding: 20px;
}

.my-post-header {
  background-color: #ffaa00;
  color: black;
  padding: 10px 20px;
  font-weight: bold;
  margin-bottom: 20px;
}

.table-container {
  margin-bottom: 20px;
  border: 1px solid #e0e0e0;
  overflow-x: auto;
}

.post-table {
  width: 100%;
  border-collapse: collapse;
}

.post-table th, .post-table td {
  border: none;
  padding: 10px 20px;
  text-align: left;
}

.post-table th {
  background-color: #f5f5f5;
  font-weight: normal;
}

.post-table tr:not(:last-child) {
  border-bottom: 1px solid #e0e0e0;
}

.action-button {
  padding: 5px 10px;
  border: none;
  background: none;
  cursor: pointer;
  margin-right: 5px;
}

.action-button.details {
  color: blue;
}

.action-button.reactivate {
  color: blue;
}

.action-button.close {
  color: #6c757d;
}

.action-button.delete {
  color: #dc3545;
}

.button-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.new-request-button {
  background-color: #ffaa00;
  color: black;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  font-weight: normal;
}

.loading {
  text-align: center;
  font-size: 18px;
  color: #555;
}

.error-message {
  text-align: center;
  color: red;
  font-size: 16px;
}
</style>
