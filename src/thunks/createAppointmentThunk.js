import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

export const createAppointment = createAsyncThunk(
  'appointment/create',
  async ({ appointmentData }, { rejectWithValue, getState }) => {
    try {
      // Get userId from Redux state
      const state = getState();
      const userId = state.userDetails?.userDetails?.id;

      if (!userId) {
        return rejectWithValue('User ID not found. Please log in again.');
      }

      // Send request with userId in endpoint
      const response = await api.post(
        `/user/appointment/${userId}/create`,
        appointmentData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create appointment'
      );
    }
  }
);