import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { examService } from '../services/examService';

// Async thunks
export const scheduleExam = createAsyncThunk(
  'exams/scheduleExam',
  async (examData, { rejectWithValue }) => {
    try {
      const response = await examService.scheduleExam(examData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to schedule exam');
    }
  }
);

export const getMyExams = createAsyncThunk(
  'exams/getMyExams',
  async (params, { rejectWithValue }) => {
    try {
      const response = await examService.getMyExams(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to get exams');
    }
  }
);

export const getExamById = createAsyncThunk(
  'exams/getExamById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await examService.getExamById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to get exam');
    }
  }
);

export const startExam = createAsyncThunk(
  'exams/startExam',
  async (id, { rejectWithValue }) => {
    try {
      const response = await examService.startExam(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to start exam');
    }
  }
);

export const submitExam = createAsyncThunk(
  'exams/submitExam',
  async ({ id, answers }, { rejectWithValue }) => {
    try {
      const response = await examService.submitExam(id, answers);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to submit exam');
    }
  }
);

export const gradeExam = createAsyncThunk(
  'exams/gradeExam',
  async ({ id, gradeData }, { rejectWithValue }) => {
    try {
      const response = await examService.gradeExam(id, gradeData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to grade exam');
    }
  }
);

export const getAllExams = createAsyncThunk(
  'exams/getAllExams',
  async (params, { rejectWithValue }) => {
    try {
      const response = await examService.getAllExams(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to get all exams');
    }
  }
);

// Initial state
const initialState = {
  exams: [],
  currentExam: null,
  allExams: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  },
  allExamsPagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  }
};

// Exam slice
const examSlice = createSlice({
  name: 'exams',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentExam: (state) => {
      state.currentExam = null;
    },
    clearExams: (state) => {
      state.exams = [];
      state.pagination = {
        page: 1,
        limit: 10,
        total: 0,
        pages: 0
      };
    },
    clearAllExams: (state) => {
      state.allExams = [];
      state.allExamsPagination = {
        page: 1,
        limit: 10,
        total: 0,
        pages: 0
      };
    }
  },
  extraReducers: (builder) => {
    builder
      // Schedule Exam
      .addCase(scheduleExam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(scheduleExam.fulfilled, (state, action) => {
        state.loading = false;
        state.allExams.unshift(action.payload.data.exam);
      })
      .addCase(scheduleExam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get My Exams
      .addCase(getMyExams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyExams.fulfilled, (state, action) => {
        state.loading = false;
        state.exams = action.payload.data.exams;
        state.pagination = action.payload.data.pagination;
      })
      .addCase(getMyExams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Exam By ID
      .addCase(getExamById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getExamById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentExam = action.payload.data.exam;
      })
      .addCase(getExamById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Start Exam
      .addCase(startExam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(startExam.fulfilled, (state, action) => {
        state.loading = false;
        const startedExam = action.payload.data.exam;
        const index = state.exams.findIndex(exam => exam._id === startedExam._id);
        if (index !== -1) {
          state.exams[index] = startedExam;
        }
        if (state.currentExam && state.currentExam._id === startedExam._id) {
          state.currentExam = startedExam;
        }
      })
      .addCase(startExam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Submit Exam
      .addCase(submitExam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitExam.fulfilled, (state, action) => {
        state.loading = false;
        const submittedExam = action.payload.data.exam;
        const index = state.exams.findIndex(exam => exam._id === submittedExam._id);
        if (index !== -1) {
          state.exams[index] = submittedExam;
        }
        if (state.currentExam && state.currentExam._id === submittedExam._id) {
          state.currentExam = submittedExam;
        }
      })
      .addCase(submitExam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Grade Exam
      .addCase(gradeExam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(gradeExam.fulfilled, (state, action) => {
        state.loading = false;
        const gradedExam = action.payload.data.exam;
        const index = state.allExams.findIndex(exam => exam._id === gradedExam._id);
        if (index !== -1) {
          state.allExams[index] = gradedExam;
        }
        if (state.currentExam && state.currentExam._id === gradedExam._id) {
          state.currentExam = gradedExam;
        }
      })
      .addCase(gradeExam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get All Exams
      .addCase(getAllExams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllExams.fulfilled, (state, action) => {
        state.loading = false;
        state.allExams = action.payload.data.exams;
        state.allExamsPagination = action.payload.data.pagination;
      })
      .addCase(getAllExams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentExam, clearExams, clearAllExams } = examSlice.actions;
export default examSlice.reducer; 