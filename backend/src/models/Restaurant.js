import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Restaurant name is required'],
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Restaurant image URL is required'],
    },
    cuisine: {
      type: [String],
      required: [true, 'At least one cuisine is required'],
    },
    rating: {
      type: Number,
      default: 4.0,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot be more than 5'],
    },
    deliveryTime: {
      type: Number,
      required: [true, 'Delivery time (in minutes) is required'],
    },
    costForTwo: {
      type: Number,
      required: [true, 'Average cost for two is required'],
    },
    address: {
      type: String,
      required: [true, 'Restaurant address is required'],
    },
    coordinates: {
      lat: { type: Number },
      lon: { type: Number },
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    partner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const Restaurant = mongoose.model('Restaurant', restaurantSchema);
export default Restaurant;
