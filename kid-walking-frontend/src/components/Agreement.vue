<template>
  <div class="my-agreement">
    <div class="content">
    <template v-if="isLoading">
      <p>loading...</p>
    </template>

    <template v-else-if="errorMessage">
      <p class="error-message">{{ errorMessage }}</p>
    </template>

    <template v-else-if="!selectedAgreement && !showRating">
      <div class="banner">My Agreement</div>
      <div class="agreement-list">
        <div v-for="agreement in agreements" :key="agreement.id" class="agreement-card">
          <img :src="agreement.image" :alt="agreement.name" class="agreement-image">
          <div class="agreement-content">
            <p class="agreement-description">{{ agreement.description }}</p>
            <p v-if="agreement.startTime" class="agreement-date">{{ "Start Time: "+agreement.startTime }}</p>
          </div>
          <div class="agreement-status-container">
            <p class="agreement-status">
              {{ agreement.status }}
            </p>
            <button v-if="agreement.status !== 'Cancelled' && agreement.status !== 'Completed'" @click="showDetails(agreement)" class="details-button">
              Details
            </button>
            <button v-if="agreement.status === 'Completed'" @click="showRatingForm(agreement)" class="rate-button">
              Rate your agreement
            </button>
          </div>
        </div>
      </div>
    </template>

    <template v-else-if="showRating">
      <div class="rating-form">
        <h2>Rate your Agreement</h2>
        <div class="rating">
          <span v-for="n in 5" :key="n" class="star" :class="{ 'filled': n <= rating }" @click="setRating(n)">★</span>
        </div>
        <textarea v-model="review" placeholder="Write your review here..." rows="4" class="review-input"></textarea>
        <button @click="submitRating" class="submit-button">Submit</button>
        <button @click="cancelRating" class="cancel-button">Cancel</button>
      </div>
    </template>

    <template v-else>
      <div v-if="selectedAgreement.status === 'agreed'" class="agreement-details agreed">
        <div class="user-info-details">
          <img :src="selectedAgreement.image" :alt="selectedAgreement.name" class="user-image-large">
          <div>
            <h3 class="user-name-large">{{ selectedAgreement.name }}</h3>
            <div class="rating">
              <span v-for="n in 5" :key="n" class="star" :class="{ 'filled': n <= selectedAgreement.walkerRating }">★</span>
              <span class="rating-count">({{ selectedAgreement.ratingCount }})</span>
            </div>
          </div>
        </div>
        <div class="contact-info">
          <p><span class="icon">✉</span> {{selectedAgreement.email}}</p>
          <p><span class="icon">☎</span> {{selectedAgreement.phoneNumber}}</p>
        </div>
        <button @click="cancelDetails" class="cancel-button">Cancel</button>
      </div>

      <!-- 使用子组件 代替原来的 in progress 页面 -->
      <div v-else-if="selectedAgreement.status === 'In Progress'">
        <div class="map-container">
          <div ref="map" class="map"></div>
          <MapPage :agreement="selectedAgreement" @cancel="cancel(selectedAgreement.agreementId)" @goBack="goBack()"/>
        </div>
      </div>
    </template>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import MapPage from "./MapPage.vue";

