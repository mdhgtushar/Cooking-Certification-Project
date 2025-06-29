import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { contactService } from '../services/contactService';

// Async thunks
export const submitContact = createAsyncThunk(
  'contacts/submitContact',
  async (contactData, { rejectWithValue }) => {
    try {
      const response = await contactService.submitContact(contactData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to submit contact');
    }
  }
);

export const getAllContacts = createAsyncThunk(
  'contacts/getAllContacts',
  async (params, { rejectWithValue }) => {
    try {
      const response = await contactService.getAllContacts(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to get contacts');
    }
  }
);

export const getContactById = createAsyncThunk(
  'contacts/getContactById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await contactService.getContactById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to get contact');
    }
  }
);

export const updateContactStatus = createAsyncThunk(
  'contacts/updateContactStatus',
  async ({ id, statusData }, { rejectWithValue }) => {
    try {
      const response = await contactService.updateContactStatus(id, statusData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update contact status');
    }
  }
);

export const respondToContact = createAsyncThunk(
  'contacts/respondToContact',
  async ({ id, responseData }, { rejectWithValue }) => {
    try {
      const response = await contactService.respondToContact(id, responseData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to respond to contact');
    }
  }
);

export const getContactStats = createAsyncThunk(
  'contacts/getContactStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await contactService.getContactStats();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to get contact stats');
    }
  }
);

export const markAsSpam = createAsyncThunk(
  'contacts/markAsSpam',
  async (id, { rejectWithValue }) => {
    try {
      const response = await contactService.markAsSpam(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to mark as spam');
    }
  }
);

// Initial state
const initialState = {
  contacts: [],
  currentContact: null,
  contactStats: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  }
};

// Contact slice
const contactSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentContact: (state) => {
      state.currentContact = null;
    },
    clearContacts: (state) => {
      state.contacts = [];
      state.pagination = {
        page: 1,
        limit: 10,
        total: 0,
        pages: 0
      };
    },
    clearContactStats: (state) => {
      state.contactStats = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Submit Contact
      .addCase(submitContact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitContact.fulfilled, (state, action) => {
        state.loading = false;
        // Contact submitted successfully
      })
      .addCase(submitContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get All Contacts
      .addCase(getAllContacts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllContacts.fulfilled, (state, action) => {
        state.loading = false;
        state.contacts = action.payload.data.contacts;
        state.pagination = action.payload.data.pagination;
      })
      .addCase(getAllContacts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Contact By ID
      .addCase(getContactById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getContactById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentContact = action.payload.data.contact;
      })
      .addCase(getContactById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Contact Status
      .addCase(updateContactStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateContactStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedContact = action.payload.data.contact;
        const index = state.contacts.findIndex(contact => contact._id === updatedContact._id);
        if (index !== -1) {
          state.contacts[index] = updatedContact;
        }
        if (state.currentContact && state.currentContact._id === updatedContact._id) {
          state.currentContact = updatedContact;
        }
      })
      .addCase(updateContactStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Respond to Contact
      .addCase(respondToContact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(respondToContact.fulfilled, (state, action) => {
        state.loading = false;
        const respondedContact = action.payload.data.contact;
        const index = state.contacts.findIndex(contact => contact._id === respondedContact._id);
        if (index !== -1) {
          state.contacts[index] = respondedContact;
        }
        if (state.currentContact && state.currentContact._id === respondedContact._id) {
          state.currentContact = respondedContact;
        }
      })
      .addCase(respondToContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Contact Stats
      .addCase(getContactStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getContactStats.fulfilled, (state, action) => {
        state.loading = false;
        state.contactStats = action.payload.data;
      })
      .addCase(getContactStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Mark as Spam
      .addCase(markAsSpam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markAsSpam.fulfilled, (state, action) => {
        state.loading = false;
        const spamContact = action.payload.data.contact;
        const index = state.contacts.findIndex(contact => contact._id === spamContact._id);
        if (index !== -1) {
          state.contacts[index] = spamContact;
        }
        if (state.currentContact && state.currentContact._id === spamContact._id) {
          state.currentContact = spamContact;
        }
      })
      .addCase(markAsSpam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentContact, clearContacts, clearContactStats } = contactSlice.actions;
export default contactSlice.reducer; 