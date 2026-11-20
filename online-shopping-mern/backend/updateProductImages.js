const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Product = require('./models/Product');

dotenv.config({ path: path.join(__dirname, '.env') });

const imageUpdates = [
  {
    id: '6afd61523a854e62a5fffa8b',
    name: 'Wireless Headphones',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=85',
  },
  {
    id: '6afd61523a854e62a5fffa8c',
    name: 'Smart Watch',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=85',
  },
  {
    id: '6afd61523a854e62a5fffa8d',
    name: 'Bluetooth Speaker',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=85',
  },
  {
    id: '6afd61523a854e62a5fffa8e',
    name: 'Power Bank 10000mAh',
    category: 'Electronics',
    image: 'https://images.pexels.com/photos/3921704/pexels-photo-3921704.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '6afd61523a854e62a5fffa8f',
    name: 'Classic Cotton T-Shirt',
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=85',
  },
  {
    id: '6afd61523a854e62a5fffa90',
    name: 'Slim Fit Denim Jeans',
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=85',
  },
  {
    id: '6afd61523a854e62a5fffa91',
    name: 'Running Shoes',
    category: 'Fashion',
    image: 'https://images.pexels.com/photos/1456733/pexels-photo-1456733.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '6afd61523a854e62a5fffa92',
    name: 'Canvas Backpack',
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=85',
  },
  {
    id: '6afd61523a854e62a5fffa93',
    name: 'Stainless Steel Water Bottle',
    category: 'Home & Kitchen',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=85',
  },
  {
    id: '6afd61523a854e62a5fffa94',
    name: 'Non-Stick Cookware Set',
    category: 'Home & Kitchen',
    image: 'https://images.pexels.com/photos/15245007/pexels-photo-15245007/free-photo-of-close-up-of-pink-cooking-pots-with-glass-lids.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '6afd61523a854e62a5fffa95',
    name: 'Ceramic Coffee Mug Set',
    category: 'Home & Kitchen',
    image: 'https://images.pexels.com/photos/39024946/pexels-photo-39024946/free-photo-of-four-unique-ceramic-mugs-on-wooden-shelf.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '6afd61523a854e62a5fffa96',
    name: 'Atomic Habits (Paperback)',
    category: 'Books',
    image: 'https://images.pexels.com/photos/7998492/pexels-photo-7998492.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '6afd61523a854e62a5fffa97',
    name: 'Spiral Notebook Pack',
    category: 'Books',
    image: 'https://images.pexels.com/photos/15422296/pexels-photo-15422296/free-photo-of-stack-of-colorful-notebooks.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

const run = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not configured in backend/.env');
  }

  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 8000 });

  const ids = imageUpdates.map((product) => product.id);
  const totalProducts = await Product.countDocuments({});
  const currentProducts = await Product.find({ _id: { $in: ids } })
    .select('_id name category image')
    .lean();
  const currentById = new Map(currentProducts.map((product) => [String(product._id), product]));

  const mismatches = imageUpdates.filter((expected) => {
    const current = currentById.get(expected.id);
    return !current || current.name !== expected.name || current.category !== expected.category;
  });

  if (
    totalProducts !== imageUpdates.length ||
    currentProducts.length !== imageUpdates.length ||
    mismatches.length > 0
  ) {
    throw new Error(
      `Safety check failed: expected exactly ${imageUpdates.length} matching database products; found ${totalProducts} total and ${currentProducts.length} mapped. No changes were made.`
    );
  }

  const changed = imageUpdates.filter(
    (expected) => currentById.get(expected.id).image !== expected.image
  );
  const dryRun = !process.argv.includes('--apply');

  if (dryRun) {
    console.log(
      `Dry run: ${changed.length} of ${imageUpdates.length} image fields would change. Run with --apply to write.`
    );
    return;
  }

  if (changed.length > 0) {
    const result = await Product.bulkWrite(
      changed.map((product) => ({
        updateOne: {
          filter: {
            _id: product.id,
            name: product.name,
            category: product.category,
          },
          update: { $set: { image: product.image } },
        },
      })),
      { ordered: true, timestamps: false }
    );

    if (result.matchedCount !== changed.length) {
      throw new Error(`Safety check failed: matched ${result.matchedCount} of ${changed.length} products.`);
    }
  }

  const verified = await Product.find({ _id: { $in: ids } })
    .select('_id name category image')
    .lean();
  const verifiedById = new Map(verified.map((product) => [String(product._id), product]));
  const missingImages = imageUpdates.filter(
    (expected) => verifiedById.get(expected.id)?.image !== expected.image
  );

  if (verified.length !== imageUpdates.length || missingImages.length > 0) {
    throw new Error(`Verification failed: ${missingImages.length} products do not have the expected image URL.`);
  }

  console.log(
    `Verified ${verified.length} products. Updated ${changed.length} image fields; ${verified.length - changed.length} were already current; missing images: 0.`
  );
};

run()
  .catch((error) => {
    console.error(`Product image update failed: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
