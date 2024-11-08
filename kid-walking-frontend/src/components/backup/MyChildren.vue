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
          <router-link to="/src/components/UserSettings" @click="switchTab('settings')" class="nav-link">Settings</router-link>
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
          <!-- Children list and details go here -->
          <div v-for="child in children" :key="child.id" class="child-item">
            <p><strong>Name:</strong> {{ child.name }}</p>
            <p><strong>Gender:</strong>
              <select v-model="child.gender" class="gender-select">
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="prefer not to say">Prefer not to say</option>
              </select>
            </p>
            <p><strong>Age:</strong> {{ child.age }}</p>
            <p><strong>Description:</strong> {{ child.description }}</p>
            <div class="button-group">
              <button class="edit-btn" @click="editChild(child.id)">Edit</button>
              <button class="delete-btn" @click="deleteChild(child.id)">Delete</button>
            </div>
          </div>
          <button class="add-child-btn" @click="showAddChildModal = true">+ Add Child</button>
        </div>

        <!-- Add Child Modal -->
        <div v-if="showAddChildModal" class="modal-overlay" @click.self="closeModal">
          <div class="modal-content">
            <h3>Add New Child</h3>
            <form @submit.prevent="submitChild">
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
                <input type="number" id="childAge" v-model="newChild.age" required />
              </div>
              <div class="form-group">
                <label for="description">Description</label>
                <textarea id="description" v-model="newChild.description" rows="3"></textarea>
              </div>
              <div class="modal-buttons">
                <button type="submit" class="add-child-confirm">Add Child</button>
                <button type="button" class="close-button" @click="closeModal">Cancel</button>
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
  data() {
    return {
      currentTab: 'children',
      showAddChildModal: false,
      newChild: {
        name: '',
        birthDate: '',
        description: '',
        gender: '',
        age: ''
      },
      userId: '',
      // Demo data for display
      children: [
        {
          id: 1,
          name: 'Ryan',
          age:'3',
          gender: 'male',
          description: 'Ryan is an active and cheerful boy.'
        },
        {
          id: 2,
          name: 'Lisa',
          age:'3',
          gender: 'male',
          description: 'Lisa loves painting and playing with her friends.'
        }
      ]
    };
  },
  mounted() {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      this.userId = storedUserId;
      this.fetchChildrenData(localStorage.getItem('userId'));
    } else {
      window.location.href = '/login';
    }
  },
  methods: {
    switchTab(tab) {
      this.currentTab = tab;
    },
    closeModal() {
      this.showAddChildModal = false;
      // Reset form
      this.newChild = {
        name: '',
        birthDate: '',
        description: '',
        gender: '',
        age: ''
      };
    },
    submitChild() {
      // First try to use API
      axios.post(`${this.apiBaseUrl}/children/add`, {
        age: this.newChild.age,
        description: this.newChild.description,
        gender: this.newChild.gender,
        name: this.newChild.name,
        parentsId: this.userId
      })
          .then(response => {
            console.log('Child added successfully:', response.data);
            this.fetchChildrenData(this.userId);
            this.closeModal();
          })
          .catch(error => {
            console.error('Error adding child:', error);
            // Fallback to demo data
            const newId = this.children.length + 1;
            this.children.push({
              id: newId,
              name: this.newChild.name,
              age: this.newChild.age,
              gender: this.newChild.gender,
              description: this.newChild.description
            });
            this.closeModal();
          });
    },
    deleteChild(childId) {
      if (confirm('Are you sure you want to delete this child?')) {
        // 直接传递 childId 作为 data 参数
        axios.delete(`${this.apiBaseUrl}/children/delete/${childId}`, {
          data: { id: childId }
        })
            .then(response => {
              console.log('Child deleted successfully:', response.data);
              this.fetchChildrenData(this.userId);
            })
            .catch(error => {
              console.error('Error deleting child:', error);
              // Fallback to demo data
              this.children = this.children.filter(child => child.id !== childId);
            });
      }
    },

    fetchChildrenData(parentId) {
      // Try to fetch from API
      axios.get(`${this.apiBaseUrl}/children/parent/${parentId}`)
          .then(response => {
            this.children = response.data;
          })
          .catch(error => {
            console.error('Error fetching children data:', error);
            // Keep using demo data if API fails
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

.close-button {
  background-color: #ddd;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 4px;
  color: #333;
  margin-top: 20px;
}
</style>