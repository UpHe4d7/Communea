<template>
  <div class="address-page">
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

    <!-- Profile Content -->
    <div class="profile-content">
      <div v-if="currentTab === 'address'">
        <!-- Home Address -->
        <div class="address-section">
          <h2 class="section-header">Home Address</h2>
          <div class="address-item" v-if="homeAddress">
            <span class="address-icon">🏠</span>
            <span class="address-text">{{ homeAddress.fullAddress }}</span>
            <div class="button-group">
              <button class="edit-btn" @click="editAddress('home', homeAddress)">Edit</button>
            </div>
          </div>
          <div v-else>
            <p>No Home Address Found.</p>
            <button class="add-address-btn" @click="createAddress('home')">+ Add Home Address</button>
          </div>
        </div>

        <!-- Destination Addresses -->
        <!--div class="address-section">
          <h2 class="section-header">Destination Addresses</h2>
          <div v-if="destinationAddresses.length">
            <div v-for="address in destinationAddresses" :key="address.addressId" class="address-item">
              <span class="address-icon">📍</span>
              <span class="address-text">{{ address.fullAddress }}</span>
              <div class="button-group">
                <button class="edit-btn" @click="editAddress('destination', address)">Edit</button>
                <button class="delete-btn" @click="deleteAddress('destination', address.addressId)">Delete</button>
              </div>
            </div>
          </div>
          <div v-else>
            <p>No Destination Addresses Found.</p>
          </div>
          <button class="add-address-btn" @click="openAddressModal('destination')">+ Add New Address</button>
        </div-->

        <!-- Address Modal -->
        <div v-if="showAddressModal" class="modal-overlay" @click.self="closeModal">
          <div class="modal-content">
            <div class="modal-header">
              <h3>{{ isEditing ? 'Edit' : 'Add New' }} Address</h3>
              <button class="close-button" @click="closeModal">&times;</button>
            </div>
            <form @submit.prevent="submitAddress">
              <div class="form-group">
                <input type="text" id="addressLine1" v-model="newAddress.addressLine1" required placeholder=" " />
                <label for="addressLine1">Address Line 1</label>
              </div>
              <div class="form-group">
                <input type="text" id="addressLine2" v-model="newAddress.addressLine2" placeholder=" " />
                <label for="addressLine2">Address Line 2</label>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <input type="text" id="city" v-model="newAddress.city" required placeholder=" " />
                  <label for="city">City</label>
                </div>
                <div class="form-group">
                  <input type="text" id="postcode" v-model="newAddress.postcode" required placeholder=" " />
                  <label for="postcode">Postcode</label>
                </div>
              </div>
              <div class="form-group">
                <input type="text" id="state" v-model="newAddress.state" required placeholder=" " />
                <label for="state">State</label>
              </div>
              <div class="form-group">
                <input type="text" id="country" v-model="newAddress.country" required placeholder=" " />
                <label for="country">Country</label>
              </div>
              <div class="form-actions">
                <button type="submit" class="save-button">{{ isEditing ? 'Update' : 'Save' }}</button>
              </div>
            </form>
          </div>
        </div>

        <!-- Loading and Error Messages -->
        <div v-if="isLoading" class="loading-overlay">
          <p>Loading addresses...</p>
        </div>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </div>
      <!-- Other tabs content can be added here -->
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  inject: ['apiBaseUrl'],
  name: 'ParentProfileAddress',
  data() {
    return {
      currentTab: 'address',
      showAddressModal: false,
      isEditing: false,
      editingAddressType: null,
      editingAddressId: null,
      newAddress: {
        addressLine1: '',
        addressLine2: '',
        city: '',
        postcode: '',
        state: '',
        country: ''
      },
      addressid: '',
      userId: '',
      homeAddress: null,
      destinationAddresses: [],
      isLoading: false,
      errorMessage: ''
    };
  },
  mounted() {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      this.userId = storedUserId;
      this.fetchUserAddresses();
    } else {
      window.location.href = '/login';
    }
  },
  methods: {
    switchTab(tab) {
      this.currentTab = tab;
    },
    openAddressModal(type, address = null) {
      this.showAddressModal = true;
      this.editingAddressType = type;
      if (address) {
        this.isEditing = true;
        this.editingAddressId = address.addressId;
        this.newAddress = {
          addressLine1: address.addressLine1 || '',
          addressLine2: address.addressLine2 || '',
          city: address.city || '',
          postcode: address.postcode || '',
          state: address.state || '',
          country: address.country || ''
        };
      } else {
        this.isEditing = false;
        this.editingAddressId = null;
        this.newAddress = { addressLine1: '', addressLine2: '', city: '', postcode: '', state: '', country: '' };
      }
    },
    closeModal() {
      this.showAddressModal = false;
      this.isEditing = false;
      this.editingAddressType = null;
      this.editingAddressId = null;
      this.newAddress = { addressLine1: '', addressLine2: '', city: '', postcode: '', state: '', country: '' };
    },
    editAddress(type, address) {
      this.openAddressModal(type, address);
    },
    async createAddress(type) {
        await axios.post(`${this.apiBaseUrl}/address/save`, {
          addressLine1: '123 Main St',
          city: 'Sydnet',
          state: 'NSW',
          postcode: '2008',
          country: 'Australia'
        })
            .then(response => {
              console.log('Address saved successfully:', response.data);
              // 更新users中的addressId
              const addressId = response.data;
              axios.get(`${this.apiBaseUrl}/user/${this.userId}`)
                  .then(response => {
                    const userData = response.data;
                    userData.addressId = addressId;
                    axios.put(`${this.apiBaseUrl}/user/${this.userId}`, userData);
                    this.editAddress(type, { addressId, addressLine1: '123 Main St', city: 'Sydnet', state: 'NSW', postcode: '2008', country: 'Australia' });
                  })
                  .catch(error => {
                    console.error('Error adding address:', error);
                    this.errorMessage = 'Failed to add address.';
                  });
            })
            .catch(error => {
              console.error('Error adding address:', error);
              this.errorMessage = 'Failed to add address.';
            });
    },
    submitAddress() {
      const addressData = {
        addressLine1: this.newAddress.addressLine1,
        addressLine2: this.newAddress.addressLine2,
        city: this.newAddress.city,
        state: this.newAddress.state,
        postcode: this.newAddress.postcode,
        country: this.newAddress.country
      };

      this.isLoading = true;

      if (this.isEditing) {
        // Update existing address
        axios.put(`${this.apiBaseUrl}/address/${this.editingAddressId}`, addressData)
            .then(response => {
              console.log('Address updated successfully:', response.data);
              // Update local data
              this.homeAddress = {
                ...this.homeAddress,
                ...addressData,
                fullAddress: this.constructFullAddress(addressData)
              };
              this.closeModal();
            })
            .catch(error => {
              console.error('Error updating address:', error);
              this.errorMessage = 'Failed to update address.';
            })
            .finally(() => {
              this.isLoading = false;
            });
      } else {
        // Add new address
        axios.post(`${this.apiBaseUrl}/address/save`, addressData)
            .then(response => {
              console.log('Address saved successfully:', response.data);
              const savedAddress = response.data;
              // Associate address with user
              return axios.post(`${this.apiBaseUrl}/parentsAddress/create`, {
                userId: this.userId,
                addressId: savedAddress
              });
            })
            .then(response => {
              console.log('Address associated with user successfully:', response.data);
              // Add to destinationAddresses array
              const fullAddress = this.constructFullAddress(this.newAddress);
              this.destinationAddresses.push({
                addressId: this.newAddress.addressId || Date.now().toString(), // Assuming addressId is returned
                fullAddress
              });
              this.closeModal();
            })
            .catch(error => {
              console.error('Error adding address:', error);
              this.errorMessage = 'Failed to add address.';
            })
            .finally(() => {
              this.isLoading = false;
            });
      }
    },
    constructFullAddress(address) {
      return `${address.addressLine1}, ${address.addressLine2 ? address.addressLine2 + ', ' : ''}${address.city}, ${address.state} ${address.postcode}, ${address.country}`;
    },
    async fetchUserAddresses() {
      this.isLoading = true;
      try {
        // Fetch user data
        const userResponse = await axios.get(`${this.apiBaseUrl}/user/${this.userId}`);
        const userData = userResponse.data;
        if (userData.addressId) {
          // Fetch home address
          const homeAddressResponse = await axios.get(`${this.apiBaseUrl}/address/${userData.addressId}`);
          const homeAddressData = homeAddressResponse.data;
          this.homeAddress = {
            addressId: homeAddressData.addressId,
            fullAddress: this.constructFullAddress(homeAddressData)
          };
        } else {
          this.homeAddress = null;
        }
      } catch (error) {
        console.error('Error fetching user addresses:', error);
        this.errorMessage = 'Failed to fetch addresses.';
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<style scoped>
.nav-link {
  text-decoration: none;
  color: inherit;
}

.address-page {
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

.address-item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.address-item i {
  margin-right: 10px;
}

.edit-btn {
  margin-left: auto;
  background-color: #0A2640;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 4px;
  color: white;
}

.section-header {
  background-color: #0A2640;
  color: white;
  padding: 10px;
  margin-bottom: 10px;
  font-weight: bold;
}

.address-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 4px;
}
.address-icon {
  font-size: 20px;
  margin-right: 10px;
}
.address-text {
  flex-grow: 1;
}

.button-group {
  display: flex;
  gap: 10px;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  width: 600px;
  max-width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.modal-header h3 {
  font-size: 24px;
  font-weight: bold;
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #888;
}

.form-group {
  margin-bottom: 25px;
  position: relative;
}

.form-group input {
  width: 100%;
  padding: 12px 0;
  border: none;
  border-bottom: 2px solid #ddd;
  outline: none;
  font-size: 18px;
  transition: border-color 0.3s;
}

.form-group label {
  position: absolute;
  top: 12px;
  left: 0;
  font-size: 18px;
  color: #999;
  pointer-events: none;
  transition: 0.3s ease all;
}

.form-group input:focus ~ label,
.form-group input:not(:placeholder-shown) ~ label {
  top: -20px;
  font-size: 16px;
  color: #0A2640;
}

.form-group input:focus {
  border-bottom-color: #0A2640;
}

.form-row {
  display: flex;
  justify-content: space-between;
}

.form-row .form-group {
  width: 48%;
}

.form-actions {
  text-align: right;
  margin-top: 30px;
}

.save-button {
  background-color: #0A2640;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 18px;
  transition: background-color 0.3s;
}

.save-button:hover {
  background-color: #0A2640;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  color: #0A2640;
}

.error-message {
  color: #ff4444;
  margin-top: 20px;
  text-align: center;
}
</style>