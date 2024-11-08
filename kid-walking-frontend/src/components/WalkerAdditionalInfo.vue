<template>
  <div class="additional-info-page">
    <div class="additional-info-container">
      <h1>Create account</h1>
      <p>A Vibrant Parent Walker Community</p>
      <div class="form-group">
        <label for="self-introduction">Self-introduction(skills/experience)</label>
        <textarea id="self-introduction" v-model="selfIntroduction" @input="handleInputChange"></textarea>
      </div>
      <div class="form-group">
        <label>Set your schedule</label>
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
      <div class="button-group">
        <button class="start-button" @click="handleSubmit">Start</button>
        <button class="skip-button" @click="skip">Skip</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  inject: ['apiBaseUrl'],
  data() {
    return {
      selfIntroduction: '',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      times: ['Morning', 'Afternoon', 'Evening', 'Night'],
      schedule: {
        Mon: [],
        Tue: [],
        Wed: [],
        Thu: [],
        Fri: [],
        Sat: [],
        Sun: [],
      },
      scheduleType: 'Weekly'
    };
  },
  methods: {
    // check if the time is checked
    isChecked(day, time) {
      return this.schedule[day] && this.schedule[day].includes(time);
    },

    // toggle the time
    toggleTime(day, time) {
      if (this.schedule[day].includes(time)) {
        this.schedule[day] = this.schedule[day].filter((t) => t !== time);
      } else {
        this.schedule[day].push(time);
      }
      this.checkChanges(); // 每次变更时检查
    },
    // monitor changes
    handleInputChange() {
      this.checkChanges();
    },

    // check if there are changes
    checkChanges() {
      this.hasChanges =
          JSON.stringify(this.schedule) !==
          JSON.stringify(this.originalSchedule) ||
          this.selfIntroduction !== this.originalSelfIntroduction;
    },
    handleSubmit() {
      const walkerId = localStorage.getItem('userId');
      // prepare data to send
      const profileData = {
        walkerId: walkerId,
        availableDatesTimes: this.schedule,
        skills: this.selfIntroduction, // 示例技能，传递为字符串
        availableDate: '',
        timePeriod: 'Morning',
        scheduleType: this.scheduleType
      };
      console.log(profileData);
      // send POST request
      axios.post(`${this.apiBaseUrl}/profile/saveProfile`, profileData)
          .then(response => {
            console.log('Profile created successfully:', response.data);
            this.$router.push({ path: '/walker-home'});
          })
          .catch(error => {
            console.error('Error creating profile:', error);
          });
    },
    skip() {
      // skip to the next page
      const walkerId = localStorage.getItem('userId');
      // 准备要发送的数据
      const profileData = {
        availableDate: '',
        availableDatesTimes: {
            Mon: [],
            Tue: [],
            Wed: [],
            Thu: [],
            Fri: [],
            Sat: [],
            Sun: [],
        },
        skills: '',
        timePeriod: 'Moring',
        walkerId: walkerId,
        workingWithChildrenCheck: '0',
        scheduleType: this.scheduleType
      };
      // send POST request
      axios.post(`${this.apiBaseUrl}/profile/saveProfile`, profileData)
          .then(response => {
            console.log('Profile created successfully:', response.data);
            this.$router.push({ path: '/walker-home'});
          })
          .catch(error => {
            console.error('Error creating profile:', error);
          });
    }
  }
};
</script>

<style scoped>
.additional-info-page {
  display: flex;
  height: 100vh;
  width: 100vw;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #0A2640;
  padding: 20px;
}

.additional-info-container {
  background-color: #fff;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
}

h1 {
  font-size: 24px;
  margin-bottom: 8px;
  font-weight: bold;
}

p {
  font-size: 14px;
  margin-bottom: 20px;
  color: #666;
}

.form-group {
  margin-bottom: 20px;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #333;
}

textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: vertical;
  font-size: 14px;
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

.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.start-button, .skip-button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.start-button {
  background-color: #000;
  color: #fff;
}

.skip-button {
  background-color: transparent;
  color: #000;
}
</style>