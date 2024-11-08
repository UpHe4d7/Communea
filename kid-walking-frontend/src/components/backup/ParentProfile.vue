<template>
  <div class="parent-profile">
    <!-- Profile Navigation -->
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
          <router-link to="/src/components/UserSettings" @click="switchTab('settings')" class="nav-link">Settings</router-link>
        </li>
      </ul>
    </div>

    <!-- Profile Content -->
    <div class="profile-content">
      <div v-if="currentTab === 'info'">
        <div class="profile-header">
          <h2>Personal Information</h2>
        </div>
        <div class="profile-form">
          <div class="form-row">
            <div class="form-group short">
              <label for="firstName">First name</label>
              <input type="text" id="firstName" v-model="firstName" disabled />
            </div>
            <div class="form-group short">
              <label for="lastName">Last name</label>
              <input type="text" id="lastName" v-model="lastName" disabled />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group short">
              <label for="preferredName">Preferred name</label>
              <input
                  type="text"
                  id="preferredName"
                  v-model="preferredName"
                  :disabled="!isEditing"
              />
            </div>
            <div class="form-group short">
              <label for="birthDate">Date of Birth</label>
              <input
                  type="text"
                  id="birthDate"
                  v-model="birthDate"
                  placeholder="YYYY-MM-DD"
                  @blur="validateBirthDate"
                  :class="{ invalid: birthDateError }"
                  :disabled="!isEditing"
              />
              <span v-if="birthDateError" class="error-message">请输入有效的日期格式 (YYYY-MM-DD)</span>
            </div>
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <div class="input-group">
              <input
                  type="email"
                  id="email"
                  v-model="email"
                  :disabled="emailVerified"
              />
              <span class="verification-status" :class="{ verified: emailVerified }">
                <i class="fas fa-check-circle"></i>
              </span>
              <button @click="handleEmailAction">
                {{ emailVerified ? 'Update' : 'Verify' }}
              </button>
            </div>
          </div>

          <div class="form-group">
            <label for="phone">Phone Number</label>
            <div class="input-group">
              <input
                  type="text"
                  id="phone"
                  v-model="phoneNumber"
                  :disabled="phoneVerified"
              />
              <span class="verification-status" :class="{ verified: phoneVerified }">
                <i class="fas fa-check-circle"></i>
              </span>
              <button @click="handlePhoneAction">
                {{ phoneVerified ? 'Update' : 'Verify' }}
              </button>
            </div>
          </div>

          <div class="form-group">
            <label for="description">Description about your family/children</label>
            <textarea
                id="description"
                v-model="description"
                :disabled="!isEditing"
            ></textarea>
          </div>

          <div class="button-group">
            <template v-if="!isEditing">
              <button class="edit-btn" @click="startEdit">Edit</button>
            </template>
            <template v-else>
              <button class="save-btn" @click="handleSave">Save</button>
              <button class="cancel-btn" @click="handleCancel">Cancel</button>
            </template>
          </div>
        </div>
      </div>

      <div v-if="currentTab === 'children'">
        <!-- My Children content here -->
      </div>
      <div v-if="currentTab === 'address'">
        <!-- My Address content here -->
      </div>
      <div v-if="currentTab === 'settings'">
        <!-- Settings content here -->
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  inject: ['apiBaseUrl'],
  data() {
    return {
      currentTab: 'info',
      isEditing: false,
      firstName: 'Kobe',
      lastName: 'Brown',
      preferredName: '',
      email: 'KB@gmail.com',
      phoneNumber: '0492988777',
      description: '',
      emailVerified: false,
      phoneVerified: false,
      birthDate: '',
      birthDateError: false,
      userId: '',
      originalData: null,
    };
  },

  mounted() {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      this.userId = storedUserId;
      this.fetchUserData(this.userId);
    } else {
      window.location.href = '/login';
    }
  },

  methods: {
    switchTab(tab) {
      this.currentTab = tab;
    },

    startEdit() {
      // 保存当前数据（不包括email和phone）
      this.originalData = {
        preferredName: this.preferredName,
        birthDate: this.birthDate,
        description: this.description
      };
      this.isEditing = true;
    },

    async handleSave() {
      try {
        if (this.birthDateError) {
          alert('Please correct the date format before saving.');
          return;
        }

        // 调用API保存数据
        await axios.put(`${this.apiBaseUrl}/user/${this.userId}`, {
          preferredName: this.preferredName,
          dateOfBirth: this.birthDate,
          description: this.description
          // 不包括 email 和 phone，它们有自己的更新流程
        });

        this.isEditing = false;
        this.originalData = null;
        alert('Profile updated successfully!');
      } catch (error) {
        console.error('Failed to update profile:', error);
        alert('Failed to update profile. Please try again.');
      }
    },

    handleCancel() {
      if (this.originalData) {
        this.preferredName = this.originalData.preferredName;
        this.birthDate = this.originalData.birthDate;
        this.description = this.originalData.description;
        // 不恢复 email 和 phone
      }
      this.isEditing = false;
      this.originalData = null;
    },

    handleEmailAction() {
      if (this.emailVerified) {
        this.emailVerified = false; // 允许修改
      } else {
        // 发送验证邮件
        alert('Verification email sent. Please check your inbox.');
        setTimeout(() => {
          this.emailVerified = true;
        }, 2000);
      }
    },

    handlePhoneAction() {
      if (this.phoneVerified) {
        this.phoneVerified = false; // 允许修改
      } else {
        // 发送验证短信
        alert('Verification SMS sent. Please check your phone.');
        setTimeout(() => {
          this.phoneVerified = true;
        }, 2000);
      }
    },

    validateBirthDate() {
      const datePattern = /^\d{4}-\d{2}-\d{2}$/;
      const isValidFormat = datePattern.test(this.birthDate);

      if (!isValidFormat) {
        this.birthDateError = true;
        return;
      }

      const date = new Date(this.birthDate);
      this.birthDateError = !(date instanceof Date && !isNaN(date));
    },

    fetchUserData(userId) {
      axios.get(`${this.apiBaseUrl}/user/${userId}`)
          .then(response => {
            const user = response.data;
            this.firstName = user.firstName;
            this.lastName = user.lastName;
            this.email = user.email;
            this.phoneNumber = user.phoneNumber;
            this.preferredName = user.preferredName;
            this.birthDate = user.dateOfBirth;
            this.description = user.description;
          })
          .catch(error => {
            console.error('Error fetching user data:', error);
          });
    },
  }
};
</script>

