<template>
  <div class="settings-page">
    <div class="profile-navigation">
      <ul>
        <li :class="{ active: currentTab === 'info' }">
          <router-link to="/walker-profile" class="nav-link" @click="switchTab('info')">My Profile</router-link>
        </li>
        <li :class="{ active: currentTab === 'skills' }">
          <router-link to="/walker-skills" class="nav-link" @click="switchTab('skills')">Schedule & Skills</router-link>
        </li>
        <li :class="{ active: currentTab === 'address' }">
          <router-link to="/walker-address" class="nav-link" @click="switchTab('address')">My Address</router-link>
        </li>
        <li :class="{ active: currentTab === 'settings' }">
          <router-link to="/walker-settings" class="nav-link" @click="switchTab('settings')">Settings</router-link>
        </li>
      </ul>
    </div>
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
        avatar: ""
      },
      selectedFile: null,
      currentTab: 'settings',
      currentUserRealPassword: '',  // real password from the database
      currentPassword: '',  // password entered by the user
      newPassword: '',  // new password
      confirmPassword: '',  // confirm password
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
        this.selectedFile = file; // store the selected file
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
      formData.append('avatar', this.selectedFile); // append the file to the FormData object

      // upload the avatar
      axios.post(`${this.apiBaseUrl}/api/upload-avatar?userId=${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
          .then(response => {
            // update the avatar in the UI
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
            this.currentUserRealPassword = user.password;  // store the real password
          })
          .catch(error => {
            console.error('Error fetching user data:', error);
          });
    },
    updatePassword() {
      // check if the current password is correct
      if (this.currentPassword !== this.currentUserRealPassword) {
        alert('Current password is incorrect.');
        return;
      }

      // check if the new password and confirm password match
      if (this.newPassword !== this.confirmPassword) {
        alert('New password and confirm password do not match.');
        return;
      }

      // send a request to update the password
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
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
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
  background-color: #0A2640;
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
  background-color: #0A2640;
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
  background-color: #0A2640;
}

.user-avatar {
  width: 40%;
  height: 40%;
  max-width: 200px;
  max-height: 200px;
}

</style>

