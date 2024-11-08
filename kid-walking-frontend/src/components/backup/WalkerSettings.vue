<template>
  <div class="settings-page">
    <!-- 添加导航栏 -->
    <div class="profile-navigation">
      <ul>
        <li :class="{ active: currentTab === 'info' }">
          <router-link to="/walker-profile" class="nav-link" @click="switchTab('info')">My Profile</router-link>
        </li>
        <li :class="{ active: currentTab === 'skills' }">
          <router-link to="/walker-skills" class="nav-link" @click="switchTab('skills')">Availability & Skills</router-link>
        </li>
        <li :class="{ active: currentTab === 'address' }">
          <router-link to="/walker-address" class="nav-link" @click="switchTab('address')">My Address</router-link>
        </li>
        <li :class="{ active: currentTab === 'settings' }">
          <router-link to="/walker-settings" class="nav-link" @click="switchTab('settings')">Settings</router-link>
        </li>
      </ul>
    </div>
    <!-- 内容区域 -->
    <div class="profile-content">
      <div v-if="currentTab === 'settings'">

        <div class="settings-form">
          <div class="form-group">
            <label for="avatar">Avatar</label>
            <img :src="currentUser.avatar" :alt="currentUser.name" class="user-avatar">
            <input type="file" id="avatar" @change="onFileChange" />
            <button class="update-btn" @click="updateAvatar">Upload</button>
          </div>
        </div>

        <div class="profile-header">
          <h2>Change my Password</h2>
        </div>
        <div class="settings-form">
          <div class="form-group">
            <label for="current-password">Current Password</label>
            <input type="password" id="current-password" v-model="currentPassword" />
          </div>
          <div class="form-group">
            <label for="new-password">Password</label>
            <input type="password" id="new-password" v-model="newPassword" />
          </div>
          <div class="form-group">
            <label for="confirm-password">Confirm password</label>
            <input type="password" id="confirm-password" v-model="confirmPassword" />
          </div>
          <button class="update-btn" @click="updatePassword">Update</button>
        </div>
      </div>
      <!-- 其他选项卡内容（如果需要） -->
      <div v-if="currentTab === 'info'">
        <!-- 个人信息内容 -->
      </div>
      <div v-if="currentTab === 'skills'">
        <!-- 可用性和技能内容 -->
      </div>
      <div v-if="currentTab === 'address'">
        <!-- 地址信息内容 -->
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  inject: ['apiBaseUrl'],
  name: 'WalkerSettings',
  data() {
    return {
      currentUser: {
        avatar: ""//'http://localhost:9000/avatars/1729320779653_avatar.jpg', // 默认头像地址
      },
      selectedFile: null, // 存储用户选择的文件
      currentTab: 'settings',
      currentUserRealPassword: '',  // 数据库中的真实密码
      currentPassword: '',  // 用户输入的当前密码
      newPassword: '',  // 用户输入的新密码
      confirmPassword: '',  // 确认新密码
    };
  },
  mounted() {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      this.userId = storedUserId;
      this.fetchUserPassword(this.userId);
    } else {
      window.location.href = '/login';
    }
    this.fetchUserPhoto(storedUserId);
  },
  methods: {
    fetchUserPhoto(userId) {

      console.log(userId);
      axios.get(`${this.apiBaseUrl}/user/getPhotoUrl/?userId=${userId}`)
          .then(response => {
            this.currentUser.avatar = response.data;
          })
          .catch(error => {
            console.error('Error fetching user photo:', error);
          });
    },

    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.selectedFile = file; // 保存用户选择的文件
      }
    },
    updateAvatar() {
      if (!this.selectedFile) {
        alert('Please select an avatar to upload.');
        return;
      }

      // 假设 userId 存储在组件的 data 中，或从 localStorage 获取
      const userId = this.userId || localStorage.getItem('userId'); // 确保 userId 存在
      if (!userId) {
        alert('User ID is missing.');
        return;
      }

      const formData = new FormData();
      formData.append('avatar', this.selectedFile); // 将文件添加到 FormData 中

      // 发起 POST 请求上传文件，并通过查询参数传递 userId
      axios.post(`${this.apiBaseUrl}/api/upload-avatar?userId=${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
          .then(response => {
            // 更新用户头像的 URL（假设后端返回 fileUrl）
            this.currentUser.avatar = response.data.fileUrl;
            alert('Avatar updated successfully.');
          })
          .catch(error => {
            alert('Failed to update avatar.');
            console.error('Error updating avatar:', error);
          });
    },
    switchTab(tab) {
      this.currentTab = tab;
    },
    fetchUserPassword(userId) {
      axios
          .get(`${this.apiBaseUrl}/user/${userId}`)
          .then(response => {
            const user = response.data;
            this.currentUserRealPassword = user.password;  // 将数据库中的密码保存
          })
          .catch(error => {
            console.error('Error fetching user data:', error);
          });
    },
    updatePassword() {
      // 检查当前密码是否正确
      if (this.currentPassword !== this.currentUserRealPassword) {
        alert('Current password is incorrect.');  // 弹窗提示
        return;
      }

      // 检查新密码和确认密码是否一致
      if (this.newPassword !== this.confirmPassword) {
        alert('New password and confirm password do not match.');  // 弹窗提示
        return;
      }

      // 发送请求更新密码
      axios
          .put(`${this.apiBaseUrl}/user/${this.userId}/password`, {
            oldPassword: this.currentPassword,
            newPassword: this.newPassword
          })
          .then(() => {
            alert('Password updated successfully.');
          })
          .catch(error => {
            alert('Failed to update password. Please check the old password.');
            console.error('Error updating password:', error);
          });
    }
  },
};
</script>


<style scoped>
.nav-link {
  text-decoration: none;
  color: inherit;
}

.settings-page {
  display: flex;
  width: 95%;
  margin: 0 auto;
}

.profile-navigation {
  width: 200px;
  margin-right: 20px;
}

.profile-navigation ul {
  list-style-type: none;
  padding: 0;
}

.profile-navigation li {
  padding: 10px;
  cursor: pointer;
}

.profile-navigation li.active {
  background-color: #f0f0f0;
  font-weight: bold;
}

.profile-content {
  flex-grow: 1;
}

.profile-header {
  background-color: #ffaa00;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-weight: bold;
  color: white;
  text-align: center;
}

.settings-form {
  background-color: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 2400px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 10px;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-sizing: border-box;
  font-size: 16px;
}

.update-btn {
  background-color: #ffaa00;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 6px;
  color: white;
  font-size: 16px;
  width: 100%;
  transition: background-color 0.3s;
}

.update-btn:hover {
  background-color: #e69500;
}

.user-avatar {
  width: 320px;
  height: 320px;
}

</style>

