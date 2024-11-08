# HomePage.vue
<template>
  <div class="home-page">
    <!-- Navigation bar -->
    <div class="logo">
      <span class="commun">Commun</span><span class="ea">ea</span>
    </div>
    <nav class="navigation">
      <div class="nav-links">
        <!-- router-link to="/parent-faq" class="nav-link">Parents</router-link -->
        <!-- router-link to="/walker-faq" class="nav-link">Walkers</router-link -->
        <div class="nav-item">
          <div class="nav-link">About Us</div>
          <div class="dropdown-menu">
            <router-link to="/MissionStatement" class="dropdown-link">Mission Statement</router-link>
            <router-link to="/TeamIntroduction" class="dropdown-link">Team Introduction</router-link>
          </div>
        </div>
        <router-link to="/login" class="login-btn">Log In</router-link>
      </div>
    </nav>


    <!-- main content -->
    <div class="content-wrapper">
      <!-- Left side content   -->
      <div class="left-content">
        <h1 class="main-title">Find a trusted walker to pick up your children</h1>
        <p class="description">
          Connect parents with trusted local volunteers to ensure safe walks to school for primary children. With easy registration and verified credentials, parents can quickly find and connect with walkers in their area.
        </p>
        <p class="sub-description">
          Join us and help build a stronger, safer community today!
        </p>
        <div class="button-group">
          <button class="get-started-btn" @click="navigateToLogin">Get started</button>
          <button class="watch-demo-btn">Watch demo</button>
        </div>
      </div>

      <!-- Video -->
      <div class="right-content">
        <div class="icon-wrapper">
          <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/Bw4oZp_hsAk"
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
          ></iframe>
        </div>
      </div>

      <!-- background -->
      <div class="background-curve"></div>
    </div>

    <div class="cards-section">
      <h2 class="section-title">Learn what Communea can </h2>
      <h2 class="section-title">do for you</h2>
      <div class="cards-container">
        <router-link to="/parent-faq" class="card">
          <img src="/images/111.png" alt="Family" class="card-image">
          <h3>For Parent</h3>
        </router-link>
        <router-link to="/walker-faq" class="card">
          <img src="/images/222.png" alt="Walker" class="card-image">
          <h3>For Walker</h3>
        </router-link>
      </div>
    </div>

    <div class="faq-page">
      <!-- Top Parents Stories Section -->
      <section class="top-stories">
        <h2 class="section-title">Meet our happy parents</h2>
        <div class="stories-grid">
          <div
              class="story-card"
              v-for="story in parentStories"
              :key="story.id"
              @click="navigateToLogin"
          >
            <div class="parent-photo">
              <img :src="story.photo" :alt="story.name" />
            </div>
            <div class="story-info">
              <h3>{{ story.name }}</h3>
              <div class="location">
                <span class="icon">📍</span>
                {{ story.location }}
              </div>
              <div class="family-info">
                <span class="icon">👨‍👩‍👧‍👦</span>
                {{ story.familyInfo }}
              </div>
              <p class="testimonial">{{ story.testimonial }}</p>
            </div>
          </div>
        </div>
      </section>

      <section class="top-walkers">
        <h2 class="section-title">Meet some of our top walkers</h2>
        <div class="walkers-grid">
          <div
              class="walker-card"
              v-for="walker in topWalkers"
              :key="walker.id"
              @click="navigateToLogin"
          >
            <div class="walker-photo">
              <img :src="walker.photo" :alt="walker.name" />
            </div>
            <div class="walker-info">
              <h3>{{ walker.name }}</h3>
              <div class="location">
                <span class="icon">📍</span>
                {{ walker.location }}
              </div>
              <div class="verification">
                <span class="icon">✓</span>
                {{ walker.verificationStatus }}
              </div>
              <p class="bio">{{ walker.bio }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Questions Section -->
      <section class="questions-section">
        <h2 class="title">Questions?</h2>
        <h3 class="subtitle">We'll put you on the right path</h3>
        <p class="description">Ask us about any questions</p>
        <p class="support-text">Our highly trained reps are standing by, ready to help</p>
        <button class="contact-btn" @click="openContactModal">Contact us</button>
      </section>

      <ContactModal :show="showContactModal" @close="closeContactModal" />

      <!-- Footer Navigation -->
      <footer class="footer-nav">
        <div class="nav-section">
          <h3>Parent</h3>
          <ul>
            <router-link to="parent-faq" class="nav-link">
            <li><a href="#how-it-works">How it works</a></li>
            </router-link>
            <router-link to="Login" class="nav-link">
            <li><a href="#get-started">Get started</a></li>
            </router-link>
          </ul>
        </div>
        <div class="nav-section">
          <h3>Walker</h3>
          <ul>
            <router-link to="walker-faq" class="nav-link">
            <li><a href="#how-it-works">How it works</a></li>
            </router-link>
            <router-link to="Login" class="nav-link">
            <li><a href="#get-started">Get started</a></li>
            </router-link>
          </ul>
        </div>
        <div class="nav-section">
          <h3>About us</h3>
          <ul>

            <li><a href="#faq">FAQ</a></li>
            <router-link to="TeamIntroduction" class="nav-link">
            <li><a href="#team">Team introduction</a></li>
            </router-link>
            <router-link to="MissionStatement" class="nav-link">
            <li><a href="#mission">Mission Statement</a></li>
            </router-link>
          </ul>
        </div>
      </footer>
    </div>
  </div>


</template>

<script>
import ContactModal from './ContactModal.vue';

export default {
  name: 'HomePage',
  components: {
    ContactModal
  },
  data() {
    return {
      showContactModal: false,
      parentStories: [
        {
          id: 1,
          name: 'Emma & James',
          photo: '/images/家庭照片1.png',
          location: 'NSW 2021 Paddington Sydney',
          familyInfo: 'Family of 4, 2 children (7 & 9 years)',
          testimonial: 'Finding Communea has been a game-changer for our family. With both of us working full-time, having a trusted walker to pick up our kids from school has given us peace of mind...'
        },
        {
          id: 2,
          name: 'Lisa & Michael',
          photo: '/images/家庭照片2.png',
          location: 'NSW 2000 Sydney CBD',
          familyInfo: 'Family of 3, 1 child (8 years)',
          testimonial: 'Our walker Sarah has become like part of our family. She\'s reliable, caring, and our daughter looks forward to their walks home...'
        },
        {
          id: 3,
          name: 'Rachel',
          photo: '/images/家庭照片3.png',
          location: 'NSW 2010 Surry Hills',
          familyInfo: 'Single parent, 2 children (6 & 10 years)',
          testimonial: 'As a single mom, Communea has been invaluable. The flexibility and reliability of the service has helped me manage work and family life...'
        },
        {
          id: 4,
          name: 'David & Sophie',
          photo: '/images/家庭照片4.png',
          location: 'NSW 2031 Randwick',
          familyInfo: 'Family of 5, 3 children (6, 8 & 11 years)',
          testimonial: 'With three kids at different schools, logistics were a nightmare until we found Communea. Now we have a dedicated walker for each route...'
        }
      ],
      topWalkers: [
        {
          id: 1,
          name: 'Mia. D',
          photo: '/images/image1.jpg',
          location: 'NSW 2021 Paddington Sydney',
          verificationStatus: 'WWCC check',
          bio: 'Hello parents! As an experienced Walker with a real Working with Children Check and years of childcare experience, I am...'
        },
        {
          id: 2,
          name: 'John. R',
          photo: '/images/c1.jpg',
          location: 'NSW 2000 Sydney CBD',
          verificationStatus: 'WWCC check',
          bio: 'Professional childcare worker with 5+ years of experience...'
        },
        {
          id: 3,
          name: 'Sarah. M',
          photo: '/images/c2.jpg',
          location: 'NSW 2010 Surry Hills',
          verificationStatus: 'WWCC check',
          bio: 'Certified teacher and experienced child carer...'
        },
        {
          id: 4,
          name: 'David. L',
          photo: '/images/c3.jpg',
          location: 'NSW 2031 Randwick',
          verificationStatus: 'WWCC check',
          bio: 'Former school teacher with passion for child development...'
        }
      ]
    };
  },
  methods: {
    navigateToLogin() {
      this.$router.push('/login');
    },
    openContactModal() {
      this.showContactModal = true;
    },
    closeContactModal() {
      this.showContactModal = false;
    }
  }
};
</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Mansalva&display=swap');

.home-page {
  min-height: 100vh;
  overflow: hidden;
}

.navigation {
  position: relative;
  margin-right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.2rem 5%;
  z-index: 100;
}

.logo {
  font-size: 32px;
  margin: 0;
  font-family: 'Arial', sans-serif;
  font-weight: 900;
}

.commun {
  color: #000;
}

.ea {
  color: #ffaa00;
}

.nav-links {
  display: flex;
  gap: 2.5rem;
  align-items: center;
  /*靠右对齐*/
  margin-left: auto;
}

.nav-link {
  text-decoration: none;
  color: #000;
  font-size: 1rem;
  font-weight: 500;
}

.login-btn {
  background-color: #14213d;
  color: white;
  padding: 0.5rem 1.2rem;
  border-radius: 20px;
  text-decoration: none;
  font-size: 0.9rem;
}

.content-wrapper {
  position: relative;
  display: flex;
  padding: 0 5%;
  gap: 5%;

}

.left-content {
  flex: 1;
  padding-top: 10%;
  max-width: 1900px;
}

.right-content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding-top: 5%;
}

