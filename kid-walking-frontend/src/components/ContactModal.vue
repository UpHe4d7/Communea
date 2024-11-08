<template>
  <div class="modal-overlay" v-if="show">
    <div class="modal-content">
      <button class="close-btn" @click="closeModal">&times;</button>
      <h2 class="modal-title">Contact Information</h2>
      <p class="modal-text">You can reach us at:</p>
      <p class="modal-email">cyao0459@uni.sydney.edu.au</p>
      <button class="modal-save-btn" @click="closeModal">Close</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContactModal',
  props: {
    show: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    closeModal() {
      this.$emit('close');
    }
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  padding: 2rem;
  width: 400px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  text-align: center;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #333;
  cursor: pointer;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #333;
}

.modal-text {
  font-size: 1rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.modal-email {
  font-size: 1.2rem;
  color: #14213d;
  font-weight: bold;
  margin-bottom: 2rem;
}

.modal-save-btn {
  background-color: #14213d;
  color: #fff;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
}

.modal-save-btn:hover {
  background-color: #1d3557;
}
</style>
