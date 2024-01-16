<template>
  <div>
    <div class="bingo-card">
      <div v-for="(item, index) in apiData.items" :key="index" class="card-cell" @click="toggleCompletion(item)">
        <div :class="{ 'completed': item.completed }">
          <div class="startext">
            <div class="star"></div>
            <div class="card-cell-text">{{ item.task }}</div>
          </div>
          <div class="namedate">{{ item.name }}{{ item.date }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    data() {
        return {
            apiData: { items: [] },
        };
    },
    mounted() {
        fetch('/api.json')
            .then(response => response.json())
            .then(data => {
                this.apiData = data;
            })
            .catch(error => console.error('Error fetching data:', error));
    },
    methods: {
        toggleCompletion(item) {
            if (!item.completed) {
              item.name = prompt("Please enter your name") + ", ";
              item.date = new Date().toLocaleDateString([], { month: 'short', day: 'numeric' });
            } else {
              item.name = "";
              item.date = ""
            }
            item.completed = !item.completed;
            this.updateServerJsonFile();
        },
        updateServerJsonFile() {
            console.log(this.apiData.items);
            fetch('http://localhost:3000/api', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ items: this.apiData.items }),
            })
            .then(response => response.json())
            .catch(error => console.error('Error:', error));
        },
    },
};
</script>
