import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { courseService } from '../services/courseService';

// Async thunks
export const getAllCourses = createAsyncThunk(
  'courses/getAllCourses',
  async (params, { rejectWithValue }) => {
    try {
      const response = await courseService.getAllCourses(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to get courses');
    }
  }
);

export const getCourseById = createAsyncThunk(
  'courses/getCourseById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await courseService.getCourseById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to get course');
    }
  }
);

export const createCourse = createAsyncThunk(
  'courses/createCourse',
  async (courseData, { rejectWithValue }) => {
    try {
      const response = await courseService.createCourse(courseData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to create course');
    }
  }
);

export const updateCourse = createAsyncThunk(
  'courses/updateCourse',
  async ({ id, courseData }, { rejectWithValue }) => {
    try {
      const response = await courseService.updateCourse(id, courseData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update course');
    }
  }
);

export const deleteCourse = createAsyncThunk(
  'courses/deleteCourse',
  async (id, { rejectWithValue }) => {
    try {
      const response = await courseService.deleteCourse(id);
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete course');
    }
  }
);

export const getInstructorCourses = createAsyncThunk(
  'courses/getInstructorCourses',
  async (params, { rejectWithValue }) => {
    try {
      const response = await courseService.getInstructorCourses(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to get instructor courses');
    }
  }
);

// Initial state
const initialState = {
  courses: [],
  currentCourse: null,
  instructorCourses: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  },
  instructorPagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  }
};

// Course slice
const courseSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentCourse: (state) => {
      state.currentCourse = null;
    },
    clearCourses: (state) => {
      state.courses = [];
      state.pagination = {
        page: 1,
        limit: 10,
        total: 0,
        pages: 0
      };
    },
    clearInstructorCourses: (state) => {
      state.instructorCourses = [];
      state.instructorPagination = {
        page: 1,
        limit: 10,
        total: 0,
        pages: 0
      };
    }
  },
  extraReducers: (builder) => {
    builder
      // Get All Courses
      .addCase(getAllCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload.data.courses;
        state.pagination = action.payload.data.pagination;
      })
      .addCase(getAllCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Course By ID
      .addCase(getCourseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCourseById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCourse = action.payload.data.course;
      })
      .addCase(getCourseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Course
      .addCase(createCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.courses.unshift(action.payload.data.course);
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Course
      .addCase(updateCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        state.loading = false;
        const updatedCourse = action.payload.data.course;
        const index = state.courses.findIndex(course => course._id === updatedCourse._id);
        if (index !== -1) {
          state.courses[index] = updatedCourse;
        }
        if (state.currentCourse && state.currentCourse._id === updatedCourse._id) {
          state.currentCourse = updatedCourse;
        }
      })
      .addCase(updateCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Course
      .addCase(deleteCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = state.courses.filter(course => course._id !== action.payload.id);
        if (state.currentCourse && state.currentCourse._id === action.payload.id) {
          state.currentCourse = null;
        }
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Instructor Courses
      .addCase(getInstructorCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getInstructorCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.instructorCourses = action.payload.data.courses;
        state.instructorPagination = action.payload.data.pagination;
      })
      .addCase(getInstructorCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentCourse, clearCourses, clearInstructorCourses } = courseSlice.actions;
export default courseSlice.reducer; 