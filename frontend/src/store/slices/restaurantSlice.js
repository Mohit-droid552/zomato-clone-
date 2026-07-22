import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import client from '../../api/client.js';

const initialState = {
  restaurants: [],
  restaurantDetail: null,
  menu: [],
  loading: false,
  error: null,
};

// Fetch all restaurants with optional filters
export const fetchRestaurants = createAsyncThunk(
  'restaurant/fetchRestaurants',
  async (filters = {}, { rejectWithValue }) => {
    try {
      // Build query string
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.cuisine) params.append('cuisine', filters.cuisine);
      if (filters.minRating) params.append('minRating', filters.minRating);
      if (filters.maxDeliveryTime) params.append('maxDeliveryTime', filters.maxDeliveryTime);
      if (filters.isFeatured) params.append('isFeatured', filters.isFeatured);

      const queryString = params.toString();
      const url = `/restaurants${queryString ? `?${queryString}` : ''}`;
      const response = await client.get(url);
      return response.data.restaurants;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch restaurants'
      );
    }
  }
);

// Fetch single restaurant and its food items (menu)
export const fetchRestaurantDetail = createAsyncThunk(
  'restaurant/fetchRestaurantDetail',
  async (id, { rejectWithValue }) => {
    try {
      // Run both API requests in parallel
      const [restaurantRes, foodItemsRes] = await Promise.all([
        client.get(`/restaurants/${id}`),
        client.get(`/food-items?restaurant=${id}`),
      ]);

      return {
        restaurant: restaurantRes.data.restaurant,
        menu: foodItemsRes.data.foodItems,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch restaurant details'
      );
    }
  }
);

const restaurantSlice = createSlice({
  name: 'restaurant',
  initialState,
  reducers: {
    clearRestaurantDetail: (state) => {
      state.restaurantDetail = null;
      state.menu = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Restaurants
      .addCase(fetchRestaurants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRestaurants.fulfilled, (state, action) => {
        state.loading = false;
        state.restaurants = action.payload;
      })
      .addCase(fetchRestaurants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Restaurant Detail
      .addCase(fetchRestaurantDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRestaurantDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.restaurantDetail = action.payload.restaurant;
        state.menu = action.payload.menu;
      })
      .addCase(fetchRestaurantDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearRestaurantDetail } = restaurantSlice.actions;
export default restaurantSlice.reducer;
