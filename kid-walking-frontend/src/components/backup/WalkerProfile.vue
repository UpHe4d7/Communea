<template>
  <div class="walker-profile">
    <!-- Profile Navigation -->
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

    <!-- Profile Content -->
    <div class="profile-content">
      <div v-if="currentTab === 'info'">
        <div class="profile-header">
          <h2>Personal Information</h2>
        </div>
        <div class="profile-form">
          <!-- First Name and Last Name -->
          <div class="form-row">
            <div class="form-group short">
              <label for="firstName">First Name</label>
              <input type="text" id="firstName" v-model="firstName" disabled />
            </div>
            <div class="form-group short">
              <label for="lastName">Last Name</label>
              <input type="text" id="lastName" v-model="lastName" disabled />
            </div>
          </div>

          <!-- Preferred Name and Date of Birth -->
          <div class="form-row">
            <div class="form-group short">
              <label for="preferredName">Preferred Name</label>
              <input type="text" id="preferredName" v-model="preferredName" />
            </div>
            <div class="form-group short">
              <label>Date of Birth</label>
              <div class="date-select">
                <select v-model="birthYear" @change="validateBirthDate">
                  <option value="">Year</option>
                  <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
                </select>
                <select v-model="birthMonth" @change="validateBirthDate">
                  <option value="">Month</option>
                  <option v-for="month in months" :key="month.value" :value="month.value">{{ month.label }}</option>
                </select>
                <select v-model="birthDay" @change="validateBirthDate">
                  <option value="">Day</option>
                  <option v-for="day in days" :key="day" :value="day">{{ day }}</option>
                </select>
              </div>
              <span v-if="birthDateError" class="error-message">Please select a valid date</span>
            </div>
          </div>

          <!-- Email with verification status -->
          <div class="form-group">
            <label for="email">Email</label>
            <div class="input-group">
              <input type="email" id="email" v-model="email" :disabled="emailVerified" />
              <span class="verification-status" :class="{ verified: emailVerified }">
                <i class="fas fa-check-circle"></i>
              </span>
              <button @click="handleEmailAction">{{ emailVerified ? 'Update' : 'Verify' }}</button>
            </div>
          </div>

          <!-- Phone Number with verification status -->
          <div class="form-group">
            <label for="phone">Phone Number</label>
            <div class="input-group">
              <input type="text" id="phone" v-model="phoneNumber" :disabled="phoneVerified" />
              <span class="verification-status" :class="{ verified: phoneVerified }">
                <i class="fas fa-check-circle"></i>
              </span>
              <button @click="handlePhoneAction">{{ phoneVerified ? 'Update' : 'Verify' }}</button>
            </div>
          </div>

          <div class="form-group">
            <label for="description">Description about yourself</label>
            <textarea id="description" v-model="description"></textarea>
          </div>

          <div class="form-group">
            <label>Identity Verification</label>
            <div id="digitalid-verify" class="digitalid-verify"></div> <!-- Add this line -->
            <div class="input-group">
              <span class="verification-status" :class="{ verified: identityVerified }">
                <i class="fas fa-check-circle"></i>
              </span>
              <button @click="initiateIdentityVerification()">{{ identityVerified ? 'Verified' : 'Verify' }}</button>
            </div>
          </div>

          <button class="edit-btn" @click="editProfile">Edit</button>
        </div>
      </div>

      <!-- Other tab contents -->
      <div v-if="currentTab === 'skills'">
        <div class="profile-header">
          <h2>Availability & Skills</h2>
        </div>
        <!-- Availability & Skills content here -->
      </div>
      <div v-if="currentTab === 'address'">
        <div class="profile-header">
          <h2>My Address</h2>
        </div>
        <!-- Address content here -->
      </div>
      <div v-if="currentTab === 'settings'">
        <div class="profile-header">
          <h2>Settings</h2>
        </div>
        <!-- Settings content here -->
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  inject: ['apiBaseUrl'],  // 通过 inject 获取
  data() {
    return {
      currentTab: 'info',
      firstName: 'Mia',
      lastName: 'Davis',
      preferredName: '',
      email: 'mia.davis@gmail.com',
      phoneNumber: '123-456-7890',
      description: '',
      emailVerified: false,
      phoneVerified: false,
      identityVerified: false,
      birthYear: '',
      birthMonth: '',
      birthDay: '',
      birthDateError: false,
      years: [],
      months: [
        { value: '01', label: 'January' },
        { value: '02', label: 'February' },
        { value: '03', label: 'March' },
        { value: '04', label: 'April' },
        { value: '05', label: 'May' },
        { value: '06', label: 'June' },
        { value: '07', label: 'July' },
        { value: '08', label: 'August' },
        { value: '09', label: 'September' },
        { value: '10', label: 'October' },
        { value: '11', label: 'November' },
        { value: '12', label: 'December' }
      ],
      days: [],
    };
  },

  mounted() {

    const script = document.createElement('script');
    script.src = 'https://digitalid-sandbox.com/sdk/app.js';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      console.log('Digital ID SDK Loaded');
    };
    document.head.appendChild(script);

    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      this.userId = storedUserId; // 从 localStorage 读取并赋值
      console.log(this.userId)
      this.fetchUserData(this.userId)
      this.checkIdentityVerification(this.userId);  // 检查身份验证状态
    } else {
      // 如果没有 userId，重定向回登录页面
      window.location.href = '/login';
    }
  },
  computed: {
    formattedBirthDate() {
      if (!this.birthYear || !this.birthMonth || !this.birthDay) return '';
      return `${this.birthYear}-${this.birthMonth}-${this.birthDay}`;
    },
  },
  methods: {
    switchTab(tab) {
      this.currentTab = tab;
    },

    // 手动解析 JWT 的函数
    parseJwt(token) {
      try {
        const base64Url = token.split('.')[1]; // 拆分 JWT 并获取 payload 部分
        if (!base64Url) throw new Error("Invalid JWT structure");

        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
      } catch (error) {
        console.error('Failed to parse JWT:', error.message);
        return null;
      }
    },
    fetchUserData(userId) {
      axios
          .get(`${this.apiBaseUrl}/user/${userId}`)
          .then(response => {
            const user = response.data;
            this.firstName = user.firstName;
            this.lastName = user.lastName;
            this.email = user.email;
            this.phoneNumber = user.phoneNumber;
            this.preferredName = user.preferredName;
            this.birthDate = user.dateOfBirth;

            this.description = user.description;
            console.log(user);
            const [year, month, day] = user.dateOfBirth.split('-');
            this.birthYear = year;
            this.birthMonth = month;
            this.birthDay = day;
            // 将数据渲染到其他字段
          })
          .catch(error => {
            console.error('Error fetching user data:', error);
          });

    },
    handleEmailAction() {
      if (this.emailVerified) {
        this.email = '';
        this.emailVerified = false;
      } else {
        alert('Verification email sent. Please check your inbox.');
        setTimeout(() => {
          this.emailVerified = true;
        }, 2000);
      }
    },

    /* eslint-disable no-undef */
    initiateIdentityVerification() {
      if (typeof digitalId === 'undefined') {
        console.error('Digital ID SDK not loaded');
        return;
      }
      digitalId.init({
        clientId: 'ctid4ymnzO2f7Ty59qDlx29JOy',
        onComplete: (response) => {  // Use arrow function here
          if (response.code) {
            console.log('Verification code:', response.code);
            axios.post(
                `${this.apiBaseUrl}/verifications/verifications/getVerifyStatus`,
                new URLSearchParams({
                  code: response.code
                }),
                {
                  headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                  }
                }
            )
                .then(res => {
                  console.log('Verification successful:', res.data); // 打印返回的内容

                  if (res.data && res.data.includes('.')) { // 确保 JWT 是有效的
                    const decodedData = this.parseJwt(res.data);
                    console.log('Decoded JWT:', decodedData);
                    this.updateIdentityVerificationStatus(this.userId);

                  } else {
                    console.error('Invalid JWT format:', res.data);
                  }
                })
                .catch(err => {
                  console.error('Verification failed:', err);
                });
          }
        }
      });
    },

    checkIdentityVerification(userId) {
      axios
          .get(`${this.apiBaseUrl}/verifications/check-identity`, { params: { userId: userId } })
          .then(response => {
            this.identityVerified = response.data.verified;
            console.log('Identity verification status:', this.identityVerified);
          })
          .catch(error => {
            console.error('Error checking identity verification status:', error);
          });
    },

    updateIdentityVerificationStatus(userId) {
      axios.post(
          `${this.apiBaseUrl}/verifications/verify-identity`,
          new URLSearchParams({ userId: userId }), // 使用 URLSearchParams 传递参数
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }
      )
          .then(response => {
            console.log('Identity verification status updated:', response.data);
          })
          .catch(error => {
            console.error('Error updating identity verification status:', error);
          });
    },
    handlePhoneAction() {
      if (this.phoneVerified) {
        this.phoneNumber = '';
        this.phoneVerified = false;
      } else {
        alert('Verification SMS sent. Please check your phone.');
        setTimeout(() => {
          this.phoneVerified = true;
        }, 2000);
      }
    },
    editProfile() {
      alert('Edit Profile Clicked');
    },
    validateBirthDate() {
      this.birthDateError = !this.birthYear || !this.birthMonth || !this.birthDay;
      this.updateDays();
    },
    updateDays() {
      if (!this.birthYear || !this.birthMonth) {
        this.days = [];
        return;
      }
      const daysInMonth = new Date(this.birthYear, this.birthMonth, 0).getDate();
      this.days = Array.from({length: daysInMonth}, (_, i) => String(i + 1).padStart(2, '0'));
    },
  },
  created() {
    const currentYear = new Date().getFullYear();
    this.years = Array.from({length: 100}, (_, i) => currentYear - i);
  },
  watch: {
    birthMonth() {
      this.updateDays();
    },
    birthYear() {
      this.updateDays();
    },
  },
};
</script>

<style scoped>
.nav-link {
  text-decoration: none;
  color: inherit;
}

.walker-profile {
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
.form-group textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.form-group input.invalid {
  border-color: red;
}

.error-message {
  color: red;
  font-size: 12px;
  margin-top: 5px;
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

.edit-btn {
  background-color: #ffaa00;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 4px;
  color: white;
  margin-top: 20px;
}

.date-select {
  display: flex;
  justify-content: space-between;
}

.date-select select {
  width: 32%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

@media (max-width: 600px) {
  .form-row {
    flex-direction: column;
  }

  .form-group.short {
    width: 100%;
  }
}

@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css');
</style>