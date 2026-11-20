const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const asyncHandler = require('../utils/asyncHandler');

const STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered'];

// GET /api/admin/stats
const getStats = asyncHandler(async (req, res) => {
  const [totalProducts, totalUsers, totalOrders, revenueData, recentOrders] = await Promise.all([
    Product.countDocuments(),
    User.countDocuments({ role: 'user' }),
    Order.countDocuments(),
    Order.aggregate([{ $group: { _id: null, total: { $sum: '$totalPrice' } } }]),
    Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name email'),
  ]);

  res.json({
    totalProducts,
    totalUsers,
    totalOrders,
    totalRevenue: revenueData[0] ? revenueData[0].total : 0,
    recentOrders,
  });
});

// GET /api/admin/users
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json(users);
});

// GET /api/admin/orders
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 }).populate('user', 'name email');
  res.json(orders);
});

// PUT /api/admin/orders/:id/status
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!STATUSES.includes(status)) {
    res.status(400);
    throw new Error(`Status must be one of: ${STATUSES.join(', ')}`);
  }

  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.status = status;
  if (status === 'Delivered') order.deliveredAt = new Date();
  const updated = await order.save();
  res.json(updated);
});

module.exports = { getStats, getUsers, getAllOrders, updateOrderStatus };
