<template>
  <div class="settings">
    <!-- Settings Navigation -->
    <div class="profile-navigation">
      <ul>
        <li :class="{ active: currentTab === 'info' }">
          <router-link to="/profile" @click="switchTab('info')" class="nav-link">My Profile</router-link>
        </li>
        <li :class="{ active: currentTab === 'children' }">
          <router-link to="/children" @click="switchTab('children')" class="nav-link">My Children</router-link>
        </li>
        <li :class="{ active: currentTab === 'address' }">
          <router-link to="/address" @click="switchTab('address')" class="nav-link">My Address</router-link>
        </li>
        <li :class="{ active: currentTab === 'settings' }">
          <router-link to="/settings" @click="switchTab('settings')" class="nav-link">Settings</router-link>        </li>
      </ul>
    </div>

    <!-- Settings Content -->
    <div class="profile-content">
      <div v-if="currentTab === 'settings'">
        <div class="profile-header">
          <h2>Change my Password</h2>
        </div>
        <div class="settings-form">
          <div class="form-group">
            <label for="currentPassword">Current Password</label>
            <input type="password" id="currentPassword" v-model="currentPassword" />
          </div>
          <div class="form-group">
            <label for="newPassword">Password</label>
            <input type="password" id="newPassword" v-model="newPassword" />
          </div>
          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input type="password" id="confirmPassword" v-model="confirmPassword" />
          </div>
          <button class="update-btn" @click="updatePassword">Update</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserSettings',
  data() {
    return {
      currentTab: 'settings', // Default tab is 'settings'
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
  },
  methods: {
    switchTab(tab) {
      this.currentTab = tab;
    },
    updatePassword() {
      // 更新密码逻辑
    }
  }
};
</script>

<style scoped>
.nav-link {
  text-decoration: none; /* 移除下划线 */
  color: inherit; /* 保持文字颜色与父元素一致 */
}

.settings {
  display: flex;
  width: 95%; /* 让整个容器占据 95% 的宽度 */
  margin: 0 auto; /* 居中显示 */
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
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 20px;
  font-weight: bold;
  color: white;
}

.settings-form {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.update-btn {
  background-color: #ffaa00;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 4px;
  color: white;
  margin-top: 20px;
}
</style>