.main-title {
  font-size: 2.7rem;
  line-height: 1.2;
  margin-bottom: 1.5rem;
}

.description {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #333;
  margin-bottom: 1rem;
}

.sub-description {
  font-size: 1rem;
  color: #666;
}

.button-group {
  display: flex;
  gap: 1rem;
  margin-top: 2.5rem;
}

.get-started-btn {
  background-color: #14213d;
  color: white;
  padding: 0.8rem 2rem;
  border: none;
  border-radius: 25px;
  font-size: 1rem;
  cursor: pointer;
}

.watch-demo-btn {
  background-color: white;
  color: #14213d;
  padding: 0.8rem 2rem;
  border: 2px solid #14213d;
  border-radius: 25px;
  font-size: 1rem;
  cursor: pointer;
}

.icon-wrapper {
  width: 100%;
  aspect-ratio: 16/9;
  background-color: #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  overflow: hidden;
  margin-top: 2rem;
}

.background-curve {
  position: absolute;
  top: 0;
  right: 0;
  width: 45%;
  height: 100%;
  background-color: #ffaa00;
  clip-path: polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%);
  z-index: -1;
}

.cards-section {
  padding: 4rem 5%;
}

.section-title {
  font-family: 'Mansalva', cursive;
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
}

.cards-container {
  display: flex;
  justify-content: center;
  gap: 4rem;
  padding: 0 5%;
}

