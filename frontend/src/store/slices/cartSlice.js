import { createSlice } from '@reduxjs/toolkit';

// Load initial cart from localStorage
let initialItems = [];
let initialRestaurantId = null;
try {
  const cartJson = localStorage.getItem('cart');
  if (cartJson) {
    const parsed = JSON.parse(cartJson);
    initialItems = parsed.items || [];
    initialRestaurantId = parsed.restaurantId || null;
  }
} catch (e) {
  localStorage.removeItem('cart');
}

const calculateTotal = (items) => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

const saveCartToStorage = (items, restaurantId) => {
  localStorage.setItem(
    'cart',
    JSON.stringify({
      items,
      restaurantId,
    })
  );
};

const initialState = {
  items: initialItems,
  restaurantId: initialRestaurantId,
  totalAmount: calculateTotal(initialItems),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { foodItem, name, price, image, restaurantId } = action.payload;

      // If item is from a different restaurant, clear the cart first
      if (state.restaurantId && state.restaurantId !== restaurantId) {
        state.items = [];
        state.restaurantId = restaurantId;
      } else if (!state.restaurantId) {
        state.restaurantId = restaurantId;
      }

      const existingItem = state.items.find((item) => item.foodItem === foodItem);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({
          foodItem,
          name,
          price,
          image,
          quantity: 1,
        });
      }

      state.totalAmount = calculateTotal(state.items);
      saveCartToStorage(state.items, state.restaurantId);
    },
    removeFromCart: (state, action) => {
      const foodItemId = action.payload;
      const existingItem = state.items.find((item) => item.foodItem === foodItemId);

      if (existingItem) {
        if (existingItem.quantity > 1) {
          existingItem.quantity -= 1;
        } else {
          state.items = state.items.filter((item) => item.foodItem !== foodItemId);
        }
      }

      if (state.items.length === 0) {
        state.restaurantId = null;
      }

      state.totalAmount = calculateTotal(state.items);
      saveCartToStorage(state.items, state.restaurantId);
    },
    deleteFromCart: (state, action) => {
      const foodItemId = action.payload;
      state.items = state.items.filter((item) => item.foodItem !== foodItemId);

      if (state.items.length === 0) {
        state.restaurantId = null;
      }

      state.totalAmount = calculateTotal(state.items);
      saveCartToStorage(state.items, state.restaurantId);
    },
    clearCart: (state) => {
      state.items = [];
      state.restaurantId = null;
      state.totalAmount = 0;
      localStorage.removeItem('cart');
    },
  },
});

export const { addToCart, removeFromCart, deleteFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
