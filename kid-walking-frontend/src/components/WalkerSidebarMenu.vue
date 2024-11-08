<!-- WalkerSidebarMenu.vue -->
<template>
  <div :class="['sidebar', { 'dimmed': isDimmed }]">
    <button
        class="close-button"
        @click="$emit('close-sidebar')"
        aria-label="Close sidebar"
    >
      &times;
    </button>
    <div class="profile">
       <img :src="currentUser.avatar" :alt="Avatar" class="avatar">
      <p class="rater-name">{{ currentUser.firstName + " " + currentUser.lastName }}</p>
    </div>
    <div class="divider"></div> <!-- 分隔线 -->
    <ul class="menu">
      <li><router-link to="/walker-home">Home</router-link></li>
      <li><router-link to="/walker-profile">My Profile</router-link></li>
      <li><router-link to="/walkerparentrequest">Parent request</router-link></li>
      <li><router-link to="/walker-my-applications">My Application</router-link></li>
      <li><router-link to="/walker-my-agreements">My Agreement</router-link></li>
      <li><router-link to="/walker-my-ratings">My Ratings</router-link></li>
    </ul>
    <button class="logout" @click="logout">Log out</button>
  </div>
</template>

<script>
import axios from "axios";

export default {
  inject: ['apiBaseUrl'],
  name: 'WalkerSidebarMenu',
  props: {
    isDimmed: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentUser: {
        avatar: ''
      }
    };
  },
  methods: {
    fetchUserName(userId) {
      axios.get(`${this.apiBaseUrl}/user/${userId}`)
          .then(response => {
            this.currentUser = response.data;
            this.fetchUserPhoto(userId);
          })
          .catch(error => {
            console.error('Error fetching user name:', error);
          });
    },
    fetchUserPhoto(userId) {
      axios.get(`${this.apiBaseUrl}/user/getPhotoUrl/?userId=${userId}`)
          .then(response => {
            this.currentUser.avatar = response.data;
          })
          .catch(error => {
            console.error('Error fetching user photo:', error);
          });
    },
    logout() {
      alert('Logged out successfully!');
      localStorage.removeItem('userId');
      localStorage.removeItem('userType');
      // Cancel grey state
      this.$emit('close-sidebar');
      this.$router.push('/login');
    }
  },
  mounted() {
    this.fetchUserName(localStorage.getItem('userId'));
    //this.fetchUserPhoto(localStorage.getItem('userId'));
  }
};
</script>

<style scoped>
.sidebar {
  width: 250px;
  height: 100vh;
  background-color: #fff;
  padding: 20px;
  border-right: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1001;
  overflow-y: auto;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.sidebar.dimmed {
  opacity: 0.5;
  pointer-events: none;
}

.close-button {
  background: none;
  border: none;
  color: #333;
  font-size: 30px;
  position: absolute;
  top: 10px;
  right: 20px;
  cursor: pointer;
}

.close-button:focus {
  outline: none;
}

.profile {
  text-align: center;
  margin-bottom: 20px;
}

.avatar {
  width: 80px;
  height: 80px;
  background-color: #eee;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: #333;
  margin: 0 auto 10px;
  border: 2px solid #ccc;
}

.username {
  font-weight: bold;
  margin-top: 10px;
}

.divider {
  width: 80%;
  height: 1px;
  background-color: #ccc;
  margin: 20px 0;
}

.menu {
  list-style-type: none;
  padding: 0;
  width: 100%;
}

.menu li {
  margin: 10px 0;
}

.menu a {
  text-decoration: none;
  color: #333;
  display: block;
  text-align: left;
  font-size: 16px;
  padding-left: 10px;
  transition: color 0.3s;
}

.menu a:hover {
  color: #0A2640;
}

.logout {
  width: 80%;
  padding: 10px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 20px;
  cursor: pointer;
  margin-top: 80%;
  color: #333;
  text-align: center;
  font-size: 16px;
  transition: background-color 0.3s;
}

.logout:hover {
  background-color: #f0f0f0;
}

/* 响应式设计 */
@media (max-width: 600px) {
  .sidebar {
    width: 200px;
    padding: 15px;
  }

  .avatar {
    width: 60px;
    height: 60px;
    font-size: 24px;
  }

  .logo {
    font-size: 24px;
  }

  .menu a {
    font-size: 14px;
  }

  .logout {
    width: 90%;
    font-size: 14px;
  }
}
</style>