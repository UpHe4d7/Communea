<template>
    <div class="mission-statement-page">
      <!-- Navigation Bar -->
      <nav class="navigation">
        <div class="logo">
          <span class="commun">Commun</span><span class="ea">ea</span>
        </div>
        <button @click="navigateToLogin" class="login-btn">Log In</button>
      </nav>
  
      <!-- Background Circle Positioned under Log In Button -->
      <div class="background-circle"></div>
  
      <!-- Back Button -->
      <div class="back-button" @click="navigateToHomepage">
        <i class="fas fa-arrow-left"></i> Back to Homepage
      </div>
  
      <!-- Main Content Area -->
      <div class="mission-container">
        <!-- Mission Statement Section -->
        <div class="header">
          <h1>Mission Statement</h1>
        </div>
        <p class="intro-text">
          Welcome to Communea – a vibrant platform connecting parents with trusted local volunteers to ensure safe walks to school for primary children. With easy registration and verified credentials, parents can quickly find and connect with walkers in their area. Join us and help build a stronger, safer community today!
        </p>
        <p class="mission-text">
          At Neighbourhood Walk, we aim to build stronger, safer, and more connected communities by bridging the gap between parents and local volunteers. Our platform empowers parents to find trustworthy walkers who can safely accompany their children to school, fostering a supportive network within the neighborhood. Through seamless self-registration, verified identities, and a user-friendly experience, we ensure peace of mind for families while promoting meaningful community engagement. Together, we’re creating a future where helping hands are always close by.
        </p>
  
      </div>
      <!-- Image Section -->
      <img src="@/components/pic/mission.png" alt="Mission Statement Visual" class="mission-image"/>
    </div>
  </template>
  
  <script>
  export default {
    name: 'MissionStatement',
    methods: {
      navigateToLogin() {
        this.$router.push('/login');
      },
      navigateToHomepage() {
        this.$router.push('/');
      }
    }
  };
  </script>
  
  
  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Mansalva&display=swap');
  
  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow-x: hidden;
  }
  
  .mission-statement-page {
    min-height: 100vh;
    overflow: hidden;
    position: relative;
    width: 100vw;
  }
  
  /* Navigation and Header Bar */
  .navigation {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.2rem 5%;
    z-index: 2; /* Ensures it appears above the background circle */
    position: relative;
  }
  
  .logo {
    font-size: 32px;
    font-family: 'Arial', sans-serif;
    font-weight: 900;
  }
  
  .commun {
    color: #000;
  }
  
  .ea {
    color: #ffaa00;
  }
  
  .login-btn {
    background-color: white;
    color: #333;
    padding: 0.5rem 1.2rem;
    border: 1px solid #333;
    border-radius: 20px;
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: bold;
  }
  
  /* Back Button */
  .back-button {
    display: inline-flex;
    align-items: center;
    font-size: 1rem;
    color: #333;
    cursor: pointer;
    margin: 20px 5%;
    padding: 8px 16px;
    background-color: #f0f0f0;
    border-radius: 8px;
    transition: background-color 0.3s, box-shadow 0.3s;
    font-weight: bold;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    text-decoration: none;
    position: relative;
    z-index: 2;
  }
  
  .mission-container {
    width: 100vw; /* Full width of the viewport */
    padding: 0; /* Remove padding */
    margin: 0; /* Remove margin */
  }
  
  .mission-image {
    width: 100vw; /* Full width of the viewport */
    display: block;
    margin: 0; /* Remove all margins */
    padding: 0; /* Remove padding */
    position: relative;
    left: 0; /* Align to the left edge */
  }
  
  .back-button i {
    margin-right: 8px;
  }
  
  .back-button:hover {
    background-color: #e0e0e0;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
  
  /* Background Circle */
  .background-circle {
    position: absolute;
    top: 0;
    right: 0;
    width: 30vw; 
    height: 30vw; 
    background-color: #ffaa00;
    border-radius: 50%;
    z-index: 1; 
    transform: translate(10%, -50%);
  }
  
  /* Mission Container */
  .mission-container {
    width: 85%;
    padding: 20px;
    margin: 0 auto;
    font-family: Arial, sans-serif;
    color: #333;
  }
  
  .header h1 {
    font-size: 36px;
    font-weight: bold;
    color: #333;
    margin-left: 0;
  }
  
  .intro-text, .mission-text {
    margin-top: 10px;
    text-align: left;
    font-size: 16px;
    line-height: 1.6;
    margin-left: 50px;
  }
  
  .intro-text {
    font-weight: 500;
  }
  
  .mission-text {
    margin-top: 20px;
    color: #333;
    line-height: 1.6;
    margin-left: 50px;
    font-size: 16px;
  }
  </style>
  
  