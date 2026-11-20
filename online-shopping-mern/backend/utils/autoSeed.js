const User = require('../models/User');
const Product = require('../models/Product');
const { products, defaultUsers } = require('../data/seedData');

// Runs every time the server starts. It only ADDS what is missing:
//  - demo customer accounts (matched by email)
//  - sample products (only when the products collection is empty)
// It never deletes or overwrites existing data.
const autoSeed = async () => {
  for (const u of defaultUsers) {
    const exists = await User.findOne({ email: u.email });
    if (!exists) {
      await User.create(u); // create() runs the bcrypt hashing hook
      console.log(`Created ${u.role}: ${u.email}`);
    }
  }

  if ((await Product.countDocuments()) === 0) {
    await Product.insertMany(products);
    console.log(`Added ${products.length} sample products`);
  }
};

module.exports = autoSeed;
