<template>
  <div>
    <div class="popup-bingo" v-if="bingo">
      <h2>bingo!!</h2>
      <p>time for a mario kart game night</p>
    </div>
    <div class="bingo-card">
      <div v-for="(item, index) in apiData.items" :key="index" class="card-cell" @click="toggleComplete(item)">
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
      rows: 5,
      cols: 5,
      bingo: false
    };
  },
  mounted() {
    fetch('/api.json')
      .then(response => response.json())
      .then(data => {
        this.apiData = data;
        this.markNumber();
      })
      .catch(error => console.error('Error fetching data:', error));
  },
  methods: {
    toggleComplete(item) {
        if (!item.completed) {
          item.name = prompt("Please enter your name") + ", ";
          item.date = new Date().toLocaleDateString([], { month: 'short', day: 'numeric' });
        } else {
          item.name = "";
          item.date = ""
        }
        item.completed = !item.completed;
        this.updateAPI();
        this.markNumber();
    },
    updateAPI() {
        // console.log(this.apiData.items);
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
    markNumber() {
      this.bingo = false;
      for (let column = 0; column < this.cols; column++) {
        let columnComplete = true;
        let rowComplete = true;
        for (let row = 0; row < this.rows; row++) {
          const vertical = column + (row * this.cols);
          const horizontal = row + (column * this.cols);
          if (!this.apiData.items[vertical].completed) {
            columnComplete = false;
          }
          if (!this.apiData.items[horizontal].completed) {
            rowComplete = false;
          }
          if (row == this.rows - 1) {
            // console.log(`Row ${column + 1} complete?`, rowComplete);
            if (rowComplete) this.bingo = true;
          }
        }
        // console.log(`Column ${column + 1} complete?`, columnComplete);
        if (columnComplete) this.bingo = true;
      }


      const diagonalLeft = [];
      const diagonalRight = [];
      for (let i = 0; i <= ((this.rows * this.cols) - 1); i += this.cols + 1) {
        diagonalLeft.push(i);
      }
      for (let i = this.rows - 1; i < ((this.rows * this.cols) - 1); i += this.cols - 1) {
        diagonalRight.push(i);
      }
      const diagLeftComplete = diagonalLeft.every(i => this.apiData.items[i].completed);
      const diagRightComplete = diagonalRight.every(i => this.apiData.items[i].completed);
      // console.log('Diagonal from left complete?', diagLeftComplete);
      // console.log('Diagonal from right complete?', diagRightComplete);
      if (diagLeftComplete == true || diagRightComplete == true) {
        this.bingo = true;
      }
    }
  }
};
</script>

<!--
  Horizontal:
    1, 2, 3, 4, 5
    6, 7, 8, 9, 10
    11, 12, 13, 14, 15
    16, 17, 18, 19, 20
    12, 22, 23, 24, 25

  Vertical:
    0, 5, 10, 15, 20
    1, 6, 11, 16, 21
    2, 7, 12, 17, 22
    3, 8, 13, 18, 23
    4, 9, 14, 19, 24

  Diagonal from left
    1, 7, 13, 19, 25

  Diagonal from right
    5, 9, 13, 17, 21
-->
