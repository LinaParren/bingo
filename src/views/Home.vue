<template>
  <div>
    <!-- Popup that shows when bingo == true -->
    <div class="popup-bingo" v-if="bingo">
      <h2>bingo!!</h2>
      <p>time for a mario kart game night</p>
    </div>
    <!-- Bingo card is created based on items in listAPI -->
    <div class="bingo-card">
      <!-- Click on item runs markItem() -->
      <div v-for="(item, index) in listAPI.items" :key="index" class="card-cell" @click="markItem(item)">
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
      listAPI: { items: [] },
      rows: 5,
      cols: 5,
      bingo: false
    };
  },
  mounted() {
    // Get the data from api.json
    fetch('/api.json')
      .then(response => response.json())
      .then(data => {
        this.listAPI = data;
        this.checkBingo();
      })
      .catch(error => console.error('Error fetching data:', error));
  },
  methods: {
    // Function that marks an item when clicked
    markItem(item) {
        // Do if item has not been marked yet
        if (!item.completed) {
          // Ask user for name, this will be displayed on the marked item
          item.name = prompt("Please enter your name") + ", ";
          // Get date at time of click, this will be displayed on the marked item
          item.date = new Date().toLocaleDateString([], { month: 'short', day: 'numeric' });
        } else {
          // If item was clicked, switch back to not-clicked state
          item.name = "";
          item.date = ""
        }
        // Change value for .completed in api.json
        item.completed = !item.completed;
        // Run following functions
        this.updateAPI();
        this.checkBingo();
    },
    updateAPI() {
        // Save the changes to items in api.json
        fetch('http://localhost:3000/api', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ items: this.listAPI.items }),
        })
        .then(response => response.json())
        .catch(error => console.error('Error:', error));
    },
    checkBingo() {
      // Set bingo = false to start with
      this.bingo = false;
      // Get keys that form columns
      for (let column = 0; column < this.cols; column++) {
        // Set all columns and all rows to true
        let columnComplete = true;
        let rowComplete = true;
        // Get keys that form rows
        for (let row = 0; row < this.rows; row++) {
          // Each item in order to make columns, from left to right
          const vertical = column + (row * this.cols);
          // Each item in order to make rows, from top to bottom
          const horizontal = row + (column * this.cols);
          if (!this.listAPI.items[vertical].completed) {
            // If an item in vertical is not completed, set columnComplete = false
            columnComplete = false;
          }
          if (!this.listAPI.items[horizontal].completed) {
            // If an item in horizontal is not completed, set rowComplete = false
            rowComplete = false;
          }
          // For each row, set bingo == true if rowComplete == true
          if (row == this.rows - 1) {
            if (rowComplete) this.bingo = true;
          }
        }
        // For each column, set bingo == true if columnComplete == true
        if (columnComplete) this.bingo = true;
      }

      // Make arrays to store keys for diagonalLeft and diagonalRight
      const diagonalLeft = [];
      const diagonalRight = [];
      // Get keys that make diagonal from top left to bottom right
      for (let i = 0; i <= ((this.rows * this.cols) - 1); i += this.cols + 1) {
        // Save found keys in array
        diagonalLeft.push(i);
      }
      // Get keys that make diagonal from top right to bottom left
      for (let i = this.rows - 1; i < ((this.rows * this.cols) - 1); i += this.cols - 1) {
        // Save found keys in array
        diagonalRight.push(i);
      }
      // Make variables if all keys in array are set to completed
      const diagLeftComplete = diagonalLeft.every(i => this.listAPI.items[i].completed);
      const diagRightComplete = diagonalRight.every(i => this.listAPI.items[i].completed);
      // For diagLeftComplete and diagRightComplete, set bingo == true if either is true
      if (diagLeftComplete == true || diagRightComplete == true) {
        this.bingo = true;
      }
    }
  }
};
</script>

<!--
console.log(`Row ${column + 1} complete?`, rowComplete);
console.log(`Column ${column + 1} complete?`, columnComplete);
console.log('Diagonal from left complete?', diagLeftComplete);
console.log('Diagonal from right complete?', diagRightComplete);
-->

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
