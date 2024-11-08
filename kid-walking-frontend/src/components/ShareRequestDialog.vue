<!-- ShareRequestDialog.vue -->
<template>
  <div v-if="show" class="dialog-overlay">
    <div class="dialog-content">
      <div class="dialog-header">
        <h2>Share Walk Request</h2>
        <button class="close-button" @click="close">×</button>
      </div>

      <div class="requests-list">
        <div v-if="loading" class="loading">Loading requests...</div>
        <div v-else-if="requests.length === 0" class="no-requests">
          No available requests found.
        </div>
        <div v-else v-for="request in requests"
             :key="request.requestId"
             class="request-item"
             :class="{ selected: selectedRequest === request.requestId }"
             @click="selectRequest(request.requestId)">
          <div class="request-details">
            <div class="request-addresses">
              <div> {{ request.description }}</div>
              <div><strong>Child:</strong> {{ request.childName }}</div>
            </div>
            <div class="request-time">
              <strong>Updated at:</strong> {{ request.updatedAt }}
            </div>
          </div>
        </div>
      </div>

      <div class="dialog-footer">
        <button
            class="cancel-button"
            @click="close">
          Cancel
        </button>
        <button
            class="share-button"
            :disabled="!selectedRequest || sharing"
            @click="shareRequest">
          {{ sharing ? 'Sharing...' : 'Share Request' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ShareRequestDialog',
  inject: ['apiBaseUrl'],
  props: {
    show: {
      type: Boolean,
      default: false
    },
    walkerId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      requests: [],
      selectedRequest: null,
      loading: false,
      sharing: false
    };
  },
  watch: {
    show(newVal) {
      if (newVal) {
        this.fetchRequests();
      }
    }
  },
  methods: {
    async fetchRequests() {
      this.loading = true;
      try {
        const userId = localStorage.getItem('userId');
        const response = await axios.get(`${this.apiBaseUrl}/requests/list/?parentId=${userId}`);
        this.requests = response.data.filter(request => request.status === 'Open');
        await Promise.all(
            this.requests.map(async (post) => {
              const Response = await axios.get(`${this.apiBaseUrl}/children/${post.childId}`);
              post.childName = Response.data.name;
            })
        );
      } catch (error) {
        console.error('Error fetching requests:', error);
      } finally {
        this.loading = false;
      }
    },
    selectRequest(requestId) {
      this.selectedRequest = requestId;
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString();
    },
    async shareRequest() {
      if (!this.selectedRequest) return;
      console.log(this.walkerId);
      this.sharing = true;
      try {
        console.log('Sharing request:', this.selectedRequest);
        await axios.post(`${this.apiBaseUrl}/share-requests`, {
          requestId: this.selectedRequest,
          walkerId: this.walkerId,
          shareStatus: 'Pending',
          parentId: this.requests.find(r => r.requestId === this.selectedRequest)?.parentId
        });

        this.$emit('share-success');
        this.close();
      } catch (error) {
        console.error('Error sharing request:', error);
      } finally {
        this.sharing = false;
      }
    },
    close() {
      this.selectedRequest = null;
      this.$emit('update:show', false);
    }
  }
};
</script>

<style scoped>
.dialog-overlay {
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

.dialog-content {
  background-color: white;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.dialog-header {
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f8f9fa;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.dialog-header h2 {
  margin: 0;
  font-size: 1.25rem;
  color: #333;
  font-weight: 600;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0 8px;
  color: #666;
  transition: color 0.2s;
}

.close-button:hover {
  color: #333;
}

.requests-list {
  padding: 20px;
  overflow-y: auto;
  flex-grow: 1;
}

.request-item {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: #fff;
}

.request-item:hover {
  background-color: #f8f9fa;
  border-color: #ddd;
}

.request-item.selected {
  border-color: #ffaa00;
  background-color: #fff8e6;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.request-details {
  display: grid;
  gap: 10px;
}

.request-addresses {
  display: grid;
  gap: 6px;
  color: #666;
}

.request-date, .request-time {
  color: #333;
}

.dialog-footer {
  padding: 16px 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  background-color: #f8f9fa;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
}

.share-button, .cancel-button {
  padding: 8px 20px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.share-button {
  background-color: #ffaa00;
  color: white;
}

.share-button:hover:not(:disabled) {
  background-color: #ff9900;
}

.share-button:disabled {
  background-color: #ffd580;
  cursor: not-allowed;
}

.cancel-button {
  background-color: #e9ecef;
  color: #495057;
}

.cancel-button:hover {
  background-color: #dee2e6;
}

.loading, .no-requests {
  text-align: center;
  padding: 24px;
  color: #666;
  font-size: 0.95rem;
}
</style>