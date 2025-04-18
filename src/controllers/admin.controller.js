const prisma = require('../config/db');
const asyncHandler = require('../middlewares/asyncHandler');

// Get all users
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      profilePicture: true,
      createdAt: true
    }
  });
  res.json(users);
});

// Update user role
const updateUserRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  const user = await prisma.user.update({
    where: { id },
    data: { role },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      profilePicture: true
    }
  });

  res.json(user);
});

// Delete user
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await prisma.user.delete({
    where: { id }
  });

  res.json({ message: 'User deleted successfully' });
});

module.exports = {
  getAllUsers,
  updateUserRole,
  deleteUser
}; 