<template>
  <div class="register-page">
    <div class="register-container">
      <h1 class="logo-text">Commun<span class="highlight">ea</span></h1>
      <div class="register-box">
        <h2>Create Account</h2>
        <p>A Vibrant Parent Walker Community</p>
        <form @submit.prevent="handleRegister">
          <!-- First Name and Last Name -->
          <div class="input-group">
            <div class="input-wrapper">
              <input type="text" placeholder="First name" v-model="firstName" required />
              <span class="required">*</span>
            </div>
            <div class="input-wrapper">
              <input type="text" placeholder="Last name" v-model="lastName" required />
              <span class="required">*</span>
            </div>
          </div>

          <!-- Preferred Name and Date of Birth -->
          <div class="input-group">
            <div class="input-wrapper">
              <input type="text" placeholder="Preferred name" v-model="preferredName" />
            </div>
            <div class="input-wrapper date-select">
              <select v-model="birthYear" @change="validateBirthDate" required>
                <option value="">Year</option>
                <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
              </select>
              <select v-model="birthMonth" @change="validateBirthDate" required>
                <option value="">Month</option>
                <option v-for="month in months" :key="month.value" :value="month.value">{{ month.label }}</option>
              </select>
              <select v-model="birthDay" @change="validateBirthDate" required>
                <option value="">Day</option>
                <option v-for="day in days" :key="day" :value="day">{{ day }}</option>
              </select>
              <span class="required">*</span>
            </div>
          </div>
          <span v-if="birthDateError" class="error-message">Please select a valid date of birth.</span>

          <!-- Communication Preference (Email or Phone Number) -->
          <div class="input-group">
            <div class="input-wrapper select-wrapper">
              <select v-model="registrationType">
                <option value="email">Email</option>
                <option value="phone">Phone Number</option>
              </select>
            </div>
            <div class="input-wrapper">
              <input
                  v-if="registrationType === 'email'"
                  type="email"
                  placeholder="Email"
                  v-model="email"
                  required
              />
              <input
                  v-else
                  type="text"
                  placeholder="Phone number"
                  v-model="phoneNumber"
                  required
              />
            </div>
            <button type="button" @click="openVerificationModal" class="verify-button">Verify</button>
          </div>
          <p class="verification-instruction">* Please verify either your email or phone number to complete your registration</p>

          <!-- Password and Confirm Password -->
          <div class="input-group">
            <div class="input-wrapper">
              <input type="password" placeholder="Password" v-model="password" required />
            </div>
            <div class="input-wrapper">
              <input type="password" placeholder="Confirm password" v-model="confirmPassword" required />
            </div>
          </div>
          <span v-if="passwordError" class="error-message">Passwords do not match.</span>

          <div class="input-wrapper">
            <!-- User type selection box -->
            <select v-model="userType" required>
              <option value="" disabled selected>Please select your user type</option>
              <option value="Walker">I am Walker</option>
              <option value="Parent">I am Parent</option>
            </select>
          </div>

          <!-- Terms and Privacy Policy -->
          <div class="terms">
            <div class="terms-checkbox">
              <input
                  type="checkbox"
                  v-model="termsAccepted"
                  required
                  aria-label="Agree to terms and privacy policy"
              />
            </div>
            <div class="terms-text">
              <span>I agree to all the <a href="#">Terms and Privacy Policy</a></span>
            </div>
          </div>
          <span v-if="termsError" class="error-message">You must agree to the terms and privacy policy.</span>


          <!-- Submit Button -->
          <button type="submit">Create Account</button>
        </form>
        <p>Already have an account? <router-link to="/login">Log in</router-link></p>
      </div>
    </div>

    <verification-modal
        :isOpen="isVerificationModalOpen"
        :isEmail="registrationType === 'email'"
        @close="closeVerificationModal"
        @submit="handleVerificationSubmit"
    />
  </div>
</template>

<script>
import VerificationModal from './VerificationModal.vue';
import axios from "axios";