.card {
  flex: 1;
  max-width: 1400px;
  text-decoration: none;
  color: inherit;
}

.card-image {
  width: 100%;
  aspect-ratio: 4/3;
  object-fit: cover;
  border-radius: 15px;
  margin-bottom: 1rem;
}

.card h3 {
  text-align: center;
  font-size: 2.0rem;
  margin-top: 1rem;
}

@media (max-width: 1024px) {
  .content-wrapper {
    flex-direction: column;
    height: auto;
    padding: 5% 5%;
  }

  .left-content {
    padding-top: 5%;
  }

  .right-content {
    margin-top: 2rem;
    padding-top: 0;
  }

  .background-curve {
    width: 100%;
    height: 50%;
    clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 80%);
  }

  .main-title {
    font-size: 2.8rem;
  }
}

@media (max-width: 768px) {
  .cards-container {
    flex-direction: column;
    align-items: center;
  }

  .nav-links {
    gap: 1rem;
  }

  .main-title {
    font-size: 2.2rem;
  }

  .description {
    font-size: 1rem;
  }

  .button-group {
    flex-direction: column;
  }

  .get-started-btn,
  .watch-demo-btn {
    width: 100%;
  }
}

@import url('https://fonts.googleapis.com/css2?family=Mansalva&family=Manjari:wght@400;700&display=swap');

.faq-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.section-title {
  font-family: 'Mansalva', cursive;
  text-align: center;
  font-size: 2rem;
  margin: 3rem 0;
}

.stories-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  padding: 1rem;
}

.story-card {
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.story-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.parent-photo {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 1.5rem;
  margin-left: auto;
  margin-right: auto;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}

.parent-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.story-info {
  width: 100%;
}

.story-info h3 {
  font-family: 'Manjari', sans-serif;
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
  font-weight: 700;
  text-align: center;
}

.location, .family-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #666;
}

.icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.testimonial {
  font-size: 0.9rem;
  line-height: 1.6;
  color: #444;
  margin-top: 0.5rem;
  text-align: center;
}

.questions-section {
  background-color: #ffd700;
  text-align: center;
  padding: 4rem 2rem;
  margin: 4rem 0;
  border-radius: 15px;
}

