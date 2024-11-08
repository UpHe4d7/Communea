<template>
  <div class="container">
    <div class="yellow-box"></div>
    <!-- 左侧的 Walker 信息框 -->
    <div class="walker-info" :class="{ collapsed: isCollapsed }">
      <div class="header" @click="toggleWalkerInfo">
        <span class="header-text">{{ isCollapsed ? 'expand' : 'collapse' }}</span>
      </div>
      <div class="content" v-if="!isCollapsed">
        <img :src="agreement.avatar" :alt="agreement.firstName" class="user-image-large">
        <h3 class="walker-name">{{ agreement.firstName+" "+agreement.lastName }}</h3>
        <h3 class="walker-name">Child: {{ agreement.childName }}</h3>
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
          <button @click="toggleLocationSharing" class="sharing-button">
            {{ sharing ? 'Stop sharing location' : 'Start sharing location' }}
          </button>
            <button calss="back-buttons" @click="handleGoBack">Back</button>
            <button class="finish-buttons" @click="handleFinish">Finish</button>
            <button class="cancel-buttons" @click="handleCancel">Cancel</button>

        </div>
      </div>
    </div>

    <!-- 地图容器 -->
    <div id="map" class="map"></div>


  </div>
</template>
<script>
export default {
  props: {
    agreement: Object, // 接收父组件传来的 agreement 对象
  },
  data() {
    return {
      google: null,
      isCollapsed: false,  // 控制信息框的折叠/展开
      walker: {
        name: "Mia",
        duration: 20,
        distance: 15,
        startLocation: "Victoria Park, Parramatta Rd, Broadway, NSW, 2008",
        endLocation: "1D Greenbank St, Hurstville, NSW, 2220",
      },
      map: null,  // 地图实例
      walkerSocket: null,  // Walker WebSocket
      parentSocket: null,  // Parent WebSocket
      sharing: false, // Walker 是否在共享位置
      receiving: false, // 是否在接收位置
      watchID: null, // Geolocation 的 watchPosition ID
      walkerMarker: null, // 用于 Parent 端显示 Walker 位置
      walkerId: this.agreement.walkerId,
      agreementId: this.agreement.agreementId,
      parentId: this.agreement.parentId,
    };
  },
  mounted() {
    this.loadGoogleMaps();
  },
  methods: {
    handleGoBack() {
      this.$emit('goBack');
    },
    handleCancel() {
      // 触发父组件的 cancel 事件
      this.$emit('cancel', this.agreement.agreementId);
    },
    handleFinish() {
      // 触发父组件的 finish 事件
      this.$emit('finish', this.agreement.agreementId);
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

    toggleLocationSharing() {
      this.toggleReceiving();
      if (this.sharing) {
        this.stopSharingLocation();
      } else {
        this.startSharingLocation();
      }
    },

    toggleReceiving() {
      if (this.receiving) {
        this.stopReceivingLocation();
      } else {
        this.startReceivingLocation();
      }
    },

    startSharingLocation() {
      if ("geolocation" in navigator) {
        this.walkerSocket = new WebSocket("wss://www.communea.net:8090/ws/walker");

        this.walkerSocket.onopen = () => {
          console.log("Walker WebSocket connection established.");
          this.sharing = true;
        };

        this.walkerSocket.onclose = () => {
          console.log("Walker WebSocket connection closed.");
          this.sharing = false;
        };

        this.walkerSocket.onerror = (error) => {
          console.error("Walker WebSocket error:", error);
        };

        this.watchID = navigator.geolocation.watchPosition(
            (position) => {
              const pos = {
                walkerId: this.walkerId,
                agreementId: this.agreementId,
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                timestamp: new Date().toISOString(),
              };

              console.log("Sending position:", pos);

              if (this.walkerSocket && this.walkerSocket.readyState === WebSocket.OPEN) {
                this.walkerSocket.send(JSON.stringify(pos));
              }
            },
            (error) => {
              console.error("Error in retrieving position:", error);
            },
            { enableHighAccuracy: true }
        );
      }
    },

    stopSharingLocation() {
      if (this.walkerSocket) {
        this.walkerSocket.close();
      }
      if (this.watchID) {
        navigator.geolocation.clearWatch(this.watchID);
      }
      this.sharing = false;
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
    this.stopSharingLocation();
    this.stopReceivingLocation();
  }
};
</script>
<style scoped>
.container {
  position: relative;
  width: 100%;
  height: 100dvh;
  background-color: #f5f5f5;
}

.map {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.yellow-box {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  background-color: #0A2640;
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.walker-info {
  position: absolute;
  top: 70px;
  left: 12px;
  right: 12px;
  z-index: 2;
  max-width: 500px;
  margin: 0 auto;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.header {
  padding: 12px;
  cursor: pointer;
  text-align: center;
  border-bottom: 1px solid #f0f0f0;
}

.header-text {
  color: #007AFF;
  font-weight: 500;
}

.content {
  padding: 16px;
}

.collapsed {
  width: auto;
  height: 44px;
  overflow: hidden;
}

.user-image-large {
  width: 70px;
  height: 70px;
  border-radius: 35px;
  margin: 0 auto;
  display: block;
  object-fit: cover;
}

.walker-name {
  text-align: center;
  font-size: 22px;
  font-weight: 600;
  margin: 8px 0;
}

.duration-text {
  text-align: center;
  color: #666;
  margin: 8px 0 16px;
  font-size: 15px;
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

.location-name {
  font-size: 15px;
  font-weight: 500;
  color: #000;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.location-address {
  font-size: 13px;
  color: #666;
  margin: 2px 0 0 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.button-container {
  position: relative;
  margin-top: 20%;
}

.action-button {
  width: 100%;
  padding: 16px;
  border-radius: 12px;
  border: none;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s;
  -webkit-tap-highlight-color: transparent;
}

.sharing-button {
  background: #007AFF;
  color: white;
}
.cancel-buttons {
  background: #8e8e93;
  color: white;
}
.finish-buttons {
  background: #FFAA00;
  color: white;
}

.receiving-button {
  background: white;
  color: #007AFF;
  border: 1px solid #007AFF;
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

  .button-container {
    bottom: max(32px, env(safe-area-inset-bottom));
    padding-left: env(safe-area-inset-left);
    padding-right: env(safe-area-inset-right);
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

  .duration-text,
  .location-address {
    color: #8e8e93;
  }

  .start-dot,
  .end-dot {
    background-color: #fff;
    border-color: #fff;
  }

  .receiving-button {
    background: #1c1c1e;
  }

  .header {
    border-bottom-color: #2c2c2e;
  }
}

/* 响应式布局 */
@media (min-width: 768px) {
  .walker-info {
    left: 20px;
    right: auto;
    width: 320px;
    margin: 0;
  }

  .button-container {
    left: 20px;
    right: auto;
    width: 320px;
    margin: 0;
  }
}
</style>