const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const User = require('../models/User');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const ADMIN_EMAIL = 'nara4545@gmail.com';

const provisionAdmin = async () => {
  const password = process.env.ADMIN_INITIAL_PASSWORD;
  if (!password || password.length < 6) {
    throw new Error('Set ADMIN_INITIAL_PASSWORD to a password of at least 6 characters in backend/.env.');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not configured in backend/.env.');
  }

  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 8000 });

  const matchingUsers = await User.find({
    email: { $regex: '^nara4545@gmail\\.com$', $options: 'i' },
  })
    .select('+password')
    .limit(2);

  if (matchingUsers.length > 1) {
    throw new Error('Multiple accounts match the admin email; no account was changed.');
  }

  const user = matchingUsers[0];
  if (!user) {
    await User.create({
      name: 'Admin',
      email: ADMIN_EMAIL,
      password,
      role: 'admin',
    });
    console.log(`Created the admin account for ${ADMIN_EMAIL}.`);
    return;
  }

  const passwordMatches = await user.matchPassword(password);
  const roleChanged = user.role !== 'admin';
  const passwordChanged = !passwordMatches;

  if (!roleChanged && !passwordChanged) {
    console.log(`Verified the admin role and password for ${ADMIN_EMAIL}; no changes were needed.`);
    return;
  }

  user.role = 'admin';
  if (passwordChanged) user.password = password;
  await user.save();
  console.log(`Updated the admin role and/or password setup for ${ADMIN_EMAIL}.`);
};

provisionAdmin()
  .catch((error) => {
    console.error(`Admin provisioning failed: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
