import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

export const sendChatMessage = createAsyncThunk(
  'chatBot/sendMessage',
  async ({ message }, { rejectWithValue }) => {
    try {
      const response = await api.post('v1/api/chatbot/create', { message });
      return {
        response: response.data.reply || response.data.response || response.data.message || 'No response from server',
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to send message'
      );
    }
  }
);