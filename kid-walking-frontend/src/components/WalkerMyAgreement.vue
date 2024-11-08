<template>
  <div class="my-agreement">
    <div class="content">
      <div class="banner">My Agreement</div>
      <div class="agreement-list">
        <div v-for="agreement in agreements" :key="agreement.id" class="agreement-card">
          <img :src="agreement.avatar" :alt="agreement.description" class="agreement-image">
          <div class="agreement-content">
            <p class="agreement-description">{{ agreement.description }}</p>
            <p v-if="agreement.startTime" class="agreement-date">{{ "Start Time: "+agreement.startTime }}</p>
          </div>
          <div class="agreement-status-container">
            <p class="agreement-status">
              {{ agreement.status }}
            </p>
            <button v-if="agreement.showDetails" @click="goToDetails(agreement.agreementId)" class="details-button">Details</button>
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
  name: 'MyAgreement',
  data() {
    return {
      agreements: []
    }
  },
  methods: {
    fetchAgreements() {
      const userId = localStorage.getItem('userId');
      axios.get(`${this.apiBaseUrl}/agreements/comments/${userId}`)
          .then(response => {
            this.agreements = response.data.map(agreement => ({
              ...agreement,
              showDetails: agreement.status !== 'Cancelled' // Show details button only if status is not 'Cancelled'
            }));
          })
          .catch(error => {
            console.error('Error fetching agreements:', error);
          });
    },
    goToDetails(agreementId) {
      this.$router.push({ name: 'WalkerAgreementDetails', params: { id: agreementId} });
    }
  },
  mounted() {
    this.fetchAgreements(); // Fetch applications when component is mounted
  }
}
</script>

<style scoped>
.my-agreement {
  font-family: Arial, sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 0px;
  width: 70%;
}

.banner {
  background-color: #0A2640;
  color: white;
  padding: 10px 15px;
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 20px;
}

.agreement-list {
  padding: 0 15px;
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

.agreement-image {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 15px;
}

.agreement-content {
  flex: 1;
}

.agreement-description {
  margin: 0 0 5px 0;
  font-size: 16px;
  line-height: 1.3;
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

.agreement-status {
  font-size: 14px;
  font-weight: bold;
  margin: 0;
  color: #000000;
}

.details-button {
  background-color: #0A2640;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  margin-top: auto;
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