<template>
  <div class="my-ratings">
    <div class="content">
      <div class="banner">My Ratings</div>
      <div class="rating-summary">
        <img :src="currentUser.avatar" :alt="currentUser.name" class="user-avatar">
        <div class="star-rating">
          <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= rating.rating }">★</span>
          <span class="rating-count">({{ rating.ratingNum }})</span>
        </div>
      </div>
      <div class="rating-list">
        <div v-for="comment in comments" :key="comment.agreementId" class="rating-card">
          <img :src="comment.avatar" :alt="comment.lastName" class="rater-avatar">
          <div class="rating-info">
            <p class="rater-name">{{ comment.firstName +" "+ comment.lastName }}</p>
            <p class="rating-date">{{ comment.commentDate }}</p>
          </div>
          <div class="star-rating">
            <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= comment.ratingValue }">★</span>
          </div>
          <button class="details-button" @click="showDetails(comment)">Details</button>
        </div>
      </div>
    </div>
    <div v-if="selectedComment" class="details-overlay" @click="closeDetails">
      <div class="details-content" @click.stop>
        <button class="close-button" @click="closeDetails">&times;</button>
        <div class="rating-details">
          <div class="rater-info">
            <img :src="selectedComment.avatar" :alt="selectedComment.name" class="rater-avatar">
            <div class="rater-name-date">
              <h2 class="rater-name">{{ selectedComment.firstName +" "+ selectedComment.lastName }}</h2>
              <p class="rating-date">{{ selectedComment.commentDate }}</p>
            </div>
            <div class="star-rating">
              <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= selectedComment.ratingValue }">★</span>
            </div>
          </div>
          <p class="rating-comment">{{ selectedComment.comments }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  inject: ['apiBaseUrl'],
  name: 'WalkerMyRatings',
  data() {
    return {
      currentUser: {
        avatar: '',
        name: 'Current User',
      },
      comments: [],
      selectedComment: null,
      rating: {}
    }
  },
  methods: {
    fetchUserPhoto(userId) {

      console.log(userId);
      axios.get(`${this.apiBaseUrl}/user/getPhotoUrl/?userId=${userId}`)
          .then(response => {
            this.currentUser.avatar = response.data;
          })
          .catch(error => {
            console.error('Error fetching user photo:', error);
          });
    },
    fetchComments() {
      const userId = localStorage.getItem('userId');
      axios.get(`${this.apiBaseUrl}/agreements/comments/${userId}`)
          .then(response => {
            this.comments = response.data;
            //筛去ratingValue为null的数据
            this.comments = this.comments.filter(item => item.ratingValue !== null);
            console.log(this.comments)
          })
          .catch(error => {
            console.error('Error fetching comments:', error);
          });
    },
    fetchRating() {
      const userId = localStorage.getItem('userId');
      axios.get(`${this.apiBaseUrl}/agreements/rating/${userId}`)
          .then(response => {
            this.rating = response.data;
            console.log(this.rating)
          })
          .catch(error => {
            console.error('Error fetching ratings:', error);
          });
    },
    showDetails(comment) {
      this.selectedComment = comment;
    },
    closeDetails() {
      this.selectedComment = null;
    }
  },
  mounted() {
    this.fetchComments();
    this.fetchRating();
    this.fetchUserPhoto(localStorage.getItem('userId'));
  }
}
</script>

<style scoped>
.my-ratings {
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

.content {
  padding: 0 15px;
}

.rating-summary {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.user-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 15px;
}

.star-rating {
  font-size: 24px;
}

.star {
  color: #ccc;
}

.star.filled {
  color: #FFAA00;
}

.rating-count {
  font-size: 16px;
  color: #666;
  margin-left: 5px;
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

.rater-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 15px;
}

.rating-info {
  flex: 1;
}

.rater-name {
  margin: 0;
  font-weight: bold;
  font-size: 16px;
}

.rating-date {
  margin: 5px 0 0;
  font-size: 14px;
  color: #666;
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
}

.details-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.details-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 600px;
  width: 90%;
  max-height: 90%;
  overflow-y: auto;
  position: relative;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  background: none;
  border: none;
  cursor: pointer;
}

.rating-details {
  padding-top: 20px;
}

.rating-details .rater-info {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.rating-details .rater-avatar {
  width: 60px;
  height: 60px;
}

.rating-details .rater-name-date {
  flex: 1;
  margin-left: 15px;
}

.rating-details .rater-name {
  margin: 0;
  font-size: 18px;
}

.rating-details .rating-date {
  margin: 5px 0 0;
}

.rating-details .star-rating {
  font-size: 20px;
}

.rating-comment {
  font-size: 16px;
  line-height: 1.5;
  margin: 0;
}

@media (max-width: 768px) {
  .my-ratings {
    max-width: 100%;
    width: 90%;
  }

  .user-avatar {
    width: 60px;
    height: 60px;
  }

  .star-rating {
    font-size: 20px;
  }

  .rating-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .rater-avatar {
    margin-bottom: 10px;
  }

  .details-button {
    margin-top: 10px;
    align-self: flex-end;
  }
}
</style>