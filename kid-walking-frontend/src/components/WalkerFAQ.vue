<template>
  <div class="faq-page">
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
    <div class="faq-container">
      <!-- Header Section -->
      <div class="header">
        <h1>FAQ <span>for walkers</span></h1>
      </div>
      <p class="intro-text">
        Welcome to Communea – a vibrant platform connecting parents with trusted local volunteers to ensure safe walks to school for primary children. With easy registration and verified credentials, parents can quickly find and connect with walkers in their area. Join us and help build a stronger, safer community today!
      </p>

      <!-- FAQ Section -->
      <div class="faq-section">
        <div v-for="(item, index) in faqItems" :key="index" class="faq-item">
          <button @click="toggle(index)">
            {{ item.question }}
            <i :class="{'icon fas fa-chevron-down': !item.open, 'icon fas fa-chevron-up': item.open}"></i>
          </button>
          <transition name="fade-slide">
            <div v-if="item.open" class="faq-item-content">
              <p v-for="(line, lineIndex) in item.answer" :key="lineIndex">{{ line }}</p>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WalkerFaq',
  data() {
    return {
      faqItems: [
        {
          question: "How it works?",
          answer: [
            "1. Register: Sign up via our website. Complete your profile and undergo identity verification, including home address and working with children checks.",
            "2. Set Your Availability: Indicate your preferred walking times and days, making it easy for parents to find and request your help.",
            "3. Receive Requests: When a parent nearby sends a walk request, you’ll be notified. Review the request details, including the child’s school and meeting point.",
            "4. Accept the Walk: If you're available, simply accept the request through the web. You can then coordinate with the parent on pre-meet to finalise the walk details.",
            "5. Walk Together: On the agreed day, accompany the child to school, helping create a safer and stronger neighborhood."
          ],
          open: false
        },
        {
          question: "What conditions does a walker need to fulfill?",
          answer: [
            "All walkers are required to pass a background check and real name verification to ensure they are suitable to accompany children to and from school."
          ],
          open: false
        },
        {
          question: "How to cancel the Agreement?",
          answer: [
            "Tap Agreement in the sidebar, tap the Agreement detail page that needs to be cancelled and click Cancel."
          ],
          open: false
        },
        {
          question: "Is there a fee for walker services?",
          answer: [
            "The walker service is free of charge and parents and volunteers can make their own arrangements according to each other's needs."
          ],
          open: false
        },
        {
          question: "How does the platform ensure the safety of the children?",
          answer: [
            "In addition to rigorous background checks on walkers, we provide real-time tracking features to ensure that parents are always aware of their children's movements."
          ],
          open: false
        },
        {
          question: "Will my personal information be leaked?",
          answer: [
            "For parents, any of your personal information and contact details will not be visible to walkers, only the information you fill in the Request will be visible to nearby walkers, which depends on your own needs.",
            "For walkers, your personal description and availability will be visible to nearby parents, but your contact details will only be visible to that parent once you have applied for a Request."
          ],
          open: false
        }
      ]
    };
  },
  methods: {
    toggle(index) {
      this.faqItems[index].open = !this.faqItems[index].open;
    },
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

.faq-page {
  min-height: 100vh;
  overflow: hidden;
  position: relative;
  width: 100%;
  max-width: 1600px;
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
  background-color: #0A2640;
  border-radius: 50%;
  z-index: -1;
  transform: translate(10%, -50%);
}

/* FAQ Container */
.faq-container {
  width: 85%;
  padding: 20px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
  max-width: 1200px;
}

.header h1 {
  font-size: 36px;
  font-weight: bold;
  color: #333;
  margin-left: 0;
}

.header span {
  color: #0A2640;
}

.intro-text {
  margin-top: 10px;
  text-align: left;
  font-size: 16px;
  color: #333;
  line-height: 1.6;
  margin-left: 50px;
}

.faq-section {
  text-align: left;
  margin-top: 20px;
}

.faq-item {
  border-bottom: 1px solid #ddd;
  padding: 15px 0;
}

.faq-item button {
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  outline: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.faq-item button .icon {
  transition: transform 0.3s ease;
}

.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all 0.3s ease;
  opacity: 1;
  transform: translateY(0);
}

.fade-slide-enter, .fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.faq-item-content {
  padding-top: 10px;
  font-size: 16px;
  color: #333;
}
</style>
