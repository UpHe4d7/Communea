<!-- App.vue -->
<template>
  <div id="app">
    <div v-if="showNavWrapper" class="nav-wrapper">
      <GlobalNav
          @toggle-sidebar="toggleSidebar"
          :is-dimmed="isModalOpen || showSidebar"/>
      <transition name="slide">
        <component
            :is="sidebarComponent"
            v-if="showSidebar"
            @close-sidebar="showSidebar = false"
            :is-dimmed="isModalOpen"
        />
      </transition>
    </div>
    <div class="app-content">
      <router-view />
    </div>
    <div v-if="showSidebar || isModalOpen" class="overlay" @click="handleOverlayClick"></div>
  </div>
</template>

<script>
import GlobalNav from './components/GlobalNav.vue';
import SidebarMenu from './components/SidebarMenu.vue';
import WalkerSidebarMenu from './components/WalkerSidebarMenu.vue';

export default {
  name: 'App',
  components: {
    GlobalNav,
    WalkerSidebarMenu,
    SidebarMenu,

  },


  data() {
    return {
      showSidebar: false,
      isModalOpen: false,
      routesWithoutSidebar: ['/login', '/register', '/register/walker','/', '/walker-faq', '/parent-faq', '/StatisticsPage', '/MissionStatement', '/TeamIntroduction'],
      apiBaseUrl: 'https://www.communea.net:8090',
    };
  },
  provide() {
    return {
      apiBaseUrl: this.apiBaseUrl
    };
  },
  computed: {

    showNavWrapper() {
      const currentRoute = this.$route.path;
      return !this.routesWithoutSidebar.includes(currentRoute);
    },
    // Determine which sidebar component to show based on the current route
    sidebarComponent() {
      const walkerRoutes = ['/walker-home', '/walker-profile', '/walker-detail/:id',
        '/walker-settings', '/walker-skills', '/walker-address', '/walker-agreement-details/:id',
        '/walker-my-ratings', '/walker-my-agreements', '/walker-my-applications', '/walker-profile',
        '/walker-request', '/walkerparentrequest','/request/:id','/parent-detail/:id',
      ];


      // Check if the current route is a walker route
      return walkerRoutes.some(route => {
        if (route.includes(':')) {
          const baseRoute = route.split('/:')[0];
          return this.$route.path.startsWith(baseRoute);
        }
        return this.$route.path === route;
      }) ? 'WalkerSidebarMenu' : 'SidebarMenu';
    },
  },
  methods: {
    toggleSidebar() {
      this.showSidebar = !this.showSidebar;
    },
    handleOverlayClick() {
      if (this.showSidebar) {
        this.showSidebar = false;
      }
      if (this.isModalOpen) {
        this.closeModal();
      }
    },
    openModal() {
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
    }
  },
};
</script>

<style>
#app {
  display: flex;
  flex-direction: column;
  position: relative;
}

.nav-wrapper {
  display: flex;
  position: relative;
}

.app-content {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  padding: 20px;
}

.slide-enter-active, .slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from, .slide-leave-to {
  transform: translateX(-100%);
}
.slide-enter-to, .slide-leave-from {
  transform: translateX(0);
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.sidebar {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1000;
}

.home {
  flex-grow: 1;
}
</style>