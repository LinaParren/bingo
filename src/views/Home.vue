<template>
  <div>
    <div class="bingo-card">
      <div v-for="(item, index) in apiData.items" :key="index" class="card-cell" @click="toggleCompletion(item)">
        <div :class="{ 'completed': item.completed }">
          <div class="star"></div>
          <div class="card-cell-text">{{ item.name }}</div>
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
            item.completed = !item.completed;
            this.updateServerJsonFile();
        },
        updateServerJsonFile() {
            console.log(this.apiData.items);
            fetch('/api.json', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ items: this.apiData.items }),
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
            })
            .catch(error => console.error('Error:', error));
            },
    },
};
</script>
