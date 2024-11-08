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
      <div v-if="currentTab === 'address'">
        <!-- Home Address -->
        <div class="address-section">
          <h2 class="section-header">Home Address</h2>
          <div class="address-item" v-if="homeAddress">
            <span class="address-icon">🏠</span>
            <span class="address-text">{{ homeAddress.fullAddress }}</span>
            <div class="button-group">
              <button class="edit-btn" @click="editAddress('home', homeAddress)">Edit</button>
              <button class="delete-btn" @click="deleteAddress('home', homeAddress.id)">Delete</button>
            </div>
          </div>
        </div>

        <!-- Destination Address -->
        <div class="address-section">
          <h2 class="section-header">Destination Address</h2>
          <div v-for="address in destinationAddresses" :key="address.id" class="address-item">
            <span class="address-icon">🏫</span>
            <span class="address-text">{{ address.fullAddress }}</span>
            <div class="button-group">
              <button class="edit-btn" @click="editAddress('destination', address)">Edit</button>
              <button class="delete-btn" @click="deleteAddress('destination', address.id)">Delete</button>
            </div>
          </div>
        </div>

        <button class="add-address-btn" @click="openAddressModal('destination')">+ Add New Address</button>

        <!-- Address Modal -->
        <div v-if="showAddressModal" class="modal-overlay" @click.self="closeModal">
          <div class="modal-content">
            <div class="modal-header">
              <h3>{{ isEditing ? 'Edit' : 'Add New' }} Address</h3>
              <button class="close-button" @click="closeModal">&times;</button>
            </div>
            <form @submit.prevent="submitAddress">
              <div class="form-group">
                <input type="text" id="addressLine1" v-model="newAddress.line1" required placeholder=" " />
                <label for="addressLine1">Address Line 1</label>
              </div>
              <div class="form-group">
                <input type="text" id="addressLine2" v-model="newAddress.line2" placeholder=" " />
                <label for="addressLine2">Address Line 2</label>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <input type="text" id="suburb" v-model="newAddress.suburb" required placeholder=" " />
                  <label for="suburb">Suburb</label>
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
              <div class="form-actions">
                <button type="submit" class="save-button">Save</button>
              </div>
            </form>
          </div>
        </div>
      </div>
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
        line1: '',
        line2: '',
        suburb: '',
        postcode: '',
        state: ''
      },
      addressid: '',
      // Demo data
      homeAddress: {
        id: 1,
        fullAddress: '395 Forest Rd, Hurstville, NSW 2220'
      },
      destinationAddresses: [
        {
          id: 2,
          fullAddress: '5 Greenbank St, Hurstville, NSW 2220'
        }
      ]
    };
  },
  mounted() {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      this.userId = storedUserId;
      this.fetchUserAddress(localStorage.getItem('userId'));
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
        this.editingAddressId = address.id;
        this.newAddress = {
          line1: '',
          line2: '',
          suburb: '',
          postcode: '',
          state: ''
        };
      } else {
        this.isEditing = false;
        this.editingAddressId = null;
        this.newAddress = { line1: '', line2: '', suburb: '', postcode: '', state: '' };
      }
    },
    closeModal() {
      this.showAddressModal = false;
      this.newAddress = { line1: '', line2: '', suburb: '', postcode: '', state: '' };
    },
    editAddress(type, address) {
      this.openAddressModal(type, address);
    },
    deleteAddress(type, addressId) {
      if (confirm('Are you sure you want to delete this address?')) {
        // Try API first
        axios.delete(`${this.apiBaseUrl}/address/${addressId}`)
            .then(response => {
              console.log('Address deleted successfully:', response.data);
              // Update local data after successful API call
              if (type === 'home') {
                this.homeAddress = null;
              } else {
                this.destinationAddresses = this.destinationAddresses.filter(a => a.id !== addressId);
              }
            })
            .catch(error => {
              console.error('Error deleting address:', error);
              // Fallback to demo data
              if (type === 'home') {
                this.homeAddress = null;
              } else {
                this.destinationAddresses = this.destinationAddresses.filter(a => a.id !== addressId);
              }
            });
      }
    },
    submitAddress() {
      const addressData = {
        addressLine1: this.newAddress.line1,
        addressLine2: this.newAddress.line2,
        city: this.newAddress.suburb,
        state: this.newAddress.state,
        postcode: this.newAddress.postcode,
        userId: this.userId
      };

      if (this.isEditing) {
        // Update existing address
        axios.put(`${this.apiBaseUrl}/address/${this.editingAddressId}`, addressData)
            .then(response => {
              console.log('Address updated successfully:', response.data);
              this.fetchUserAddress(this.userId);
            })
            .catch(error => {
              console.error('Error updating address:', error);
              // Fallback to demo data
              const fullAddress = `${this.newAddress.line1}, ${this.newAddress.suburb}, ${this.newAddress.state} ${this.newAddress.postcode}`;
              if (this.editingAddressType === 'home') {
                this.homeAddress.fullAddress = fullAddress;
              } else {
                const index = this.destinationAddresses.findIndex(a => a.id === this.editingAddressId);
                if (index !== -1) {
                  this.destinationAddresses[index].fullAddress = fullAddress;
                }
              }
            });
      } else {
        // Add new address
        axios.post(`${this.apiBaseUrl}/address/add`, addressData)
            .then(response => {
              console.log('Address added successfully:', response.data);
              this.fetchUserAddress(this.userId);
            })
            .catch(error => {
              console.error('Error adding address:', error);
              // Fallback to demo data
              const fullAddress = `${this.newAddress.line1}, ${this.newAddress.suburb}, ${this.newAddress.state} ${this.newAddress.postcode}`;
              if (this.editingAddressType === 'home') {
                this.homeAddress = { id: Date.now(), fullAddress };
              } else {
                this.destinationAddresses.push({ id: Date.now(), fullAddress });
              }
            });
      }
      this.closeModal();
    },
    async fetchUserAddress(UserId) {
      try {
        const userResponse = await axios.get(`${this.apiBaseUrl}/user/${UserId}`);
        this.addressid = userResponse.data.addressId;

        const addressResponse = await axios.get(`${this.apiBaseUrl}/address/${this.addressid}`);
        const address = addressResponse.data;
        this.homeAddress.fullAddress = `${address.addressLine1} ${address.addressLine2}, ${address.city}, ${address.state}, ${address.postcode}`;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  }
};
</script>

<style scoped>
.parent-profile {
  display: flex;
  width: 95%;
  margin: 0 auto;
  position: relative;
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

.nav-link {
  text-decoration: none;
  color: inherit;
}

.profile-content {
  flex-grow: 1;
}

.section-header {
  background-color: #ffaa00;
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

.edit-btn, .delete-btn {
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.edit-btn {
  background-color: #ffaa00;
  color: white;
}

.delete-btn {
  background-color: #ff4444;
  color: white;
}

.add-address-btn {
  background-color: #ffaa00;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 20px;
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
  color: #ffaa00;
}

.form-group input:focus {
  border-bottom-color: #ffaa00;
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
  background-color: #ffaa00;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 18px;
  transition: background-color 0.3s;
}

.save-button:hover {
  background-color: #ff9500;
}
</style>