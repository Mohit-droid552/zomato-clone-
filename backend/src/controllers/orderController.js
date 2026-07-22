import Order from '../models/Order.js';
import FoodItem from '../models/FoodItem.js';
import Restaurant from '../models/Restaurant.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// @desc    Create a new order
// @route   POST /api/v1/orders
// @access  Private (Customer)
export const createOrder = asyncHandler(async (req, res) => {
  const { restaurantId, items, deliveryAddress } = req.body;

  if (!restaurantId || !items || !Array.isArray(items) || items.length === 0 || !deliveryAddress) {
    return res.status(400).json({
      success: false,
      message: 'Please provide restaurantId, items array, and deliveryAddress',
    });
  }

  // Verify restaurant exists
  const restaurantObj = await Restaurant.findById(restaurantId);
  if (!restaurantObj) {
    return res.status(404).json({
      success: false,
      message: `Restaurant not found with id of ${restaurantId}`,
    });
  }

  // Build items list with server-validated prices
  const orderItems = [];
  let calculatedTotal = 0;

  for (const item of items) {
    const dbItem = await FoodItem.findById(item.foodItem);
    if (!dbItem) {
      return res.status(404).json({
        success: false,
        message: `Food item not found with id of ${item.foodItem}`,
      });
    }

    if (dbItem.restaurant.toString() !== restaurantId) {
      return res.status(400).json({
        success: false,
        message: `Food item ${dbItem.name} does not belong to the selected restaurant`,
      });
    }

    const itemPrice = dbItem.price;
    const itemTotal = itemPrice * item.quantity;
    calculatedTotal += itemTotal;

    orderItems.push({
      foodItem: dbItem._id,
      name: dbItem.name,
      price: itemPrice,
      quantity: item.quantity,
    });
  }

  // Create order
  const order = await Order.create({
    user: req.user.id,
    restaurant: restaurantId,
    items: orderItems,
    totalAmount: calculatedTotal,
    deliveryAddress,
  });

  res.status(201).json({
    success: true,
    message: 'Order placed successfully',
    order,
  });
});

// @desc    Get logged in user's orders
// @route   GET /api/v1/orders/my-orders
// @access  Private (Customer/Partner/Admin)
export const getMyOrders = asyncHandler(async (req, res) => {
  let query = {};
  
  // If partner, they see orders for their restaurants
  if (req.user.role === 'partner') {
    const partnerRestaurants = await Restaurant.find({ partner: req.user.id });
    const restaurantIds = partnerRestaurants.map((r) => r._id);
    query = { restaurant: { $in: restaurantIds } };
  } else if (req.user.role === 'admin') {
    // Admin sees all
    query = {};
  } else {
    // Customers see only their own orders
    query = { user: req.user.id };
  }

  const orders = await Order.find(query)
    .populate('restaurant', 'name image address')
    .populate('user', 'name email')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: orders.length,
    orders,
  });
});

// @desc    Get order by ID
// @route   GET /api/v1/orders/:id
// @access  Private
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('restaurant', 'name image address partner')
    .populate('user', 'name email');

  if (!order) {
    return res.status(404).json({
      success: false,
      message: `Order not found with id of ${req.params.id}`,
    });
  }

  // Authorized user check (Customer who placed it, partner who owns restaurant, or admin)
  const isOwner = order.user._id.toString() === req.user.id;
  const isRestaurantPartner = order.restaurant.partner && order.restaurant.partner.toString() === req.user.id;
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isRestaurantPartner && !isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'You are not authorized to view this order',
    });
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// @desc    Update order status
// @route   PUT /api/v1/orders/:id/status
// @access  Private (Partner/Admin)
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!status || !['Pending', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid status: Pending, Preparing, Out for Delivery, Delivered, Cancelled',
    });
  }

  const order = await Order.findById(req.params.id).populate('restaurant', 'partner');

  if (!order) {
    return res.status(404).json({
      success: false,
      message: `Order not found with id of ${req.params.id}`,
    });
  }

  // Check if user is partner of this restaurant or admin
  const isRestaurantPartner = order.restaurant.partner && order.restaurant.partner.toString() === req.user.id;
  const isAdmin = req.user.role === 'admin';

  if (!isRestaurantPartner && !isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'You are not authorized to update this order status',
    });
  }

  order.status = status;
  await order.save();

  res.status(200).json({
    success: true,
    message: 'Order status updated successfully',
    order,
  });
});
