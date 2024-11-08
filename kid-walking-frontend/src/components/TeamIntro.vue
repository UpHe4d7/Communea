<template>
    <div class="team-introduction-page">
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
      <div class="team-container">
        <!-- Team Introduction Section -->
        <div class="header">
          <h1>Team Introduction</h1>
          <p class="sub-header">Capstone CS1-1</p>
        </div>
  
        <!-- Team Members -->
        <div class="team-members">
          <div v-for="(member, index) in teamMembers" :key="index" class="team-member-card">
            <img :src="member.photo" :alt="member.name" class="member-photo" />
            <h3 class="member-name">{{ member.name }}</h3>
            <p class="member-role">{{ member.role }}</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'TeamIntroduction',
    data() {
      return {
        teamMembers: [
          { name: "Chenkai Yao", role: "Project / Product Manager", photo: require('@/components/pic/Chenkai.png') },
          { name: "Nicole Zhang", role: "Designer / Front-end Developer", photo: require('@/components/pic/Nicole.png') },
          { name: "Zachary Zhang", role: "Front-end Developer", photo: require('@/components/pic/Zachary.png') },
          { name: "Nikolas Wu", role: "Lead Developer", photo: require('@/components/pic/Nikolas.png') },
          { name: "Logan Wu", role: "Back-end Developer", photo: require('@/components/pic/Logan.png') },
          { name: "Gary Gao", role: "Back-end Developer", photo: require('@/components/pic/Gary.png') }
        ]
      };
    },
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
  
  .team-introduction-page {
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
    z-index: 2;
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
    z-index: -1;
    transform: translate(10%, -50%);
  }
  
  .team-container {
    width: 85%;
    padding: 20px;
    margin: 0 auto;
    font-family: Arial, sans-serif;
    color: #333;
    text-align: left;
  }
  
  .header h1 {
    font-size: 36px;
    font-weight: bold;
    color: #333;
    margin: 0;
  }
  
  .sub-header {
    font-size: 20px;
    color: #333;
    margin-top: 5px;
  }
  
  .team-members {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    margin-top: 30px;
  }
  
  .team-member-card {
    width: 250px;
    padding: 20px;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    text-align: center;
    margin: 15px;
  }
  
  .member-photo {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin-bottom: 10px;
  }
  
  .member-name {
    font-size: 18px;
    font-weight: bold;
    color: #333;
    margin: 10px 0 5px;
  }
  
  .member-role {
    font-size: 14px;
    color: #666;
    margin-bottom: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .member-description {
    font-size: 14px;
    color: #aaa;
  }
  </style>
  