export default {
  name: 'MyAgreement',
  components: {
    MapPage,
  },
  inject: ['apiBaseUrl'],
  data() {
    return {
      agreements: [],
      selectedAgreement: null,
      showRating: false,
      rating: 0,
      review: '',
      isLoading: false,
      errorMessage: '',
      updateAgreement: {},
    };
  },
  mounted() {
    this.fetchAgreements();
  },
  methods: {
    goBack() {
      this.selectedAgreement = null;
      this.$router.push('/agreement');
    },
    showDetails(agreement) {
      this.selectedAgreement = agreement;
    },
    cancelDetails() {
      this.selectedAgreement = null;
    },
    showRatingForm(agreement) {
      this.selectedAgreement = agreement;
      this.showRating = true;
    },
    setRating(value) {
      this.rating = value;
    },
    async submitRating() {
      if (!this.rating) {
        this.errorMessage = 'Please select a rating before submitting.';
        return;
      }

      const agreementId = this.selectedAgreement.agreementId;
      this.isLoading = true;
      //读取现有数据
      try {
        const response = await axios.get(`${this.apiBaseUrl}/agreements/${agreementId}`);
        this.updateAgreement = response.data;
        console.log('Agreement data:', this.updateAgreement);
      } catch (error) {
        console.error('Error fetching agreement:', error);
        this.errorMessage = 'Failed to fetch agreement data. Please try again later.';
        this.isLoading = false;
        return;
      }
      if (this.updateAgreement.ratingValue) {
        this.errorMessage = 'You have already rated this agreement.';
        this.isLoading = false;
        return;
      }
      try {
        await axios.put(`${this.apiBaseUrl}/agreements/${agreementId}`, {
          ...this.updateAgreement,
          ratingValue: this.rating,
          comments: this.review
        });
        // 假设后端返回成功消息
        alert('Thanks for your rating!');
        // 可以根据需要更新协议状态或其他数据
        this.cancelRating();
      } catch (error) {
        console.error('Error submitting rating:', error);
        this.errorMessage = 'Failed to submit rating. Please try again later.';
      } finally {
        this.updateAgreement = {};
        this.isLoading = false;
      }
    },
    cancelRating() {
      this.showRating = false;
      this.selectedAgreement = null;
      this.rating = 0;
      this.review = '';
      this.errorMessage = '';
    },

    // get agreements
    async fetchAgreements() {
      const parentId = localStorage.getItem('userId'); // 假设您使用 userId 作为 walker_id
      if (!parentId) {
        this.errorMessage = '未找到用户ID，请先登录。';
        return;
      }

      this.isLoading = true;
      try {
        const response = await axios.get(`${this.apiBaseUrl}/agreements/listByParent/${parentId}`);
        console.log(response.data);
        this.agreements = response.data.map(agreement => ({
          ...agreement,

          showDetails: agreement.status !== 'Cancelled' // 仅在特定状态时显示按钮
        }));

        // get Walker avatar
        await Promise.all(
            this.agreements.map(async (agreement) => {
              const response = await axios.get(`${this.apiBaseUrl}/user/getPhotoUrl/?userId=${agreement.walkerId}`);
              agreement.image = response.data;
            })
        );

        // get Walker name, email, phone number
        await Promise.all(
            this.agreements.map(async (agreement) => {
              const response = await axios.get(`${this.apiBaseUrl}/user/${agreement.walkerId}`);
              agreement.name = response.data.firstName+" "+response.data.lastName;
              agreement.email = response.data.email;
              agreement.phoneNumber = response.data.phoneNumber;
            })
        );

        // get Walker rating
        await Promise.all(
            this.agreements.map(async (agreement) => {
              const response = await axios.get(`${this.apiBaseUrl}/agreements/rating/${agreement.walkerId}`);
              agreement.walkerRating = response.data.rating;
              agreement.ratingCount = response.data.ratingNum;
            })
        );

      } catch (error) {
        console.error('Error fetching agreements:', error);
      } finally {
        this.isLoading = false;
      }
    },
    cancel(agreementId) {
      // Ask for confirmation before canceling the agreement
      if (!confirm('Are you sure you want to cancel this agreement? This action cannot be undone.')) {
        return;
      }

      // get agreement data
      axios.get(`${this.apiBaseUrl}/agreements/${agreementId}`)
          .then(response => {
            // save agreement data
            this.agreement = response.data;

            // set agreement status to "Cancelled"
            this.agreement.status = "Cancelled";

            // send updated agreement data to the server
            axios.put(`${this.apiBaseUrl}/agreements/${agreementId}`, this.agreement)
                .then(updateResponse => {
                  console.log('Agreement updated successfully:', updateResponse.data);
                  this.selectedAgreement = null;
                  // 可以在这里更新界面
                  this.fetchAgreements();
                })
                .catch(updateError => {
                  console.error('Error updating agreement:', updateError);
                });
            // stop sharing location
            if(this.$refs.map.sharing){
              this.$refs.map.stopSharingLocation();
              this.$refs.map.sharing = false;
            }
          })
          .catch(error => {
            console.error('Error fetching agreements:', error);
          });
    },
  }
};
</script>

<style scoped>
.my-agreement {
  font-family: Arial, sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 0px;
  width: 70%;
}

.agreement-card {
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 8px;
  margin-bottom: 15px;
  padding: 15px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.agreement-status {
  font-size: 14px;
  font-weight: bold;
  margin: 0;
  color: #000000;
}

.details-button, .rate-button {
  background-color: #FFAA00;
  color: black;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  margin-top: auto;
}

.agreement-details {
  border: 1px solid #ddd;
  padding: 30px;
  border-radius: 8px;
}

.agreement-details.agreed {
  width: 100%;
}

.user-info-details {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.user-image-large {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-right: 20px;
}

.user-name-large {
  font-size: 24px;
  margin: 0;
}

.rating {
  display: flex;
  margin-top: 5px;
}

.star {
  color: #ccc;
  font-size: 24px;
  cursor: pointer;
}

.star.filled {
  color: #FFAA00;
}

.contact-info {
  margin-top: 20px;
}

.contact-info p {
  margin: 10px 0;
  font-size: 18px;
}

.cancel-button {
  background-color: #000;
  color: #fff;
  border: none;
  padding: 15px 20px;
  margin-top: 30px;
  cursor: pointer;
  width: 100%;
  font-size: 18px;
  border-radius: 4px;
}

.icon {
  margin-right: 10px;
  font-size: 20px;
}

.agreement-details{
  border: none;
  padding: 0;
}


.user-name-large {
  font-size: 1.2em;
  font-weight: bold;
  text-align: center;
  margin-bottom: 10px;
}


.contact-info p, .address-info p {
  margin: 10px 0;
  display: flex;
  align-items: center;
}
.icon {
  margin-right: 5px;
}

.map-container {
  flex: 3;
  height: 100%;
  background-color: #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
}

.agreement-description {
  margin: 0 0 5px 0;
  font-size: 16px;
  line-height: 1.3;
}

.agreement-content {
  flex: 1;
}

.agreement-list {
  padding: 0 15px;
}

.banner {
  background-color: #FFAA00;
  color: black;
  padding: 10px 15px;
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 20px;
}

.agreement-image {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 15px;
}

.agreement-date {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.agreement-status-container {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  height: 100%;
  min-width: 80px;
}

@media (max-width: 768px) {
  .my-agreement {
    max-width: 100%;
    width: 90%;
  }

  .agreement-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .agreement-image {
    margin-bottom: 10px;
  }

  .agreement-status-container {
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    margin-top: 10px;
  }

  .details-button {
    margin-top: 0;
  }
}
</style>