.questions-section .title {
  font-family: 'Mansalva', cursive;
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.questions-section .subtitle {
  font-family: 'Mansalva', cursive;
  font-size: 1.8rem;
  margin-bottom: 2rem;
}

.questions-section .description {
  font-size: 1.1rem;
  color: #444;
  margin-bottom: 0.5rem;
}

.questions-section .support-text {
  font-size: 1rem;
  color: #666;
  margin-bottom: 2rem;
}

.contact-btn {
  background: white;
  border: none;
  padding: 0.8rem 2rem;
  border-radius: 25px;
  font-family: 'Manjari', sans-serif;
  font-weight: bold;
  cursor: pointer;
  margin-top: 2rem;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.contact-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.footer-nav {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  padding: 3rem 0;
  border-top: 1px solid #eee;
}

.nav-section h3 {
  font-family: 'Manjari', sans-serif;
  margin-bottom: 1rem;
}

.nav-section ul {
  list-style: none;
  padding: 0;
}

.nav-section ul li {
  margin-bottom: 0.5rem;
}

.nav-section ul li a {
  color: #666;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s;
}

.nav-section ul li a:hover {
  color: #333;
}

/* Responsive layout */
@media (max-width: 1200px) {
  .stories-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 900px) {
  .stories-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .questions-section .title {
    font-size: 2rem;
  }

  .questions-section .subtitle {
    font-size: 1.5rem;
  }
}

@media (max-width: 600px) {
  .faq-page {
    padding: 1rem;
  }

  .stories-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .parent-photo {
    width: 100px;
    height: 100px;
  }

  .footer-nav {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 1.5rem;
  }

  .section-title {
    font-size: 1.8rem;
    margin: 2rem 0;
  }

  .questions-section {
    padding: 2rem 1rem;
  }

  .questions-section .title {
    font-size: 1.8rem;
  }

  .questions-section .subtitle {
    font-size: 1.3rem;
  }
}

@import url('https://fonts.googleapis.com/css2?family=Mansalva&family=Manjari:wght@400;700&display=swap');

.faq-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.section-title {
  font-family: 'Mansalva', cursive;
  text-align: center;
  font-size: 2rem;
  margin: 3rem 0;
}

.walkers-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  padding: 1rem;
}

.walker-card {
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  min-width: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.walker-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.walker-photo {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 1.5rem;
  margin-left: auto;
  margin-right: auto;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}

.walker-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.walker-info {
  width: 100%;
}

.walker-info h3 {
  font-family: 'Manjari', sans-serif;
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
  font-weight: 700;
  text-align: center;
}

.location, .verification {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #666;
}

.icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.bio {
  font-size: 0.9rem;
  line-height: 1.6;
  color: #444;
  margin-top: 0.5rem;
  flex-grow: 1;
  text-align: center;
}

.questions-section {
  background-color: #ffd700;
  text-align: center;
  padding: 4rem 2rem;
  margin: 4rem 0;
  border-radius: 15px;
}

.questions-section .title {
  font-family: 'Mansalva', cursive;
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #333;
}

.questions-section .subtitle {
  font-family: 'Mansalva', cursive;
  font-size: 1.8rem;
  margin-bottom: 1rem;
  color: #333;
}

.questions-section .description {
  font-size: 1.1rem;
  color: #444;
  margin-bottom: 0.5rem;
}

.questions-section .support-text {
  font-size: 1rem;
  color: #666;
  margin-bottom: 2rem;
}

.contact-btn {
  background: white;
  border: none;
  padding: 0.8rem 2rem;
  border-radius: 25px;
  font-family: 'Manjari', sans-serif;
  font-weight: bold;
  font-size: 1rem;
  color: #333;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.contact-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.footer-nav {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  padding: 3rem 0;
  border-top: 1px solid #eee;
  margin-top: 2rem;
}

.nav-section h3 {
  font-family: 'Manjari', sans-serif;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  font-weight: 700;
  color: #333;
}

.nav-section ul {
  list-style: none;
  padding: 0;
}

.nav-section ul li {
  margin-bottom: 0.8rem;
}

.nav-section ul li a {
  color: #666;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s;
}

.nav-section ul li a:hover {
  color: #333;
}

/* Responsive layout */
@media (max-width: 1200px) {
  .walkers-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 900px) {
  .walkers-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .questions-section .title {
    font-size: 2rem;
  }

  .questions-section .subtitle {
    font-size: 1.5rem;
  }
}

@media (max-width: 600px) {
  .faq-page {
    padding: 1rem;
  }

  .walkers-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .footer-nav {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 1.5rem;
  }

  .section-title {
    font-size: 1.8rem;
    margin: 2rem 0;
  }

  .questions-section {
    padding: 2rem 1rem;
  }

  .questions-section .title {
    font-size: 1.8rem;
  }

  .questions-section .subtitle {
    font-size: 1.3rem;
  }

  .walker-photo {
    width: 100px;
    height: 100px;
  }
}

.questions-section {
  background-color: #ffd700;
  text-align: center;
  padding: 4rem 2rem;
  margin: 4rem 0;
  border-radius: 15px;
}

.contact-btn {
  background: white;
  border: none;
  padding: 0.8rem 2rem;
  border-radius: 25px;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.contact-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.dropdown-menu {
  display: none;
  position: absolute;
  background-color: white;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  z-index: 1;
  margin-top: 0px;
  margin-left: -40px;
}

.nav-item:hover .dropdown-menu {
  display: block;
}


.dropdown-link {
  display: block;
  padding: 8px 16px;
  color: black;
  text-decoration: none;
  white-space: nowrap;
}

.dropdown-link:hover {
  background-color: #f0f0f0;
}
</style>