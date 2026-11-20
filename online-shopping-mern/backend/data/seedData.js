// Sample data used by both "npm run seed" and the automatic first-run seeding.
const img = (text, bg) =>
  `https://placehold.co/600x600/${bg}/ffffff?text=${encodeURIComponent(text)}`;

const products = [
  { name: 'Wireless Headphones', category: 'Electronics', price: 2499, stock: 25,
    description: 'Over-ear Bluetooth headphones with 30-hour battery life, soft ear cushions and a built-in microphone for calls.',
    image: img('Wireless Headphones', '0E7C7B') },
  { name: 'Smart Watch', category: 'Electronics', price: 3999, stock: 15,
    description: 'Fitness smart watch with heart-rate tracking, step counter, sleep monitor and a bright always-on display.',
    image: img('Smart Watch', '16222A') },
  { name: 'Bluetooth Speaker', category: 'Electronics', price: 1799, stock: 30,
    description: 'Portable water-resistant speaker with deep bass and 12 hours of playtime on a single charge.',
    image: img('Bluetooth Speaker', '0A5C5B') },
  { name: 'Power Bank 10000mAh', category: 'Electronics', price: 999, stock: 50,
    description: 'Slim 10000mAh power bank with fast charging and two USB outputs. Charges a phone about three times.',
    image: img('Power Bank', '3D5A80') },
  { name: 'Classic Cotton T-Shirt', category: 'Fashion', price: 499, stock: 80,
    description: 'Soft, breathable 100% cotton round-neck t-shirt with a relaxed fit. Machine washable.',
    image: img('Cotton T-Shirt', 'C2571A') },
  { name: 'Slim Fit Denim Jeans', category: 'Fashion', price: 1299, stock: 40,
    description: 'Stretch denim jeans with a slim fit, five pockets and a durable zip fly.',
    image: img('Denim Jeans', '3D5A80') },
  { name: 'Running Shoes', category: 'Fashion', price: 2199, stock: 20,
    description: 'Lightweight running shoes with a cushioned sole and breathable mesh upper for daily workouts.',
    image: img('Running Shoes', '0E7C7B') },
  { name: 'Canvas Backpack', category: 'Fashion', price: 899, stock: 35,
    description: 'Roomy 25-litre canvas backpack with a padded laptop sleeve and water-resistant lining.',
    image: img('Canvas Backpack', '7A5C3E') },
  { name: 'Stainless Steel Water Bottle', category: 'Home & Kitchen', price: 599, stock: 60,
    description: 'Double-wall insulated 750 ml bottle that keeps drinks cold for 24 hours or hot for 12 hours.',
    image: img('Water Bottle', '0A5C5B') },
  { name: 'Non-Stick Cookware Set', category: 'Home & Kitchen', price: 2799, stock: 12,
    description: 'Three-piece non-stick set with a fry pan, kadai and saucepan. Works on gas and induction stoves.',
    image: img('Cookware Set', 'C2571A') },
  { name: 'Ceramic Coffee Mug Set', category: 'Home & Kitchen', price: 699, stock: 45,
    description: 'Set of four 300 ml ceramic mugs, microwave and dishwasher safe.',
    image: img('Coffee Mugs', '16222A') },
  { name: 'Atomic Habits (Paperback)', category: 'Books', price: 399, stock: 70,
    description: 'A practical guide to building good habits and breaking bad ones, by James Clear.',
    image: img('Atomic Habits', '7A5C3E') },
  { name: 'Spiral Notebook Pack', category: 'Books', price: 249, stock: 100,
    description: 'Pack of five A5 ruled notebooks with 160 pages each and a sturdy laminated cover.',
    image: img('Notebook Pack', '3D5A80') },
];

// Demo customer accounts. Passwords are hashed by the User model before saving.
const defaultUsers = [
  { name: 'Demo Customer', email: 'user@shop.com', password: 'User@123', role: 'user',
    phone: '9876543210', address: '12 Main Street, Coimbatore' },
  { name: 'Priya Sharma', email: 'priya@shop.com', password: 'Priya@123', role: 'user',
    phone: '9876501234', address: '45 Gandhi Road, Coimbatore' },
];

module.exports = { products, defaultUsers };
