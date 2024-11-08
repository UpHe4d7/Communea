<template>
  <div class="container">
    <div class="yellow-box"></div>
    <!-- walker info on the left -->
    <div class="walker-info" :class="{ collapsed: isCollapsed }">
      <div class="header" @click="toggleWalkerInfo">
        <span>{{ isCollapsed ? 'expand' : 'collapse' }}</span>
      </div>
      <div class="content" v-if="!isCollapsed">
        <img :src="agreement.image" :alt="agreement.name" class="user-image-large">
        <h3 class="walker-name">{{ agreement.name }}</h3>
        <div class="address-info">
          <div class="location start">
            <div class="dot start-dot"></div>
            <div class="location-text">
              <p class="location-address">🏠 {{ agreement.pickupAddress }}</p>
            </div>
          </div>
          <div class="location end">
            <div class="dot end-dot"></div>
            <div class="location-text">
              <p class="location-address">📍 {{ agreement.dropoffAddress }}</p>
            </div>
          </div>
          <button @click="toggleReceiving" class="parent-button">
            {{ receiving ? 'Stop Tracking' : 'Start Tracking' }}
          </button>
          <div/>
          <button class="back-buttons" @click="handleGoBack">Back</button>
          <button class="cancel-buttons" @click="handleCancel">Cancel</button>
        </div>
        <!-- Parent receiving location button -->
      </div>
      </div>
    <!-- map container -->
    <div id="map" class="map"></div>
  </div>