export default {

  inject: ['apiBaseUrl'],
  name: 'RegisterPage',
  components: {
    VerificationModal,
  },
  data() {
    return {
      firstName: '',
      lastName: '',
      preferredName: '',
      birthYear: '',
      birthMonth: '',
      birthDay: '',
      registrationType: 'phone',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      termsAccepted: false,
      birthDateError: false,
      termsError: false,
      passwordError: false,
      isVerificationModalOpen: false,
      years: [],
      months: [
        { value: '01', label: 'January' },
        { value: '02', label: 'February' },
        { value: '03', label: 'March' },
        { value: '04', label: 'April' },
        { value: '05', label: 'May' },
        { value: '06', label: 'June' },
        { value: '07', label: 'July' },
        { value: '08', label: 'August' },
        { value: '09', label: 'September' },
        { value: '10', label: 'October' },
        { value: '11', label: 'November' },
        { value: '12', label: 'December' }
      ],
      days: [],
      userType: '',
      verified: false, //if the user is verified
    };
  },
  methods: {
    // send a request to create an avatar for the user
    createAvatar() {
      const userId = localStorage.getItem('userId');
      axios.post(`${this.apiBaseUrl}/user/createUserPhoto`, {
        userId: userId
      })
          .then(response => {
            console.log('Avatar created:', response.data);
          })
          .catch(error => {
            console.error('Failed to create avatar:', error);
          });
    },

    // handle the registration form submission
    handleRegister() {
      this.validateBirthDate();
      this.validatePasswords();
      this.termsError = !this.termsAccepted;

      if (this.birthDateError || this.termsError || this.passwordError) {
        return;
      }

      const communicationPreference = this.registrationType === 'email'
          ? 'Email'
          : 'SMS';

      const registrationData = {
        firstName: this.firstName,
        lastName: this.lastName,
        preferredName: this.preferredName,
        dateOfBirth: `${this.birthYear}-${this.birthMonth}-${this.birthDay}`,
        communicationPreference: communicationPreference,
        userType: this.userType,
        email: this.email,
        phoneNumber: this.phoneNumber,
        password: this.password,
      };

      console.log('Registration data to be sent:', JSON.stringify(registrationData));

      axios.post(`${this.apiBaseUrl}/user/register`, registrationData)
          .then(response => {
            const responseData = response.data;
            console.log('Registration response:', response.data);
            if (responseData && responseData.includes("verified")) {
              alert('Please verify your email or phone number to complete registration.');
            } else if (responseData) {
              console.log('Registration successful:', responseData);
              localStorage.setItem('userId', responseData);
              localStorage.setItem('userType', this.userType);

              this.createAvatar();

              // redirect according to user type
              if (this.userType === 'Parent') {
                // redirect to Parent registration additional information page
                this.$router.push('/');
              } else if (this.userType === 'Walker') {
                // redirect to Walker registration additional information page
                this.$router.push({ path: '/register/walker' });
              } else {
                // default redirect to home page
                this.$router.push('/');
              }
              this.resetForm();
            } else {
              alert('Registration successful!');
            }
          })
          .catch(error => {
            console.error('Registration failed:', error);
            alert('Registration failed. Please try again.');
          });
    },

    // validate the birth date
    validateBirthDate() {
      this.birthDateError = !this.birthYear || !this.birthMonth || !this.birthDay;
      this.updateDays();
    },

    // update the days based on the selected month and year
    updateDays() {
      if (!this.birthYear || !this.birthMonth) {
        this.days = [];
        return;
      }
      const daysInMonth = new Date(this.birthYear, this.birthMonth, 0).getDate();
      this.days = Array.from({ length: daysInMonth }, (_, i) => String(i + 1).padStart(2, '0'));
    },

    // validate the passwords
    validatePasswords() {
      this.passwordError = this.password !== this.confirmPassword;
    },

    // reset the form fields
    resetForm() {
      this.firstName = '';
      this.lastName = '';
      this.preferredName = '';
      this.birthYear = '';
      this.birthMonth = '';
      this.birthDay = '';
      this.registrationType = 'email';
      this.email = '';
      this.phoneNumber = '';
      this.password = '';
      this.confirmPassword = '';
      this.termsAccepted = false;
      this.birthDateError = false;
      this.termsError = false;
      this.passwordError = false;
    },


    // open the verification modal and send the verification code
    openVerificationModal() {
      const verificationData = this.registrationType === 'email'
          ? { email: this.email }
          : { phoneNumber: this.phoneNumber };

      if (this.registrationType === 'email' && !verificationData.email) {
        alert('Please enter a valid email.');
        return;
      }

      if (this.registrationType === 'phone' && !verificationData.phoneNumber) {
        alert('Please enter a valid phone number.');
        return;
      }

      const endpoint = this.registrationType === 'email'
          ? '/verifications/send-verification-code-email'
          : '/verifications/send-verification-code-phone';

      axios.post(`${this.apiBaseUrl}${endpoint}`, null, {
        params: verificationData
      })
          .then(response => {
            console.log('Verification code sent:', response.data);
            // open the verification modal
            this.isVerificationModalOpen = true;
          })
          .catch(error => {
            console.error('Failed to send verification code:', error);
            alert('Failed to send verification code. Please try again.');
          });
    },

    // close the verification modal
    closeVerificationModal() {
      this.isVerificationModalOpen = false;
    },

    // handle the verification code submission
    handleVerificationSubmit(code) {
      console.log('Verification code submitted:', code);
      const endpoint = this.registrationType === 'email'
          ? '/verifications/verify-email'
          : '/verifications/verify-phone';

      const verificationData = this.registrationType === 'email'
          ? { code: code, email: this.email }
          : { code: code, phoneNumber: this.phoneNumber };

      console.log('Verification code submitted:', code);

      axios.post(`${this.apiBaseUrl}${endpoint}`, null, {
        params: verificationData
      })
          .then(response => {
            const responseData = response.data;
            alert(responseData.message || 'Verification successful.');
          })
          .catch(error => {
            console.error('Failed to verify code:', error);
            alert('Failed to verify code. Please try again.');
          });
      this.closeVerificationModal();
      // 如果验证成功，您可能想更新 UI 显示验证状态
    },
  },
  created() {
    const currentYear = new Date().getFullYear();
    this.years = Array.from({ length: 100 }, (_, i) => currentYear - i);
  },
  watch: {
    birthMonth() {
      this.updateDays();
    },
    birthYear() {
      this.updateDays();
    },
  },
};
</script>

