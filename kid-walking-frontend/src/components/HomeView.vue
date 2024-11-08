<template>
  <div class="home-view">
    <div class="content-wrapper">
      <div class="statistics">
        <p><strong>{{ walkers.length }}</strong> Walkers results nearby ({{ filter.radius }} km)</p>
        <a href="#" class="filter" @click.prevent="showFilterModal = true">+ Filter</a>
      </div>

      <!-- loding and error -->
      <div v-if="isLoading" class="loading">
        <p>loading...</p>
      </div>
      <div v-else-if="errorMessage" class="error">
        <p>{{ errorMessage }}</p>
      </div>

      <!-- Walker list -->
      <div v-else class="results-list">
        <!-- add click for each walker -->
        <div class="result-item" v-for="walker in walkers" :key="walker.userId" @click="goToDetail(walker.userId)">
          <img :src="walker.image" alt="Walker Image" class="walker-image" />
          <div class="walker-info">
            <h2>{{ walker.name }}</h2>
            <p class="location">Distacnce: {{  Math.round(walker.distance/10)/100 }} KM</p>

              <div class="rating">
                <!--span v-for="star in walker.rating" :key="star" class="star">★</span-->
                <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= Math.round(walker.rating) }">★ </span>
                <!--保留一位小数-->
                {{Math.round(walker.rating * 10) / 10}}
                <!--span v-for="n in (5 - walker.rating)" :key="n" class="star empty">☆</span-->
                <span class="rating-count">({{ walker.ratingCount }})</span>
              </div>
              <div class="age-label">Age: {{ walker.age }}</div>

            <p class="description">Description: {{ walker.description }}</p>
          </div>
        </div>
      </div>

      <!-- If open filter modal -->
      <div v-if="showFilterModal" class="modal-overlay" @click.self="showFilterModal = false">
        <div class="filter-modal">
          <h3>Filter Options</h3>
          <form @submit.prevent="applyFilter">
            <div class="form-group">
              <label for="radius">Radius (km):</label>
              <select v-model="filter.radius" id="radius">
                <option value="2">2 km</option>
                <option value="3">3 km</option>
                <option value="5">5 km</option>
              </select>
            </div>

            <button type="submit">Apply</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'HomeView',
  inject: ['apiBaseUrl'],
  data() {
    return {
      userId: '',
      walkers: [
        // default data
        {
          userId: '1',
          name: 'Mia D.',
          location: 'Paddington, Sydney',
          rating: 4,
          ratingCount: 6,
          age: 54,
          description: "Hello parents! As an experienced Walker with a valid Working with Children Check and years of childcare experience...",
          image: '/images/image1.jpg'
        },
        {
          userId: '2',
          name: 'Vienna I.',
          location: 'Ashfield, Ashfield',
          rating: 5,
          ratingCount: 1,
          age: 30,
          description: "Early started until 6pm. Long hours daily ONLY. English / Mandarin / Cantonese Speaker...",
          image: '/images/image2.jpg'
        }
      ],
      showFilterModal: false,
      filter: {
        radius: '5'        // 默认半径
      },
      isLoading: false,
      errorMessage: '',
    };
  },
  mounted() {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      this.userId = storedUserId; // restore userId from localStorage
      console.log('User ID:', this.userId);
      this.fetchWalkers(); // get walkers nearby
    } else {
      // redirect to login page if userId is not found
      window.location.href = '/login';
    }
  },
  methods: {
    /**
     * Fetch walkers from API
     */
    async fetchWalkers() {
      this.isLoading = true;
      this.errorMessage = '';
      try {
        // Fetch walkers from API with radius filter and userId
        const response = await axios.get(`${this.apiBaseUrl}/user/nearby-walkers`, {
          params: {
            rangeInKm: this.filter.radius,
            userId: this.userId
          }
        });
        if (Array.isArray(response.data)) {
          // Update walkers with response data
          this.walkers = response.data
        } else {
          this.errorMessage = 'No walkers found nearby.';
        }

        // 获取 Walker 头像
        await Promise.all(
            this.walkers.map(async (walker) => {
              const response = await axios.get(`${this.apiBaseUrl}/user/getPhotoUrl/?userId=${walker.userId}`);
              walker.image = response.data;
              const rateResponse = await axios.get(`${this.apiBaseUrl}/agreements/rating/${walker.userId}`);
              walker.ratingCount = rateResponse.data.ratingNum;
              console.log('Rating:', rateResponse.data.rating);
              walker.rating = rateResponse.data.rating;
            })
        );
      } catch (error) {
        console.error('Error fetching walkers:', error);
        this.errorMessage = 'Error fetching walkers. Please try again later.';
      } finally {
        console.log('Walkers:', this.walkers);
        this.isLoading = false;
      }
    },

    /**
     * Navigate to Walker detail page
     * @param {string} walkerId
     */
    goToDetail(walkerId) {
      // Navigate to Walker detail page with walkerId
      this.$router.push({ name: 'WalkerDetail', params: { id: walkerId } });
    },

    /**
     * Apply filter options
     */
    applyFilter() {
      console.log('Applying filter with:', this.filter);
      this.fetchWalkers(); // Fetch walkers with new filter
      this.showFilterModal = false; // Close filter modal
    }
  }
};
</script>

<style scoped>
.home-view {
  display: flex;
  justify-content: center;
  padding: 20px;
  width: 100%;
  max-width: 800px;
}

.content-wrapper {
  max-width: 800px;
  width: 100%;
  background-color: #fff;
  border: 1px solid #ddd;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.statistics {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.filter {
  color: #ffaa00;
  text-decoration: none;
  cursor: pointer;
}

.results-list {
  display: flex;
  flex-direction: column;
}

.result-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 20px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
  cursor: pointer;
}

.walker-image {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-right: 20px;
  object-fit: cover;
}

.walker-info {
  flex-grow: 1;
}

.walker-info h2 {
  margin: 0;
  font-size: 18px;
}

.location {
  color: #666;
  margin: 5px 0;
}

.rating {
  display: flex;
  align-items: center;
  margin-right: 10px;
}

.star {
  color: #ccc;
}

.star.filled {
  color: #FFAA00;
}

.rating-count {
  margin-left: 5px;
  color: #666;
}

.age-label {
  background-color: #f3f3f3;
  border-radius: 4px;
  padding: 3px 6px;
  font-size: 14px;
  color: #333;
}

.description {
  margin-top: 10px;
  color: #333;
}


.loading, .error {
  text-align: center;
  margin: 20px 0;
  color: #ff0000;
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

.filter-modal {
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  width: 300px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

button {
  padding: 8px 16px;
  background-color: #ffaa00;
  border: none;
  color: #fff;
  cursor: pointer;
  border-radius: 4px;
}

button:hover {
  background-color: #e69500;
}
</style>
