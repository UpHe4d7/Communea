<template>
  <div class="login-page">
    <div class="login-container">
      <h1>Commun<span class="highlight">ea</span></h1>
      <div class="login-box">
        <h2>Welcome back!</h2>
        <p>A Vibrant Parent Walker Community</p>
        <form @submit.prevent="handleLogin">
          <input type="text" placeholder="Email or phone number" v-model="emailOrPhone" required />
          <input type="password" placeholder="Password" v-model="password" required />
          <button type="submit">Log in</button>
        </form>
        <div class="login-links">
          <a href="#">Forget Password?</a>
          <router-link to="/register">Create Account</router-link>
        </div>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  inject: ['apiBaseUrl'],
  name: 'LoginPage',
  data() {
    return {
      emailOrPhone: '',
      password: '',
      errorMessage: '',
      userid: '',
      userType: '',
    };
  },
  methods: {

    handleLogin() {
      axios.post(`${this.apiBaseUrl}/user/login`, null, {
        params: {
          account: this.emailOrPhone,
          password: this.password
        }
      })
          .then(response => {
            if (response.data.includes('Login successful')) {
              const userId = response.data.split('User ID: ')[1].split(' ')[0]; // get User ID
              const userType = response.data.split('User Type: ')[1]; // get User Type
              localStorage.setItem('userId', userId); // store User ID
              localStorage.setItem('userType', userType); // store User Type

              // redirect to different pages based on user type
              if (userType === 'Walker') {
                window.location.href = '/walker-home'; // redirect to Walker page
              } else if (userType === 'Parent') {
                window.location.href = '/home'; // redirect to Parent page
              } else if (userType === 'Admin') {
                window.location.href = '/ManagerHome'; // redirect to Admin page
              } else {
                window.location.href = '/'; // default redirect to home page
              }
            } else {
              this.errorMessage = response.data; // show error message
            }
          })
          .catch(error => {
            console.error(error);  // print error message
            this.errorMessage = 'login failed';  // show error message
          });


    }

  }
};
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: #ffaa00;
  overflow: hidden;
}

.login-container {
  text-align: center;
  color: #fff;
}

.login-box {
  background-color: #fff;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  color: #333;
  max-width: 400px;
  margin: 0 auto;
}

.highlight {
  color: black;
}

form input {
  display: block;
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: black;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.login-links {
  margin-top: 15px;
}

.login-links a {
  color: #333;
  text-decoration: none;
  margin: 0 10px;
}

.error-message {
  color: red;
  margin-top: 10px;
}
</style>