const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');

// POST /api/orders
// Body: { items: [{ product, quantity }], shippingAddress: {...} }
// Prices are read from the database, never trusted from the browser.
const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    res.status(400);
    throw new Error('Your cart is empty');
  }

  const quantitiesByProduct = new Map();

  for (const item of items) {
    if (!item || !mongoose.isValidObjectId(item.product)) {
      res.status(400);
      throw new Error('Invalid product in cart');
    }

    const quantity = Number(item.quantity);
    if (!Number.isSafeInteger(quantity) || quantity < 1) {
      res.status(400);
      throw new Error('Invalid quantity in cart');
    }

    const productId = new mongoose.Types.ObjectId(item.product).toString();
    const combinedQuantity = (quantitiesByProduct.get(productId) || 0) + quantity;
    if (!Number.isSafeInteger(combinedQuantity)) {
      res.status(400);
      throw new Error('Invalid quantity in cart');
    }
    quantitiesByProduct.set(productId, combinedQuantity);
  }

  const products = await Product.find({ _id: { $in: [...quantitiesByProduct.keys()] } });
  const productsById = new Map(products.map((product) => [String(product._id), product]));
  const orderItems = [];
  let total = 0;

  for (const [productId, quantity] of quantitiesByProduct) {
    const product = productsById.get(productId);
    if (!product) {
      res.status(404);
      throw new Error('A product in your cart is no longer available');
    }

    orderItems.push({
      product: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity,
    });
    total += product.price * quantity;
  }

  const reservedItems = [];
  let order;
  try {
    for (const item of orderItems) {
      const reservation = await Product.updateOne(
        { _id: item.product, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } }
      );

      if (reservation.matchedCount !== 1) {
        res.status(400);
        throw new Error(`Insufficient stock for ${item.name}`);
      }

      reservedItems.push(item);
    }

    order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod: 'Cash on Delivery',
      itemsPrice: total,
      totalPrice: total,
    });
  } catch (error) {
    const rollbackFailures = [];
    for (const item of reservedItems) {
      try {
        const rollback = await Product.updateOne(
          { _id: item.product },
          { $inc: { stock: item.quantity } }
        );
        if (rollback.matchedCount !== 1) {
          rollbackFailures.push({
            productId: String(item.product),
            error: 'Product no longer exists',
          });
        }
      } catch (rollbackError) {
        rollbackFailures.push({
          productId: String(item.product),
          error: rollbackError.message,
        });
      }
    }

    if (rollbackFailures.length > 0) {
      console.error('Could not restore reserved stock for products:', rollbackFailures);
      res.status(500);
      throw new Error('Order could not be completed and some reserved stock could not be restored. Contact support.');
    }

    throw error;
  }

  res.status(201).json(order);
});

// GET /api/orders/myorders
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

// GET /api/orders/:id  (owner or admin)
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  const isOwner = order.user._id.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('You cannot view this order');
  }
  res.json(order);
});

module.exports = { createOrder, getMyOrders, getOrderById };
