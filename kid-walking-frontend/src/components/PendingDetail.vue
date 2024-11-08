<template>
  <div class="pending-detail">
    <div class="profile-section">
      <div class="header">
        <div class="header-left">
          <img :src="walker.image" alt="Walker Image" class="walker-image" />
          <div class="walker-info">
            <h2>{{ walker.name }}</h2>
            <p>{{ walker.check }}</p>
          </div>
        </div>
        <div class="message">
          <p>{{ message }}</p>
        </div>
        <div class="header-right">
          <div class="rating">
            <span v-for="star in parseInt(walker.rating)" :key="star" class="star">★</span> - {{ walker.rating}}
            <span>({{ walker.ratingCount }})</span>
          </div>
          <div class="button-group">
            <button class="pre-meet" @click="openPreMeetModal">Pre-meet</button>
            <button
                :class="{ 'ready-active': readyForWalkEnabled }"
                :disabled="!readyForWalkEnabled"
                @click="handleReadyForWalk"
            >
              Ready for a walk
            </button>
            <button class="reject" @click="handleReject">Reject</button>
          </div>
        </div>
      </div>
    </div>

    <!-- About Section -->
    <div class="about-section">
      <h3>About</h3>
      <p>{{ walker.about }}</p>
    </div>

    <!-- Reviews Section -->
    <div class="reviews-section">
      <h3>Reviews</h3>
      <div v-if="isLoadingReviews">loading...</div>
      <div v-else-if="errorReviews">{{ errorReviews }}</div>
      <div v-else-if="walker.reviews.length === 0">No reviews available.</div>
      <div v-else>
        <div v-for="review in walker.reviews" :key="review.id" class="review">
          <img :src="review.avatar" alt="User Avatar" class="comment-avatar" />
          <strong>{{ review.firstName }} {{ review.lastName }}</strong> - <span v-for="star in review.ratingValue" :key="star" class="star">★</span> - {{ formatDate(review.commentDate) }}

          <p>{{ review.comments }}</p>
        </div>
      </div>
    </div>


    <!-- Success Alert -->
    <div v-if="showSuccessAlert" class="alert success-alert">You are ready for a walk!</div>

    <!-- Warning Alert -->
    <div v-if="showAlert" class="alert">You must Pre-meet first before Ready for a walk!</div>

    <!-- Pre-meet Modal -->
    <div v-if="showPreMeetModal" class="modal-overlay">
      <div class="modal-content">
        <h2>Pre-meet</h2>
        <img :src="walker.image" alt="Walker Image" class="modal-walker-image" />
        <p class="modal-walker-name">{{ walker.name }}</p>
        <p class="modal-contact">
          <i class="fas fa-phone"></i> {{ walker.phoneNumber }}<br>
          <i class="fas fa-envelope"></i> {{ walker.email }}
        </p>
        <p class="modal-note">
          To ensure the safety of the walk, a pre-meet is recommended.
          Please use the contact provided above to reach out.
        </p>
        <p class="modal-warning">
          Notice: a walk will not be able to start unless both users are "ready for a walk".
        </p>
        <button class="ready-button" @click="confirmReadyForWalk">Ready for a walk</button>
        <button class="close-button" @click="closePreMeetModal">Close</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'PendingDetail',
  inject: ['apiBaseUrl'],
  data() {
    return {
      readyForWalkEnabled: false,
      showAlert: false,
      showSuccessAlert: false,
      showPreMeetModal: false,
      isLoading: false,
      isLoadingReviews: false,
      error: '',
      errorReviews: '',
      walker: {
        name: '',
        check: '',
        rating: 0.0,
        ratingCount: 0,
        about: '',
        reviews: [],
        phoneNumber: '',
        email: '',
        image: '',
        walkerId: null,
      },
      applicationId: null,
      requestId: null,
      message: '',
    };
  },
  mounted() {
    const pathSegments = this.$route.path.split('/');
    this.applicationId = pathSegments[pathSegments.length - 1];
    console.log(this.applicationId);
    this.loadWalkerDetailsAndReviews();
  },
  methods: {
    async loadWalkerDetailsAndReviews() {
      try {
        await this.fetchWalkerDetails();
        await this.fetchWalkerReviews();
        await this.fetchWalkerPhoto();
      } catch (error) {
        console.error('Error loading details and reviews:', error);
      }
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
    async fetchWalkerDetails() {
      if (!this.applicationId) {
        this.error = 'Application ID is missing.';
        return;
      }
      this.isLoading = true;
      try {
        const applicationResponse = await axios.get(`${this.apiBaseUrl}/applications/${this.applicationId}`);
        const applicationData = applicationResponse.data;
        if (applicationData && applicationData.walkerId) {
          this.walker.walkerId = applicationData.walkerId;
          this.requestId = applicationData.requestId;
          this.message = applicationData.description;
          const response = await axios.get(`${this.apiBaseUrl}/user/${this.walker.walkerId}`);
          const userData = response.data;
          if (userData) {
            this.walker = {
              ...this.walker,
              name: `${userData.firstName} ${userData.lastName}`,
              check: userData.workingWithChildrenCheck || 'No check provided',
              about: userData.description || 'No description provided',
              phoneNumber: userData.phoneNumber || 'Not provided',
              email: userData.email || 'Not provided',
            };
            this.fetchWalkerRating(this.walker.walkerId);

          } else {
            this.error = 'Could not find the Walker information.';
          }
        } else {
          this.error = 'Could not find the Walker ID in the application data.';
        }
      } catch (err) {
        console.error(err);
        this.error = 'Failed to load Walker details. Please try again later.';
      } finally {
        this.isLoading = false;
      }
    },
    async fetchWalkerRating(walkerId) {
      try {
        const response = await axios.get(`${this.apiBaseUrl}/agreements/rating/${walkerId}`);
        if (response.data) {
          this.walker.rating = parseInt(response.data.rating*10)/10;// keep one decimal
          this.walker.ratingCount = response.data.ratingNum;
        }
      } catch (err) {
        console.error('Failed to load rating:', err);
      }
    },
    // get walker reviews
    async fetchWalkerReviews() {
      const walkerId = this.walker.walkerId;

      this.isLoadingReviews = true;
      try {
        const response = await axios.get(`${this.apiBaseUrl}/agreements/comments/${walkerId}`);

        if (Array.isArray(response.data)) {
          this.walker.reviews = response.data
              .filter(comment => comment.comments)  // 过滤掉 comments 为空或为 null 的评论
              .map(comment => ({
                id: comment.agreementId,
                firstName: comment.firstName || 'Unknown',
                lastName: comment.lastName || '',
                commentDate: comment.commentDate || 'Unknown Date',
                ratingValue: comment.ratingValue !== null ? parseInt(comment.ratingValue) : 0,
                comments: comment.comments,
                avatar: comment.avatar
              }));
        } else {
          this.errorReviews = 'Could not load reviews data.';
        }
      } catch (err) {
        console.error(err);
        this.errorReviews = 'Could not load reviews data.';
      } finally {
        this.isLoadingReviews = false;
      }
    },
    async fetchWalkerPhoto() {
      try {
        const response = await axios.get(`${this.apiBaseUrl}/user/getPhotoUrl/?userId=${this.walker.walkerId}`);
        const userData = response.data;
        if (userData) {
          this.walker.image = userData;
        }
      } catch (err) {
        console.error('Failed to load walker photo:', err);
      }
    },

    // open Pre-meet modal
    async openPreMeetModal() {
      this.showPreMeetModal = true; // show the Pre-meet modal

      try {
        // Update the application status to "rejected"
        const response = await axios.put(
            `${this.apiBaseUrl}/applications/${this.applicationId}`,
            {
              preMeetScheduled: 1  // Set the status to "1"
            }
        );

        if (response.status === 200) {
          alert('Pre-meet information has been sent to walker!'); // Show a success message
        } else {
          this.error = 'Message sent failed, please try again later.';
        }
      } catch (error) {
        console.error(error);
        this.error = 'Message sent failed, please try again later.';
      }
    },
    // close Pre-meet modal
    closePreMeetModal() {
      this.showPreMeetModal = false; // hide the Pre-meet modal
    },

    // confirm Ready for a walk
    formatDateToMySQL(datetime) {
      return datetime.toISOString().slice(0, 19).replace('T', ' ');
    },

    async confirmReadyForWalk() {
      try {
        // Step 1: Update application status
        const statusResponse = await axios.put(
            `${this.apiBaseUrl}/applications/${this.applicationId}`,
            { applicationStatus: 'agreed' } // Set the application status to "agreed"
        );

        if (statusResponse.status === 200) {
          alert('The ready message has been sent to the walker.');

          // Step 2: Create a new agreement if the status update is successful
          const startTime = this.formatDateToMySQL(new Date());
          const endTime = this.formatDateToMySQL(new Date(new Date().getTime() + 240 * 60 * 60 * 1000)); // 10 days after start

          const agreementResponse = await axios.post(
              `${this.apiBaseUrl}/agreements/create`,
              {
                endTime: endTime,              // Formatted end time
                requestId: this.requestId,     // Use the request ID relevant to this agreement
                startTime: startTime,          // Formatted start time
                status: "agreed",              // Initial status of the agreement
                walkerId: this.walker.walkerId        // Use the walker's ID
              }
          );

          if (agreementResponse.status === 200) {
            alert('The agreement has been created successfully.');
            // Optional: Redirect to another page or refresh
            window.location.href = '/parent-application';
          } else {
            this.error = 'Failed to create agreement, please try again.';
          }
        } else {
          this.error = 'Failed to update application status, please try again later.';
        }
      } catch (error) {
        console.error(error);
        this.error = 'An error occurred, please try again later.';
      }
    },

    // handle Ready for a walk
    handleReadyForWalk() {
      if (!this.readyForWalkEnabled) {
        this.showAlert = true; // show warning message
        setTimeout(() => {
          this.showAlert = false; // hide warning message after 3 seconds
        }, 3000);
      } else {
        this.showSuccessAlert = true; // show success message
        setTimeout(() => {
          this.showSuccessAlert = false; // hide success message after 3 seconds
        }, 3000);
      }
    },
    // 拒绝application
    async handleReject() {

      // Confirmation dialog
      const confirmed = window.confirm("Are you sure you want to reject this application?");
      if (!confirmed) {
        return; // If the user cancels, exit the function
      }

      try {
        // Update the application status to "rejected"
        const response = await axios.put(
            `${this.apiBaseUrl}/applications/${this.applicationId}`,
            {
              applicationStatus: 'rejected'  // Set the status to rejected
            }
        );

        if (response.status === 200) {
          alert('Successful rejection!'); // Show a success message
          // Optional: Reload the page or navigate to another page
          window.location.href = '/parent-application'; // Redirect to homepage
        } else {
          this.error = 'Refusal request failed, please try again later.';
        }
      } catch (error) {
        console.error(error);
        this.error = 'Refusal request failed, please try again later.';
      }
    },


    // get agreement ID
    getAgreementId() {
      return this.$route.params.agreementId || localStorage.getItem('agreementId');
    },
  },
};
</script>

