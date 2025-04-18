const prisma = require("../config/db");
const asyncHandler = require("../middlewares/asyncHandler");
const bcrypt = require("bcrypt");

// Get all users
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      profilePicture: true,
      createdAt: true,
      updatedAt: true
    }
  });
  res.json(users);
});

// Get single user
const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      profilePicture: true,
      createdAt: true,
      updatedAt: true
    }
  });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json(user);
});

// Get current user profile
const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      profilePicture: true,
      createdAt: true,
      updatedAt: true
    }
  });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json(user);
});

// Update current user profile
const updateUser = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;

  // Get current user
  const existingUser = await prisma.user.findUnique({
    where: { id: req.user.userId }
  });

  if (!existingUser) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Check if email is being changed and if it's already in use
  if (email && email !== existingUser.email) {
    const emailExists = await prisma.user.findUnique({ where: { email } });
    if (emailExists) {
      return res.status(400).json({ message: 'Email already in use' });
    }
  }

  // Prepare update data
  const updateData = {
    fullName: fullName || existingUser.fullName,
    email: email || existingUser.email,
    profilePicture: req.file ? `/uploads/${req.file.filename}` : existingUser.profilePicture
  };

  // If password is provided, hash it
  if (password) {
    updateData.password = await bcrypt.hash(password, 10);
  }

  const updatedUser = await prisma.user.update({
    where: { id: req.user.userId },
    data: updateData,
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      profilePicture: true,
      createdAt: true,
      updatedAt: true
    }
  });

  res.json(updatedUser);
});

// Delete user
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if user exists
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  await prisma.user.delete({ where: { id } });
  res.json({ message: 'User deleted successfully' });
});

// Update user role (Admin only)
const updateUserRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  // Check if user exists
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Update user role
  const updatedUser = await prisma.user.update({
    where: { id },
    data: { role },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      profilePicture: true,
      createdAt: true,
      updatedAt: true
    }
  });

  res.json(updatedUser);
});

module.exports = {
  getAllUsers,
  getUser,
  getCurrentUser,
  updateUser,
  deleteUser,
  updateUserRole
};
