import FoodItem from '../models/FoodItem.js';
import Restaurant from '../models/Restaurant.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// @desc    Get all food items (optionally filter by restaurant, category, isVeg, search)
// @route   GET /api/v1/food-items
// @access  Public
export const getFoodItems = asyncHandler(async (req, res) => {
  const { restaurant, category, isVeg, search } = req.query;
  const query = {};

  if (restaurant) {
    query.restaurant = restaurant;
  }

  if (category) {
    query.category = { $regex: category, $options: 'i' };
  }

  if (isVeg) {
    query.isVeg = isVeg === 'true';
  }

  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }

  const foodItems = await FoodItem.find(query);

  res.status(200).json({
    success: true,
    count: foodItems.length,
    foodItems,
  });
});

// @desc    Create new food item
// @route   POST /api/v1/food-items
// @access  Private (Partner/Admin)
export const createFoodItem = asyncHandler(async (req, res) => {
  const { restaurantId } = req.body;
  
  // Use restaurantId if restaurant is not in body
  const finalRestaurantId = req.body.restaurant || restaurantId;
  req.body.restaurant = finalRestaurantId;

  if (!finalRestaurantId) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a restaurant ID for the food item',
    });
  }

  // Verify restaurant exists and user has permission
  const restaurantObj = await Restaurant.findById(finalRestaurantId);
  if (!restaurantObj) {
    return res.status(404).json({
      success: false,
      message: `Restaurant not found with id of ${finalRestaurantId}`,
    });
  }

  if (
    restaurantObj.partner &&
    restaurantObj.partner.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return res.status(403).json({
      success: false,
      message: 'You are not authorized to add food items to this restaurant',
    });
  }

  const foodItem = await FoodItem.create(req.body);

  res.status(201).json({
    success: true,
    message: 'Food item created successfully',
    foodItem,
  });
});

// @desc    Update food item
// @route   PUT /api/v1/food-items/:id
// @access  Private (Partner/Admin)
export const updateFoodItem = asyncHandler(async (req, res) => {
  let foodItem = await FoodItem.findById(req.params.id);

  if (!foodItem) {
    return res.status(404).json({
      success: false,
      message: `Food item not found with id of ${req.params.id}`,
    });
  }

  // Get restaurant to check permissions
  const restaurantObj = await Restaurant.findById(foodItem.restaurant);
  if (
    restaurantObj &&
    restaurantObj.partner &&
    restaurantObj.partner.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return res.status(403).json({
      success: false,
      message: 'You are not authorized to update food items for this restaurant',
    });
  }

  foodItem = await FoodItem.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: 'Food item updated successfully',
    foodItem,
  });
});

// @desc    Delete food item
// @route   DELETE /api/v1/food-items/:id
// @access  Private (Partner/Admin)
export const deleteFoodItem = asyncHandler(async (req, res) => {
  const foodItem = await FoodItem.findById(req.params.id);

  if (!foodItem) {
    return res.status(404).json({
      success: false,
      message: `Food item not found with id of ${req.params.id}`,
    });
  }

  // Get restaurant to check permissions
  const restaurantObj = await Restaurant.findById(foodItem.restaurant);
  if (
    restaurantObj &&
    restaurantObj.partner &&
    restaurantObj.partner.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return res.status(403).json({
      success: false,
      message: 'You are not authorized to delete food items for this restaurant',
    });
  }

  await foodItem.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Food item deleted successfully',
  });
});
