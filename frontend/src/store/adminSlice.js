import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as adminService from '../services/adminService';

// Async thunks for API calls
export const fetchDashboardStats = createAsyncThunk(
  'admin/fetchDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminService.getDashboardStats();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUsers = createAsyncThunk(
  'admin/fetchUsers',
  async (params, { rejectWithValue }) => {
    try {
      const response = await adminService.getUsers(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUser = createAsyncThunk(
  'admin/updateUser',
  async ({ userId, userData }, { rejectWithValue }) => {
    try {
      const response = await adminService.updateUser(userId, userData);
      return { userId, userData: response.data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  'admin/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      await adminService.deleteUser(userId);
      return userId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const bulkUpdateUsers = createAsyncThunk(
  'admin/bulkUpdateUsers',
  async ({ userIds, updateData }, { rejectWithValue }) => {
    try {
      const response = await adminService.bulkUpdateUsers(userIds, updateData);
      return { userIds, updateData: response.data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const bulkDeleteUsers = createAsyncThunk(
  'admin/bulkDeleteUsers',
  async (userIds, { rejectWithValue }) => {
    try {
      await adminService.bulkDeleteUsers(userIds);
      return userIds;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCertificates = createAsyncThunk(
  'admin/fetchCertificates',
  async (params, { rejectWithValue }) => {
    try {
      const response = await adminService.getCertificates(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCertificate = createAsyncThunk(
  'admin/updateCertificate',
  async ({ certificateId, certificateData }, { rejectWithValue }) => {
    try {
      const response = await adminService.updateCertificate(certificateId, certificateData);
      return { certificateId, certificateData: response.data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const revokeCertificate = createAsyncThunk(
  'admin/revokeCertificate',
  async (certificateId, { rejectWithValue }) => {
    try {
      await adminService.revokeCertificate(certificateId);
      return certificateId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchApplications = createAsyncThunk(
  'admin/fetchApplications',
  async (params, { rejectWithValue }) => {
    try {
      const response = await adminService.getApplications(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateApplication = createAsyncThunk(
  'admin/updateApplication',
  async ({ applicationId, applicationData }, { rejectWithValue }) => {
    try {
      const response = await adminService.updateApplication(applicationId, applicationData);
      return { applicationId, applicationData: response.data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const approveApplication = createAsyncThunk(
  'admin/approveApplication',
  async (applicationId, { rejectWithValue }) => {
    try {
      await adminService.approveApplication(applicationId);
      return applicationId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const rejectApplication = createAsyncThunk(
  'admin/rejectApplication',
  async ({ applicationId, reason }, { rejectWithValue }) => {
    try {
      await adminService.rejectApplication(applicationId, reason);
      return { applicationId, reason };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchExams = createAsyncThunk(
  'admin/fetchExams',
  async (params, { rejectWithValue }) => {
    try {
      const response = await adminService.getExams(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateExam = createAsyncThunk(
  'admin/updateExam',
  async ({ examId, examData }, { rejectWithValue }) => {
    try {
      const response = await adminService.updateExam(examId, examData);
      return { examId, examData: response.data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const gradeExam = createAsyncThunk(
  'admin/gradeExam',
  async ({ examId, gradeData }, { rejectWithValue }) => {
    try {
      const response = await adminService.gradeExam(examId, gradeData);
      return { examId, gradeData: response.data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchContacts = createAsyncThunk(
  'admin/fetchContacts',
  async (params, { rejectWithValue }) => {
    try {
      const response = await adminService.getContacts(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateContact = createAsyncThunk(
  'admin/updateContact',
  async ({ contactId, contactData }, { rejectWithValue }) => {
    try {
      const response = await adminService.updateContact(contactId, contactData);
      return { contactId, contactData: response.data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteContact = createAsyncThunk(
  'admin/deleteContact',
  async (contactId, { rejectWithValue }) => {
    try {
      await adminService.deleteContact(contactId);
      return contactId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCourses = createAsyncThunk(
  'admin/fetchCourses',
  async (params, { rejectWithValue }) => {
    try {
      const response = await adminService.getCourses(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createCourse = createAsyncThunk(
  'admin/createCourse',
  async (courseData, { rejectWithValue }) => {
    try {
      const response = await adminService.createCourse(courseData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCourse = createAsyncThunk(
  'admin/updateCourse',
  async ({ courseId, courseData }, { rejectWithValue }) => {
    try {
      const response = await adminService.updateCourse(courseId, courseData);
      return { courseId, courseData: response.data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteCourse = createAsyncThunk(
  'admin/deleteCourse',
  async (courseId, { rejectWithValue }) => {
    try {
      await adminService.deleteCourse(courseId);
      return courseId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createApplication = createAsyncThunk(
  'admin/createApplication',
  async (applicationData, { rejectWithValue }) => {
    try {
      const response = await adminService.createApplication(applicationData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createExam = createAsyncThunk(
  'admin/createExam',
  async (examData, { rejectWithValue }) => {
    try {
      const response = await adminService.createExam(examData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createCertificate = createAsyncThunk(
  'admin/createCertificate',
  async (certificateData, { rejectWithValue }) => {
    try {
      const response = await adminService.createCertificate(certificateData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  // Dashboard
  dashboardStats: null,
  dashboardLoading: false,
  dashboardError: null,

  // Users
  users: [],
  usersLoading: false,
  usersError: null,
  usersPagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  },

  // Certificates
  certificates: [],
  certificatesLoading: false,
  certificatesError: null,
  certificatesPagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  },

  // Applications
  applications: [],
  applicationsLoading: false,
  applicationsError: null,
  applicationsPagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  },

  // Exams
  exams: [],
  examsLoading: false,
  examsError: null,
  examsPagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  },

  // Contacts
  contacts: [],
  contactsLoading: false,
  contactsError: null,
  contactsPagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  },

  // Courses
  courses: [],
  coursesLoading: false,
  coursesError: null,
  coursesPagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  },

  // UI State
  selectedItems: [],
  filters: {},
  searchQuery: '',
};

// Slice
const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearError: (state, action) => {
      const section = action.payload;
      if (section) {
        state[`${section}Error`] = null;
      } else {
        state.dashboardError = null;
        state.usersError = null;
        state.certificatesError = null;
        state.applicationsError = null;
        state.examsError = null;
        state.contactsError = null;
        state.coursesError = null;
      }
    },
    setSelectedItems: (state, action) => {
      state.selectedItems = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {};
      state.searchQuery = '';
    },
  },
  extraReducers: (builder) => {
    // Dashboard
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.dashboardLoading = true;
        state.dashboardError = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.dashboardLoading = false;
        state.dashboardStats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.dashboardLoading = false;
        state.dashboardError = action.payload;
      });

    // Users
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.usersLoading = true;
        state.usersError = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.usersLoading = false;
        state.users = action.payload.data.users;
        state.usersPagination = action.payload.data.pagination;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.usersLoading = false;
        state.usersError = action.payload;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const { userId, userData } = action.payload;
        const index = state.users.findIndex(user => user._id === userId);
        if (index !== -1) {
          state.users[index] = { ...state.users[index], ...userData };
        }
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(user => user._id !== action.payload);
      })
      .addCase(bulkUpdateUsers.fulfilled, (state, action) => {
        const { userIds, updateData } = action.payload;
        state.users = state.users.map(user => 
          userIds.includes(user._id) ? { ...user, ...updateData } : user
        );
      })
      .addCase(bulkDeleteUsers.fulfilled, (state, action) => {
        state.users = state.users.filter(user => !action.payload.includes(user._id));
      });

    // Certificates
    builder
      .addCase(fetchCertificates.pending, (state) => {
        state.certificatesLoading = true;
        state.certificatesError = null;
      })
      .addCase(fetchCertificates.fulfilled, (state, action) => {
        state.certificatesLoading = false;
        state.certificates = action.payload.data.certificates;
        state.certificatesPagination = action.payload.data.pagination;
      })
      .addCase(fetchCertificates.rejected, (state, action) => {
        state.certificatesLoading = false;
        state.certificatesError = action.payload;
      })
      .addCase(updateCertificate.fulfilled, (state, action) => {
        const { certificateId, certificateData } = action.payload;
        const index = state.certificates.findIndex(cert => cert._id === certificateId);
        if (index !== -1) {
          state.certificates[index] = { ...state.certificates[index], ...certificateData };
        }
      })
      .addCase(revokeCertificate.fulfilled, (state, action) => {
        const index = state.certificates.findIndex(cert => cert._id === action.payload);
        if (index !== -1) {
          state.certificates[index].status = 'revoked';
        }
      })
      .addCase(createCertificate.fulfilled, (state, action) => {
        state.certificates.unshift(action.payload.data);
      });

    // Applications
    builder
      .addCase(fetchApplications.pending, (state) => {
        state.applicationsLoading = true;
        state.applicationsError = null;
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.applicationsLoading = false;
        state.applications = action.payload.data.applications;
        state.applicationsPagination = action.payload.data.pagination;
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.applicationsLoading = false;
        state.applicationsError = action.payload;
      })
      .addCase(updateApplication.fulfilled, (state, action) => {
        const { applicationId, applicationData } = action.payload;
        const index = state.applications.findIndex(app => app._id === applicationId);
        if (index !== -1) {
          state.applications[index] = { ...state.applications[index], ...applicationData };
        }
      })
      .addCase(approveApplication.fulfilled, (state, action) => {
        const index = state.applications.findIndex(app => app._id === action.payload);
        if (index !== -1) {
          state.applications[index].status = 'approved';
        }
      })
      .addCase(rejectApplication.fulfilled, (state, action) => {
        const index = state.applications.findIndex(app => app._id === action.payload.applicationId);
        if (index !== -1) {
          state.applications[index].status = 'rejected';
          state.applications[index].rejectionReason = action.payload.reason;
        }
      })
      .addCase(createApplication.fulfilled, (state, action) => {
        state.applications.unshift(action.payload.data);
      });

    // Exams
    builder
      .addCase(fetchExams.pending, (state) => {
        state.examsLoading = true;
        state.examsError = null;
      })
      .addCase(fetchExams.fulfilled, (state, action) => {
        state.examsLoading = false;
        state.exams = action.payload.data.exams;
        state.examsPagination = action.payload.data.pagination;
      })
      .addCase(fetchExams.rejected, (state, action) => {
        state.examsLoading = false;
        state.examsError = action.payload;
      })
      .addCase(updateExam.fulfilled, (state, action) => {
        const { examId, examData } = action.payload;
        const index = state.exams.findIndex(exam => exam._id === examId);
        if (index !== -1) {
          state.exams[index] = { ...state.exams[index], ...examData };
        }
      })
      .addCase(gradeExam.fulfilled, (state, action) => {
        const { examId, gradeData } = action.payload;
        const index = state.exams.findIndex(exam => exam._id === examId);
        if (index !== -1) {
          state.exams[index] = { ...state.exams[index], ...gradeData };
        }
      })
      .addCase(createExam.fulfilled, (state, action) => {
        state.exams.unshift(action.payload);
      });

    // Contacts
    builder
      .addCase(fetchContacts.pending, (state) => {
        state.contactsLoading = true;
        state.contactsError = null;
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.contactsLoading = false;
        state.contacts = action.payload.contacts;
        state.contactsPagination = action.payload.pagination;
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.contactsLoading = false;
        state.contactsError = action.payload;
      })
      .addCase(updateContact.fulfilled, (state, action) => {
        const { contactId, contactData } = action.payload;
        const index = state.contacts.findIndex(contact => contact._id === contactId);
        if (index !== -1) {
          state.contacts[index] = { ...state.contacts[index], ...contactData };
        }
      })
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.contacts = state.contacts.filter(contact => contact._id !== action.payload);
      });

    // Courses
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.coursesLoading = true;
        state.coursesError = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.coursesLoading = false;
        state.courses = action.payload.data.courses;
        state.coursesPagination = action.payload.data.pagination;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.coursesLoading = false;
        state.coursesError = action.payload;
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.courses.unshift(action.payload);
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        const { courseId, courseData } = action.payload;
        const index = state.courses.findIndex(course => course._id === courseId);
        if (index !== -1) {
          state.courses[index] = { ...state.courses[index], ...courseData };
        }
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.courses = state.courses.filter(course => course._id !== action.payload);
      });
  },
});

export const { clearError, setSelectedItems, setFilters, setSearchQuery, clearFilters } = adminSlice.actions;

export default adminSlice.reducer; 