<style scoped>
.register-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100vw;/* 100% window width */
  min-height: 100vh;/* 100%Windows height */
  background-color: #ffaa00;
  overflow: auto;
}

.register-container {
  width: 100%;
  max-width: 600px;
  padding: 40px;
}

.logo-text {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 20px;
  color: #000;
  text-align: center;
}

.highlight {
  color: #fff;
}

.register-box {
  background-color: #fff;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

form {
  display: flex;
  flex-direction: column;
}

.input-group {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.input-wrapper {
  position: relative;
  flex: 1;
  display: flex;
}

.input-wrapper input,
.input-wrapper select {
  flex: 1;
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.select-wrapper {
  flex: 0 0 auto;
  width: 150px;
}

.required {
  color: red;
  position: absolute;
  top: 10px;
  right: 10px;
}

.verification-instruction {
  font-size: 12px;
  color: #666;
  text-align: left;
  margin-top: -10px;
  margin-bottom: 15px;
}

.password-error {
  color: red;
  font-size: 12px;
  margin-top: 5px;
  text-align: left;
}

.terms {
  display: flex;
  align-items: center;
  margin: 15px 0;
  width: 100%;
}

.terms-checkbox {
  flex: 0 0 20%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.terms-text {
  flex: 0 0 80%;
  display: flex;
  align-items: center;
}

.terms-text span {
  font-size: 14px;
}

.error-message {
  color: red;
  font-size: 12px;
  margin-top: 5px;
  text-align: left;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #000;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #333;
}

.verify-button {
  flex: 0 0 auto;
  width: auto;
  padding: 10px 20px;
  background-color: #ffaa00;
  color: #000;
}

.verify-button:hover {
  background-color: #ff9900;
}

.terms-text a {
  color: #000;
  text-decoration: underline;
}

.terms-text a:hover {
  color: #ffaa00;
}

.date-select {
  display: flex;
  gap: 5px;
}

.date-select select {
  flex: 1;
}

/* responsive design */
@media (max-width: 600px) {
  .input-group {
    flex-direction: column;
  }

  .terms {
    flex-direction: column;
    align-items: flex-start;
  }

  .terms-checkbox {
    flex: 0 0 auto;
    margin-bottom: 10px;
  }

  .terms-text {
    flex: 0 0 auto;
  }

  .select-wrapper {
    width: 100%;
  }

  .date-select {
    flex-direction: column;
  }
}
</style>
