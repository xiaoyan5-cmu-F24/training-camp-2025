const express = require('express');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const products = [
  {
    id: 1,
    name: "Wireless Noise-Cancelling Headphones",
    price: 299.99,
    description: "Premium over-ear headphones with industry-leading noise cancellation and 30-hour battery life.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    name: "Smartphone 15 Pro",
    price: 999.00,
    description: "The latest smartphone featuring a titanium design, A17 Pro chip, and advanced camera system.",
    image: "https://plus.unsplash.com/premium_photo-1666298863696-8e8da5d85f2b?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    name: "4K Ultra HD Smart TV",
    price: 499.50,
    description: "55-inch 4K TV with HDR10+, voice control, and built-in streaming apps.",
    image: "https://plus.unsplash.com/premium_photo-1681236323432-3df82be0c1b0?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 4,
    name: "Mechanical Gaming Keyboard",
    price: 129.99,
    description: "RGB backlit mechanical keyboard with hot-swappable switches and dedicated media controls.",
    image: "https://plus.unsplash.com/premium_photo-1664194583917-b0ba07c4ce2a?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 5,
    name: "Ergonomic Office Chair",
    price: 249.00,
    description: "Mesh back office chair with adjustable lumbar support and headrest for all-day comfort.",
    image: "https://plus.unsplash.com/premium_photo-1671656349007-0c41dab52c96?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 6,
    name: "Portable SSD 1TB",
    price: 89.99,
    description: "High-speed portable solid-state drive with USB-C connectivity and rugged design.",
    image: "https://plus.unsplash.com/premium_photo-1721133260774-84f57d69cb82?auto=format&fit=crop&w=600&q=80"
  }
];

app.get('/api/products', (req, res) => {
  // Simulate network delay
  setTimeout(() => {
    res.json(products);
  }, 500);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
