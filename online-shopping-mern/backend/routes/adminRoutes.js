const express = require('express');
const {
  getStats,
  getUsers,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

const router = express.Router();

router.use(protect, admin); // every admin route needs login + admin role

router.get('/stats', getStats);
router.get('/users', getUsers);
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

module.exports = router;
