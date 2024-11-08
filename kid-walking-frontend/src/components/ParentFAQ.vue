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
        <h1>FAQ <span>for parents</span></h1>
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
  name: 'ParentFaq',
  data() {
    return {
      faqItems: [
        {
          question: "How it works?",
          answer: [
            "1. Register: Sign up easily through our website. Complete your profile and verify your identity with simple steps, including home address and working with children checks.",
            "2. Find a Walker: Search for trusted local volunteers (walkers) near your area. You can filter by availability, proximity, and more.",
            "3. Request a Walk: Once you’ve found a suitable walker, send a walk request. The walker will receive the request and confirm if they are available.",
            "4. Walk Agreement: Once the walker accepts, you can arrange for a pre-meet to finalize all the details.",
            "5. Enjoy: Your child will be accompanied by a trusted volunteer to school, giving you peace of mind and fostering community connections."
          ],
          open: false
        },
        {
          question: "How to find walkers/requests?",
          answer: [
            "Parents can find suitable walkers by entering an address and filtering the distance, and share the Request they created for your intended walker, or just create a Request and wait for a walker to apply.",
            "Walkers can find suitable requests by entering an address and filtering the distance."
          ],
          open: false
        },
        {
          question: "How to communicate with walker?",
          answer: [
            "After receiving the walker's application, we will provide the walker's contact information, and parents can contact the walker by phone or email."
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
  background-color: #ffaa00;
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
  color: #ffaa00;
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
