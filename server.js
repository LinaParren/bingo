import express  from 'express';
import fs  from 'fs';
import cors  from 'cors';

// Create Express app
const app = express();

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors())
app.use(express.json());

var corsOptions = {
  // Allow requests from this origin
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200
}

app.get('/api', cors(corsOptions),(req, res) => {
  // Read the contents of 'api.json'
  const rawData = fs.readFileSync('api.json');
  // Parse JSON data
  const data = JSON.parse(rawData);
  // Respond with JSON data
  res.json(data);
});

app.post('/api', cors(corsOptions), (req, res) => {
  // Get updated items from request
  const updatedItems = req.body.items;
  // Read the contents of 'api.json'
  const rawData = fs.readFileSync('api.json');
  // Parse JSON data
  const data = JSON.parse(rawData);

  // Update items in api.json with new data
  data.items.forEach((item, index) => {
    item.completed = updatedItems[index].completed;
    item.name = updatedItems[index].name;
    item.date = updatedItems[index].date;
  });
  // Change data in 'api.json' to updated data
  fs.writeFileSync('api.json', JSON.stringify(data, null, 2));

  res.json(data);
});
