<template>
  <div v-if="isOpen" class="modal-overlay">
    <div class="modal-content">
      <div class="modal-header">
        <h2>{{ title }}</h2>
        <button class="close-button" @click="close">×</button>
      </div>
      <p class="modal-text">
        To complete the verification please enter the six digit code
        that was sent {{ isEmail ? 'to your email' : 'by SMS to your mobile phone' }}.
      </p>
      <div class="verification-input">
        <input
            v-for="(digit, index) in 6"
            :key="index"
            type="text"
            maxlength="1"
            v-model="code[index]"
            @input="onInput(index)"
            ref="inputs"
        />
      </div>
      <div class="modal-actions">
        <button class="submit-button" @click="submit">Submit</button>
        <button class="cancel-button" @click="close">Cancel</button>
      </div>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script>

export default {

  inject: ['apiBaseUrl'],
  name: 'VerificationModal',
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
    isEmail: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      code: ['', '', '', '', '', ''],
      errorMessage: '',
    };
  },
  computed: {
    title() {
      return this.isEmail ? 'Verify Email' : 'Verify Phone Number';
    },
  },
  methods: {
    close() {
      this.$emit('close');
      this.resetCode();
      this.errorMessage = '';
    },
    submit(){
      this.$emit('submit', this.code.join(''));
    },
    onInput(index) {
      if (this.code[index].length === 1 && index < 5) {
        this.$nextTick(() => {
          this.$refs.inputs[index + 1].focus();
        });
      }
    },
    resetCode() {
      this.code = ['', '', '', '', '', ''];
    },
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.modal-text {
  margin-bottom: 20px;
  font-size: 14px;
}

.verification-input {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.verification-input input {
  width: 40px;
  height: 40px;
  text-align: center;
  font-size: 18px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.modal-actions {
  display: flex;
  justify-content: flex-start;
  gap: 10px;
}

.submit-button, .cancel-button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.submit-button {
  background-color: #ffaa00;
  color: black;
}

.cancel-button {
  background-color: white;
  color: black;
  border: 1px solid #ccc;
}

.error-message {
  color: red;
  margin-top: 10px;
  font-size: 14px;
}
</style>
