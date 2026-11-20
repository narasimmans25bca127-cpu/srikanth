const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// GET /api/products?keyword=phone&category=Electronics
const getProducts = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.keyword) {
    filter.name = { $regex: escapeRegex(req.query.keyword), $options: 'i' };
  }
  if (req.query.category) {
    filter.category = req.query.category;
  }
  const products = await Product.find(filter).sort({ createdAt: -1 });
  res.json(products);
});

// GET /api/products/categories
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Product.distinct('category');
  res.json(categories.sort());
});

// GET /api/products/:id
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json(product);
});

// POST /api/products  (admin)
const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category, image, stock } = req.body;
  const product = await Product.create({ name, description, price, category, image, stock });
  res.status(201).json(product);
});

// PUT /api/products/:id  (admin)
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const { name, description, price, category, image, stock } = req.body;
  if (name !== undefined) product.name = name;
  if (description !== undefined) product.description = description;
  if (price !== undefined) product.price = price;
  if (category !== undefined) product.category = category;
  if (image !== undefined) product.image = image;
  if (stock !== undefined) product.stock = stock;

  const updated = await product.save();
  res.json(updated);
});

// DELETE /api/products/:id  (admin)
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  await product.deleteOne();
  res.json({ message: 'Product deleted' });
});

module.exports = {
  getProducts,
  getCategories,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
