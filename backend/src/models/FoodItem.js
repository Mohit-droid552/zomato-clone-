import mongoose from 'mongoose';

const foodItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Food item name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Food item description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Food item price is required'],
      min: [0, 'Price cannot be negative'],
    },
    image: {
      type: String,
      required: [true, 'Food item image URL is required'],
    },
    category: {
      type: String,
      required: [true, 'Food item category is required'],
      trim: true,
    },
    isVeg: {
      type: Boolean,
      required: [true, 'Food item type (veg/non-veg) is required'],
      default: true,
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: [true, 'Restaurant reference is required'],
    },
    isBestselling: {
      type: Boolean,
      default: false,
    },
    isTopRated: {
      type: Boolean,
      default: false,
    },
    isTodaysSpecial: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const FoodItem = mongoose.model('FoodItem', foodItemSchema);
export default FoodItem;
