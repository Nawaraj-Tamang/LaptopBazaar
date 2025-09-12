require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');

const productsData = [
  { name: 'Laptop A', description: '14" Intel i5, 8GB RAM, 256GB SSD', price: 650, image:'', category:'Ultrabook', countInStock: 10 },
  { name: 'Laptop B', description: '15" Ryzen 5, 8GB RAM, 512GB SSD', price: 720, image:'', category:'Gaming', countInStock: 8 },
  { name: 'Laptop C', description: '13" M-series, 8GB RAM, 256GB SSD', price: 950, image:'', category:'Apple', countInStock: 5 }
];

const adminUser = {
  name: 'Admin',
  email: 'admin@laptopbazaar.com',
  password: 'admin123', // plain password, will be hashed by pre-save hook
  isAdmin: true
};

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Clear old data
    await Product.deleteMany({});
    await User.deleteMany({});

    // Insert products
    await Product.insertMany(productsData);

    // Insert admin user
    const admin = new User(adminUser);
    await admin.save();

    console.log('✅ Seed complete: Products + Admin created');
  } catch (error) {
    console.error('❌ Seed error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
