<template>
  <nav :class="['global-nav', { 'dimmed': isDimmed }]">
    <button
        @click="toggleSidebar"
        class="hamburger-button"
        aria-label="Toggle sidebar"
    >
      &#9776;
    </button>
    <h1 class="logo">
      <router-link to="/" class="logo-link">
        <span class="black-text">Commun</span><span class="yellow-text">ea</span>
      </router-link>
    </h1>
  </nav>
</template>

<script>
export default {
  name: 'GlobalNav',
  props: {
    isDimmed: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    toggleSidebar() {
      this.$emit('toggle-sidebar');
    }
  }
};
</script>

<style scoped>
.logo-link {
  text-decoration: none;
}

.global-nav {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  background-color: #fff;
  border-bottom: 1px solid #ddd;
  position: relative;
  z-index: 0;
  transition: opacity 0.3s ease;
  width: 100%;

}

.global-nav.dimmed {
  opacity: 0.5;
  pointer-events: none;
}


.hamburger-button {
  font-size: 24px;
  cursor: pointer;
  border: none;
  background: none;
  margin-right: 20px;
  padding: 5px;
  transition: color 0.3s;
  color: #333;
}

.hamburger-button:hover {
  color: #ffaa00;
}

.hamburger-button:focus {
  outline: none;
}

.logo {
  font-size: 32px;
  margin: 0;
  font-family: 'Arial', sans-serif;
}

.black-text {
  color: #000;
}

.yellow-text {
  color: #ffaa00;
}

@media (max-width: 600px) {
  .logo {
    font-size: 24px;
  }

  .hamburger-button {
    font-size: 20px;
    margin-right: 10px;
  }
}
</style>