<template>
  <div class="skills-page">

    <!-- Profile Navigation -->
    <div class="profile-navigation">
      <ul>
        <li :class="{ active: currentTab === 'info' }">
          <router-link to="/walker-profile" class="nav-link" @click="switchTab('info')">My Profile</router-link>
        </li>
        <li :class="{ active: currentTab === 'skills' }">
          <router-link to="/walker-skills" class="nav-link" @click="switchTab('skills')">Schedule & Skills</router-link>
        </li>
        <li :class="{ active: currentTab === 'address' }">
          <router-link to="/walker-address" class="nav-link" @click="switchTab('address')">My Address</router-link>
        </li>
        <li :class="{ active: currentTab === 'settings' }">
          <router-link to="/walker-settings" class="nav-link" @click="switchTab('settings')">Settings</router-link>
        </li>
      </ul>
    </div>

    <div class="profile-content">
      <div v-if="currentTab === 'skills'">
        <div class="profile-header">
          <h2>Availability & Skills</h2>
        </div>
        <div class="skills-form">
          <div class="form-group">
            <label for="self-introduction">Self-introduction (skills/experience)</label>
            <textarea id="self-introduction" v-model="selfIntroduction" @input="handleInputChange"></textarea>
            <label for="self-introduction">WWCC Number</label>
            <input type="text" class="id-input" v-model="wwccNum" @input="handleInputChange" />
          </div>
          <div class="form-group">
            <label>My schedule</label>
            <div class="schedule-table">
              <table>
                <thead>
                <tr>
                  <th></th>
                  <th v-for="day in days" :key="day">{{ day }}</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(time, index) in times" :key="index">
                  <td>{{ time }}</td>
                  <td v-for="day in days" :key="day">
                    <input
                        type="checkbox"
                        :name="`${day}-${time}`"
                        :checked="isChecked(day, time)"
                        @change="toggleTime(day, time)"
                    />
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="buttons-container">
            <button
                class="edit-btn"
                :disabled="!hasChanges"
                @click="saveSchedule"
                :class="{ 'btn-disabled': !hasChanges }"
            >
              Edit
            </button>
            <!--button class="close-btn">Close my application</button-->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  inject: ["apiBaseUrl"],
  name: "WalkerSkills",
  data() {
    return {
      currentTab: "skills",
      selfIntroduction: "",
      originalSelfIntroduction: "",
      originalWwccNum: "",
      days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      times: ["Morning", "Afternoon", "Evening", "Night"],
      schedule: {
        Mon: [],
        Tue: [],
        Wed: [],
        Thu: [],
        Fri: [],
        Sat: [],
        Sun: [],
      },
      originalSchedule: {},
      walkerId: null,
      hasChanges: false,
      wwccNum: "",
    };
  },

  mounted() {
    const storedWalkerId = localStorage.getItem("userId");
    if (storedWalkerId) {
      this.walkerId = storedWalkerId;
      this.loadSchedule();
    } else {
      console.error("Walker ID not found in localStorage");
    }
  },

  methods: {
    isChecked(day, time) {
      return this.schedule[day] && this.schedule[day].includes(time);
    },

    toggleTime(day, time) {
      if (this.schedule[day].includes(time)) {
        this.schedule[day] = this.schedule[day].filter((t) => t !== time);
      } else {
        this.schedule[day].push(time);
      }
      this.checkChanges(); // 每次变更时检查
    },

    saveSchedule() {
      const payload = {
        walkerId: this.walkerId,
        availableDatesTimes: JSON.stringify(this.schedule),
        skills: this.selfIntroduction,
        workingWithChildrenCheck: this.wwccNum,
      };
      axios
          .put(`${this.apiBaseUrl}/profile/updateProfile`, payload)
          .then(() => {
            alert("Schedule updated successfully!");
            window.location.reload(); // 刷新页面
          })
          .catch((error) => {
            console.error("Error saving schedule:", error);
          });
    },

    loadSchedule() {
      axios
          .get(`${this.apiBaseUrl}/profile/${this.walkerId}`)
          .then((response) => {
            const profile = response.data;
            this.selfIntroduction = profile.skills;
            this.originalSelfIntroduction = profile.skills; // 保存原始自我介绍
            console.log(profile);
            // 将字符串格式的 schedule 转换为对象
            this.schedule = this.parseSchedule(profile.availableDatesTimes);
            this.originalSchedule = JSON.parse(
                JSON.stringify(this.schedule)
            ); // 深拷贝保存原始 schedule
            this.wwccNum = profile.workingWithChildrenCheck;
            this.originalWwccNum = profile.workingWithChildrenCheck;
            console.log("Schedule loaded:", this.schedule);
          })
          .catch((error) => {
            console.error("Error loading schedule:", error);
          });
    },

    parseSchedule(scheduleString) {
      const parsedSchedule = {};
      const dayRegex = /(\w{3})=\[(.*?)\]/g;
      let match;
      while ((match = dayRegex.exec(scheduleString)) !== null) {
        const day = match[1];
        const times = match[2] ? match[2].split(", ") : [];
        parsedSchedule[day] = times;
      }
      return parsedSchedule;
    },

    handleInputChange() {
      this.checkChanges();
    },

    checkChanges() {
      this.hasChanges =
          JSON.stringify(this.schedule) !==
          JSON.stringify(this.originalSchedule) ||
          this.selfIntroduction !== this.originalSelfIntroduction ||
          this.wwccNum !== this.originalWwccNum;
    },

    switchTab(tab) {
      this.currentTab = tab;
    },
  },
};
</script>

<style scoped>
.nav-link {
  text-decoration: none;
  color: inherit;
}

.skills-page {
  display: flex;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.profile-navigation {
  width: 25%;
}

.profile-navigation ul {
  list-style-type: none;
  padding: 0;
}

.profile-navigation li {
  padding: 10px;
  cursor: pointer;
}

.profile-navigation li.active {
  background-color: #f0f0f0;
  font-weight: bold;
}

.profile-content {
  flex-grow: 1;
  width: 80%;
}

.profile-header {
  background-color: #0A2640;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-weight: bold;
  color: white;
  text-align: center;
}

.skills-form {
  background-color: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 700px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 10px;
  font-weight: bold;
}

.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-sizing: border-box;
  font-size: 16px;
  resize: vertical;
  min-height: 100px;
}

.schedule-table {
  overflow-x: auto;
}

.schedule-table table {
  width: 100%;
  border-collapse: collapse;
}

.schedule-table th,
.schedule-table td {
  padding: 10px;
  text-align: center;
  border: 1px solid #ddd;
}

.schedule-table th {
  background-color: #f7f7f7;
  font-weight: bold;
}

.schedule-table td {
  background-color: #fff;
}

.edit-btn,
.close-btn {
  background-color: #0A2640;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 6px;
  color: white;
  font-size: 16px;
  transition: background-color 0.3s;
  margin-top: 20px;
}

.edit-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.buttons-container {
  display: flex;
  justify-content: space-between;
}

.edit-btn:hover {
  background-color: #e69500;
}

.id-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}
</style>
