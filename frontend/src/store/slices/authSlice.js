import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import client from '../../api/client.js';

// Helper to get items from localStorage
const storedToken = localStorage.getItem('token');
let storedUser = null;
try {
  const userJson = localStorage.getItem('user');
  if (userJson) {
    storedUser = JSON.parse(userJson);
  }
} catch (e) {
  localStorage.removeItem('user');
}

const initialState = {
  user: storedUser,
  token: storedToken,
  isAuthenticated: !!storedToken,
  loading: false,
  error: null,
};

// Async Thunks
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await client.post('/auth/register', userData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Registration failed'
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await client.post('/auth/login', credentials);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Login failed'
      );
    }
  }
);

export const fetchProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await client.get('/users/me');
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch profile'
      );
    }
  }
);

export const updateProfileDetails = createAsyncThunk(
  'auth/updateProfileDetails',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await client.put('/users/me', profileData);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Profile update failed'
      );
    }
  }
);

export const addSavedAddress = createAsyncThunk(
  'auth/addSavedAddress',
  async (address, { rejectWithValue }) => {
    try {
      const response = await client.post('/users/me/addresses', { address });
      return response.data.addresses;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to add address'
      );
    }
  }
);

export const removeSavedAddress = createAsyncThunk(
  'auth/removeSavedAddress',
  async (index, { rejectWithValue }) => {
    try {
      const response = await client.delete(`/users/me/addresses/${index}`);
      return response.data.addresses;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete address'
      );
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Profile
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Profile Details
      .addCase(updateProfileDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProfileDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateProfileDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Saved Address
      .addCase(addSavedAddress.fulfilled, (state, action) => {
        if (state.user) {
          state.user.addresses = action.payload;
        }
      })
      // Remove Saved Address
      .addCase(removeSavedAddress.fulfilled, (state, action) => {
        if (state.user) {
          state.user.addresses = action.payload;
        }
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
