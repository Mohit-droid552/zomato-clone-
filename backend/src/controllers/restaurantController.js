import Restaurant from '../models/Restaurant.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getFallbackRestaurants } from '../utils/fallbackData.js';

// @desc    Get all restaurants
// @route   GET /api/v1/restaurants
// @access  Public
export const getAllRestaurants = asyncHandler(async (req, res) => {
  const { search, cuisine, minRating, maxDeliveryTime, isFeatured } = req.query;
  let restaurants = [];

  try {
    const query = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (cuisine) {
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

    restaurants = await Restaurant.find(query);
  } catch (error) {
    console.warn(`[Restaurant Query Warning] Using fallback dataset: ${error.message}`);
  }

  // If DB query failed or database is empty, serve fallback Indian restaurants
  if (!restaurants || restaurants.length === 0) {
    restaurants = getFallbackRestaurants();

    if (search) {
      restaurants = restaurants.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()));
    }
    if (cuisine) {
      const cuisinesList = cuisine.toLowerCase().split(',');
      restaurants = restaurants.filter((r) =>
        r.cuisine.some((c) => cuisinesList.includes(c.toLowerCase()))
      );
    }
    if (minRating) {
      restaurants = restaurants.filter((r) => r.rating >= parseFloat(minRating));
    }
    if (maxDeliveryTime) {
      restaurants = restaurants.filter((r) => r.deliveryTime <= parseInt(maxDeliveryTime, 10));
    }
    if (isFeatured) {
      restaurants = restaurants.filter((r) => r.isFeatured === (isFeatured === 'true'));
    }
  }

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
  let restaurant = null;

  try {
    restaurant = await Restaurant.findById(req.params.id);
  } catch (error) {
    console.warn(`[Restaurant FindById Warning] Using fallback search: ${error.message}`);
  }

  if (!restaurant) {
    const fallbacks = getFallbackRestaurants();
    restaurant = fallbacks.find((r) => r._id === req.params.id) || fallbacks[0];
  }

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