<style scoped>
.pending-detail {
  padding: 20px;
  width: 100vw;
  max-width: 1200px;
  box-sizing: border-box;
}

.profile-section {
  background-color: #fff7e6;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
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

.walker-info h2 {
  margin: 0;
}

.header-right {
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* left justification */
  margin-right: 90px; /* Move a little to the left. */
}

.rating {
  display: flex;
  align-items: center;
  margin-bottom: 10px; /* Adding a bottom margin */
}

.star {
  color: #ffaa00;
  margin-right: 2px;
}

.button-group {
  display: flex;
  flex-direction: column; /* vertical alignment */
  align-items: flex-start; /* left justification */
  width: 220px; /* Set the width of the button group */
}

.button-group button {
  margin-bottom: 10px; /* Spacing between buttons */
  width: 100%; /* The buttons take up the full width of the container, making sure the length is consistent */
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.pre-meet {
  background-color: #ffaa00;
  color: white;
}

.ready-active {
  background-color: #ffaa00;
  color: white;
}

button[disabled] {
  background-color: #ddd;
  color: #999;
  cursor: not-allowed;
}

.reject {
  background-color: black;
  color: white;
}

.about-section,
.reviews-section {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.alert {
  margin-top: 20px;
  background-color: #ffc107;
  padding: 15px;
  border-radius: 4px;
  color: black;
  text-align: center;
  font-weight: bold;
}

.success-alert {
  background-color: #28a745;
}

/* Pre-meet Modal box styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%; /* Make sure to cover the entire width of the screen */
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  width: 600px; /* Set the width of the popup window to 600px */
  max-width: 90%; /* Ensure that the maximum width of the pop-up window on a small screen is 90% */
  height: auto; /* Height adapts to content */
  text-align: left; /* Make sure the text is left-aligned */
}

.modal-walker-image {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-bottom: 10px;
}

.modal-walker-name {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.modal-contact {
  font-size: 14px;
  margin-bottom: 20px;
}

.modal-note {
  font-size: 14px;
  color: #555;
  margin-bottom: 10px;
}

.modal-warning {
  font-size: 14px;
  font-weight: bold;
  color: #ff0000;
}

.ready-button {
  background-color: #ffaa00;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: white;
  margin: 10px;
}

.close-button {
  background-color: #ccc;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: white;
  margin: 10px;
}

.review {
  margin-bottom: 15px;
}

.stars {
  display: flex;
  margin-bottom: 5px;
}

.comment-avatar{
  width: 3%;
  height: 3%;
  border-radius: 50%;
  margin-right: 10px;
}
</style>
