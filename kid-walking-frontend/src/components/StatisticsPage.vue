<template>
  <div class="statistics-page">
    <div class="page-title">
      <h2>Administration Dashboard</h2>
    </div>

    <!-- Overview of top statistics -->
    <div class="summary-bar">
      <div class="summary-item">
        <div class="summary-title">Total Users</div>
        <div class="summary-data">
          {{ totalUsers }}
          <span v-if="newUsersLastMonth > 0" class="increase">
        ↑ {{ newUsersLastMonth }}
      </span>
          <span v-else-if="newUsersLastMonth < 0" class="decrease">
        ↓ {{ -newUsersLastMonth }}
      </span>
        </div>
      </div>
      <div class="summary-item">
        <div class="summary-title">Total Agreements</div>
        <div class="summary-data">{{ totalAgreements }}</div>
      </div>
      <div class="summary-item">
        <div class="summary-title">Total Agreements</div>
        <div class="summary-data">{{ totalAgreements }}</div>
      </div>
      <div class="summary-item">
        <div class="summary-title">Applications</div>
        <div class="summary-data">{{ totalApplications }}</div>
      </div>
      <div class="summary-item">
        <div class="summary-title">Ongoing Agreements</div>
        <div class="summary-data">{{ ongoingAgreements }}</div>
      </div>
      <div class="summary-item">
        <div class="summary-title">Total Requests</div>
        <div class="summary-data">{{ totalRequests }}</div>
      </div>
    </div>

    <!-- chart area -->
    <div class="chart-container">
      <div id="userTypePieChart" style="width: 600px; height: 400px;"></div>
      <div id="agreementTrendLineChart" style="width: 600px; height: 400px;"></div>
      <div id="applicationStatusBarChart" style="width: 600px; height: 400px;"></div>
      <div id="requestTrendLineChart" style="width: 600px; height: 400px; margin-top: 20px;"></div>
    </div>

    <!-- User evaluation message header and scroll bar -->
    <div class="section-title">User Feedback</div>
    <div class="feedback-scroll">
      <div class="feedback-content" v-for="feedback in userFeedbacks" :key="feedback.id">
        <p>"{{ feedback.comment }}" - {{ feedback.user }}</p>
      </div>
    </div>

    <!-- Map title and user geolocation -->
    <div class="section-title" style="margin-top: 30px;">User Location Map</div>
    <div id="map" class="map-container"></div>

    <div class="bottom-action">
      <button @click="goToManagerPage" class="manager-btn">Data Management</button>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

