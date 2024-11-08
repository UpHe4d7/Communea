<template>
  <div class="walker-agreement-details">
    <header class="header">
    </header>
    <div class="content">
      <!-- before start page -->
      <div v-if="agreementDetail.status === 'agreed'" class="parent-contact">
        <div class="banner">Parent contact</div>
        <div class="contact-card">
          <img :src="agreementDetail.avatar" :alt="agreementDetail.firstName" class="contact-image">
          <h2 class="contact-name">{{ agreementDetail.firstName+" "+agreementDetail.lastName }}</h2>
          <div class="contact-info">
            <p><span class="icon">👤</span> Child: {{ agreementDetail.childName }}</p>
            <p><span class="icon">🏠</span> Home: {{ agreementDetail.pickupAddress }}</p>
            <p><span class="icon">📍</span> Destination: {{ agreementDetail.dropoffAddress }}</p>
            <p><span class="icon">✉️</span> Email: {{ agreementDetail.email }}</p>
            <p><span class="icon">📞</span> Phone: {{ agreementDetail.phoneNumber }}</p>
          </div>
          <div class="action-buttons">
            <button class="start-walk" @click="startWalk(this.agreementId)">Start a walk</button>
            <button class="cancel" @click="cancel(this.agreementId)">Cancel</button>
          </div>
        </div>
      </div>

      <!-- in progress page -->
      <div v-if="agreementDetail.status === 'In Progress'" class="route-view">
        <div class="route-content">
          <!--div class="info-card">
            <img :src="agreementDetail.avatar" :alt="agreementDetail.firstname" class="user-image">
            <h2 class="user-name">{{ agreementDetail.firstName+" "+agreementDetail.lastName }}</h2>
            <p class="route-info">{{ agreementDetail.trackingData }}</p>
            <div class="address-info">
              <p><span class="icon">🏠</span> {{ agreementDetail.pickupAddress }}</p>
              <p><span class="icon">📍</span> {{ agreementDetail.dropoffAddress }}</p>
            </div>
            <div class="action-buttons">
              <button class="start-walk" @click="finish(this.agreementId)">Finish</button>
              <button class="cancel" @click="cancel(this.agreementId)">Cancel</button>
            </div>
          </div-->
          <div class="map-container">
            <div ref="map" class="map"></div>
            <WalkerMap :agreement="agreementDetail"
                       @cancel="cancel(this.agreementId)"
                       @finish="finish(this.agreementId)"
                       @goBack="goBack()"
            />
          </div>
        </div>
      </div>

      <!-- Completed status view -->
      <div v-if="agreementDetail.status === 'Completed'" class="completed-view">
        <div class="completed-card">
          <img :src="agreementDetail.avatar" :alt="agreementDetail.firstName" class="contact-image">
          <h2 class="contact-name">{{ agreementDetail.firstName + " " + agreementDetail.lastName }}</h2>
          <div class="feedback-info">
            <p class="contact-card">{{ agreementDetail.comments }}</p>
            <p class="contact-card">Rating: {{ agreementDetail.ratingValue }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import WalkerMap from "@/components/WalkerMap.vue";
export default {
  components: {WalkerMap},
  inject: ['apiBaseUrl'],
  name: 'WalkerAgreementDetails',
  data() {
    return {
      //agreementId: '',
      agreementDetail: {
        avatar: '/images/image1.jpg'
      },
      agreement: {}
    }
  },
  methods: {
    goBack() {
      this.$router.push({ name: 'WalkerMyAgreement' });
    },
    fetchAgreement(agreementId) {
      console.log(agreementId);
      axios.get(`${this.apiBaseUrl}/agreements/detail/${agreementId}`)
          .then(response => {
            this.agreementDetail = response.data;
            console.log(this.agreementDetail);
          })
          .catch(error => {
            console.error('Error fetching agreementDetail:', error);
          });
    },
    startWalk(agreementId) {
      // get the agreement details first
      axios.get(`${this.apiBaseUrl}/agreements/${agreementId}`)
          .then(response => {
            // store the agreement data in this.agreement
            this.agreement = response.data;

            // change the status of the agreement
            this.agreement.status = "In Progress";

            // get the current time
            const now = new Date();

            // format as MySQL DATETIME format
            const formattedDate = now.getFullYear() +
                '-' + String(now.getMonth() + 1).padStart(2, '0') +
                '-' + String(now.getDate()).padStart(2, '0') +
                ' ' + String(now.getHours()).padStart(2, '0') +
                ':' + String(now.getMinutes()).padStart(2, '0') +
                ':' + String(now.getSeconds()).padStart(2, '0');

            // assign the formatted time
            this.agreement.endTime = formattedDate;

            // send a PUT request to update the modified agreement data
            axios.put(`${this.apiBaseUrl}/agreements/${agreementId}`, this.agreement)
                .then(updateResponse => {
                  console.log('Agreement updated successfully:', updateResponse.data);
                  this.$router.push({ name: 'WalkerMyAgreement'});
                })
                .catch(updateError => {
                  console.error('Error updating agreement:', updateError);
                });
            // refresh the agreement data
            this.fetchAgreement(agreementId);

            //start sharing location
            this.$refs.map.startSharingLocation();
            this.$refs.map.sharing = true;

          })
          .catch(error => {
            console.error('Error fetching agreements:', error);
          });
    },


    cancel(agreementId) {
      // confirm if the user wants to cancel the agreement
      if (!confirm('Are you sure you want to cancel this agreement? This action cannot be undone.')) {
        return;
      }
      // get the agreement first
      axios.get(`${this.apiBaseUrl}/agreements/${agreementId}`)
          .then(response => {
            // store the agreement data in this.agreement
            this.agreement = response.data;

            // set the status of the agreement to Cancelled
            this.agreement.status = "Cancelled";

            // send a PUT request to update the modified agreement data
            axios.put(`${this.apiBaseUrl}/agreements/${agreementId}`, this.agreement)
                .then(updateResponse => {
                  console.log('Agreement updated successfully:', updateResponse.data);
                  this.$router.push({ name: 'WalkerMyAgreement'});
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
    finish(agreementId) {
      axios.get(`${this.apiBaseUrl}/agreements/${agreementId}`)
          .then(response => {
            this.agreement = response.data;

            this.agreement.status = "Completed";

            const now = new Date();

            const formattedDate = now.getFullYear() +
                '-' + String(now.getMonth() + 1).padStart(2, '0') +
                '-' + String(now.getDate()).padStart(2, '0') +
                ' ' + String(now.getHours()).padStart(2, '0') +
                ':' + String(now.getMinutes()).padStart(2, '0') +
                ':' + String(now.getSeconds()).padStart(2, '0');

            this.agreement.endTime = formattedDate;

            axios.put(`${this.apiBaseUrl}/agreements/${agreementId}`, this.agreement)
                .then(updateResponse => {
                  console.log('Agreement updated successfully:', updateResponse.data);
                  this.$router.push({ name: 'WalkerMyAgreement'});
                })
                .catch(updateError => {
                  console.error('Error updating agreement:', updateError);
                });
            if(this.$refs.map.sharing){
              this.$refs.map.stopSharingLocation();
              this.$refs.map.sharing = false;
            }
          })
          .catch(error => {
            console.error('Error fetching agreements:', error);
          });
    }

  },
  mounted() {
    this.agreementId = this.$route.params.id;
    this.fetchAgreement(this.agreementId);
  }
}
</script>

<style scoped>
.walker-agreement-details {
  font-family: Arial, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  width: 80%;
  height: 50%;
}

.header {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #e0e0e0;
}

.menu-button {
  background: none;
  border: none;
  font-size: 24px;
  margin-right: 15px;
  cursor: pointer;
}

.logo {
  font-size: 20px;
  font-weight: bold;
  margin: 0;
}

.logo::first-letter {
  color: #0A2640;
}

.banner {
  background-color: #0A2640;
  color: white;
  padding: 10px 15px;
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 20px;
}

/* Styles for parent contact view */
.contact-card {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  max-width: 600px;
  margin: 0 auto;
}

.contact-image, .user-image {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin: 0 auto 15px;
  display: block;
}

.contact-name, .user-name {
  text-align: center;
  margin-bottom: 20px;
}

.contact-info p, .address-info p {
  margin: 10px 0;
  display: flex;
  align-items: center;
}

.icon {
  margin-right: 10px;
  font-size: 20px;
}

.action-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.start-walk, .cancel {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
}

.start-walk {
  background-color: #0A2640;
  color: white;
}

.cancel {
  background-color: black;
  color: white;
}

/* Styles for map view */
.route-view {
  display: flex;
  flex-direction: column;
}

.back-button {
  cursor: pointer;
  margin: 20px 0;
  font-size: 16px;
}

.route-content {
  display: flex;
  gap: 20px;
}

.info-card {
  flex: 1;
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.route-info {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
}

.map-container {
  flex: 2;
  height: 800px;
  background-color: #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
}

.map-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>