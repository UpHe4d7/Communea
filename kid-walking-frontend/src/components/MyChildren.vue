<template>
  <div class="my-children">
    <!-- Children Navigation -->
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

    <!-- Children Content -->
    <div class="profile-content">
      <div v-if="currentTab === 'children'">
        <div class="profile-header">
          <h2>My Children</h2>
        </div>
        <div class="children-list">
          <!-- Loading and Error Messages -->
          <div v-if="isLoading" class="loading">
            <p>Loading...</p>
          </div>
          <div v-else-if="errorMessage" class="error">
            <p>{{ errorMessage }}</p>
          </div>
          <div v-else>
            <!-- Children list and details -->
            <div v-for="child in children" :key="child.childrenId" class="child-item">
              <p><strong>Name:</strong> {{ child.name }}</p>
              <p><strong>Gender:</strong> {{child.gender}}
                <!--select v-model="child.gender" class="gender-select" @change="updateChild(child)">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="prefer not to say">Prefer not to say</option>
                </select-->
              </p>
              <p><strong>Age:</strong> {{ child.age }}</p>
              <p><strong>Description:</strong> {{ child.description }}</p>
              <div class="button-group">
                <button class="edit-btn" @click="openEditModal(child)">Edit</button>
                <button class="delete-btn" @click="deleteChild(child.childrenId)">Delete</button>
              </div>
            </div>
            <button class="add-child-btn" @click="openAddModal">+ Add Child</button>
          </div>
        </div>

        <!-- Add Child Modal -->
        <div v-if="showAddChildModal" class="modal-overlay" @click.self="closeAddModal">
          <div class="modal-content">
            <h3>Add New Child</h3>
            <form @submit.prevent="submitAddChild">
              <div class="form-group">
                <label for="childName">Name</label>
                <input type="text" id="childName" v-model="newChild.name" required />
              </div>
              <div class="form-group">
                <label for="childGender">Gender</label>
                <select id="childGender" v-model="newChild.gender" required>
                  <option value="" disabled selected>Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="prefer not to say">Prefer not to say</option>
                </select>
              </div>
              <div class="form-group">
                <label for="childAge">Age</label>
                <input type="number" id="childAge" v-model.number="newChild.age" required min="0" />
              </div>
              <div class="form-group">
                <label for="description">Description</label>
                <textarea id="description" v-model="newChild.description" rows="3"></textarea>
              </div>
              <div class="modal-buttons">
                <button type="submit" class="add-child-confirm">Add Child</button>
                <button type="button" class="close-button" @click="closeAddModal">Cancel</button>
              </div>
            </form>
          </div>
        </div>

        <!-- Edit Child Modal -->
        <div v-if="showEditChildModal" class="modal-overlay" @click.self="closeEditModal">
          <div class="modal-content">
            <h3>Edit Child</h3>
            <form @submit.prevent="submitEditChild">
              <div class="form-group">
                <label for="editChildName">Name</label>
                <input type="text" id="editChildName" v-model="editChildData.name" required />
              </div>
              <div class="form-group">
                <label for="editChildGender">Gender</label>
                <select id="editChildGender" v-model="editChildData.gender" required>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="prefer not to say">Prefer not to say</option>
                </select>
              </div>
              <div class="form-group">
                <label for="editChildAge">Age</label>
                <input type="number" id="editChildAge" v-model.number="editChildData.age" required min="0" />
              </div>
              <div class="form-group">
                <label for="editDescription">Description</label>
                <textarea id="editDescription" v-model="editChildData.description" rows="3"></textarea>
              </div>
              <div class="modal-buttons">
                <button type="submit" class="edit-child-confirm">Save Changes</button>
                <button type="button" class="close-button" @click="closeEditModal">Cancel</button>
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
  name: 'MyChildren',
  data() {
    return {
      currentTab: 'children',
      showAddChildModal: false,
      showEditChildModal: false,
      newChild: {
        name: '',
        gender: '',
        age: '',
        description: ''
      },
      editChildData: {
        childrenId: '',
        name: '',
        gender: '',
        age: '',
        description: ''
      },
      userId: '',
      // Initial hardcoded children data
      children: [
        {
          childrenId: '1',
          name: 'Ryan',
          age: 3,
          gender: 'male',
          description: 'Ryan is an active and cheerful boy.'
        },
        {
          childrenId: '2',
          name: 'Lisa',
          age: 4,
          gender: 'female',
          description: 'Lisa loves painting and playing with her friends.'
        }
      ],
      isLoading: false,
      errorMessage: ''
    };
  },
  mounted() {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      this.userId = storedUserId;
      this.fetchChildrenData(this.userId);
    } else {
      window.location.href = '/login';
    }
  },
  methods: {
    switchTab(tab) {
      this.currentTab = tab;
    },
    // Fetch children data from API
    fetchChildrenData(parentId) {
      this.isLoading = true;
      axios
          .get(`${this.apiBaseUrl}/children/parent/${parentId}`)
          .then(response => {
            if (Array.isArray(response.data)) {
              this.children = response.data.map(child => ({
                childrenId: child.childrenId,
                name: child.name,
                gender: child.gender,
                age: child.age,
                description: child.description
              }));
            } else {
              this.errorMessage = 'Unexpected response format.';
            }
          })
          .catch(error => {
            console.error('Error fetching children data:', error);
            this.errorMessage = 'Failed to fetch children data. Using default data.';
            // Retain hardcoded data if API fails
          })
          .finally(() => {
            this.isLoading = false;
          });
    },
    // Open Add Child Modal
    openAddModal() {
      this.showAddChildModal = true;
    },
    // Close Add Child Modal
    closeAddModal() {
      this.showAddChildModal = false;
      // Reset form
      this.newChild = {
        name: '',
        gender: '',
        age: '',
        description: ''
      };
    },
    // Submit Add Child Form
    submitAddChild() {
      const { name, gender, age, description } = this.newChild;
      axios
          .post(`${this.apiBaseUrl}/children/add`, {
            name,
            gender,
            age,
            description,
            parentsId: this.userId
          })
          .then(response => {
            console.log('Child added successfully:', response.data);
            this.fetchChildrenData(this.userId);
            this.closeAddModal();
          })
          .catch(error => {
            console.error('Error adding child:', error);
            this.errorMessage = 'Failed to add child. Using default data.';
            // Fallback to demo data
            const newId = this.children.length + 1;
            this.children.push({
              childrenId: newId.toString(),
              name: this.newChild.name,
              age: this.newChild.age,
              gender: this.newChild.gender,
              description: this.newChild.description
            });
            this.closeAddModal();
          });
    },
    // Open Edit Child Modal
    openEditModal(child) {
      this.editChildData = { ...child };
      this.showEditChildModal = true;
    },
    // Close Edit Child Modal
    closeEditModal() {
      this.showEditChildModal = false;
      // Reset edit form
      this.editChildData = {
        childrenId: '',
        name: '',
        gender: '',
        age: '',
        description: ''
      };
    },
    // Submit Edit Child Form
    submitEditChild() {
      const { childrenId, name, gender, age, description } = this.editChildData;
      axios
          .put(`${this.apiBaseUrl}/children/update`, {
            childrenId,
            name,
            gender,
            age,
            description,
            parentsId: this.userId
          })
          .then(response => {
            console.log('Child updated successfully:', response.data);
            this.fetchChildrenData(this.userId);
            this.closeEditModal();
          })
          .catch(error => {
            console.error('Error updating child:', error);
            this.errorMessage = 'Failed to update child. Changes not saved.';
            // Optionally, refresh data from API or revert changes
            this.fetchChildrenData(this.userId);
            this.closeEditModal();
          });
    },
    // Delete Child
    deleteChild(childId) {
      if (confirm('Are you sure you want to delete this child?')) {
        axios
            .delete(`${this.apiBaseUrl}/children/delete/${childId}`)
            .then(response => {
              console.log('Child deleted successfully:', response.data);
              this.fetchChildrenData(this.userId);
            })
            .catch(error => {
              console.error('Error deleting child:', error);
              this.errorMessage = 'Failed to delete child. Removing from list locally.';
              // Fallback to demo data
              this.children = this.children.filter(child => child.childrenId !== childId);
            });
      }
    },
    // Update Child Gender directly from select
    updateChild(child) {
      axios
          .put(`${this.apiBaseUrl}/children/update`, {
            childrenId: child.childrenId,
            name: child.name,
            gender: child.gender,
            age: child.age,
            description: child.description,
            parentsId: this.userId
          })
          .then(response => {
            console.log('Child gender updated successfully:', response.data);
          })
          .catch(error => {
            console.error('Error updating child gender:', error);
            this.errorMessage = 'Failed to update child gender. Reverting change.';
            // Revert change by fetching data again
            this.fetchChildrenData(this.userId);
          });
    }
  }
};
</script>

<style scoped>
.nav-link {
  text-decoration: none;
  color: inherit;
}

.my-children {
  display: flex;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.profile-navigation {
  width: 25%;
  align-items: center;
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

.children-list {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.child-item {
  margin-bottom: 15px;
  padding: 10px;
  border-bottom: 1px solid #ccc;
}

.button-group {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.edit-btn,
.delete-btn {
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

.gender-select {
  padding: 5px;
  border-radius: 4px;
  border: 1px solid #ccc;
  margin-left: 5px;
}

.add-child-btn {
  background-color: #ffaa00;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 4px;
  color: white;
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
  z-index: 999;
}

.modal-content {
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  width: 600px;
  max-width: 90%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

h3 {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.modal-buttons {
  display: flex;
  justify-content: space-between;
}

.add-child-confirm {
  background-color: #ffaa00;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 4px;
  color: white;
  margin-top: 20px;
}

.edit-child-confirm {
  background-color: #00aaff;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 4px;
  color: white;
  margin-top: 20px;
}

.close-button {
  background-color: #ddd;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 4px;
  color: #333;
  margin-top: 20px;
}

.loading,
.error {
  text-align: center;
  margin: 20px 0;
}

.error {
  color: red;
}
</style>