export default {
  inject: ['apiBaseUrl'],
  name: 'StatisticsPage',
  data() {
    return {
      totalUsers: 0,
      totalAgreements: 0,
      newUsersLastMonth: 0,
      totalApplications: 0,
      ongoingAgreements: 0,
      totalRequests: 0,
      userTypeData: [],
      agreementTrendData: [],
      applicationStatusData: [],
      requestTrendData: [],
      userFeedbacks: [],
      userLocations: [],
    };
  },
  mounted() {
    this.initializeData().then(() => {
      console.log("Total Users:", this.totalUsers);
      console.log("New Users Last Month:", this.newUsersLastMonth);
    });
  },
  methods: {
    async initializeData() {
      await this.fetchUserData();
      await this.fetchAgreementData();
      await this.fetchApplicationData();
      await this.fetchRequestData();
      await this.fetchAddressData();
      await this.fetchCommentsData();
      this.renderUserTypePieChart();
      this.renderAgreementTrendLineChart();
      this.renderApplicationStatusBarChart();
      this.renderRequestTrendLineChart();
      this.initMap();
    },
    async fetchUserData() {
      try {
        const response = await axios.get(`${this.apiBaseUrl}/user/all`);
        const users = response.data;
        this.totalUsers = users.length;

        const userTypeCount = { Parent: 0, Walker: 0 };
        users.forEach(user => {
          userTypeCount[user.userType] += 1;
        });

        this.userTypeData = [
          { type: 'Parent', count: userTypeCount.Parent },
          { type: 'Walker', count: userTypeCount.Walker }
        ];

        // check userTypeData
        console.log("User Type Data:", this.userTypeData);

      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    },

    goToManagerPage() {
      this.$router.push('/ManagerHome');
    },

    async fetchAgreementData() {
      try {
        const response = await axios.get(`${this.apiBaseUrl}/agreements/all`);
        const agreements = response.data;
        this.totalAgreements = agreements.length;
        this.ongoingAgreements = agreements.filter(a => a.status === 'In Progress').length;
        const trendData = {};
        agreements.forEach(agreement => {
          const month = agreement.startTime.slice(0, 7);
          trendData[month] = (trendData[month] || 0) + 1;
        });
        this.agreementTrendData = Object.keys(trendData).map(date => ({
          date,
          count: trendData[date]
        }));
      } catch (error) {
        console.error('Error fetching agreement data:', error);
      }
    },
    async fetchApplicationData() {
      try {
        const response = await axios.get(`${this.apiBaseUrl}/applications/all`);
        const applications = response.data;
        this.totalApplications = applications.length;
        const statusCount = {};
        applications.forEach(app => {
          statusCount[app.applicationStatus] = (statusCount[app.applicationStatus] || 0) + 1;
        });
        this.applicationStatusData = Object.keys(statusCount).map(status => ({
          status,
          count: statusCount[status]
        }));
      } catch (error) {
        console.error('Error fetching application data:', error);
      }
    },
    async fetchRequestData() {
      try {
        const response = await axios.get(`${this.apiBaseUrl}/requests/all`);
        const requests = response.data;
        this.totalRequests = requests.length;
        const trendData = {};
        requests.forEach(request => {
          const month = request.updatedAt.slice(0, 7);
          trendData[month] = (trendData[month] || 0) + 1;
        });
        this.requestTrendData = Object.keys(trendData).map(date => ({
          date,
          count: trendData[date]
        }));
      } catch (error) {
        console.error('Error fetching request data:', error);
      }
    },
    async fetchAddressData() {
      try {
        const response = await axios.get(`${this.apiBaseUrl}/address/all`);
        const addresses = response.data;

        this.userLocations = addresses
            .filter(address => address.latitude && address.longitude) // Filter out addresses without latitude and longitude
            .map(address => ({
              lat: parseFloat(address.latitude),
              lng: parseFloat(address.longitude),
            }));
      } catch (error) {
        console.error('Error fetching address data:', error);
      }
    },
    async fetchCommentsData() {
      try {
        const response = await axios.get(`${this.apiBaseUrl}/agreements/comments/all`);
        const comments = response.data;

        this.userFeedbacks = comments
            .filter(comment => comment.comments) // Excluding comments that are null or empty strings
            .map(comment => ({
              id: comment.agreementId,
              user: `${comment.firstName} ${comment.lastName}`,
              comment: comment.comments,
            }));
      } catch (error) {
        console.error('Error fetching comments data:', error);
      }
    },

    renderUserTypePieChart() {
      const chart = echarts.init(document.getElementById('userTypePieChart'));
      const option = {
        title: { text: 'User Type Ratio', left: 'center' },
        tooltip: { trigger: 'item' },
        series: [
          {
            name: 'User Type',
            type: 'pie',
            radius: '50%',
            data: this.userTypeData.map(item => ({ value: item.count, name: item.type })),
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
      chart.setOption(option);
    },

    renderAgreementTrendLineChart() {
      const chart = echarts.init(document.getElementById('agreementTrendLineChart'));
      const option = {
        title: {text: 'Agreement Trend Over Time', left: 'center'},
        tooltip: {trigger: 'axis'},
        xAxis: {type: 'category', data: this.agreementTrendData.map(item => item.date)},
        yAxis: {type: 'value', name: 'Count'},
        series: [{name: 'Agreements', type: 'line', data: this.agreementTrendData.map(item => item.count)}]
      };
      chart.setOption(option);
    },
    renderApplicationStatusBarChart() {
      const chart = echarts.init(document.getElementById('applicationStatusBarChart'));
      const option = {
        title: { text: 'Application Status Distribution', left: 'center' },
        tooltip: { trigger: 'axis' },
        xAxis: {
          type: 'category',
          data: this.applicationStatusData.map(item => item.status),
          name: 'Status',
          axisLabel: {
            rotate: 45, // Rotation angle (displayed diagonally downwards)
            interval: 0, // Show all tags
            color: '#333' // Label Colour
          }
        },
        yAxis: { type: 'value', name: 'Count' },
        series: [
          {
            name: 'Application Status',
            type: 'bar',
            data: this.applicationStatusData.map(item => ({
              value: item.count,
              itemStyle: {
                color: this.getStatusColor(item.status) // Custom colours based on status
              }
            })),
            barWidth: '50%'
          }
        ],
      };
      chart.setOption(option);
    },

// 自定义函数：返回每种状态的颜色
    getStatusColor(status) {
      switch (status) {
        case 'agreed':
          return '#4CAF50'; // green
        case 'cancelled':
          return '#FF5722'; // red
        case 'waiting for parents response':
          return '#FF9800'; // orange
        default:
          return '#2196F3'; // blue
      }
    },

    renderRequestTrendLineChart() {
      const chart = echarts.init(document.getElementById('requestTrendLineChart'));
      const option = {
        title: {text: 'Request Trend Over Time', left: 'center'},
        tooltip: {trigger: 'axis'},
        xAxis: {type: 'category', data: this.requestTrendData.map(item => item.date)},
        yAxis: {type: 'value', name: 'Count'},
        series: [{name: 'Requests', type: 'line', data: this.requestTrendData.map(item => item.count)}]
      };
      chart.setOption(option);
    },
    initMap() {
      const map = L.map('map').setView([-33.8688, 151.2093], 10);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);
      const redDotIcon = L.divIcon({
        className: 'custom-red-dot',
        html: '<div style="width: 10px; height: 10px; background-color: red; border-radius: 50%;"></div>'
      });
      this.userLocations.forEach(location => {
        L.marker([location.lat, location.lng], {icon: redDotIcon}).addTo(map);
      });
    }
  }
};
</script>

<style scoped>
.page-title {
  width: 100%;
  padding: 15px;
  background-color: #f0f0f0;
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.summary-bar {
  display: flex;
  justify-content: space-around;
  width: 100%;
  padding: 20px 0;
  background-color: #f5f5f5;
}

.summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.summary-title {
  font-weight: bold;
  font-size: 16px;
  color: #333;
}

.summary-data {
  font-size: 24px;
  color: #4CAF50;
  display: flex;
  align-items: center;
}

.increase {
  color: green;
  margin-left: 5px;
}

.decrease {
  color: red;
  margin-left: 5px;
}

.chart-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  width: 100%;
  padding: 20px 0;
}

.section-title {
  width: 100%;
  padding: 10px;
  background-color: #f0f0f0;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  margin-top: 30px;
  margin-bottom: 10px;
}

.feedback-scroll {
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  background-color: #f9f9f9;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
}

.map-container {
  width: 100%;
  height: 400px;
  margin-top: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.custom-red-dot {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 底部按钮样式 */
.bottom-action {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.manager-btn {
  background-color: #ffaa00;
  color: white;
  border: none;
  padding: 12px 24px;
  cursor: pointer;
  border-radius: 4px;
  font-size: 16px;
}

.manager-btn:hover {
  background-color: #ff9900;
}
</style>
