import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

export const listProfessionals = createAsyncThunk(
  'professionals/list',
  async ({ roleId, status, search } = {}, { rejectWithValue }) => {
    try {
      const params = {};
      if (roleId) params.roleId = roleId;
      if (status) params.status = status;
      if (search) params.search = search;

      const response = await api.get('/Admin/manage/list', { params });

      // Response shape: { message: "...", data: [...] }
      const data = response.data;
      if (Array.isArray(data?.data)) return data.data;
      if (Array.isArray(data)) return data;
      return [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch professionals'
      );
    }
  }
);