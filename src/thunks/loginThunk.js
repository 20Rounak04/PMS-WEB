import { createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../utils/api';

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials);

      // Response structure: { message: "success", data: { token, user, pet } }
      const { token, user, pet } = response.data.data;

      // Store correctly in localStorage
      localStorage.setItem('accessToken', token);
      localStorage.setItem('user', JSON.stringify({ user, pet }));

      return {
        user: { user, pet },
        accessToken: token,
      };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Login failed. Please try again.';
      return rejectWithValue(errorMessage);
    }
  }
);