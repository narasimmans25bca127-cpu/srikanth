const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/users/profile
const getProfile = asyncHandler(async (req, res) => {
  res.json(req.user);
});

// PUT /api/users/profile
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('+password');
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const { name, phone, address, password } = req.body;
  if (name !== undefined) user.name = name;
  if (phone !== undefined) user.phone = phone;
  if (address !== undefined) user.address = address;
  if (password) user.password = password; // hashed by the model hook

  const updated = await user.save();
  res.json({
    _id: updated._id,
    name: updated.name,
    email: updated.email,
    role: updated.role,
    phone: updated.phone,
    address: updated.address,
  });
});

module.exports = { getProfile, updateProfile };
