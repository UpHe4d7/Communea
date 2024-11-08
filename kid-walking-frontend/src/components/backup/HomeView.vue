<template>
  <div class="home-view">
    <div class="content-wrapper">
      <div class="statistics">
        <p><strong>{{ walkers.length }}</strong> Walkers results near 2220 (+{{ filter.radius }} km)</p>
        <a href="#" class="filter" @click.prevent="showFilterModal = true">+ Filter</a>
      </div>
      <div class="results-list">
        <!-- 为每个 walker 添加点击事件 -->
        <div class="result-item" v-for="walker in walkers" :key="walker.id" @click="goToDetail(walker.id)">
          <img :src="walker.image" alt="Walker Image" class="walker-image" />
          <div class="walker-info">
            <h2>{{ walker.name }}</h2>
            <p class="location">{{ walker.location }}</p>
            <div class="rating-age">
              <div class="rating">
                <span v-for="star in walker.rating" :key="star" class="star">★</span>
                <span v-for="n in 5 - walker.rating" :key="n" class="star empty">☆</span>
                <span class="rating-count">({{ walker.ratingCount }})</span>
              </div>
              <div class="age-label">Age: {{ walker.age }}</div>
            </div>
            <p class="description">{{ walker.description }}</p>
          </div>
        </div>
      </div>

      <!-- 筛选模态框 -->
      <div v-if="showFilterModal" class="modal-overlay" @click.self="showFilterModal = false">
        <div class="filter-modal">
          <h3>Filter Options</h3>
          <form @submit.prevent="applyFilter">

            <div class="form-group">
              <label for="radius">Radius (km):</label>
              <select v-model="filter.radius" id="radius">
                <option value="2">2 km</option>
                <option value="3">3 km</option>
                <option value="5">5 km</option>
              </select>
            </div>
            <button type="submit">Apply</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
  data() {
    return {
      userId: '',
      walkers: [
        {
          id: 1,
          name: 'Mia D.',
          location: 'Paddington, Sydney',
          rating: 4,
          ratingCount: 6,
          age: 54,
          description: "Hello parents! As an experienced Walker with a valid Working with Children Check and years of childcare experience...",
          image: '/images/image1.jpg'
        },
        {
          id: 2,
          name: 'vienna I.',
          location: 'Ashfield, Ashfield',
          rating: 5,
          ratingCount: 1,
          age: 30,
          description: "Early started until 6pm. Long hours daily ONLY. English / Mandarin / Cantonese Speaker...",
          image: '/images/image2.jpg'
        }
      ],
      showFilterModal: false,
      filter: {
        location: '',
        radius: '5'
      }
    };
  },
  mounted() {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      this.userId = storedUserId; // 从 localStorage 读取并赋值
      console.log(this.userId)
    } else {
      // 如果没有 userId，重定向回登录页面
      window.location.href = '/login';
    }
  },

  methods: {
    goToDetail(walkerId) {
      // 使用路由导航到详情页，并传递参数
      this.$router.push({ name: 'WalkerDetail', params: { id: walkerId } });
    },
    applyFilter() {
      console.log('Applying filter with:', this.filter);
      // 这里可以添加筛选逻辑，例如重新获取数据
      this.showFilterModal = false; // 关闭模态框
    }
  }
};
</script>

<style scoped>
.home-view {
  display: flex;
  justify-content: center;
  padding: 20px;
}

.content-wrapper {
  max-width: 800px; /* 设置最大宽度 */
  width: 100%; /* 让容器的宽度自适应 */
  background-color: #fff; /* 大框背景色 */
  border: 1px solid #ddd; /* 大框边框 */
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* 添加阴影 */
}

.statistics {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.filter {
  color: #ffaa00; /* 与 Communea 的黄色相同 */
  text-decoration: none;
  cursor: pointer;
}

.results-list {
  display: flex;
  flex-direction: column;
}

.result-item {
  display: flex;
  align-items: flex-start; /* 确保图片和内容顶部对齐 */
  margin-bottom: 20px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
}

.walker-image {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-right: 20px;
}

.walker-info {
  flex-grow: 1;
}

.walker-info h2 {
  margin: 0;
  font-size: 18px;
}

.location {
  color: #666;
  margin: 5px 0;
}

.rating-age {
  display: flex;
  align-items: center;
  margin: 5px 0;
}

.rating {
  display: flex;
  align-items: center;
  margin-right: 10px;
}

.star {
  color: #ffaa00; /* 星级颜色 */
}

.star.empty {
  color: #ddd; /* 空星颜色 */
}

.rating-count {
  margin-left: 5px;
  color: #666;
}

.age-label {
  background-color: #f3f3f3;
  border-radius: 4px;
  padding: 3px 6px;
  font-size: 14px;
  color: #333;
}

.description {
  margin-top: 10px;
  color: #333;
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.filter-modal {
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.form-group {
  margin-bottom: 15px;
}

button {
  padding: 8px 16px;
  background-color: #ffaa00;
  border: none;
  color: #fff;
  cursor: pointer;
  border-radius: 4px;
}
</style>
