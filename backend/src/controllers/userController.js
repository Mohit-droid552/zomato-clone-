import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// @desc    Get current user profile
// @route   GET /api/v1/users/me
// @access  Private
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      addresses: user.addresses,
    },
  });
});

// @desc    Update user profile details
// @route   PUT /api/v1/users/me
// @access  Private
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, email } = req.body;

  const user = await User.findById(req.user.id);

  if (name) user.name = name;
  if (email) {
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser._id.toString() !== user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Email is already in use by another account',
      });
    }
    user.email = email;
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      addresses: user.addresses,
    },
  });
});

// @desc    Update user password
// @route   PUT /api/v1/users/me/password
// @access  Private
export const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Please provide current and new password',
    });
  }

  const user = await User.findById(req.user.id).select('+password');

  // Verify current password
  if (!(await user.comparePassword(currentPassword))) {
    return res.status(401).json({
      success: false,
      message: 'Current password is incorrect',
    });
  }

  // Set new password
  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password updated successfully',
  });
});

// @desc    Add address to saved addresses
// @route   POST /api/v1/users/me/addresses
// @access  Private
export const addAddress = asyncHandler(async (req, res) => {
  const { address } = req.body;

  if (!address || typeof address !== 'string' || address.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid address string',
    });
  }

  const user = await User.findById(req.user.id);
  user.addresses.push(address.trim());
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Address added successfully',
    addresses: user.addresses,
  });
});

// @desc    Delete address from saved addresses
// @route   DELETE /api/v1/users/me/addresses/:index
// @access  Private
export const deleteAddress = asyncHandler(async (req, res) => {
  const index = parseInt(req.params.index, 10);
  const user = await User.findById(req.user.id);

  if (isNaN(index) || index < 0 || index >= user.addresses.length) {
    return res.status(400).json({
      success: false,
      message: 'Invalid address index',
    });
  }

  user.addresses.splice(index, 1);
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Address deleted successfully',
    addresses: user.addresses,
  });
});
