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
          <router-link to="/settings" @click="switchTab('settings')" class="nav-link">Settings</router-link>
        </li>
      </ul>
    </div>

    <!-- Profile Content -->
    <div class="profile-content">
      <!-- Personal Information Tab -->
      <div v-if="currentTab === 'info'">

        <div class="profile-header">
          <h2>Personal Information</h2>
        </div>
        <div class="profile-form">
          <div class="form-row">
            <div class="form-group short">
              <label for="firstName">First name</label>
              <input type="text" id="firstName" v-model="user.firstName" disabled />
            </div>
            <div class="form-group short">
              <label for="lastName">Last name</label>
              <input type="text" id="lastName" v-model="user.lastName" disabled />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group short">
              <label for="preferredName">Preferred name</label>
              <input
                  type="text"
                  id="preferredName"
                  v-model="user.preferredName"
                  :disabled="!isEditing"
              />
            </div>
            <div class="form-group short">
              <label for="birthDate">Date of Birth</label>
              <input
                  type="text"
                  id="birthDate"
                  v-model="user.dateOfBirth"
                  placeholder="YYYY-MM-DD"
                  @blur="validateBirthDate"
                  :class="{ invalid: birthDateError }"
                  :disabled="!isEditing"
              />
              <span v-if="birthDateError" class="error-message">Please enter valid date format (YYYY-MM-DD)</span>
            </div>
          </div>

          <div class="form-group">
            <label for="description">Description about your family/children</label>
            <textarea
                id="description"
                v-model="user.description"
                :disabled="!isEditing"
            ></textarea>
          </div>

          <div class="form-group">
            <label>Identity Verification</label>
            <div id="digitalid-verify" class="digitalid-verify"></div> <!-- Add this line -->
            <div class="input-group">
              <span class="verification-status" :class="{ verified: identityVerified }">
                <i class="fas fa-check-circle"></i>
              </span>
              <button @click="initiateIdentityVerification()" >{{ identityVerified ? 'Verified' : 'Verify' }}</button>
            </div>
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

      <!-- My Children Tab -->
      <div v-if="currentTab === 'children'">
        <!-- My Children content here -->
        <div class="profile-header">
          <h2>My Children</h2>
        </div>
        <div class="children-list">
          <div v-if="childrenLoading">Loading...</div>
          <div v-else-if="childrenError" class="error-message">{{ childrenError }}</div>
          <div v-else>
            <ul>
              <li v-for="child in children" :key="child.childrenId">
                <p><strong>Name:</strong> {{ child.name }}</p>
                <p><strong>Age:</strong> {{ child.age }}</p>
                <p><strong>Gender:</strong> {{ child.gender }}</p>
                <p><strong>Description:</strong> {{ child.description }}</p>
                <button @click="editChild(child.childrenId)">Edit</button>
                <button @click="deleteChild(child.childrenId)">Delete</button>
              </li>
            </ul>
            <button @click="addChild">Add Child</button>
          </div>
        </div>
      </div>

      <!-- My Address Tab -->
      <div v-if="currentTab === 'address'">
        <!-- My Address content here -->
        <div class="profile-header">
          <h2>My Address</h2>
        </div>
        <div class="address-list">
          <div v-if="addressLoading">Loading...</div>
          <div v-else-if="addressError" class="error-message">{{ addressError }}</div>
          <div v-else>
            <ul>
              <li v-for="address in addresses" :key="address.addressId">
                <p><strong>Address Line 1:</strong> {{ address.addressLine1 }}</p>
                <p><strong>Address Line 2:</strong> {{ address.addressLine2 }}</p>
                <p><strong>City:</strong> {{ address.city }}</p>
                <p><strong>State:</strong> {{ address.state }}</p>
                <p><strong>Postcode:</strong> {{ address.postcode }}</p>
                <p><strong>Country:</strong> {{ address.country }}</p>
                <p><strong>Latitude:</strong> {{ address.latitude }}</p>
                <p><strong>Longitude:</strong> {{ address.longitude }}</p>
                <button @click="editAddress(address.addressId)">Edit</button>
                <button @click="deleteAddress(address.addressId)">Delete</button>
              </li>
            </ul>
            <button @click="addAddress">Add Address</button>
          </div>
        </div>
      </div>

      <!-- Settings Tab -->
      <div v-if="currentTab === 'settings'">
        <!-- Settings content here -->
        <div class="profile-header">
          <h2>Settings</h2>
        </div>
        <div class="settings-form">
          <!-- Settings form elements go here -->
          <p>Settings content is under development.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  inject: ['apiBaseUrl'],
  name: 'ParentProfile',
  data() {
    return {
      currentTab: 'info',
      isEditing: false,
      birthDateError: false,
      identityVerified: false,
      user: {
        addressId: '',
        communicationPreference: '',
        dateOfBirth: '',
        description: '',
        email: '',
        firstName: 'Kobe',
        lastName: 'Brown',
        password: '', // Note: Typically, you should not handle passwords in profile pages like this
        phoneNumber: '0492988777',
        preferredName: '',
        userId: '',
        userType: '',
      },
      originalData: null,
      emailVerified: false,
      phoneVerified: false,
      children: [],
      childrenLoading: false,
      childrenError: '',
      addresses: [],
      addressLoading: false,
      addressError: '',
      hasVerifyButton: false,
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
      this.user.userId = storedUserId;
      this.fetchUserData(this.user.userId);
      this.fetchChildrenData(this.user.userId);
      this.fetchAddressesData(this.user.userId);
      this.checkIdentityVerification(this.user.userId);  // check identity verification status
    } else {
      window.location.href = '/login';
    }
  },

  methods: {
    switchTab(tab) {
      this.currentTab = tab;
    },

    // Identity Verification Methods
    parseJwt(token) {
      try {
        const base64Url = token.split('.')[1]; // split the JWT into 3 parts and get the payload
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

    /* eslint-disable no-undef */
    initiateIdentityVerification() {
      if(!this.hasVerifyButton){
        this.hasVerifyButton = true;
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
                    console.log('Verification successful:', res.data); // print the response

                    if (res.data && res.data.includes('.')) { // make sure the response is a JWT
                      const decodedData = this.parseJwt(res.data);
                      console.log('Decoded JWT:', decodedData);
                      this.updateIdentityVerificationStatus(this.user.userId);

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
      }
      else {
        console.log('Verification already initiated');
      }

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
          new URLSearchParams({ userId: userId }), // send the userId to the backend
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

    // Personal Information Methods
    startEdit() {
      // store the original data before editing
      this.originalData = {
        preferredName: this.user.preferredName,
        dateOfBirth: this.user.dateOfBirth,
        description: this.user.description,
      };
      this.isEditing = true;
    },

    async handleSave() {
      try {
        if (this.birthDateError) {
          alert('Please correct the date format before saving.');
          return;
        }

        // svae the updated profile data
        await axios.put(`${this.apiBaseUrl}/user/${this.user.userId}`, {
          addressId: this.user.addressId,
          communicationPreference: this.user.communicationPreference,
          dateOfBirth: this.user.dateOfBirth,
          description: this.user.description,
          email: this.user.email,
          firstName: this.user.firstName,
          lastName: this.user.lastName,
          password: this.user.password, // warning: do not send password in plain text normally
          phoneNumber: this.user.phoneNumber,
          preferredName: this.user.preferredName,
          userId: this.user.userId,
          userType: this.user.userType,
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
        this.user.preferredName = this.originalData.preferredName;
        this.user.dateOfBirth = this.originalData.dateOfBirth;
        this.user.description = this.originalData.description;
      }
      this.isEditing = false;
      this.originalData = null;
    },

    handleEmailAction() {
      if (this.emailVerified) {
        // allow updating email
        this.emailVerified = false;
      } else {
        // send verification email
        alert('Verification email sent. Please check your inbox.');
        // 假设后端有发送验证邮件的接口
        axios.post(`${this.apiBaseUrl}/user/sendEmailVerification`, {
          email: this.user.email,
        })
            .then(() => {
              setTimeout(() => {
                this.emailVerified = true;
              }, 2000);
            })
            .catch(error => {
              console.error('Email verification failed:', error);
              alert('Failed to send verification email.');
            });
      }
    },

    handlePhoneAction() {
      if (this.phoneVerified) {
        // allow updating phone number
        this.phoneVerified = false;
      } else {
        // send verification SMS
        alert('Verification SMS sent. Please check your phone.');
        // 假设后端有发送验证短信的接口
        axios.post(`${this.apiBaseUrl}/user/sendPhoneVerification`, {
          phoneNumber: this.user.phoneNumber,
        })
            .then(() => {
              setTimeout(() => {
                this.phoneVerified = true;
              }, 2000);
            })
            .catch(error => {
              console.error('Phone verification failed:', error);
              alert('Failed to send verification SMS.');
            });
      }
    },

    validateBirthDate() {
      const datePattern = /^\d{4}-\d{2}-\d{2}$/;
      const isValidFormat = datePattern.test(this.user.dateOfBirth);

      if (!isValidFormat) {
        this.birthDateError = true;
        return;
      }

      const date = new Date(this.user.dateOfBirth);
      this.birthDateError = !(date instanceof Date && !isNaN(date));
    },

    async fetchUserData(userId) {
      try {
        const response = await axios.get(`${this.apiBaseUrl}/user/${userId}`);
        const user = response.data;
        this.user.addressId = user.addressId;
        this.user.communicationPreference = user.communicationPreference;
        this.user.dateOfBirth = user.dateOfBirth;
        this.user.description = user.description;
        this.user.email = user.email;
        this.user.firstName = user.firstName;
        this.user.lastName = user.lastName;
        this.user.password = user.password; // warning: do not store password in plain text normally
        this.user.phoneNumber = user.phoneNumber;
        this.user.preferredName = user.preferredName;
        this.user.userType = user.userType;
      } catch (error) {
        console.error('Error fetching user data:', error);
        alert('Failed to fetch user data. Please try again.');
      }
    },

    // Children Methods
    async fetchChildrenData(userId) {
      this.childrenLoading = true;
      this.childrenError = '';
      try {
        const response = await axios.get(`${this.apiBaseUrl}/children/parent/${userId}`);
        this.children = response.data;
      } catch (error) {
        console.error('Error fetching children data:', error);
        this.childrenError = 'Failed to fetch children data.';
      } finally {
        this.childrenLoading = false;
      }
    },

    addChild() {
      // Logic to add a child (e.g., open a modal with a form)
      alert('Add Child functionality is under development.');
    },

    editChild(childId) {
      // Logic to edit a child (e.g., navigate to edit page or open a modal)
      alert(`Edit Child with ID: ${childId} is under development.`);
    },

    async deleteChild(childId) {
      if (confirm('Are you sure you want to delete this child?')) {
        try {
          await axios.delete(`${this.apiBaseUrl}/children/delete/${childId}`);
          this.children = this.children.filter(child => child.childrenId !== childId);
          alert('Child deleted successfully.');
        } catch (error) {
          console.error('Error deleting child:', error);
          alert('Failed to delete child. Please try again.');
        }
      }
    },

    // Address Methods
    async fetchAddressesData(userId) {
      this.addressLoading = true;
      this.addressError = '';
      try {
        const response = await axios.get(`${this.apiBaseUrl}/parentsAddress/${userId}`);
        this.addresses = response.data;
      } catch (error) {
        console.error('Error fetching addresses:', error);
        this.addressError = 'Failed to fetch addresses.';
      } finally {
        this.addressLoading = false;
      }
    },

    addAddress() {
      // Logic to add an address (e.g., open a modal with a form)
      alert('Add Address functionality is under development.');
    },

    editAddress(addressId) {
      // Logic to edit an address (e.g., navigate to edit page or open a modal)
      alert(`Edit Address with ID: ${addressId} is under development.`);
    },

    async deleteAddress(addressId) {
      if (confirm('Are you sure you want to delete this address?')) {
        try {
          await axios.delete(`${this.apiBaseUrl}/address/${addressId}`);
          this.addresses = this.addresses.filter(address => address.addressId !== addressId);
          alert('Address deleted successfully.');
        } catch (error) {
          console.error('Error deleting address:', error);
          alert('Failed to delete address. Please try again.');
        }
      }
    },
  },
};
</script>

<style scoped>
.nav-link {
  text-decoration: none;
  color: inherit;
}

.parent-profile {
  display: flex;
  width: 100%;
  margin: 0 auto;
  max-width: 1200px;
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

.profile-form,
.children-list,
.address-list,
.settings-form {
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

.edit-btn,
.save-btn {
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

.children-list ul,
.address-list ul {
  list-style-type: none;
  padding: 0;
}

.children-list li,
.address-list li {
  border-bottom: 1px solid #ddd;
  padding: 10px 0;
}

.children-list li:last-child,
.address-list li:last-child {
  border-bottom: none;
}

.children-list button,
.address-list button {
  margin-right: 10px;
  background-color: #ffaa00;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 4px;
  color: white;
}

.children-list button:hover,
.address-list button:hover {
  background-color: #ff9900;
}

.settings-form {
  /* Add styles for settings form */
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
