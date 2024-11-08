<template>
  <div class="walker-detail">
    <!-- 个人资料框 -->
    <div class="profile-section">
      <div class="header">
        <div class="header-left">
          <img :src="walker.avatar" alt="Walker Image" class="walker-image" />
          <div class="walker-info">
            <h2>{{ walker.firstName+" "+walker.lastName }}</h2>
            <p>Police / Working With Children Check</p>
          </div>
        </div>
        <div class="header-right">
          <div class="walker-rating">
            <div class="stars">
              <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= rating.rating }">★</span>
              <span>({{ rating.ratingNum }})</span>
            </div>
            <button class="share-request" @click="openShareDialog">Share Walk Request</button>
          </div>
        </div>
      </div>
    </div>

    <div class="about-section">
      <h3>About</h3>
      <p>{{ walker.description }}</p>
    </div>

    <div class="about-section">
      <h3>Reviews</h3>
      <div v-for="comment in comments" :key="comment.agreementId" class="rating-card">
        <img :src="comment.avatar" :alt="comment.lastName" class="rater-avatar">
        <div class="rating-info">
          <p class="rater-name">{{ comment.firstName +" "+ comment.lastName }}</p>
          <p class="rating-comment">{{ comment.comments }}</p>
          <p class="rating-date">{{ comment.commentDate }}</p>
        </div>
        <div class="star-rating">
          <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= comment.ratingValue }">★</span>
        </div>
      </div>
    </div>

    <ShareRequestDialog
        :show="showShareDialog"
        :walker-id="id"
        @update:show="showShareDialog = $event"
        @share-success="handleShareSuccess"
    />

    <div v-if="showSuccessMessage" class="success-message">
      Walk request shared successfully!
    </div>
  </div>
</template>

<script>
import axios from "axios";
import ShareRequestDialog from './ShareRequestDialog.vue';

export default {
  name: 'WalkerDetail',
  components: {
    ShareRequestDialog
  },
  inject: ['apiBaseUrl'],
  props: ['id'],// walker id from parent component
  data() {
    return {
      walker: {
        avatar:'',
      },
      comments:[],
      rating:{},
      showSuccessMessage: false,
      showShareDialog: false
    };
  },
  mounted() {
    this.fetchWalkerInformation();
  },
  methods: {
    fetchWalkerInformation(){
      axios.get(`${this.apiBaseUrl}/user/${this.id}`)
          .then(response => {
            this.walker = response.data;
            this.fetchPhoto(this.walker.userId);
            this.fetchComments(this.walker.userId);
            this.fetchRating(this.walker.userId);
          })
          .catch(error => {
            console.error('Error fetching walker information:', error);
          });
    },
    fetchPhoto(userId){
      axios.get(`${this.apiBaseUrl}/user/getPhotoUrl/?userId=${userId}`)
          .then(response => {
            this.walker.avatar = response.data;
          })
          .catch(error => {
            console.error('Error fetching walker photo:', error);
          });
    },
    fetchComments(userId) {
      axios.get(`${this.apiBaseUrl}/agreements/comments/${userId}`)
          .then(response => {
            this.comments = response.data;
            this.comments = this.comments.filter(item => item.ratingValue !== null);
          })
          .catch(error => {
            console.error('Error fetching comments:', error);
          });
    },
    fetchRating(userId) {
      axios.get(`${this.apiBaseUrl}/agreements/rating/${userId}`)
          .then(response => {
            this.rating = response.data;
          })
          .catch(error => {
            console.error('Error fetching ratings:', error);
          });
    },
    openShareDialog() {
      this.showShareDialog = true;
    },
    handleShareSuccess() {
      this.showSuccessMessage = true;
      setTimeout(() => {
        this.showSuccessMessage = false;
      }, 3000);
    }
  }
};
</script>

<style scoped>
.walker-detail {
  padding: 20px;
  width: 80%;
  max-width: 1200px;
  box-sizing: border-box;
}


.profile-section,
.about-section,
.reviews-section {
  background-color: #ffffff;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 95%;
  margin-left: auto;
  margin-right: auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
}

.walker-image {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin-right: 20px;
}

.walker-info {
  flex-grow: 1;
}

.header-right {
  text-align: right;
}

.walker-rating {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.star {
  color: #ccc;
}

.star.filled {
  color: #FFAA00;
}

.share-request {
  margin-top: 10px;
  background-color: #ffaa00;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.share-request:hover {
  background-color: #e69500;
}

.about-section h3,
.reviews-section h3 {
  font-size: 24px;
  margin-bottom: 10px;
}

.review {
  margin-top: 10px;
}

.review p {
  margin: 5px 0;
}

.review .stars {
  margin-bottom: 5px;
}

.success-message {
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: #4caf50;
  color: white;
  padding: 15px 20px;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  animation: fadein 0.5s, fadeout 0.5s 2.5s;
}

/* 动画效果 */
@keyframes fadein {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeout {
  from { opacity: 1; }
  to { opacity: 0; }
}

.rating-comment {
  font-size: 16px;
  line-height: 1.5;
  margin: 0;
}

.rater-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 15px;
}

.rating-card {
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 8px;
  margin-bottom: 15px;
  padding: 15px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
</style>
