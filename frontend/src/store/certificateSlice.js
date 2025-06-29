import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import certificateService from '../services/certificateService';

// Async thunks
export const fetchUserCertificates = createAsyncThunk(
  'certificate/fetchUserCertificates',
  async (_, { rejectWithValue }) => {
    try {
      const response = await certificateService.getUserCertificates();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch certificates');
    }
  }
);

export const fetchCertificateById = createAsyncThunk(
  'certificate/fetchCertificateById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await certificateService.getCertificateById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch certificate');
    }
  }
);

export const verifyCertificate = createAsyncThunk(
  'certificate/verifyCertificate',
  async (verificationCode, { rejectWithValue }) => {
    try {
      const response = await certificateService.verifyCertificate(verificationCode);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to verify certificate');
    }
  }
);

const initialState = {
  certificates: [],
  currentCertificate: null,
  verifiedCertificate: null,
  loading: false,
  error: null,
};

const certificateSlice = createSlice({
  name: 'certificate',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentCertificate: (state) => {
      state.currentCertificate = null;
    },
    clearVerifiedCertificate: (state) => {
      state.verifiedCertificate = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchUserCertificates
      .addCase(fetchUserCertificates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserCertificates.fulfilled, (state, action) => {
        state.loading = false;
        state.certificates = action.payload;
      })
      .addCase(fetchUserCertificates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchCertificateById
      .addCase(fetchCertificateById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCertificateById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCertificate = action.payload;
      })
      .addCase(fetchCertificateById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // verifyCertificate
      .addCase(verifyCertificate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyCertificate.fulfilled, (state, action) => {
        state.loading = false;
        state.verifiedCertificate = action.payload;
      })
      .addCase(verifyCertificate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentCertificate, clearVerifiedCertificate } = certificateSlice.actions;
export default certificateSlice.reducer; 