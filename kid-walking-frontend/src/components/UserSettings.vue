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
          <router-link to="/settings" @click="switchTab('settings')" class="nav-link">Settings</router-link>
        </li>
      </ul>
    </div>

    <!-- Settings Content -->
    <div class="profile-content">
      <div v-if="currentTab === 'settings'">
        <div class="profile-header">
          <h2>Change my Avatar</h2>
        </div>
        <div class="settings-form">
          <div class="form-group">
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
            <label for="currentPassword">Current Password</label>
            <input
                type="password"
                id="currentPassword"
                v-model="currentPassword"
                :disabled="!isEditing"
                required
            />
          </div>
          <div class="form-group">
            <label for="newPassword">New Password</label>
            <input
                type="password"
                id="newPassword"
                v-model="newPassword"
                :disabled="!isEditing"
                required
            />
          </div>
          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input
                type="password"
                id="confirmPassword"
                v-model="confirmPassword"
                :disabled="!isEditing"
                required
            />
          </div>

          <!-- Display different buttons according to editing status -->
          <div class="button-group" v-if="!isEditing">
            <button class="update-btn" @click="startEditing">Update</button>
          </div>
          <div class="button-group" v-else>
            <button class="save-btn" @click="saveChanges">Save</button>
            <button class="cancel-btn" @click="cancelEditing">Cancel</button>
          </div>

          <!-- Display success or error messages -->
          <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  inject: ['apiBaseUrl'],
  name: 'UserSettings',
  data() {
    return {
      currentUser: {
        avatar: ''
      },
      currentTab: 'settings',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      isEditing: false,
      errorMessage: '',
      successMessage: '',
      originalData: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
    };
  },
  mounted() {
    const storedUserId = localStorage.getItem('userId');
    if (!storedUserId) {
      window.location.href = '/login';
    }
    this.fetchUserPhoto(storedUserId);
  },
  methods: {
    fetchUserPhoto(userId) {
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
        this.selectedFile = file; // Save user-selected files
      }
    },
    updateAvatar() {
      if (!this.selectedFile) {
        alert('Please select an avatar to upload.');
        return;
      }

      const userId = this.userId || localStorage.getItem('userId');
      if (!userId) {
        alert('User ID is missing.');
        return;
      }

      const formData = new FormData();
      formData.append('avatar', this.selectedFile); // add the file to the form data

      // send the post request to the server
      axios.post(`${this.apiBaseUrl}/api/upload-avatar?userId=${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
          .then(response => {
            // update the avatar URL
            console.log('Avatar updated:', response.data.fileUrl);
            console.log(response.data);
            this.currentUser.avatar = response.data.fileUrl;
            alert('Avatar updated successfully.');
          })
          .catch(error => {
            alert('Failed to update avatar, the size of the file may be too large.');
            console.error('Error updating avatar:', error);
          });
    },
    switchTab(tab) {
      this.currentTab = tab;
      this.errorMessage = '';
      this.successMessage = '';
    },
    startEditing() {
      this.isEditing = true;
      // save the original data
      this.originalData = {
        currentPassword: this.currentPassword,
        newPassword: this.newPassword,
        confirmPassword: this.confirmPassword
      };
      // clear messages
      this.errorMessage = '';
      this.successMessage = '';
    },
    async saveChanges() {
      // clear messages
      this.errorMessage = '';
      this.successMessage = '';

      // verify the new password and confirm password
      if (this.newPassword !== this.confirmPassword) {
        this.errorMessage = 'New password and confirm password do not match.';
        return;
      }

      const userId = localStorage.getItem('userId');
      if (!userId) {
        this.errorMessage = 'User ID is missing.';
        return;
      }

      axios
          .put(`${this.apiBaseUrl}/user/${userId}/password`, {
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

    },
    cancelEditing() {
      // reload the original data
      this.currentPassword = this.originalData.currentPassword;
      this.newPassword = this.originalData.newPassword;
      this.confirmPassword = this.originalData.confirmPassword;
      this.isEditing = false;
      // clear messages
      this.errorMessage = '';
      this.successMessage = '';
    },
  }
};
</script>

<style scoped>
.nav-link {
  text-decoration: none;
  color: inherit;
}

.settings {
  display: flex;
  width: 100%;
  max-width: 1200px;
  margin: 0;
}

.profile-navigation {
  width: 25%;
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

.form-group input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.button-group {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.update-btn,
.save-btn,
.cancel-btn {
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  flex: 1;
}

.update-btn,
.save-btn {
  background-color: #ffaa00;
  color: white;
}

.cancel-btn {
  background-color: #f5f5f5;
  color: #333;
}

.update-btn:hover,
.save-btn:hover {
  background-color: #e69500;
}

.cancel-btn:hover {
  background-color: #e0e0e0;
}

.error-message {
  color: red;
  margin-top: 10px;
}

.success-message {
  color: green;
  margin-top: 10px;
}

.user-avatar {
  width: 40%;
  height: 40%;
  max-width: 200px;
  max-height: 200px;
}
</style>
