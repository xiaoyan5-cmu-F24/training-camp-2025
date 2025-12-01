const express = require('express');
const cors = require('cors');
const products = require('./products-data');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.get('/api/products', (req, res) => {
  // Simulate network delay
  setTimeout(() => {
    res.json(products);
  }, 500);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
