<!-- PreMeetModal.vue -->
<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <h2>Pre-meet</h2>
      <img :src="walker.image" alt="Walker Image" class="modal-walker-image" />
      <p class="modal-walker-name">{{ walker.name }}</p>
      <p class="modal-contact">
        <i class="fas fa-phone"></i> {{ walker.phone }}<br />
        <i class="fas fa-envelope"></i> {{ walker.email }}
      </p>
      <p class="modal-note">
        To ensure the safety of the walk, a pre-meet is recommended.
        Please use the contact provided above to reach out.
      </p>
      <p class="modal-warning">
        Notice: a walk will not be able to start unless both users are "ready for a walk".
      </p>

      <div v-if="isLoading" class="loading">
        <p>正在处理...</p>
      </div>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

      <button class="ready-button" @click="confirmReadyForWalk" :disabled="isLoading">
        Ready for a walk
      </button>
      <button class="close-button" @click="closePreMeetModal" :disabled="isLoading">
        Close
      </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "PreMeetModal",

  // The parent component needs to be passed the 'agreementId' and 'walker' objects
  props: {
    walker: {
      type: Object,
      required: true
    },
    agreementId: {
      type: String,
      required: true
    }
  },

  inject: ['apiBaseUrl'],

  data() {
    return {
      isLoading: false,
      errorMessage: ''
    };
  },

  methods: {
    /**
     * Confirmation of readiness to start walking, update protocol status
     */
    async confirmReadyForWalk() {
      this.isLoading = true;
      this.errorMessage = '';

      try {
        // Build the updated data, assuming we only need to update the 'status' field
        const updateData = {
          status: 'ready for a walk'
        };

        // Send PUT request to update protocol status
        const response = await axios.put(`${this.apiBaseUrl}/agreements/${this.agreementId}`, updateData);

        // Assuming the backend returns the updated protocol object
        if (response.status === 200) {
          // 可以根据需要进一步处理响应，例如通知父组件
          this.$emit('readyConfirmed', response.data);

          // Close the modal box or perform other actions
          this.closePreMeetModal();
        } else {
          this.errorMessage = '更新状态失败，请稍后再试。';
        }
      } catch (error) {
        console.error('Error updating agreement status:', error);
        this.errorMessage = '更新状态时发生错误，请检查网络或稍后再试。';
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Close the preview modal box
     */
    closePreMeetModal() {
      // Notify the parent component to close the modal box via an event
      this.$emit('closeModal');

    }
  }
};
</script>

<style scoped>
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
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  width: 400px;
  text-align: center;
  position: relative;
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

.ready-button:disabled {
  background-color: #ddd;
  cursor: not-allowed;
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

.close-button:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}

.loading {
  margin-bottom: 10px;
  color: #ffaa00;
}

.error-message {
  color: #ff0000;
  margin-bottom: 10px;
}
</style>
