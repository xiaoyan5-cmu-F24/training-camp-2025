const baseProducts = [
  {
    name: "Wireless Noise-Cancelling Headphones",
    price: 299.99,
    description: "Premium over-ear headphones with industry-leading noise cancellation and 30-hour battery life.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Smartphone 15 Pro",
    price: 999.00,
    description: "The latest smartphone featuring a titanium design, A17 Pro chip, and advanced camera system.",
    image: "https://plus.unsplash.com/premium_photo-1666298863696-8e8da5d85f2b?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "4K Ultra HD Smart TV",
    price: 499.50,
    description: "55-inch 4K TV with HDR10+, voice control, and built-in streaming apps.",
    image: "https://plus.unsplash.com/premium_photo-1681236323432-3df82be0c1b0?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Mechanical Gaming Keyboard",
    price: 129.99,
    description: "RGB backlit mechanical keyboard with hot-swappable switches and dedicated media controls.",
    image: "https://plus.unsplash.com/premium_photo-1664194583917-b0ba07c4ce2a?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Ergonomic Office Chair",
    price: 249.00,
    description: "Mesh back office chair with adjustable lumbar support and headrest for all-day comfort.",
    image: "https://plus.unsplash.com/premium_photo-1671656349007-0c41dab52c96?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Portable SSD 1TB",
    price: 89.99,
    description: "High-speed portable solid-state drive with USB-C connectivity and rugged design.",
    image: "https://plus.unsplash.com/premium_photo-1721133260774-84f57d69cb82?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Smartwatch Series 9",
    price: 399.00,
    description: "Advanced health sensors, always-on retina display, and crash detection.",
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Action Camera 4K",
    price: 249.99,
    description: "Waterproof action camera with hypersmooth stabilization and dual screens.",
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Drone with Camera",
    price: 799.00,
    description: "Foldable drone with 4K camera, 3-axis gimbal, and 30-minute flight time.",
    image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "VR Headset",
    price: 349.00,
    description: "All-in-one virtual reality headset with immersive 3D audio and high-resolution display.",
    image: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Gaming Laptop 15\"",
    price: 1499.00,
    description: "High-performance gaming laptop with RTX 4060, 165Hz display, and RGB keyboard.",
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Wireless Mouse",
    price: 49.99,
    description: "Ergonomic wireless mouse with precision sensor and long battery life.",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Tablet Pro 12.9\"",
    price: 1099.00,
    description: "The ultimate tablet experience with M2 chip and XDR display.",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Bluetooth Speaker",
    price: 129.00,
    description: "Portable waterproof speaker with 360-degree sound and 20-hour playtime.",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Smart Home Hub",
    price: 99.00,
    description: "Voice-controlled smart home hub with built-in display and speaker.",
    image: "https://images.unsplash.com/photo-1586078875290-c22eb791ad5d?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Mirrorless Camera",
    price: 1299.00,
    description: "Compact mirrorless camera with 24MP sensor and 4K video recording.",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Instant Camera",
    price: 79.00,
    description: "Fun instant camera that prints credit-card-sized photos instantly.",
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Noise-Cancelling Earbuds",
    price: 199.00,
    description: "True wireless earbuds with active noise cancellation and transparency mode.",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80"
  }
];

const generatedProducts = [];
for (let i = 0; i < 200; i++) {
  const baseProduct = baseProducts[i % baseProducts.length];
  generatedProducts.push({
    id: i + 1,
    name: `${baseProduct.name} ${Math.floor(i / baseProducts.length) + 1}`,
    price: Math.round(baseProduct.price * (0.8 + Math.random() * 0.4) * 100) / 100, // Random price variation +/- 20%
    description: baseProduct.description,
    image: baseProduct.image
  });
}

module.exports = generatedProducts;
