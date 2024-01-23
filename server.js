import express  from 'express';
import fs  from 'fs';
import cors  from 'cors';

const app = express();

app.use(express.json());
app.use(cors())

var corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200
}

app.get('/api', cors(corsOptions),(req, res) => {
  console.log(req)
  const rawData = fs.readFileSync('api.json');
  const data = JSON.parse(rawData);
  res.json(data);
});

app.post('/api', cors(corsOptions), (req, res) => {
  const updatedItems = req.body.items;
  const rawData = fs.readFileSync('api.json');
  const data = JSON.parse(rawData);

  data.items.forEach((item, index) => {
    item.completed = updatedItems[index].completed;
    item.name = updatedItems[index].name;
    item.date = updatedItems[index].date;
  });
  fs.writeFileSync('api.json', JSON.stringify(data, null, 2));

  res.json(data);
});

app.listen(3000, () => {
    console.log(`server.js zegt: Example app listening on port ${3000}`)
})
