import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { applicationService } from '../services/applicationService';

// Async thunks
export const applyForCourse = createAsyncThunk(
  'applications/applyForCourse',
  async (applicationData, { rejectWithValue }) => {
    try {
      const response = await applicationService.applyForCourse(applicationData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to apply for course');
    }
  }
);

export const getMyApplications = createAsyncThunk(
  'applications/getMyApplications',
  async (params, { rejectWithValue }) => {
    try {
      const response = await applicationService.getMyApplications(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to get applications');
    }
  }
);

export const getApplicationById = createAsyncThunk(
  'applications/getApplicationById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await applicationService.getApplicationById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to get application');
    }
  }
);

export const updateApplication = createAsyncThunk(
  'applications/updateApplication',
  async ({ id, applicationData }, { rejectWithValue }) => {
    try {
      const response = await applicationService.updateApplication(id, applicationData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update application');
    }
  }
);

export const cancelApplication = createAsyncThunk(
  'applications/cancelApplication',
  async (id, { rejectWithValue }) => {
    try {
      const response = await applicationService.cancelApplication(id);
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to cancel application');
    }
  }
);

export const getAllApplications = createAsyncThunk(
  'applications/getAllApplications',
  async (params, { rejectWithValue }) => {
    try {
      const response = await applicationService.getAllApplications(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to get all applications');
    }
  }
);

export const reviewApplication = createAsyncThunk(
  'applications/reviewApplication',
  async ({ id, reviewData }, { rejectWithValue }) => {
    try {
      const response = await applicationService.reviewApplication(id, reviewData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to review application');
    }
  }
);

// Initial state
const initialState = {
  applications: [],
  currentApplication: null,
  allApplications: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  },
  allApplicationsPagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  }
};

// Application slice
const applicationSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentApplication: (state) => {
      state.currentApplication = null;
    },
    clearApplications: (state) => {
      state.applications = [];
      state.pagination = {
        page: 1,
        limit: 10,
        total: 0,
        pages: 0
      };
    },
    clearAllApplications: (state) => {
      state.allApplications = [];
      state.allApplicationsPagination = {
        page: 1,
        limit: 10,
        total: 0,
        pages: 0
      };
    }
  },
  extraReducers: (builder) => {
    builder
      // Apply for Course
      .addCase(applyForCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyForCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.applications.unshift(action.payload.data.application);
      })
      .addCase(applyForCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get My Applications
      .addCase(getMyApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload.data.applications;
        state.pagination = action.payload.data.pagination;
      })
      .addCase(getMyApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Application By ID
      .addCase(getApplicationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getApplicationById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentApplication = action.payload.data.application;
      })
      .addCase(getApplicationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Application
      .addCase(updateApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateApplication.fulfilled, (state, action) => {
        state.loading = false;
        const updatedApplication = action.payload.data.application;
        const index = state.applications.findIndex(app => app._id === updatedApplication._id);
        if (index !== -1) {
          state.applications[index] = updatedApplication;
        }
        if (state.currentApplication && state.currentApplication._id === updatedApplication._id) {
          state.currentApplication = updatedApplication;
        }
      })
      .addCase(updateApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Cancel Application
      .addCase(cancelApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelApplication.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = state.applications.filter(app => app._id !== action.payload.id);
        if (state.currentApplication && state.currentApplication._id === action.payload.id) {
          state.currentApplication = null;
        }
      })
      .addCase(cancelApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get All Applications
      .addCase(getAllApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.allApplications = action.payload.data.applications;
        state.allApplicationsPagination = action.payload.data.pagination;
      })
      .addCase(getAllApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Review Application
      .addCase(reviewApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(reviewApplication.fulfilled, (state, action) => {
        state.loading = false;
        const reviewedApplication = action.payload.data.application;
        const index = state.allApplications.findIndex(app => app._id === reviewedApplication._id);
        if (index !== -1) {
          state.allApplications[index] = reviewedApplication;
        }
        if (state.currentApplication && state.currentApplication._id === reviewedApplication._id) {
          state.currentApplication = reviewedApplication;
        }
      })
      .addCase(reviewApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentApplication, clearApplications, clearAllApplications } = applicationSlice.actions;
export default applicationSlice.reducer; 