</template>
<script>
export default {
  props: {
    agreement: Object, // receive agreement data from parent component
  },
  data() {
    return {
      google: null,
      isCollapsed: false,  // control walker info display
      walker: {
        name: "Mia",
        duration: 20,
        distance: 15,
        startLocation: "Victoria Park, Parramatta Rd, Broadway, NSW, 2008",
        endLocation: "1D Greenbank St, Hurstville, NSW, 2220",
      },
      map: null,  // map object
      parentSocket: null,  // Parent WebSocket
      receiving: false, // is parent receiving location
      watchID: null, // watchPosition ID for geolocation
      walkerMarker: null, // used to show walker's location on the map
      walkerId: this.agreement.walkerId,
      agreementId: this.agreement.agreementId,
      parentId: this.agreement.parentId,
    };
  },
  mounted() {
    this.loadGoogleMaps();
  },
  methods: {
    handleCancel() {
      // cancel agreement
      this.$emit('cancel', this.agreement.agreementId);
    },
    handleGoBack() {
      this.$emit('goBack');
    },
    loadGoogleMaps() {
      if (!window.google) {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDXe-IdpOpSh-9xtIPkynjPpd9pyjztbEs`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
          this.initMap();
        };
        document.head.appendChild(script);
      } else {
        this.initMap();
      }
    },
    initMap() {
      const mapOptions = {
        center: { lat: -33.8688, lng: 151.2093 },
        zoom: 13,
        mapTypeControl: true,
        zoomControl: true,
        fullscreenControl: true,
        streetViewControl: true,
      };

      this.map = new window.google.maps.Map(document.getElementById("map"), mapOptions);
    },
    toggleWalkerInfo() {
      this.isCollapsed = !this.isCollapsed;
    },

    toggleReceiving() {
      if (this.receiving) {
        this.stopReceivingLocation();
      } else {
        this.startReceivingLocation();
      }
    },


    startReceivingLocation() {
      if (this.socket) {
        this.socket.close();
      }

      this.socket = new WebSocket("wss://www.communea.net:8090/ws/parent");

      this.socket.onopen = () => {
        console.log("Parent WebSocket connection established.");
        this.receiving = true;
        const locationData = {
          parentId: this.parentId,
          walkerId: this.walkerId,
          agreementId: this.agreementId
        };

        if (this.socket.readyState === WebSocket.OPEN) {
          console.log("Sending data to server:", locationData);
          this.socket.send(JSON.stringify(locationData));
        } else {
          console.error("WebSocket is not open. Current state:", this.socket.readyState);
        }
      };

      this.socket.onmessage = (event) => {
        console.log("Raw data received from WebSocket:", event.data);
        try {
          const locationData = JSON.parse(event.data);
          console.log("Received location data:", locationData);

          if (locationData) {
            console.log("Received raw location data:", locationData);

            let parsedData;
            try {
              parsedData = typeof locationData === 'string' ? JSON.parse(locationData) : locationData;
              console.log("Parsed location data:", parsedData);
            } catch (error) {
              console.error("Failed to parse location data:", error);
              return;
            }

            const lat = parseFloat(parsedData.lat);
            const lng = parseFloat(parsedData.lng);

            if (!isNaN(lat) && !isNaN(lng)) {
              console.log("Received valid lat:", lat);
              console.log("Received valid lng:", lng);

              const pos = { lat: lat, lng: lng };
              if (this.walkerMarker) {
                this.walkerMarker.setPosition(pos);
                this.map.setCenter(pos);
                this.map.setZoom(20);
              } else {
                console.log(pos);
                this.walkerMarker = new window.google.maps.Marker({
                  position: pos,
                  map: this.map,
                  title: "Walker's Location",
                  icon: {
                    url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                  },
                });
                this.map.setCenter(pos);
                this.map.setZoom(20);
              }
            } else {
              console.warn("Invalid lat/lng received:", lat, lng);
            }
          } else {
            console.error("Received invalid location data structure: ", locationData);
          }

        } catch (error) {
          console.error("Error parsing location data:", error);
        }
      };

      this.socket.onclose = () => {
        console.log("Parent WebSocket connection closed.");
        this.receiving = false;
      };

      this.socket.onerror = (error) => {
        console.error("Parent WebSocket error:", error);
      };
    },

    stopReceivingLocation() {
      if (this.socket) {
        this.socket.close();
      }
      this.receiving = false;
    },
  },

  beforeUnmount() {
    this.stopReceivingLocation();
  }
};
</script>
<style scoped>
.container {
  position: relative;
  width: 100%;
  height: 80dvh;
  background-color: #f5f5f5;
}

.yellow-box {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  background-color: #FFAA00;
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.map {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.walker-info {
  position: absolute;
  top: 70px;
  left: 12px;
  right: 12px;
  z-index: 2;
  max-width: 500px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.header {
  padding: 12px;
  cursor: pointer;
  text-align: center;
  font-weight: 500;
  color: #007AFF;
  border-bottom: 1px solid #f0f0f0;
}

.content {
  padding: 16px;
}

.collapsed {
  width: auto;
  height: 44px;
  overflow: hidden;
}

.walker-name {
  text-align: center;
  font-size: 22px;
  font-weight: 600;
  margin: 8px 0;
}


.user-image-large {
  width: 70px;
  height: 70px;
  border-radius: 35px;
  margin: 0 auto;
  display: block;
  object-fit: cover;
}

.address-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.location {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-top: 6px;
  flex-shrink: 0;
}

.start-dot {
  background-color: #000;
}

.end-dot {
  background-color: #000;
  border: 2px solid #000;
  background-clip: content-box;
  padding: 1px;
  box-sizing: border-box;
}

.location-text {
  flex: 1;
  min-width: 0;
}


.location-address {
  font-size: 13px;
  color: #666;
  margin: 2px 0 0 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}


.parent-button {
  bottom: 20%;
  background: white;
  color: #007AFF;
  border: 1px solid #007AFF;
  margin-top: 10%;
  margin-left: 0;
}

.action-button:active {
  opacity: 0.8;
}

/* 适配 iPhone 刘海屏 */
@supports (padding: max(0px)) {
  .container {
    padding-top: env(safe-area-inset-top);
    padding-bottom: env(safe-area-inset-bottom);
  }

  .yellow-box {
    height: max(60px, env(safe-area-inset-top) + 20px);
  }

  .walker-info {
    top: max(70px, env(safe-area-inset-top) + 30px);
  }



  .action-button.parent-button {
    bottom: max(20px, env(safe-area-inset-bottom));
  }
}

/* 深色模式支持 */
@media (prefers-color-scheme: dark) {
  .walker-info {
    background: #1c1c1e;
  }

  .walker-name,
  .location-name {
    color: #fff;
  }


  .start-dot,
  .end-dot {
    background-color: #fff;
    border-color: #fff;
  }

  .parent-button {
    background: #1c1c1e;
  }

  .header {
    border-bottom-color: #2c2c2e;
  }

  .cancel-buttons {
    background: #8e8e93;
    color: white;
    border: none;
    margin-top: 10%;
    margin-left: 0;
  }
  .cancel-buttons {
    background: #007AFF;
    color: white;
    border: none;
    margin-top: 10%;
    margin-left: 0;
  }
}


/* 响应式布局 */
@media (min-width: 768px) {
  .walker-info {
    left: 20px;
    right: auto;
    width: 320px;
  }

  .action-button {
    left: 20px;
    right: auto;
    width: 320px;
  }
}
</style>