<style scoped>
.nav-link {
  text-decoration: none;
  color: inherit;
}

.parent-profile {
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
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 20px;
  font-weight: bold;
  color: white;
}

.profile-form {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group.short {
  width: 48%;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.form-group input:disabled,
.form-group textarea:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.input-group {
  display: flex;
  align-items: center;
}

.input-group input {
  flex-grow: 1;
}

.verification-status {
  margin: 0 10px;
  font-size: 20px;
  color: #ccc;
}

.verification-status.verified {
  color: #4CAF50;
}

.input-group button {
  margin-left: 10px;
  background-color: #ffaa00;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 4px;
  color: white;
}

.input-group button:hover {
  background-color: #ff9900;
}

.button-group {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
}

.edit-btn, .save-btn {
  background-color: #ffaa00;
  border: none;
  padding: 8px 20px;
  cursor: pointer;
  border-radius: 4px;
  color: white;
  font-weight: bold;
}

.cancel-btn {
  background-color: #ccc;
  border: none;
  padding: 8px 20px;
  cursor: pointer;
  border-radius: 4px;
  color: white;
  font-weight: bold;
}

.edit-btn:hover,
.save-btn:hover {
  background-color: #ff9900;
}

.cancel-btn:hover {
  background-color: #999;
}

.invalid {
  border-color: red !important;
}

.error-message {
  color: red;
  font-size: 12px;
  margin-top: 5px;
}

@media (max-width: 600px) {
  .form-row {
    flex-direction: column;
  }

  .form-group.short {
    width: 100%;
  }

  .button-group {
    flex-direction: column;
  }

  .button-group button {
    width: 100%;
  }
}

@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css');
</style>