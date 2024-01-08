const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());

app.get('/api', (req, res) => {
  const rawData = fs.readFileSync('api.json');
  const data = JSON.parse(rawData);
  res.json(data);
});

app.post('/api', (req, res) => {
  const updatedItems = req.body.items;
  const rawData = fs.readFileSync('api.json');
  const data = JSON.parse(rawData);

  data.items.forEach((item, index) => {
    item.completed = updatedItems[index].completed;
  });
  fs.writeFileSync('api.json', JSON.stringify(data, null, 2));

  res.json(data);
});
