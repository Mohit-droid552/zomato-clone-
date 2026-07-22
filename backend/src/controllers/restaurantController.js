import Restaurant from '../models/Restaurant.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// @desc    Get all restaurants
// @route   GET /api/v1/restaurants
// @access  Public
export const getAllRestaurants = asyncHandler(async (req, res) => {
  const { search, cuisine, minRating, maxDeliveryTime, isFeatured } = req.query;
  const query = {};

  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }

  if (cuisine) {
    // cuisine can be a string or array, handle string with comma or exact match
    const cuisinesList = cuisine.split(',');
    query.cuisine = { $in: cuisinesList.map((c) => new RegExp(c.trim(), 'i')) };
  }

  if (minRating) {
    query.rating = { $gte: parseFloat(minRating) };
  }

  if (maxDeliveryTime) {
    query.deliveryTime = { $lte: parseInt(maxDeliveryTime, 10) };
  }

  if (isFeatured) {
    query.isFeatured = isFeatured === 'true';
  }

  const restaurants = await Restaurant.find(query);

  res.status(200).json({
    success: true,
    count: restaurants.length,
    restaurants,
  });
});

// @desc    Get single restaurant by ID
// @route   GET /api/v1/restaurants/:id
// @access  Public
export const getRestaurantById = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);

  if (!restaurant) {
    return res.status(404).json({
      success: false,
      message: `Restaurant not found with id of ${req.params.id}`,
    });
  }

  res.status(200).json({
    success: true,
    restaurant,
  });
});

// @desc    Create new restaurant
// @route   POST /api/v1/restaurants
// @access  Private (Partner/Admin)
export const createRestaurant = asyncHandler(async (req, res) => {
  // Add partner/user to req.body
  req.body.partner = req.user.id;

  const restaurant = await Restaurant.create(req.body);

  res.status(201).json({
    success: true,
    message: 'Restaurant created successfully',
    restaurant,
  });
});

// @desc    Update restaurant
// @route   PUT /api/v1/restaurants/:id
// @access  Private (Partner/Admin)
export const updateRestaurant = asyncHandler(async (req, res) => {
  let restaurant = await Restaurant.findById(req.params.id);

  if (!restaurant) {
    return res.status(404).json({
      success: false,
      message: `Restaurant not found with id of ${req.params.id}`,
    });
  }

  // Make sure user is restaurant owner or admin
  if (
    restaurant.partner &&
    restaurant.partner.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return res.status(403).json({
      success: false,
      message: `User ${req.user.id} is not authorized to update this restaurant`,
    });
  }

  restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: 'Restaurant updated successfully',
    restaurant,
  });
});

// @desc    Delete restaurant
// @route   DELETE /api/v1/restaurants/:id
// @access  Private (Partner/Admin)
export const deleteRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);

  if (!restaurant) {
    return res.status(404).json({
      success: false,
      message: `Restaurant not found with id of ${req.params.id}`,
    });
  }

  // Make sure user is restaurant owner or admin
  if (
    restaurant.partner &&
    restaurant.partner.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return res.status(403).json({
      success: false,
      message: `User ${req.user.id} is not authorized to delete this restaurant`,
    });
  }

  await restaurant.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Restaurant deleted successfully',
  });
});
